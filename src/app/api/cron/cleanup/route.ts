import { NextResponse } from 'next/server';
import { getSupabaseServerClient } from '@/app/lib/server-client';

export const maxDuration = 60; // Max duration for Vercel Cron (Hobby plan is 10s, Pro is 60s)

export async function GET(request: Request) {
  // 1. Verify Vercel Cron Secret to prevent unauthorized access
  const authHeader = request.headers.get('authorization');
  if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
    return new Response('Unauthorized', { status: 401 });
  }

  try {
    const supabase = await getSupabaseServerClient();
    
    // Example cleanup task: Automatically reject student applications that have been pending for > 30 days
    // const thirtyDaysAgo = new Date();
    // thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
    //
    // await supabase
    //   .from('housing_application')
    //   .update({ status: 'expired' })
    //   .eq('status', 'pending')
    //   .lt('created_at', thirtyDaysAgo.toISOString());

    return NextResponse.json({ success: true, message: 'Cron executed successfully.' });
  } catch (error) {
    console.error('Cron job failed:', error);
    return NextResponse.json({ success: false, error: 'Cron execution failed' }, { status: 500 });
  }
}
