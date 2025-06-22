import { useEffect } from "react";
import { useStore } from "./useStore";
import { Tool } from "@repo/types";

export default function useCursorStyle() {
  const { selectedTool } = useStore();

  useEffect(() => {
    const canvas = document.querySelector("canvas");
    if (!canvas) return;

    switch (selectedTool) {
      case Tool.Cursor:
        canvas.style.cursor = "default";
        break;
      default:
        canvas.style.cursor = "crosshair";
        break;
    }
  }, [selectedTool]);
}
