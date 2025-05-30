"use client";

import { useInfiniteQuery } from "@tanstack/react-query";
import kyInstance from "@/lib/ky";
import Image from "next/image";
import LikeButton from "@/components/posts/LikeButton";
import Link from "next/link";
import FollowButton from "@/components/FollowButton";
import { useSession } from "@/app/(main)/SessionProvider";
import { useState, useRef, useEffect, useMemo } from "react";
import Comments from "@/components/comments/Comments";
import { MessageSquare, Volume2, VolumeX, Loader2 } from "lucide-react";

export default function ReelsFeed() {
  const { user } = useSession();

  const {
    data,
    hasNextPage,
    isFetchingNextPage,
    status,
  } = useInfiniteQuery<{ videos: any[]; nextCursor: string | null }>({
    queryKey: ["reels-feed"],
    queryFn: ({ pageParam }) =>
      kyInstance
        .get("/api/reels", { searchParams: pageParam ? { cursor: String(pageParam) } : undefined })
        .json(),
    initialPageParam: null,
    getNextPageParam: (lastPage) => lastPage.nextCursor,
  });

  const videos = useMemo(() => data?.pages.flatMap((page: { videos: any[] }) => page.videos) || [], [data]);
  const [activeIdx, setActiveIdx] = useState(0);
  const [muted, setMuted] = useState(true);
  const [showComments, setShowComments] = useState(false);
  const [progress, setProgress] = useState(0);
  const videoRefs = useRef<(HTMLVideoElement | null)[]>([]);
  const containerRef = useRef<HTMLDivElement>(null);

  // Scroll to active video
  useEffect(() => {
    const el = containerRef.current?.children[activeIdx] as HTMLElement;
    if (el) el.scrollIntoView({ behavior: "smooth" });
    setShowComments(false);
    setProgress(0);
  }, [activeIdx]);

  // Progress bar logic
  useEffect(() => {
    const video = videoRefs.current[activeIdx];
    if (!video) return;
    const update = () => {
      setProgress((video.currentTime / (video.duration || 1)) * 100);
    };
    video.addEventListener("timeupdate", update);
    return () => video.removeEventListener("timeupdate", update);
  }, [activeIdx, videos]);

  // Keyboard navigation
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.key === "ArrowDown") setActiveIdx((i) => Math.min(i + 1, videos.length - 1));
      if (e.key === "ArrowUp") setActiveIdx((i) => Math.max(i - 1, 0));
      if (e.key === "m") setMuted((m) => !m);
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [videos.length]);
  if (status === "pending") {
    return <Loader2 className="mx-auto my-10 animate-spin" />;
  }
  if (status === "error" || videos.length === 0) {
    return <p className="text-center text-muted-foreground">No reels found.</p>;
  }
  return (
    <div
      ref={containerRef}
      className="h-screen w-full overflow-y-scroll snap-y snap-mandatory bg-black scrollbar-thin scrollbar-thumb-gray-700 scrollbar-track-gray-900"
      style={{ scrollSnapType: "y mandatory" }}
    >
      {videos.map((video, idx) => (
        <div
          key={video.id}
          className="relative h-screen w-full flex items-center justify-center snap-center"
          style={{ scrollSnapAlign: "center" }}
        >
          <video
            ref={(el) => { videoRefs.current[idx] = el; }}
            src={video.url}
            controls={false}
            autoPlay={activeIdx === idx}
            loop
            muted={muted}
            className="object-cover w-full h-full"
            onClick={() => setActiveIdx(idx)}
          />
          {/* Progress bar */}
          {activeIdx === idx && (
            <div className="absolute top-0 left-0 w-full h-1 bg-gray-800">
              <div className="h-full bg-primary transition-all" style={{ width: `${progress}%` }} />
            </div>
          )}
          {/* Overlay actions */}
          <div className="absolute bottom-0 left-0 w-full p-6 flex flex-col gap-4 bg-gradient-to-t from-black/80 to-transparent">
            <div className="flex items-center gap-3">
              <Link href={`/users/${video.post?.user?.username}`}>
                <Image
                  src={video.post?.user?.avatarUrl || "/assets/avatar-placeholder.png"}
                  alt={video.post?.user?.displayName || "User"}
                  width={48}
                  height={48}
                  className="rounded-full border-2 border-primary"
                />
              </Link>
              <span className="font-bold text-white text-lg">
                {video.post?.user?.displayName}
              </span>
              {video.post?.user && video.post.user.username && (
                <FollowButton
                  username={video.post.user.username}
                  initialState={{ followers: video.post?.user?._count?.followers || 0, isFollowedByUser: video.post?.user?.followers?.some((f: { followerId: string }) => f.followerId === user?.id) || false }}
                />
              )}
            </div>
            <div className="flex items-center gap-4 mt-2">
              <LikeButton
                postId={video.post?.id}
                initialState={{ likes: video.post?._count?.likes || 0, isLikedByUser: video.post?.likes?.some((like: { userId: string }) => like.userId === user?.id) || false }}
              />
              <button
                className="flex items-center gap-1 text-white"
                onClick={() => setShowComments((v) => !v)}
              >
                <MessageSquare className="size-6" />
                <span>Comments</span>
              </button>
              <button
                className="flex items-center gap-1 text-white"
                onClick={() => setMuted((m) => !m)}
                aria-label={muted ? "Unmute" : "Mute"}
              >
                {muted ? <VolumeX className="size-6" /> : <Volume2 className="size-6" />}
                <span>{muted ? "Unmute" : "Mute"}</span>
              </button>
            </div>
            {showComments && video.post && (
              <div className="bg-black/80 rounded-xl p-4 mt-4 max-h-80 overflow-y-auto">
                <Comments post={video.post} />
              </div>
            )}
          </div>
        </div>
      ))}
    </div>
  );
}
