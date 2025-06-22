import { Tool } from "@repo/types";
import { useStore } from "./useStore";
import { useEffect } from "react";

export const useCommand = () => {
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
      }
    };

    window.addEventListener("keydown", handleKeyDown);

    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, []);
};
