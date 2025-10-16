interface StatsDisplayProps {
  totalCount: number;
  available: number;
  held: number;
  compact?: boolean;
}

export default function StatsDisplay({
  totalCount,
  available,
  held,
  compact,
}: StatsDisplayProps) {
  const textSize = compact ? "text-xs" : "text-sm";

  return (
    <div
      className={`flex ${compact ? "items-center gap-4" : "flex-wrap gap-x-4 gap-y-1"} ${textSize}`}
    >
      <span className="text-muted-foreground">
        <span className="font-medium text-foreground">{totalCount}</span> total
      </span>
      <span className="text-green-600 font-medium">
        {available} {compact ? "avail" : "available"}
      </span>
      <span className="text-orange-600 font-medium">{held} held</span>
    </div>
  );
}
