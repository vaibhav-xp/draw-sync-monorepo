import { RefObject, useCallback, useMemo } from "react";
import {
  RectangleProperty,
  EllipseProperty,
  PencilProperty,
  Tool,
  Shape,
  BaseShapeProperty,
  DrawingToolConfig,
} from "@repo/types";

import { RectangleTool } from "@/lib/tools/rectangle-tool";
import { EllipseTool } from "@/lib/tools/ellipse-tool";
import { PencilTool } from "@/lib/tools/pencil-tool";

import { useSelectionStore } from "./useSelectionStore";

/**
 * Handles rendering of selection indicators and selection rectangle
 */
export const useSelectionRenderer = (
  canvasRef: RefObject<HTMLCanvasElement | null>
) => {
  const { selectedShapes, selectionRect } = useSelectionStore();

  /**
   * Creates a tool instance for selection rendering
   */
  const createToolForSelection = useCallback(
    (ctx: CanvasRenderingContext2D, shape: Shape) => {
      const baseProperty: BaseShapeProperty = {
        strokeStyle: shape.properties.strokeStyle,
        lineWidth: shape.properties.lineWidth,
        fillStyle: shape.properties.fillStyle,
        lineDash: shape.properties.lineDash,
        opacity: shape.properties.opacity,
        borderRadius: (shape.properties as RectangleProperty).borderRadius ?? 0,
      };

      const config: DrawingToolConfig<any> = {
        ctx,
        baseProperty,
        renderProperty: shape.properties,
      };

      switch (shape.type) {
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
    []
  );

  /**
   * Draws selection indicators for selected shapes
   */
  const renderSelectionIndicators = useCallback(
    (ctx: CanvasRenderingContext2D, shapes: Shape[]) => {
      shapes.forEach((shape) => {
        if (selectedShapes.includes(shape.id)) {
          const tool = createToolForSelection(ctx, shape);
          if (tool) {
            tool.drawSelectionIndicator();
          }
        }
      });
    },
    [selectedShapes, createToolForSelection]
  );

  /**
   * Draws the selection rectangle during drag-to-select
   */
  const renderSelectionRect = useCallback(
    (ctx: CanvasRenderingContext2D) => {
      if (!selectionRect) return;

      const { startX, startY, endX, endY } = selectionRect;
      const left = Math.min(startX, endX);
      const top = Math.min(startY, endY);
      const width = Math.abs(endX - startX);
      const height = Math.abs(endY - startY);

      ctx.save();

      // Draw selection rectangle background
      ctx.fillStyle = "rgba(0, 122, 204, 0.1)";
      ctx.fillRect(left, top, width, height);

      // Draw selection rectangle border
      ctx.strokeStyle = "#007ACC";
      ctx.lineWidth = 1;
      ctx.setLineDash([3, 3]);
      ctx.strokeRect(left, top, width, height);

      ctx.restore();
    },
    [selectionRect]
  );

  /**
   * Renders all selection-related visual elements
   * @param shapes - The shapes to render selection indicators for (can be drag preview positions)
   */
  const renderSelectionOverlay = useCallback(
    (shapes: Shape[]) => {
      const ctx = canvasRef.current?.getContext("2d");
      if (!ctx) return;

      renderSelectionIndicators(ctx, shapes);
      renderSelectionRect(ctx);
    },
    [canvasRef, renderSelectionIndicators, renderSelectionRect]
  );

  return useMemo(() => ({ renderSelectionOverlay }), [renderSelectionOverlay]);
};
