// app/api/stripe/session/route.ts
import { NextRequest, NextResponse } from 'next/server';
import Stripe from 'stripe';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: '2024-06-20',
});

export async function GET(request: NextRequest) {
  const sessionId = request.nextUrl.searchParams.get('session_id');

  if (!sessionId) {
    return NextResponse.json({ error: 'No session_id provided' }, { status: 400 });
  }

  try {
    const session = await stripe.checkout.sessions.retrieve(sessionId);

    return NextResponse.json({
      success: true,
      amount_total: session.amount_total ? session.amount_total / 100 : 0,
      currency: session.currency,
      customer_email: session.customer_details?.email,
      payment_status: session.payment_status,
      
      // 直接返回 metadata（这是我们最需要的）
      metadata: session.metadata || {},
      
      // 额外返回一些常用信息用于调试
      customer_details: session.customer_details,
    });

  } catch (error: any) {
    console.error("Stripe session retrieve error:", error);
    return NextResponse.json({ 
      error: error.message || 'Failed to retrieve session' 
    }, { status: 500 });
  }
}