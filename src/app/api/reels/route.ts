import { validateRequest } from "@/auth";
import prisma from "@/lib/prisma";
import { NextRequest } from "next/server";

export async function GET(req: NextRequest) {
  try {
    const cursor = req.nextUrl.searchParams.get("cursor") || undefined;
    const pageSize = 10;
    const { user } = await validateRequest();
    if (!user) {
      return Response.json({ error: "Unauthorized" }, { status: 401 });
    }
    // Fetch all videos (media.type === "VIDEO") attached to posts
    const videos = await prisma.media.findMany({
      where: { type: "VIDEO", postId: { not: null } },
      orderBy: { createdAt: "desc" },
      take: pageSize + 1,
      cursor: cursor ? { id: cursor } : undefined,
      include: { post: { include: { user: true } } },
    });
    const nextCursor = videos.length > pageSize ? videos[pageSize].id : null;
    return Response.json({
      videos: videos.slice(0, pageSize),
      nextCursor,
    });
  } catch (error) {
    console.error(error);
    return Response.json({ error: "Internal server error" }, { status: 500 });
  }
}
