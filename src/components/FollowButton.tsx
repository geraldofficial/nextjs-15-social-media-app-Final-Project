"use client";

import kyInstance from "@/lib/ky";
import useFollowerInfo from "@/hooks/useFollowerInfo";
import { FollowerInfo } from "@/lib/types";
import { QueryKey, useMutation, useQueryClient } from "@tanstack/react-query";
import { Button } from "./ui/button";
import { Loader2 } from "lucide-react";
import { useToast } from "./ui/use-toast";

interface FollowButtonProps {
  username: string;
  initialState: FollowerInfo;
}

export default function FollowButton({
  username,
  initialState,
}: FollowButtonProps) {
  const { toast } = useToast();

  const queryClient = useQueryClient();

  const { data } = useFollowerInfo(username, initialState);

  const queryKey: QueryKey = ["follower-info", username];

  const { mutate, isLoading } = useMutation({
    mutationFn: async () => {
      const method = initialState.isFollowedByUser ? "DELETE" : "POST";
      await kyInstance(
        `/api/users/${username}/followers`,
        { method },
      ).json();
    },
    onMutate: async () => {
      await queryClient.cancelQueries({ queryKey });

      const previousState = queryClient.getQueryData<FollowerInfo>(queryKey);

      queryClient.setQueryData<FollowerInfo>(queryKey, () => ({
        followers:
          (previousState?.followers || 0) +
          (previousState?.isFollowedByUser ? -1 : 1),
        isFollowedByUser: !previousState?.isFollowedByUser,
      }));

      return { previousState };
    },
    onError(error, variables, context) {
      queryClient.setQueryData(queryKey, context?.previousState);
      console.error(error);
      toast({
        variant: "destructive",
        description: "Something went wrong. Please try again.",
      });
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey });
    },
  });

  return (
    <Button
      variant={data.isFollowedByUser ? "secondary" : "default"}
      disabled={isLoading}
      onClick={() => mutate()}
    >
      {isLoading ? (
        <Loader2 className="mr-2 size-4 animate-spin" />
      ) : null}
      {data.isFollowedByUser ? "Unfollow" : "Follow"}
    </Button>
  );
}
