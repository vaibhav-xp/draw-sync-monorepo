import { RefObject, useEffect, useCallback } from "react";
import useShapeRenderer from "./useShapeRenderer";
import { clearCanvas } from "@/lib/utils";

export default function useCanvasDefaultTheme(
  canvasRef: RefObject<HTMLCanvasElement | null>
) {
  const { renderAllShapes } = useShapeRenderer(canvasRef);

  const updateCanvasBackground = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    clearCanvas(canvas);
    renderAllShapes();
  }, [canvasRef, renderAllShapes]);

  useEffect(() => {
    updateCanvasBackground();

    const observer = new MutationObserver((mutations) => {
      const hasClassChange = mutations.some(
        (mutation) =>
          mutation.type === "attributes" && mutation.attributeName === "class"
      );

      if (hasClassChange) {
        updateCanvasBackground();
      }
    });

    const htmlElement = document.documentElement;
    observer.observe(htmlElement, {
      attributes: true,
      attributeFilter: ["class"],
    });

    return () => {
      observer.disconnect();
    };
  }, [updateCanvasBackground]);
}
