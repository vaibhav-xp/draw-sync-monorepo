"use client";

import {
  Square,
  Circle,
  Pen,
  Eraser,
  MousePointer,
  Palette,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { ThemeToggle } from "@/components/theme-toggle";
import { Tool } from "@repo/types";
import { useMemo } from "react";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { useStore } from "@/hooks/useStore";

export default function MenuBar() {
  const { selectedTool, setSelectedTool } = useStore();

  const tools = useMemo(() => {
    return [
      {
        id: Tool.Cursor,
        icon: MousePointer,
        label: "Select",
        shortcut: "1",
      },
      {
        id: Tool.Rectangle,
        icon: Square,
        label: "Rectangle",
        shortcut: "2",
      },
      {
        id: Tool.Ellipse,
        icon: Circle,
        label: "Ellipse",
        shortcut: "3",
      },
      {
        id: Tool.Pencil,
        icon: Pen,
        label: "Pen",
        shortcut: "4",
      },
      {
        id: Tool.Eraser,
        icon: Eraser,
        label: "Eraser",
        shortcut: "5",
      },
    ];
  }, []);

  return (
    <div className="flex h-16 items-center justify-between border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 px-6 shadow-sm">
      <div className="flex items-center space-x-6">
        {/* Logo */}
        <div className="flex items-center space-x-3">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-br from-primary to-primary/80 text-primary-foreground shadow-md">
            <Palette className="h-4 w-4" />
          </div>
          <div className="hidden sm:block">
            <h1 className="text-lg font-bold tracking-tight">DrawSync</h1>
            <p className="text-xs text-muted-foreground">Creative Board</p>
          </div>
        </div>

        {/* Separator */}
        <div className="h-6 w-px bg-gradient-to-b from-transparent via-border to-transparent" />

        {/* Tools */}
        <div className="flex items-center gap-2 rounded-lg bg-muted p-1 shadow-inner">
          {tools.map((tool, index) => {
            const Icon = tool.icon;
            const isSelected = selectedTool === tool.id;

            return (
              <Tooltip key={tool.id}>
                <TooltipTrigger asChild>
                  <Button
                    variant={isSelected ? "default" : "ghost"}
                    size="sm"
                    onClick={() => setSelectedTool(tool.id)}
                    className={`
                      h-9 w-9 p-0 transition-all duration-200
                      ${
                        isSelected
                          ? "shadow-md ring-1 ring-primary/20 scale-105"
                          : "hover:scale-105 hover:shadow-sm"
                      }
                    `}
                  >
                    <Icon
                      className={`
                        h-4 w-4 transition-transform duration-200
                        ${isSelected ? "" : "group-hover:scale-110"}
                      `}
                    />
                    <span className="sr-only">{tool.label}</span>
                  </Button>
                </TooltipTrigger>
                <TooltipContent side="bottom" className="shadow-lg">
                  <div className="flex items-center gap-2">
                    <span className="font-medium">{tool.label}</span>
                    <kbd className="pointer-events-none inline-flex h-5 select-none items-center gap-1 rounded border bg-muted px-1.5 font-mono text-[10px] font-medium text-muted-foreground opacity-100 shadow-sm">
                      {tool.shortcut}
                    </kbd>
                  </div>
                </TooltipContent>
              </Tooltip>
            );
          })}
        </div>
      </div>

      <div className="flex items-center space-x-3">
        <div className="h-6 w-px bg-gradient-to-b from-transparent via-border to-transparent" />
        <div className="rounded-lg bg-muted/30 p-1">
          <ThemeToggle />
        </div>
      </div>
    </div>
  );
}
