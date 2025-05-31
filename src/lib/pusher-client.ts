'use client';

let PusherClient: any;

if (typeof window !== 'undefined') {
  PusherClient = require('pusher-js');
}

export const pusherClient = typeof window !== 'undefined'
  ? new PusherClient(
      process.env.NEXT_PUBLIC_PUSHER_KEY!,
      {
        cluster: process.env.NEXT_PUBLIC_PUSHER_CLUSTER!,
      }
    )
  : null;
