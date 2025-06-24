import { RefObject, useCallback, useEffect } from "react";
import { v4 as uuidv4 } from "uuid";
import { Tool } from "@repo/types";

import { clearCanvas } from "@/lib/utils";
import { RectangleTool } from "@/lib/tools/rectangle-tool";
import { EllipseTool } from "@/lib/tools/ellipse-tool";
import { PencilTool } from "@/lib/tools/pencil-tool";

import { useStore } from "./useStore";
import { useShapeRenderer } from "./useShapeRenderer";

/**
 * Custom hook to handle mouse drawing events on canvas
 * Manages mousedown, mousemove, and mouseup events for drawing shapes
 * @param canvasRef - Reference to the canvas element
 */
export const useCanvasDrawingEvents = (
  canvasRef: RefObject<HTMLCanvasElement | null>
) => {
  const { renderAllShapes } = useShapeRenderer(canvasRef);
  const { selectedTool, baseProperties, addShape, setSelectedTool } =
    useStore();

  const createDrawingTool = useCallback(
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

    const drawingTool = createDrawingTool(ctx);
    if (!drawingTool) return;

    const handleMouseDown = (event: MouseEvent) => {
      drawingTool.handleMouseDown(event);
    };

    const handleMouseMove = (event: MouseEvent) => {
      clearCanvas(canvas);
      renderAllShapes();
      drawingTool.handleMouseMove(event);
    };

    const handleMouseUp = () => {
      const drawnShape = drawingTool.handleMouseUp();

      if (drawnShape.isDrawn) {
        addShape({
          id: uuidv4(),
          type: selectedTool,
          properties: drawnShape.properties,
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
  }, [
    canvasRef,
    selectedTool,
    baseProperties,
    createDrawingTool,
    addShape,
    renderAllShapes,
    setSelectedTool,
  ]);
};
