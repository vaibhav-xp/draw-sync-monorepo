import { useCanvasContext } from "./useCanvasContext";
import { useKeyboardShortcuts } from "./useKeyboardShortcuts";
import { useCanvasAutoResize } from "./useCanvasAutoResize";
import { useCanvasThemeSync } from "./useCanvasThemeSync";
import { useCanvasDrawingEvents } from "./useCanvasDrawingEvents";
import { useToolCursorSync } from "./useToolCursorSync";
import { useCanvasSelectionEvents } from "./useCanvasSelectionEvents";

/**
 * Main canvas hook that orchestrates all canvas-related functionality
 */
export const useCanvas = () => {
  const { canvasRef, canvas, context, isCanvasReady } = useCanvasContext();

  useKeyboardShortcuts();
  useCanvasAutoResize(canvasRef);
  useCanvasThemeSync(canvasRef);
  useToolCursorSync();
  useCanvasDrawingEvents(canvasRef);
  useCanvasSelectionEvents({ canvas, context });

  return {
    canvasRef,
    canvas,
    context,
    isCanvasReady,
  };
};
