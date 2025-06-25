import { useRef, useState, useEffect, useMemo } from "react";

/**
 * Provides canvas reference, 2D context, and ready state
 * @returns Object containing canvas reference, context, and ready state
 */
export const useCanvasContext = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [context, setContext] = useState<CanvasRenderingContext2D | null>(null);
  const [isCanvasReady, setIsCanvasReady] = useState(false);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) {
      setIsCanvasReady(false);
      setContext(null);
      return;
    }

    const ctx = canvas.getContext("2d");
    if (!ctx) {
      setIsCanvasReady(false);
      setContext(null);
      return;
    }

    setContext(ctx);
    setIsCanvasReady(true);
  }, []);

  const canvasData = useMemo(
    () => ({
      canvasRef,
      canvas: canvasRef.current,
      context,
      isCanvasReady,
    }),
    [context, isCanvasReady]
  );

  return canvasData;
};
