import { useEffect } from "react";
import { Tool } from "@repo/types";
import { useStore } from "./useStore";

export const useToolCursorSync = () => {
  const { selectedTool } = useStore();

  useEffect(() => {
    const canvas = document.querySelector("canvas");
    if (!canvas) return;

    switch (selectedTool) {
      case Tool.Cursor:
        canvas.style.cursor = "default";
        break;
      case Tool.Rectangle:
      case Tool.Ellipse:
      case Tool.Pencil:
      case Tool.Eraser:
        canvas.style.cursor = "crosshair";
        break;
      default:
        canvas.style.cursor = "default";
        break;
    }
  }, [selectedTool]);
};
