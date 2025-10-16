import { Badge } from "@/components/ui/badge";

interface AvailabilityBadgeProps {
  available: number;
  compact?: boolean;
}

export default function AvailabilityBadge({
  available,
  compact,
}: AvailabilityBadgeProps) {
  if (available > 0) {
    return (
      <Badge variant="secondary" className={compact ? "gap-1" : "gap-1.5"}>
        <span
          className={`rounded-full bg-green-500 ${compact ? "h-1.5 w-1.5" : "h-2 w-2 animate-pulse"}`}
        />
        {compact ? "Available" : "Available"}
      </Badge>
    );
  }
  return (
    <Badge variant="destructive" className={compact ? "gap-1" : "gap-1.5"}>
      <span
        className={`rounded-full bg-white ${compact ? "h-1.5 w-1.5" : "h-2 w-2"}`}
      />
      {compact ? "Out" : "Out of Stock"}
    </Badge>
  );
}
