import { Button } from "@/components/ui/button";
import {
  ButtonGroup,
  ButtonGroupSeparator,
} from "@/components/ui/button-group";
import { Input } from "@/components/ui/input";
import { Loader2, Minus, Plus, Trash2 } from "lucide-react";

interface ActionButtonGroupProps {
  type: "take" | "return" | "remove";
  count: number;
  onCountChange: (count: number) => void;
  onAction: () => void;
  isLoading: boolean;
  isDisabled: boolean;
  maxCount?: number;
  compact?: boolean;
}

export default function ActionButtonGroup({
  type,
  count,
  onCountChange,
  onAction,
  isLoading,
  isDisabled,
  maxCount,
  compact = false,
}: ActionButtonGroupProps) {
  const configs = {
    take: {
      icon: Plus,
      label: "Take",
      loadingLabel: "Taking",
      variant: "default" as const,
    },
    return: {
      icon: Minus,
      label: "Return",
      loadingLabel: "Returning",
      variant: "secondary" as const,
    },
    remove: {
      icon: Trash2,
      label: "Remove",
      loadingLabel: "Removing",
      variant: "destructive" as const,
    },
  };

  const config = configs[type];
  const Icon = config.icon;

  const inputClass = compact ? "h-7 flex-1 text-xs" : "h-9 flex-1";
  const buttonClass = compact ? "flex-2 h-7 text-xs px-2" : "flex-2 h-9";
  const iconClass = compact ? "h-3 w-3" : "h-3.5 w-3.5";
  const iconMargin = compact ? "sm:mr-1" : "mr-1.5";
  const minWidth = compact ? "min-w-[180px]" : "";

  return (
    <ButtonGroup orientation="horizontal" className={`flex-1 ${minWidth}`}>
      <Input
        type="number"
        min={1}
        max={maxCount}
        value={count}
        onChange={(e) =>
          onCountChange(parseInt(e.currentTarget.value || "1", 10))
        }
        className={inputClass}
        disabled={isDisabled}
        aria-label={`Quantity to ${type}`}
      />
      {type === "take" && <ButtonGroupSeparator />}
      <Button
        variant={config.variant}
        onClick={onAction}
        disabled={isDisabled}
        className={buttonClass}
        size="sm"
        aria-label={`${config.label} item`}
      >
        {isLoading ? (
          <>
            <Loader2 className={`${iconClass} ${iconMargin} animate-spin`} />
            {compact ? (
              <>
                <span className="hidden sm:inline">
                  {config.loadingLabel}...
                </span>
                <span className="sm:hidden">...</span>
              </>
            ) : (
              config.label
            )}
          </>
        ) : (
          <>
            <Icon
              className={`${iconClass} ${compact ? "sm:mr-1" : iconMargin}`}
            />
            {compact ? (
              <span className="hidden sm:inline">{config.label}</span>
            ) : (
              config.label
            )}
          </>
        )}
      </Button>
    </ButtonGroup>
  );
}
