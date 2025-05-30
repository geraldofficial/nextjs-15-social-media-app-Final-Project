"use client";

import { BarChart2 } from "lucide-react";
import { formatNumber } from "@/lib/utils";
import FollowerCount from "@/components/FollowerCount";
import { UserData, FollowerInfo } from "@/lib/types";
import Link from "next/link";

interface ProfileStatsProps {
  user: UserData;
  followerInfo: FollowerInfo;
}

export default function ProfileStats({ user, followerInfo }: ProfileStatsProps) {
  return (
    <div className="flex flex-wrap gap-5 text-sm">
      <Link
        href={`/users/${user.username}/followers`}
        className="hover:underline"
      >
        <span className="font-bold tabular-nums">
          {formatNumber(user._count.followers)}
        </span>{" "}
        <span className="text-muted-foreground">Followers</span>
      </Link>
      <Link
        href={`/users/${user.username}/following`}
        className="hover:underline"
      >
        <span className="font-bold tabular-nums">
          {formatNumber(user._count.following)}
        </span>{" "}
        <span className="text-muted-foreground">Following</span>
      </Link>
      <div>
        <span className="font-bold tabular-nums">
          {formatNumber(user._count.posts)}
        </span>{" "}
        <span className="text-muted-foreground">Posts</span>
      </div>
      {user.profileViews > 0 && (
        <div>
          <span className="font-bold tabular-nums">
            {formatNumber(user.profileViews)}
          </span>{" "}
          <span className="text-muted-foreground">Profile views</span>
        </div>
      )}
    </div>
  );
}
