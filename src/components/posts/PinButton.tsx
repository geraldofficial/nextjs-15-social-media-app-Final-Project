import { LucidePin, LucidePinOff } from "lucide-react";
import { useMutation } from "@tanstack/react-query";
import { PostData } from "@/lib/types";
import { toast } from "@/components/ui/use-toast";
import { useQueryClient } from "@tanstack/react-query";

interface PinButtonProps {
  post: PostData;
}

export default function PinButton({ post }: PinButtonProps) {
  const isPinned = post.user.pinnedPosts?.some((p) => p.post.id === post.id);

  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn: async () => {
      const response = await fetch(`/api/posts/${post.id}/pin`, {
        method: isPinned ? "DELETE" : "POST",
      });
      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error || "Failed to update pin status");
      }
    },
    onSuccess: () => {
      toast({
        description: isPinned ? "Post unpinned" : "Post pinned",
      });
      queryClient.invalidateQueries({ queryKey: ["user", post.user.username] });
    },
    onError: (error: Error) => {
      console.error(error);
      toast({
        variant: "destructive",
        description: error.message,
      });
    },
  });

  return (
    <button
      onClick={() => mutation.mutate()}
      disabled={mutation.isLoading}
      className={`flex items-center gap-1.5 text-sm font-medium ${
        isPinned ? "text-primary" : "text-muted-foreground hover:text-primary"
      }`}
    >
      {isPinned ? (
        <LucidePinOff className="size-4" />
      ) : (
        <LucidePin className="size-4" />
      )}
      {isPinned ? "Unpin" : "Pin"}
    </button>
  );
}
