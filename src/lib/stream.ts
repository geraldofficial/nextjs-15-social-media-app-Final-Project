import { StreamChat } from "stream-chat";
import { pusherServer } from './pusher-server';
import { pusherClient } from './pusher-client';

// Create stream chat instance for client
export const streamClient = StreamChat.getInstance(
  process.env.NEXT_PUBLIC_STREAM_KEY!
);

// Create stream chat instance for server with secret
export const streamServerClient = StreamChat.getInstance(
  process.env.NEXT_PUBLIC_STREAM_KEY!,
  process.env.STREAM_SECRET
);

// Export pusher instances with type safety
export { pusherServer };
export { pusherClient };
