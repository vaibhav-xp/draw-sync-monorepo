import { useEffect } from "react";
import { Tool } from "@repo/types";
import { useStore } from "./useStore";

/**
 * Custom hook to handle keyboard shortcuts for tool selection
 * Maps number keys 1-5 to different drawing tools
 * - Key 1: Cursor tool
 * - Key 2: Rectangle tool
 * - Key 3: Ellipse tool
 * - Key 4: Pencil tool
 * - Key 5: Eraser tool
 */
export const useKeyboardShortcuts = () => {
  const { setSelectedTool } = useStore();

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      switch (event.key) {
        case "1":
          setSelectedTool(Tool.Cursor);
          break;
        case "2":
          setSelectedTool(Tool.Rectangle);
          break;
        case "3":
          setSelectedTool(Tool.Ellipse);
          break;
        case "4":
          setSelectedTool(Tool.Pencil);
          break;
        case "5":
          setSelectedTool(Tool.Eraser);
          break;
        default:
          return;
      }
    };

    window.addEventListener("keydown", handleKeyDown);

    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [setSelectedTool]);
};
