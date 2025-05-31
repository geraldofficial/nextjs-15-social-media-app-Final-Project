'use server';

const Pusher = require('pusher');

const pusherServer = new Pusher({
  appId: process.env.PUSHER_APP_ID!,
  key: process.env.NEXT_PUBLIC_PUSHER_KEY!,
  secret: process.env.PUSHER_SECRET!,
  cluster: process.env.NEXT_PUBLIC_PUSHER_CLUSTER!,
  useTLS: true,
});

export async function trigger(channel: string, event: string, data: any) {
  try {
    await pusherServer.trigger(channel, event, data);
    return { success: true };
  } catch (error) {
    console.error('Pusher trigger error:', error);
    return { success: false, error };
  }
}

export { pusherServer };
