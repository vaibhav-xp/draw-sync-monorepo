import { RefObject, useCallback, useEffect } from "react";
import { useStore } from "./useStore";
import { RectangleTool } from "@/lib/tool/rectangle-tool";
import { EllipseTool } from "@/lib/tool/ellipse-tool";
import { PencilTool } from "@/lib/tool/pencil-tool";
import { Tool } from "@repo/types";
import { v4 as uuidv4 } from "uuid";
import useShapeRenderer from "./useShapeRenderer";
import { clearCanvas } from "@/lib/utils";

export default function useCanvasDraw(
  canvasRef: RefObject<HTMLCanvasElement | null>
) {
  const { renderAllShapes } = useShapeRenderer(canvasRef);
  const { selectedTool, baseProperties, addShape, setSelectedTool } =
    useStore();

  const createDrawTool = useCallback(
    (ctx: CanvasRenderingContext2D) => {
      const config = { ctx, baseProperty: baseProperties };

      switch (selectedTool) {
        case Tool.Rectangle:
          return new RectangleTool(config);
        case Tool.Ellipse:
          return new EllipseTool(config);
        case Tool.Pencil:
          return new PencilTool(config);
        default:
          return null;
      }
    },
    [selectedTool, baseProperties]
  );

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const draw = createDrawTool(ctx);
    if (!draw) return;

    const handleMouseDown = (e: MouseEvent) => {
      draw.handleMouseDown(e);
    };

    const handleMouseMove = (e: MouseEvent) => {
      clearCanvas(canvas);
      renderAllShapes();
      draw.handleMouseMove(e);
    };

    const handleMouseUp = (e: MouseEvent) => {
      const drawn = draw.handleMouseUp();
      if (drawn.isDrawn) {
        addShape({
          id: uuidv4(),
          type: selectedTool,
          properties: drawn.properties,
        });
        if (selectedTool !== Tool.Pencil) {
          setSelectedTool(Tool.Cursor);
        }
      }
    };

    canvas.addEventListener("mousedown", handleMouseDown);
    canvas.addEventListener("mousemove", handleMouseMove);
    canvas.addEventListener("mouseup", handleMouseUp);

    return () => {
      canvas.removeEventListener("mousedown", handleMouseDown);
      canvas.removeEventListener("mousemove", handleMouseMove);
      canvas.removeEventListener("mouseup", handleMouseUp);
    };
  }, [selectedTool, baseProperties, createDrawTool, addShape, renderAllShapes]);
}
