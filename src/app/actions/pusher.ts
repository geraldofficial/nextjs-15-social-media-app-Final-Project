'use server';

const PUSHER_APP_ID = process.env.PUSHER_APP_ID!;
const PUSHER_KEY = process.env.NEXT_PUBLIC_PUSHER_KEY!;
const PUSHER_SECRET = process.env.PUSHER_SECRET!;
const PUSHER_CLUSTER = process.env.NEXT_PUBLIC_PUSHER_CLUSTER!;

async function pusherRequest(endpoint: string, data: any) {
  const timestamp = Math.floor(Date.now() / 1000);
  const authVersion = '1.0';
  const authString = `${PUSHER_APP_ID}:${PUSHER_SECRET}`;
  const authSignature = Buffer.from(authString).toString('base64');

  const response = await fetch(
    `https://api-${PUSHER_CLUSTER}.pusher.com/apps/${PUSHER_APP_ID}${endpoint}`,
    {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-Pusher-Library': 'pusher-http-node',
        'X-Pusher-Auth': `PUSHER-APP-ID=${PUSHER_APP_ID},PUSHER-APP-KEY=${PUSHER_KEY},PUSHER-APP-SECRET=${PUSHER_SECRET},PUSHER-APP-CLUSTER=${PUSHER_CLUSTER},PUSHER-AUTH-VERSION=${authVersion},PUSHER-AUTH-TIMESTAMP=${timestamp},PUSHER-AUTH-SIGNATURE=${authSignature}`,
      },
      body: JSON.stringify(data),
    }
  );

  if (!response.ok) {
    throw new Error(`Pusher API error: ${response.statusText}`);
  }

  return response.json();
}

export async function trigger(channel: string, event: string, data: any) {
  try {
    await pusherRequest('/events', {
      name: event,
      channel,
      data: JSON.stringify(data),
    });
    return { success: true };
  } catch (error) {
    console.error('Pusher trigger error:', error);
    return { success: false, error };
  }
}

// Export a dummy pusherServer object to maintain compatibility
export const pusherServer = {
  trigger: async (channel: string, event: string, data: any) => {
    return trigger(channel, event, data);
  },
};
