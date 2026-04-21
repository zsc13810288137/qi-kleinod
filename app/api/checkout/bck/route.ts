// app/api/checkout/route.ts
import { NextRequest, NextResponse } from 'next/server';
import Stripe from 'stripe';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: '2024-06-20',
});

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { items, shippingInfo } = body;

    console.log("收到购物车数据:", JSON.stringify(items, null, 2));
    console.log("收到收货信息:", JSON.stringify(shippingInfo, null, 2));

    if (!items || !Array.isArray(items) || items.length === 0) {
      return NextResponse.json({ 
        error: 'No items in cart' 
      }, { status: 400 });
    }

    // 验证收货信息是否完整
    if (!shippingInfo || !shippingInfo.fullName || !shippingInfo.email || !shippingInfo.address) {
      return NextResponse.json({ 
        error: 'Shipping information is incomplete' 
      }, { status: 400 });
    }

    const line_items = items.map((item: any) => ({
      price_data: {
        currency: 'eur',
        product_data: {
          name: item.name,
          images: item.image && item.image.startsWith('/') 
            ? [`${SITE_URL}${item.image}`] 
            : item.image ? [item.image] : undefined,
        },
        unit_amount: Math.round(item.price * 100),
      },
      quantity: item.quantity || 1,
    }));

    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      line_items,
      mode: 'payment',

      // 重要：传递收货地址给 Stripe
      shipping_address_collection: {
        allowed_countries: ['DE', 'AT', 'CH'], // 德国、奥地利、瑞士
      },
      shipping_options: [
        {
          shipping_rate_data: {
            type: 'fixed_amount',
            fixed_amount: { amount: 0, currency: 'eur' },
            display_name: 'Free Shipping',
            delivery_estimate: {
              minimum: { unit: 'business_day', value: 3 },
              maximum: { unit: 'business_day', value: 7 },
            },
          },
        },
      ],

      customer_email: shippingInfo.email,

      success_url: `${SITE_URL}/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${SITE_URL}/cart`,

      // 元数据：把收货信息存入 Stripe Session，方便后续在 success 页面读取
      metadata: {
        shipping_fullName: shippingInfo.fullName,
        shipping_email: shippingInfo.email,
        shipping_phone: shippingInfo.phone || '',
        shipping_address: shippingInfo.address,
        shipping_city: shippingInfo.city,
        shipping_postalCode: shippingInfo.postalCode,
        shipping_country: shippingInfo.country,
      },
    });

    console.log("Stripe Session 创建成功，URL:", session.url);

    return NextResponse.json({ url: session.url });

  } catch (error: any) {
    console.error("Stripe Checkout 详细错误:", error);
    return NextResponse.json({ 
      error: error.message || 'Internal server error',
      code: error.code 
    }, { status: 500 });
  }
}