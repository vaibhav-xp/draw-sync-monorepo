import { useCanvasContext } from "./useCanvasContext";
import { useKeyboardShortcuts } from "./useKeyboardShortcuts";
import { useCanvasAutoResize } from "./useCanvasAutoResize";
import { useCanvasThemeSync } from "./useCanvasThemeSync";
import { useCanvasDrawingEvents } from "./useCanvasDrawingEvents";
import { useToolCursorSync } from "./useToolCursorSync";

/**
 * Main canvas hook that orchestrates all canvas-related functionality
 * Combines canvas context, drawing events, auto-resizing, theme syncing,
 * keyboard shortcuts, and cursor styling
 * @returns Object containing canvas reference, context, and ready state
 */
export const useCanvas = () => {
  const { canvasRef, canvas, context, isCanvasReady } = useCanvasContext();

  useKeyboardShortcuts();
  useCanvasAutoResize(canvasRef);
  useCanvasThemeSync(canvasRef);
  useToolCursorSync();
  useCanvasDrawingEvents(canvasRef);

  return {
    canvasRef,
    canvas,
    context,
    isCanvasReady,
  };
};
