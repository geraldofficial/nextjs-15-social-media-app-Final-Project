"use client";

import useFollowerInfo from "@/hooks/useFollowerInfo";
import { FollowerInfo } from "@/lib/types";
import { formatNumber } from "@/lib/utils";

interface FollowerCountProps {
  username: string;
  initialState: FollowerInfo;
}

export default function FollowerCount({
  username,
  initialState,
}: FollowerCountProps) {
  const { data } = useFollowerInfo(username, initialState);

  return (
    <span>
      Followers:{" "}
      <span className="font-semibold">{formatNumber(data.followers)}</span>
    </span>
  );
}
