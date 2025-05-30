import { validateRequest } from "@/auth";
import prisma from "@/lib/prisma";

export async function POST(
  request: Request,
  { params }: { params: { postId: string } },
) {
  try {
    const { user } = await validateRequest();
    const { postId } = params;

    if (!user) {
      return Response.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Find the post and check if it belongs to the user
    const post = await prisma.post.findUnique({
      where: { id: postId },
      select: { userId: true },
    });

    if (!post) {
      return Response.json({ error: "Post not found" }, { status: 404 });
    }

    if (post.userId !== user.id) {
      return Response.json(
        { error: "You can only pin your own posts" },
        { status: 403 },
      );
    }

    // Check if maximum pinned posts limit is reached
    const pinnedPostsCount = await prisma.pinnedPost.count({
      where: { userId: user.id },
    });

    if (pinnedPostsCount >= 5) {
      return Response.json(
        { error: "Maximum of 5 pinned posts allowed" },
        { status: 400 },
      );
    }

    // Pin the post
    await prisma.pinnedPost.create({
      data: {
        userId: user.id,
        postId,
      },
    });

    return Response.json({ success: true });
  } catch (error) {
    console.error(error);
    return Response.json({ error: "Internal server error" }, { status: 500 });
  }
}

export async function DELETE(
  request: Request,
  { params }: { params: { postId: string } },
) {
  try {
    const { user } = await validateRequest();
    const { postId } = params;

    if (!user) {
      return Response.json({ error: "Unauthorized" }, { status: 401 });
    }

    await prisma.pinnedPost.deleteMany({
      where: {
        userId: user.id,
        postId,
      },
    });

    return Response.json({ success: true });
  } catch (error) {
    console.error(error);
    return Response.json({ error: "Internal server error" }, { status: 500 });
  }
}
