// app/api/checkout/route.ts
import { NextRequest, NextResponse } from 'next/server';
import Stripe from 'stripe';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!);   // ← 去掉 apiVersion，让 Stripe 使用最新版本

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { items, shippingInfo } = body;

    console.log("收到购物车数据:", JSON.stringify(items, null, 2));
    console.log("收到收货信息:", JSON.stringify(shippingInfo, null, 2));

    if (!items || !Array.isArray(items) || items.length === 0) {
      return NextResponse.json({ error: 'No items in cart' }, { status: 400 });
    }

    if (!shippingInfo?.fullName || !shippingInfo?.email || !shippingInfo?.address) {
      return NextResponse.json({ error: 'Shipping information is incomplete' }, { status: 400 });
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

      shipping_address_collection: {
        allowed_countries: ['DE', 'AT', 'CH'],
      },

      customer_email: shippingInfo.email,

      success_url: `${SITE_URL}/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${SITE_URL}/cart`,

      metadata: {
        shipping_fullName: shippingInfo.fullName,
        shipping_email: shippingInfo.email,
        shipping_phone: shippingInfo.phone || '',
        shipping_address: shippingInfo.address,
        shipping_city: shippingInfo.city || '',
        shipping_postalCode: shippingInfo.postalCode || '',
        shipping_country: shippingInfo.country || 'Germany',
      },
    });

    console.log("Stripe Session 创建成功，URL:", session.url);

    return NextResponse.json({ url: session.url });

  } catch (error: any) {
    console.error("Stripe Checkout 详细错误:", error);
    return NextResponse.json({ 
      error: error.message || 'Internal server error' 
    }, { status: 500 });
  }
}