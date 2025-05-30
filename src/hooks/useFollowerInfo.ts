import kyInstance from "@/lib/ky";
import { FollowerInfo } from "@/lib/types";
import { useQuery } from "@tanstack/react-query";

export default function useFollowerInfo(
  username: string,
  initialState: FollowerInfo,
) {
  const query = useQuery({
    queryKey: ["follower-info", username],
    queryFn: () =>
      kyInstance.get(`/api/users/${username}/followers`).json<FollowerInfo>(),
    initialData: initialState,
    staleTime: Infinity,
  });

  return query;
}
