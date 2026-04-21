// app/api/admin/users/route.ts
import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseServiceKey = process.env.NEXT_PUBLIC_SUPABASE_SERVICE_ROLE_KEY!;

const supabaseAdmin = createClient(supabaseUrl, supabaseServiceKey, {
  auth: {
    autoRefreshToken: false,
    persistSession: false,
  },
});

export async function GET() {
  try {
    // 获取所有用户
    const { data: { users }, error: usersError } = await supabaseAdmin.auth.admin.listUsers();

    if (usersError) {
      console.error("listUsers error:", usersError);
      throw usersError;
    }

    // 获取每个用户的订单数量
    const userOrders: Record<string, { order_count: number }> = {};

    for (const user of users) {
      const { count, error: countError } = await supabaseAdmin
        .from('orders')
        .select('*', { count: 'exact', head: true })
        .eq('user_id', user.id);

      if (countError) {
        console.error(`订单统计失败 for user ${user.id}:`, countError);
      }

      userOrders[user.id] = {
        order_count: count || 0,
      };
    }

    return NextResponse.json({
      users: users.map((user: any) => ({
        id: user.id,
        email: user.email || '',
        created_at: user.created_at,
        last_sign_in_at: user.last_sign_in_at,
        banned: user.banned || false,
      })),
      userOrders
    });

  } catch (error: any) {
    console.error("Admin users API error:", error);
    return NextResponse.json({ 
      error: error.message || 'Failed to fetch users' 
    }, { status: 500 });
  }
}