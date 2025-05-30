"use client";

import { useEffect, useState, useRef } from "react";
import kyInstance from "@/lib/ky";
import Image from "next/image";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { ChevronLeft, ChevronRight } from "lucide-react";

interface Story {
  id: string;
  type: "IMAGE" | "VIDEO";
  url: string;
}

interface UserStories {
  user: {
    id: string;
    username: string;
    displayName: string;
    avatarUrl: string | null;
  };
  stories: Story[];
}

export default function StoriesBar() {
  const [stories, setStories] = useState<UserStories[]>([]);
  const [open, setOpen] = useState(false);
  const [activeUserIdx, setActiveUserIdx] = useState(0);
  const [activeStoryIdx, setActiveStoryIdx] = useState(0);
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    kyInstance.get("/api/stories").json<UserStories[]>().then(setStories);
  }, []);

  useEffect(() => {
    if (!open) return;
    if (timerRef.current) clearTimeout(timerRef.current);
    timerRef.current = setTimeout(() => {
      const userStories = stories[activeUserIdx]?.stories || [];
      if (activeStoryIdx < userStories.length - 1) {
        setActiveStoryIdx((i) => i + 1);
      } else if (activeUserIdx < stories.length - 1) {
        setActiveUserIdx((i) => i + 1);
        setActiveStoryIdx(0);
      } else {
        setOpen(false);
      }
    }, 4000);
    return () => {
      if (timerRef.current) clearTimeout(timerRef.current);
    };
  }, [open, activeUserIdx, activeStoryIdx, stories]);

  function openStory(userIdx: number) {
    setActiveUserIdx(userIdx);
    setActiveStoryIdx(0);
    setOpen(true);
  }

  const activeUser = stories[activeUserIdx];
  const activeStory = activeUser?.stories[activeStoryIdx];

  if (stories.length === 0) {
    return null;
  }

  return (
    <>
      <div className="flex gap-4 py-4 px-4 overflow-x-auto bg-card rounded-2xl mb-4 scrollbar-thin scrollbar-thumb-muted-foreground/20 hover:scrollbar-thumb-muted-foreground/40">
        {stories.map((userStories, idx) => (
          <button
            key={userStories.user.id}
            className={`flex flex-col items-center group transition-transform hover:scale-105 ${
              idx === activeUserIdx && open ? "scale-105" : ""
            }`}
            onClick={() => openStory(idx)}
          >
            <div className={`p-1 rounded-full ${
              idx === activeUserIdx && open 
                ? "bg-gradient-to-tr from-primary to-primary/50" 
                : "bg-gradient-to-tr from-muted-foreground to-muted-foreground/50"
            }`}>
              <div className="p-0.5 rounded-full bg-background">
                <Image
                  src={userStories.user.avatarUrl || "/assets/avatar-placeholder.png"}
                  alt={userStories.user.displayName}
                  width={48}
                  height={48}
                  className="rounded-full"
                />
              </div>
            </div>
            <span className="text-xs mt-2 max-w-[64px] truncate text-center group-hover:text-primary transition-colors">
              {userStories.user.displayName}
            </span>
          </button>
        ))}
      </div>

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="flex flex-col items-center max-w-3xl w-full p-0 gap-0 overflow-hidden bg-background/95 backdrop-blur">
          {activeUser && activeStory && (
            <>
              <div className="flex items-center gap-3 w-full p-4 bg-background/50 backdrop-blur">
                <Image
                  src={activeUser.user.avatarUrl || "/assets/avatar-placeholder.png"}
                  alt={activeUser.user.displayName}
                  width={48}
                  height={48}
                  className="rounded-full"
                />
                <span className="font-bold">{activeUser.user.displayName}</span>
              </div>

              <div className="relative w-full aspect-[9/16] flex items-center justify-center bg-black">
                {activeStory.type === "IMAGE" ? (
                  <Image
                    src={activeStory.url}
                    alt="Story"
                    fill
                    className="object-contain"
                    priority
                  />
                ) : (
                  <video
                    src={activeStory.url}
                    controls
                    autoPlay
                    playsInline
                    className="max-h-full max-w-full"
                  />
                )}

                <div className="absolute top-0 left-0 w-full h-1 bg-background/10">
                  <div 
                    className="h-full bg-primary transition-all duration-4000 linear" 
                    style={{ width: "100%" }}
                  />
                </div>

                <div className="absolute top-1/2 -translate-y-1/2 left-0 right-0 flex justify-between px-4 pointer-events-none">
                  <button
                    onClick={() => {
                      if (activeStoryIdx > 0) setActiveStoryIdx((i) => i - 1);
                      else if (activeUserIdx > 0) {
                        setActiveUserIdx((i) => i - 1);
                        setActiveStoryIdx(stories[activeUserIdx - 1].stories.length - 1);
                      }
                    }}
                    className="p-2 rounded-full bg-black/20 backdrop-blur-sm pointer-events-auto disabled:opacity-30 disabled:cursor-not-allowed"
                    disabled={activeUserIdx === 0 && activeStoryIdx === 0}
                  >
                    <ChevronLeft className="w-6 h-6 text-white" />
                  </button>
                  <button
                    onClick={() => {
                      const userStories = activeUser?.stories || [];
                      if (activeStoryIdx < userStories.length - 1) setActiveStoryIdx((i) => i + 1);
                      else if (activeUserIdx < stories.length - 1) {
                        setActiveUserIdx((i) => i + 1);
                        setActiveStoryIdx(0);
                      }
                    }}
                    className="p-2 rounded-full bg-black/20 backdrop-blur-sm pointer-events-auto disabled:opacity-30 disabled:cursor-not-allowed"
                    disabled={
                      activeUserIdx === stories.length - 1 &&
                      activeStoryIdx === (activeUser?.stories.length || 1) - 1
                    }
                  >
                    <ChevronRight className="w-6 h-6 text-white" />
                  </button>
                </div>
              </div>
            </>
          )}
        </DialogContent>
      </Dialog>
    </>
  );
}
