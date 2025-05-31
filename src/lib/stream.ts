import { StreamChat } from "stream-chat";
import 'server-only';

// Import Pusher only on server side
import Pusher from 'pusher';
import PusherClient from 'pusher-js';

export const pusherServer = new Pusher({
  appId: process.env.PUSHER_APP_ID!,
  key: process.env.NEXT_PUBLIC_PUSHER_KEY!,
  secret: process.env.PUSHER_SECRET!,
  cluster: process.env.NEXT_PUBLIC_PUSHER_CLUSTER!,
  useTLS: true,
});

export const pusherClient = new PusherClient(
  process.env.NEXT_PUBLIC_PUSHER_KEY!,
  {
    cluster: process.env.NEXT_PUBLIC_PUSHER_CLUSTER!,
  }
);

const streamServerClient = StreamChat.getInstance(
  process.env.NEXT_PUBLIC_STREAM_KEY!,
  process.env.STREAM_SECRET,
);

export default streamServerClient;
