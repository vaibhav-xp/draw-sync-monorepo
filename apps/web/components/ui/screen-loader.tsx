import { cn } from "@/lib/utils";
import { Palette, Brush, Square, Circle } from "lucide-react";

interface ScreenLoaderProps {
  isLoading: boolean;
  className?: string;
}

/**
 * Full-screen loader with theme-aware animations
 * Shows animated drawing tools while the app is loading
 */
export function ScreenLoader({ isLoading, className }: ScreenLoaderProps) {
  if (!isLoading) return null;

  return (
    <div
      className={cn(
        "fixed inset-0 z-[9999] flex items-center justify-center",
        "bg-background/95 backdrop-blur-sm",
        "transition-opacity duration-500",
        className
      )}
    >
      <div className="flex flex-col items-center space-y-8">
        <div className="relative">
          <div className="w-16 h-16 rounded-2xl bg-primary/10 flex items-center justify-center">
            <Palette className="w-8 h-8 text-primary animate-pulse" />
          </div>

          <div className="absolute -top-2 -right-2 w-6 h-6 rounded-lg bg-blue-500/20 flex items-center justify-center animate-bounce delay-100">
            <Brush className="w-3 h-3 text-blue-500" />
          </div>

          <div className="absolute -bottom-2 -left-2 w-6 h-6 rounded-lg bg-green-500/20 flex items-center justify-center animate-bounce delay-300">
            <Square className="w-3 h-3 text-green-500" />
          </div>

          <div className="absolute top-1/2 -left-8 w-6 h-6 rounded-lg bg-purple-500/20 flex items-center justify-center animate-bounce delay-500">
            <Circle className="w-3 h-3 text-purple-500" />
          </div>
        </div>

        <div className="text-center space-y-2">
          <h2 className="text-xl font-semibold text-foreground">DrawSync</h2>
          <p className="text-sm text-muted-foreground animate-pulse">
            Preparing your canvas...
          </p>
        </div>

        <div className="space-y-2 w-48">
          <div className="h-1 bg-muted rounded-full overflow-hidden">
            <div className="h-full bg-primary rounded-full animate-loading-bar"></div>
          </div>
          <div className="h-1 bg-muted rounded-full overflow-hidden">
            <div className="h-full bg-blue-500 rounded-full animate-loading-bar-delayed"></div>
          </div>
          <div className="h-1 bg-muted rounded-full overflow-hidden">
            <div className="h-full bg-green-500 rounded-full animate-loading-bar-slow"></div>
          </div>
        </div>

        <div className="flex space-x-2">
          <div className="w-2 h-2 bg-primary rounded-full animate-bounce"></div>
          <div className="w-2 h-2 bg-primary rounded-full animate-bounce delay-100"></div>
          <div className="w-2 h-2 bg-primary rounded-full animate-bounce delay-200"></div>
        </div>
      </div>
    </div>
  );
}
