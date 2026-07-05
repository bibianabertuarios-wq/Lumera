import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

export async function POST(request) {
  try {
    const { userId, subscription, hora } = await request.json();

    if (!userId || !subscription) {
      return Response.json({ error: 'Faltan datos' }, { status: 400 });
    }

    const { error } = await supabase
      .from('users')
      .update({
        push_subscription: subscription,
        push_hora: hora || '09:00',
        push_enabled: true,
      })
      .eq('id', userId);

    if (error) throw error;

    return Response.json({ success: true });
  } catch (err) {
    console.error('[push/subscribe] Error:', err);
    return Response.json({ error: err.message }, { status: 500 });
  }
}
