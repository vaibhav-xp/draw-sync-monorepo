import { RefObject, useEffect, useCallback } from "react";

import { clearCanvas } from "@/lib/utils";
import { useShapeRenderer } from "./useShapeRenderer";

/**
 * Automatically clears and re-renders canvas when dark/light theme changes
 * @param canvasRef - Reference to the canvas element
 */
export const useCanvasThemeSync = (
  canvasRef: RefObject<HTMLCanvasElement | null>
) => {
  const { renderAllShapes } = useShapeRenderer(canvasRef);

  const syncCanvasWithTheme = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    clearCanvas(canvas);
    renderAllShapes();
  }, [canvasRef, renderAllShapes]);

  useEffect(() => {
    syncCanvasWithTheme();

    const themeObserver = new MutationObserver((mutations) => {
      const hasThemeChange = mutations.some(
        (mutation) =>
          mutation.type === "attributes" && mutation.attributeName === "class"
      );

      if (hasThemeChange) {
        syncCanvasWithTheme();
      }
    });

    const htmlElement = document.documentElement;
    themeObserver.observe(htmlElement, {
      attributes: true,
      attributeFilter: ["class"],
    });

    return () => {
      themeObserver.disconnect();
    };
  }, [syncCanvasWithTheme]);
};
