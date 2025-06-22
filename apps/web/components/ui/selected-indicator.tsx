import { cn } from "@/lib/utils";

interface SelectedIndicatorProps {
  isSelected: boolean;
  className?: string;
  variant?: "default" | "small" | "large";
}

/**
 * Reusable component for showing selected state indicator
 * Displays a small circular badge with a dot when item is selected
 */
export function SelectedIndicator({
  isSelected,
  className,
  variant = "default",
}: SelectedIndicatorProps) {
  if (!isSelected) return null;

  const variants = {
    small: "w-2 h-2 -top-0.5 -right-0.5",
    default: "w-3 h-3 -top-1 -right-1",
    large: "w-4 h-4 -top-1.5 -right-1.5",
  };

  const dotVariants = {
    small: "w-0.5 h-0.5",
    default: "w-1 h-1",
    large: "w-1.5 h-1.5",
  };

  return (
    <div
      className={cn(
        "absolute bg-primary rounded-full flex items-center justify-center shadow-lg border-2 border-white",
        variants[variant],
        className
      )}
    >
      <div className={cn("bg-white rounded-full", dotVariants[variant])} />
    </div>
  );
}
