# BigBlueButton Integration

To enable video meetings, add the following to your `.env` file:

NEXT_PUBLIC_BBB_SERVER=https://your-bbb-server.com
NEXT_PUBLIC_BBB_SECRET=your-bbb-secret
NEXT_PUBLIC_BBB_MEETING_ID=your-default-meeting-id
NEXT_PUBLIC_BBB_USER_NAME=YourName

- The Video Meeting button in the menu will open a new tab and redirect to your BBB meeting.
- You can change the meeting ID and user name as needed.
- For production, generate the join URL server-side for security.

## Performance Tips
- The app is now optimized for image, font, and CSS delivery.
- Use dynamic imports for large components if you notice slow initial loads.
- Use SSR/SSG for pages that can be statically generated.
- Use React Query or SWR for data fetching with caching.
- Monitor bundle size and use code splitting for rarely-used features.

## Next Steps
- Restart your app after updating `.env` and config files.
- Test the Video Meeting button and image/video uploads.
