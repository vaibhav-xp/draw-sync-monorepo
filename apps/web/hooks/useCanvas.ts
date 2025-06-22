import { useRef } from "react";
import { useCommand } from "./useCommand";
import useCanvasResize from "./useCanvasResize";
import useCanvasDefaultTheme from "./useCanvasDefaultTheme";
import useCanvasDraw from "./useCanvasDraw";
import useCursorStyle from "./useCursorStyle";

export default function useCanvas() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  useCommand();
  useCanvasResize(canvasRef);
  useCanvasDefaultTheme(canvasRef);
  useCursorStyle();
  useCanvasDraw(canvasRef);
  return { canvasRef };
}
