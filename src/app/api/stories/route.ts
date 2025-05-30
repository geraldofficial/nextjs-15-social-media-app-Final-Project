import { validateRequest } from "@/auth";
import prisma from "@/lib/prisma";
import { NextRequest } from "next/server";

export async function GET(req: NextRequest) {
  try {
    const { user } = await validateRequest();
    if (!user) {
      return Response.json({ error: "Unauthorized" }, { status: 401 });
    }    // Get all stories (posts marked as stories) in the last 24 hours
    const since = new Date(Date.now() - 1000 * 60 * 60 * 24);
    // Find stories with media attachments
    const allStories = await prisma.media.findMany({
      where: {
        createdAt: { gte: since },
        postId: { not: null },
        post: {
          isStory: true,
        },
      },
      orderBy: { createdAt: "desc" },
      include: { 
        post: {
          include: {
            user: {
              select: {
                id: true,
                username: true,
                displayName: true,
                avatarUrl: true,
              }
            }
          }
        }
      },
    });
    // Group by userId
    const userStoriesMap = new Map();
    for (const story of allStories) {
      if (!story.post || !story.post.user) continue;
      const userId = story.post.user.id;
      if (!userStoriesMap.has(userId)) userStoriesMap.set(userId, []);
      userStoriesMap.get(userId).push(story);
    }
    // Return as array of { user, stories: Media[] }
    const groupedStories = Array.from(userStoriesMap.values()).map((stories) => ({
      user: stories[0].post.user,
      stories,
    }));
    return Response.json(groupedStories);
  } catch (error) {
    console.error(error);
    return Response.json({ error: "Internal server error" }, { status: 500 });
  }
}
