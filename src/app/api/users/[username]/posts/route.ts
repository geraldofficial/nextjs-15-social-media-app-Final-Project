import { validateRequest } from "@/auth";
import prisma from "@/lib/prisma";
import { NextRequest } from "next/server";

const POSTS_PER_PAGE = 10;

export async function GET(
  req: NextRequest,
  { params: { username } }: { params: { username: string } },
) {
  try {
    const { user: loggedInUser } = await validateRequest();
    const searchParams = req.nextUrl.searchParams;
    const page = parseInt(searchParams.get("page") || "1");

    if (!loggedInUser) {
      return Response.json({ error: "Unauthorized" }, { status: 401 });
    }

    const targetUser = await prisma.user.findUnique({
      where: { username },
      select: { id: true },
    });

    if (!targetUser) {
      return Response.json({ error: "User not found" }, { status: 404 });
    }

    const [posts, totalPosts] = await Promise.all([
      prisma.post.findMany({
        where: {
          userId: targetUser.id,
        },
        select: {
          id: true,
          content: true,
          createdAt: true,
          _count: {
            select: {
              likes: true,
              comments: true,
              bookmarks: true,
            },
          },
          likes: {
            where: {
              userId: loggedInUser.id,
            },
            select: {
              userId: true,
            },
          },
          bookmarks: {
            where: {
              userId: loggedInUser.id,
            },
            select: {
              userId: true,
            },
          },
          attachments: true,
          user: {
            select: {
              id: true,
              username: true,
              displayName: true,
              avatarUrl: true,
              bio: true,
              verifiedAt: true,
              themeColor: true,
              profileViews: true,
              lastProfileView: true,
              customLayout: true,
              _count: {
                select: {
                  followers: true,
                },
              },
              followers: {
                where: {
                  followerId: loggedInUser.id,
                },
                select: {
                  followerId: true,
                },
              },
            },
          },
        },
        orderBy: {
          createdAt: "desc",
        },
        skip: (page - 1) * POSTS_PER_PAGE,
        take: POSTS_PER_PAGE,
      }),
      prisma.post.count({
        where: {
          userId: targetUser.id,
        },
      }),
    ]);

    const hasMore = page * POSTS_PER_PAGE < totalPosts;

    return Response.json({
      posts: posts.map((post) => ({
        ...post,
        user: {
          ...post.user,
          isVerified: !!post.user.verifiedAt,
        },
      })),
      hasMore,
    });
  } catch (error) {
    console.error(error);
    return Response.json({ error: "Internal server error" }, { status: 500 });
  }
} 