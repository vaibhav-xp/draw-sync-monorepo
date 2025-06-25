import { RefObject, useCallback, useMemo } from "react";
import {
  RectangleProperty,
  EllipseProperty,
  PencilProperty,
  Tool,
  Shape,
  BaseShapeProperty,
} from "@repo/types";

import { RectangleTool } from "@/lib/tools/rectangle-tool";
import { EllipseTool } from "@/lib/tools/ellipse-tool";
import { PencilTool } from "@/lib/tools/pencil-tool";

import { useSelectionRenderer } from "./useSelectionRenderer";
import { useShapeDragging } from "./useShapeDragging";
import { getThemeColors } from "@/lib/utils";

/**
 * Handles theme-aware rendering and tool-specific shape drawing
 */
export const useShapeRenderer = (
  canvasRef: RefObject<HTMLCanvasElement | null>
) => {
  const { renderSelectionOverlay } = useSelectionRenderer(canvasRef);
  const { getDraggedShapesPreview } = useShapeDragging();

  /**
   * Updates shape colors based on current theme
   * @param shape - The shape to update
   */
  const setThemeColor = useCallback((shape: Shape) => {
    const { strokeColor } = getThemeColors();

    if (
      shape.properties.fillStyle === "white" ||
      shape.properties.fillStyle === "black"
    ) {
      shape.properties.fillStyle = strokeColor;
    }

    if (
      shape.properties.strokeStyle === "white" ||
      shape.properties.strokeStyle === "black"
    ) {
      shape.properties.strokeStyle = strokeColor;
    }
  }, []);

  /**
   * Renders a single shape on the canvas
   */
  const renderShape = useCallback(
    (ctx: CanvasRenderingContext2D, shape: Shape) => {
      setThemeColor(shape);

      const baseProperty: BaseShapeProperty = {
        strokeStyle: shape.properties.strokeStyle,
        lineWidth: shape.properties.lineWidth,
        fillStyle: shape.properties.fillStyle,
        lineDash: shape.properties.lineDash,
        opacity: shape.properties.opacity,
        borderRadius: (shape.properties as RectangleProperty).borderRadius ?? 0,
      };

      switch (shape.type) {
        case Tool.Rectangle: {
          const rectTool = new RectangleTool({
            ctx,
            baseProperty,
            renderProperty: shape.properties as RectangleProperty,
          });
          rectTool.handleDraw();
          break;
        }

        case Tool.Ellipse: {
          const ellipseTool = new EllipseTool({
            ctx,
            baseProperty,
            renderProperty: shape.properties as EllipseProperty,
          });
          ellipseTool.handleDraw();
          break;
        }

        case Tool.Pencil: {
          const pencilTool = new PencilTool({
            ctx,
            baseProperty,
            renderProperty: shape.properties as PencilProperty,
          });
          pencilTool.handleDraw();
          break;
        }

        default:
          console.warn(`Unknown shape type: ${shape.type}`);
          break;
      }
    },
    [setThemeColor]
  );

  /**
   * Renders all shapes on the canvas using drag preview positions if dragging
   */
  const renderAllShapes = useCallback(() => {
    const ctx = canvasRef.current?.getContext("2d");
    if (!ctx) return;

    // Use drag preview positions if currently dragging, otherwise use original shapes
    const shapesToRender = getDraggedShapesPreview();

    // Render all shapes first
    shapesToRender.forEach((shape) => {
      renderShape(ctx, shape);
    });

    // Then render selection overlay on top using the same positions (drag preview or original)
    renderSelectionOverlay(shapesToRender);
  }, [canvasRef, renderShape, renderSelectionOverlay, getDraggedShapesPreview]);

  return useMemo(() => ({ renderAllShapes }), [renderAllShapes]);
};
