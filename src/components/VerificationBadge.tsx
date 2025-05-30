import { Check } from "lucide-react";

interface VerificationBadgeProps {
  className?: string;
}

export default function VerificationBadge({ className }: VerificationBadgeProps) {
  return (
    <div
      className={`inline-flex items-center justify-center rounded-full bg-primary p-0.5 text-primary-foreground ${
        className ?? ""
      }`}
    >
      <Check className="size-3" />
    </div>
  );
}
