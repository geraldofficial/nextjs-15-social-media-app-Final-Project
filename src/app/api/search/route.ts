import { validateRequest } from "@/auth";
import prisma from "@/lib/prisma";
import { getPostDataInclude, PostsPage } from "@/lib/types";
import { NextRequest } from "next/server";

export async function GET(req: NextRequest) {
  try {
    const q = req.nextUrl.searchParams.get("q") || "";
    const cursor = req.nextUrl.searchParams.get("cursor") || undefined;

    const pageSize = 10;
    const { user } = await validateRequest();
    if (!user) {
      return Response.json({ error: "Unauthorized" }, { status: 401 });
    }

    let posts;
    if (!q.trim()) {
      // If no query, return recent posts
      posts = await prisma.post.findMany({
        include: getPostDataInclude(user.id),
        orderBy: { createdAt: "desc" },
        take: pageSize + 1,
        cursor: cursor ? { id: cursor } : undefined,
      });
    } else {
      // Full-text search
      const searchQuery = q.split(" ").join(" & ");
      posts = await prisma.post.findMany({
        where: {
          OR: [
            { content: { contains: searchQuery, mode: 'insensitive' } },
            { user: { displayName: { contains: searchQuery, mode: 'insensitive' } } },
            { user: { username: { contains: searchQuery, mode: 'insensitive' } } },
          ],
        },
        include: getPostDataInclude(user.id),
        orderBy: { createdAt: "desc" },
        take: pageSize + 1,
        cursor: cursor ? { id: cursor } : undefined,
      });
    }

    const nextCursor = posts.length > pageSize ? posts[pageSize].id : null;
    const data: PostsPage = {
      posts: posts.slice(0, pageSize),
      nextCursor,
    };
    return Response.json(data);
  } catch (error) {
    console.error(error);
    return Response.json({ error: "Internal server error" }, { status: 500 });
  }
}
