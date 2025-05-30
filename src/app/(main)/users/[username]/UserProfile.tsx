"use client";

import { useState } from "react";
import { UserData, FollowerInfo } from "@/lib/types";
import UserAvatar from "@/components/UserAvatar";
import VerificationBadge from "@/components/VerificationBadge";
import ProfileStats from "./ProfileStats";
import EditProfileButton from "./EditProfileButton";
import FollowButton from "@/components/FollowButton";
import { QrCode } from "lucide-react";
import Linkify from "@/components/Linkify";
import PinnedPosts from "./PinnedPosts";
import { formatDistanceToNow } from "date-fns";
import QRCodeDialog from "./QRCodeDialog";

interface UserProfileProps {
  user: UserData;
  loggedInUserId: string;
}

export default function UserProfile({ user, loggedInUserId }: UserProfileProps) {
  const [qrDialogOpen, setQrDialogOpen] = useState(false);
  const followerInfo: FollowerInfo = {
    followers: user._count.followers,
    isFollowedByUser: user.followers.some(
      ({ followerId }) => followerId === loggedInUserId,
    ),
  };

  return (
    <div
      className="h-fit w-full space-y-5 rounded-2xl bg-card p-5 shadow-sm"
      style={{
        borderColor: user.themeColor || "#1DA1F2",
        borderWidth: "2px",
      }}
    >
      <UserAvatar
        avatarUrl={user.avatarUrl}
        size={250}
        className="mx-auto size-full max-h-60 max-w-60 rounded-full"
      />
      <div className="flex flex-wrap gap-3 sm:flex-nowrap">
        <div className="me-auto space-y-3">
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-3xl font-bold">{user.displayName}</h1>
              {user.isVerified && <VerificationBadge className="size-5" />}
            </div>
            <div className="text-muted-foreground">@{user.username}</div>
          </div>
          {user.customLayout && typeof user.customLayout === 'object' && (user.customLayout as { showStats?: boolean }).showStats !== false && (
            <ProfileStats user={user} followerInfo={followerInfo} />
          )}
        </div>
        <div className="flex flex-col gap-2">
          {user.id === loggedInUserId ? (
            <EditProfileButton user={user} />
          ) : (
            <FollowButton username={user.username} initialState={followerInfo} />
          )}
          <button
            className="inline-flex items-center justify-center rounded-md bg-primary/10 px-4 py-2 text-sm font-medium text-primary hover:bg-primary/20"
            onClick={() => setQrDialogOpen(true)}
          >
            <QrCode className="mr-2 size-4" />
            QR Code
          </button>
        </div>
      </div>
      {user.bio && user.customLayout && typeof user.customLayout === 'object' && (user.customLayout as { showBio?: boolean }).showBio !== false && (
        <>
          <hr />
          <Linkify>
            <div className="overflow-hidden whitespace-pre-line break-words">
              {user.bio}
            </div>
          </Linkify>
        </>
      )}
      {user.pinnedPosts && user.pinnedPosts.length > 0 && user.customLayout && typeof user.customLayout === 'object' && (user.customLayout as { showPinnedPosts?: boolean }).showPinnedPosts !== false && (
        <>
          <hr />
          <PinnedPosts posts={user.pinnedPosts.map(pinnedPost => ({
            ...pinnedPost,
            post: {
              ...pinnedPost.post,
              likes: (pinnedPost.post as any).likes ?? [],
              bookmarks: (pinnedPost.post as any).bookmarks ?? [],
              user: {
                ...pinnedPost.post.user,
                _count: (pinnedPost.post.user as any)._count || {},
                profileViews: (pinnedPost.post.user as any).profileViews || 0,
                lastProfileView: (pinnedPost.post.user as any).lastProfileView || null,
                pinnedPosts: (pinnedPost.post.user as any).pinnedPosts || [],
                followers: (pinnedPost.post.user as any).followers || [],
                id: (pinnedPost.post.user as any).id ?? "",
                themeColor: (pinnedPost.post.user as any).themeColor ?? null,
                bio: (pinnedPost.post.user as any).bio ?? null,
                verifiedAt: (pinnedPost.post.user as any).verifiedAt ?? null,
                customLayout: (pinnedPost.post.user as any).customLayout ?? {}
              }
            }
          }))} />
        </>
      )}
      {user.lastProfileView && (
        <div className="text-sm text-muted-foreground">
          Last viewed{" "}
          {formatDistanceToNow(user.lastProfileView, { addSuffix: true })}
        </div>
      )}
      <QRCodeDialog
        username={user.username}
        open={qrDialogOpen}
        onOpenChange={setQrDialogOpen}
      />
    </div>
  );
} 