'use client';

import dynamic from 'next/dynamic';

const PusherClient = dynamic(
  () => import('pusher-js').then((mod) => mod.default),
  { ssr: false }
);

export const pusherClient = typeof window !== 'undefined'
  ? new PusherClient(
      process.env.NEXT_PUBLIC_PUSHER_KEY!,
      {
        cluster: process.env.NEXT_PUBLIC_PUSHER_CLUSTER!,
      }
    )
  : null;
