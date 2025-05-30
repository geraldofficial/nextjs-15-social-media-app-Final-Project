"use client";

import { useEffect, useState, useCallback } from "react";
import Post from "@/components/posts/Post";
import { PostData } from "@/lib/types";
import { Loader2 } from "lucide-react";

interface UserPostsProps {
  username: string;
}

export default function UserPosts({ username }: UserPostsProps) {
  const [posts, setPosts] = useState<PostData[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [hasMore, setHasMore] = useState(true);
  const [page, setPage] = useState(1);

  const fetchPosts = useCallback(async (pageNum: number) => {
    try {
      const response = await fetch(`/api/users/${username}/posts?page=${pageNum}`);
      if (!response.ok) {
        throw new Error('Failed to fetch posts');
      }
      const data = await response.json();
      if (pageNum === 1) {
        setPosts(data.posts);
      } else {
        setPosts(prev => [...prev, ...data.posts]);
      }
      setHasMore(data.hasMore);
      setError(null);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load posts');
    } finally {
      setIsLoading(false);
    }
  }, [username]);

  useEffect(() => {
    fetchPosts(1);
  }, [fetchPosts]);

  const loadMore = () => {
    if (!isLoading && hasMore) {
      setIsLoading(true);
      setPage(prev => prev + 1);
      fetchPosts(page + 1);
    }
  };

  if (error) {
    return (
      <div className="rounded-2xl bg-card p-5 text-center text-destructive">
        {error}
      </div>
    );
  }

  if (isLoading && posts.length === 0) {
    return (
      <div className="flex justify-center p-5">
        <Loader2 className="size-8 animate-spin text-primary" />
      </div>
    );
  }

  if (posts.length === 0) {
    return (
      <div className="rounded-2xl bg-card p-5 text-center text-muted-foreground">
        No posts yet
      </div>
    );
  }

  return (
    <div className="space-y-5">
      {posts.map((post) => (
        <Post key={post.id} post={post} />
      ))}
      {hasMore && (
        <div className="flex justify-center">
          <button
            onClick={loadMore}
            disabled={isLoading}
            className="inline-flex items-center justify-center rounded-md bg-primary/10 px-4 py-2 text-sm font-medium text-primary hover:bg-primary/20 disabled:opacity-50"
          >
            {isLoading ? (
              <Loader2 className="mr-2 size-4 animate-spin" />
            ) : null}
            Load More
          </button>
        </div>
      )}
    </div>
  );
}
