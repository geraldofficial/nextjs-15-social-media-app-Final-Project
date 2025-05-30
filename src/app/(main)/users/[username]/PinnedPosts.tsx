import { PostData } from "@/lib/types";
import Post from "@/components/posts/Post";
import { Prisma } from "@prisma/client";

interface PinnedPost {
  post: PostData;
  pinnedAt: Date;
}

interface PinnedPostsProps {
  posts: PinnedPost[];
}

export default function PinnedPosts({ posts }: PinnedPostsProps) {
  if (!posts || posts.length === 0) return null;

  return (
    <div className="space-y-3">
      <h2 className="text-xl font-semibold">
        Pinned Posts
      </h2>
      <div className="space-y-4">
        {posts.map((pinnedPost) => (
          <Post key={pinnedPost.post.id} post={pinnedPost.post} />
        ))}
      </div>
    </div>
  );
}
