"use client";

import { useState, useMemo, useEffect } from "react";
import { useStore } from "@/hooks/useStore";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Slider } from "@/components/ui/slider";
import { SelectedIndicator } from "@/components/ui/selected-indicator";
import { Separator } from "@/components/ui/separator";
import {
  ChevronLeft,
  ChevronRight,
  Palette,
  Brush,
  Circle,
  Square,
  Minus,
  MoreHorizontal,
  MoreVertical,
} from "lucide-react";
import { getThemeColors } from "@/lib/utils";
import { BaseShapeProperty } from "@repo/types";
import { useTheme } from "next-themes";

const BASE_STROKE_COLORS = [
  { color: "#ef4444", name: "Red" },
  { color: "#22c55e", name: "Green" },
  { color: "#3b82f6", name: "Blue" },
  { color: "#f59e0b", name: "Amber" },
  { color: "#8b5cf6", name: "Purple" },
];

const FILL_COLORS = [
  { color: "transparent", name: "None" },
  { color: "#1f2937", name: "Dark Gray" },
  { color: "#dc2626", name: "Dark Red" },
  { color: "#16a34a", name: "Dark Green" },
  { color: "#2563eb", name: "Dark Blue" },
  { color: "#d97706", name: "Dark Amber" },
  { color: "#7c3aed", name: "Dark Purple" },
];

const STROKE_WIDTHS = [
  {
    width: 1,
    label: "Fine",
    icon: <Minus className="w-2 h-2" strokeWidth={1} />,
  },
  {
    width: 2,
    label: "Medium",
    icon: <Minus className="w-2 h-2" strokeWidth={3} />,
  },
  {
    width: 4,
    label: "Bold",
    icon: <Minus className="w-2 h-2" strokeWidth={6} />,
  },
];

const LINE_STYLES = [
  { pattern: [], label: "Solid", icon: <Minus className="w-2 h-2" /> },
  {
    pattern: [8, 8],
    label: "Dashed",
    icon: <MoreHorizontal className="w-2 h-2" />,
  },
  {
    pattern: [2, 4],
    label: "Dotted",
    icon: <MoreVertical className="w-2 h-2 rotate-90" />,
  },
];

const BORDER_RADIUS_OPTIONS = [
  { radius: 0, label: "Sharp", icon: <Square className="w-2 h-2" /> },
  {
    radius: 8,
    label: "Rounded",
    icon: <Square className="w-2 h-2 rounded-2xl" />,
  },
  {
    radius: 16,
    label: "Rounded",
    icon: <Square className="w-2 h-2 rounded-4xl" />,
  },
];

export function Sidebar() {
  const [isOpen, setIsOpen] = useState(true);
  const { baseProperties, setBaseProperties } = useStore();
  const { resolvedTheme } = useTheme();

  const STROKE_COLORS = useMemo(() => {
    if (!resolvedTheme) return [];

    const isDark = resolvedTheme === "dark";

    if (isDark) {
      return [{ color: "white", name: "White" }, ...BASE_STROKE_COLORS];
    } else {
      return [{ color: "black", name: "Black" }, ...BASE_STROKE_COLORS];
    }
  }, [resolvedTheme]);

  const handleOnChange = (newProperty: Partial<BaseShapeProperty>) => {
    setBaseProperties({ ...baseProperties, ...newProperty });
  };

  return (
    <>
      <Button
        variant="outline"
        size="sm"
        className={`fixed left-4 top-1/2 -translate-y-1/2 z-50 transition-all duration-300 bg-background/95 backdrop-blur-sm border shadow-md hover:shadow-lg ${
          isOpen ? "translate-x-44" : "translate-x-0"
        }`}
        onClick={() => setIsOpen(!isOpen)}
      >
        {isOpen ? <ChevronLeft size={14} /> : <ChevronRight size={14} />}
      </Button>

      <Card
        className={`fixed left-4 top-1/2 -translate-y-1/2 z-40 w-44 bg-background/98 backdrop-blur-sm border shadow-xl transition-all duration-300 ${
          isOpen
            ? "translate-x-0 opacity-100 pointer-events-auto"
            : "-translate-x-full opacity-0 pointer-events-none"
        }`}
      >
        <CardHeader className="pb-1">
          <div className="flex items-center gap-1.5">
            <Palette className="w-3 h-3 text-primary" />
            <h2 className="text-xs font-semibold">Properties</h2>
          </div>
        </CardHeader>

        <CardContent className="space-y-2">
          <div className="space-y-1.5">
            <div className="flex items-center gap-1">
              <Brush className="w-2 h-2 text-muted-foreground" />
              <span className="text-xs font-medium text-muted-foreground">
                Stroke
              </span>
            </div>

            <div className="grid grid-cols-3 gap-1">
              {STROKE_COLORS.map(({ color, name }) => (
                <Button
                  key={color}
                  variant="outline"
                  size="sm"
                  className={`group relative w-full h-6 p-0 transition-all hover:scale-105 flex items-center justify-center border-2 ${
                    baseProperties.strokeStyle === color
                      ? "border-primary ring-2 ring-primary/20 shadow-sm"
                      : "border-border hover:border-primary/50"
                  }`}
                  style={{
                    backgroundColor:
                      color === "white"
                        ? "#ffffff"
                        : color === "transparent"
                          ? "#ffffff"
                          : color,
                    border: color === "white" ? "1px solid #e5e7eb" : undefined,
                  }}
                  onClick={() => handleOnChange({ strokeStyle: color })}
                >
                  {color === "transparent" && (
                    <div className="absolute inset-1 bg-gradient-to-br from-red-500/20 via-transparent to-red-500/20 rounded">
                      <div className="w-full h-0.5 bg-red-400 absolute top-1/2 left-0 rotate-45 origin-center opacity-50"></div>
                    </div>
                  )}
                  <SelectedIndicator
                    isSelected={baseProperties.strokeStyle === color}
                  />
                </Button>
              ))}
            </div>
          </div>

          <Separator className="my-1" />

          <div className="space-y-1.5">
            <div className="flex items-center gap-1">
              <Circle className="w-2 h-2 text-muted-foreground" />
              <span className="text-xs font-medium text-muted-foreground">
                Fill
              </span>
            </div>

            <div className="grid grid-cols-3 gap-1">
              {FILL_COLORS.map(({ color, name }) => (
                <Button
                  key={color}
                  variant="outline"
                  size="sm"
                  className={`group relative w-full h-6 p-0 transition-all hover:scale-105 flex items-center justify-center border-2 ${
                    baseProperties.fillStyle === color
                      ? "border-primary ring-2 ring-primary/20 shadow-sm"
                      : "border-border hover:border-primary/50"
                  }`}
                  style={{
                    backgroundColor:
                      color === "transparent" ? "#ffffff" : color,
                  }}
                  onClick={() => handleOnChange({ fillStyle: color })}
                >
                  {color === "transparent" && (
                    <div className="absolute inset-1 bg-gradient-to-br from-red-500/20 via-transparent to-red-500/20 rounded">
                      <div className="w-full h-0.5 bg-red-400 absolute top-1/2 left-0 rotate-45 origin-center opacity-50"></div>
                    </div>
                  )}
                  <SelectedIndicator
                    isSelected={baseProperties.fillStyle === color}
                  />
                </Button>
              ))}
            </div>
          </div>

          <Separator className="my-1" />

          <div className="space-y-1.5">
            <div className="flex items-center justify-between">
              <span className="text-xs font-medium text-muted-foreground">
                Width
              </span>
              <Badge variant="outline" className="text-xs px-1 py-0 h-3">
                {baseProperties.lineWidth}px
              </Badge>
            </div>

            <div className="grid grid-cols-3 gap-1">
              {STROKE_WIDTHS.map(({ width, label, icon }) => (
                <Button
                  key={width}
                  variant={
                    baseProperties.lineWidth === width ? "default" : "outline"
                  }
                  size="icon"
                  className={`relative h-6 w-full border-2 transition-all hover:scale-105 ${
                    baseProperties.lineWidth === width
                      ? "shadow-sm ring-2 ring-primary/20"
                      : "hover:border-primary/50"
                  }`}
                  onClick={() => handleOnChange({ lineWidth: width })}
                >
                  {icon}
                  <SelectedIndicator
                    isSelected={baseProperties.lineWidth === width}
                  />
                </Button>
              ))}
            </div>
          </div>

          <Separator className="my-1" />

          <div className="space-y-1.5">
            <span className="text-xs font-medium text-muted-foreground">
              Style
            </span>

            <div className="grid grid-cols-3 gap-1">
              {LINE_STYLES.map(({ pattern, label, icon }) => (
                <Button
                  key={label}
                  variant={
                    JSON.stringify(baseProperties.lineDash) ===
                    JSON.stringify(pattern)
                      ? "default"
                      : "outline"
                  }
                  size="icon"
                  className={`relative h-6 w-full border-2 transition-all hover:scale-105 ${
                    JSON.stringify(baseProperties.lineDash) ===
                    JSON.stringify(pattern)
                      ? "shadow-sm ring-2 ring-primary/20"
                      : "hover:border-primary/50"
                  }`}
                  onClick={() => handleOnChange({ lineDash: pattern })}
                >
                  {icon}
                  <SelectedIndicator
                    isSelected={
                      JSON.stringify(baseProperties.lineDash) ===
                      JSON.stringify(pattern)
                    }
                  />
                </Button>
              ))}
            </div>
          </div>

          <Separator className="my-1" />

          <div className="space-y-1.5">
            <span className="text-xs font-medium text-muted-foreground">
              Edges
            </span>

            <div className="grid grid-cols-3 gap-1">
              {BORDER_RADIUS_OPTIONS.map(({ radius, label, icon }) => (
                <Button
                  key={radius}
                  variant={
                    baseProperties.borderRadius === radius
                      ? "default"
                      : "outline"
                  }
                  size="icon"
                  className={`relative h-6 w-full border-2 transition-all hover:scale-105 ${
                    baseProperties.borderRadius === radius
                      ? "shadow-sm ring-2 ring-primary/20"
                      : "hover:border-primary/50"
                  }`}
                  onClick={() => handleOnChange({ borderRadius: radius })}
                >
                  {icon}
                  <SelectedIndicator
                    isSelected={baseProperties.borderRadius === radius}
                  />
                </Button>
              ))}
            </div>
          </div>

          <Separator className="my-1" />

          <div className="space-y-1.5">
            <div className="flex items-center justify-between">
              <span className="text-xs font-medium text-muted-foreground">
                Opacity
              </span>
              <Badge variant="outline" className="text-xs px-1 py-0 h-3">
                {Math.round(baseProperties.opacity * 100)}%
              </Badge>
            </div>

            <div className="px-0.5">
              <Slider
                value={[baseProperties.opacity * 100]}
                onValueChange={(values) =>
                  handleOnChange({ opacity: (values[0] ?? 100) / 100 })
                }
                max={100}
                min={0}
                step={1}
                className="w-full"
              />
            </div>
          </div>
        </CardContent>
      </Card>
    </>
  );
}
