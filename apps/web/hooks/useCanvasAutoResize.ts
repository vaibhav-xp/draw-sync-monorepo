import { useEffect, RefObject } from "react";

/**
 * Custom hook to automatically resize canvas to fit window dimensions
 * Handles both initial sizing and window resize events
 * @param canvasRef - Reference to the canvas element to resize
 */
export const useCanvasAutoResize = (
  canvasRef: RefObject<HTMLCanvasElement | null>
) => {
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const HEADER_HEIGHT = 69;

    const resizeCanvas = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight - HEADER_HEIGHT;
    };

    resizeCanvas();

    window.addEventListener("resize", resizeCanvas);

    return () => {
      window.removeEventListener("resize", resizeCanvas);
    };
  }, [canvasRef]);
};
