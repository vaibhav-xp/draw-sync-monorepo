import { useCallback } from "react";
import { DrawingToolConfig, Shape, Tool } from "@repo/types";
import { useStore } from "./useStore";
import { EllipseTool } from "@/lib/tools/ellipse-tool";
import { RectangleTool } from "@/lib/tools/rectangle-tool";
import { PencilTool } from "@/lib/tools/pencil-tool";

/**
 * Handles shape hit testing and cursor position calculations
 */
export function useShapeHitTesting({
  canvas,
  context,
}: {
  canvas: HTMLCanvasElement | null;
  context: CanvasRenderingContext2D | null;
}) {
  const { shapes } = useStore();

  /**
   * Creates a tool instance for hit testing
   */
  const getTool = useCallback(
    (shape: Shape) => {
      const config = {
        ctx: context,
        baseProperty: shape.properties,
        renderProperty: shape.properties,
      } as DrawingToolConfig<any>;

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
    [context]
  );

  /**
   * Converts mouse event coordinates to canvas coordinates
   */
  const getCanvasCoordinates = useCallback(
    (event: MouseEvent) => {
      if (!canvas) return { x: 0, y: 0 };
      const rect = canvas.getBoundingClientRect();
      return {
        x: event.clientX - rect.left,
        y: event.clientY - rect.top,
      };
    },
    [canvas]
  );

  /**
   * Finds the topmost shape at the given position
   */
  const getShapeAtPosition = useCallback(
    (event: MouseEvent): Shape | null => {
      // Check shapes in reverse order (top to bottom)
      for (let i = shapes.length - 1; i >= 0; i--) {
        const shape = shapes[i];
        if (!shape) continue;
        const tool = getTool(shape);
        if (tool && tool.handleIsCursorOnShape(event)) {
          return shape;
        }
      }
      return null;
    },
    [shapes, getTool]
  );

  /**
   * Gets the bounding box of a shape for intersection testing
   */
  const getShapeBounds = useCallback((shape: Shape) => {
    switch (shape.type) {
      case Tool.Rectangle: {
        const props = shape.properties as any;
        return {
          left: props.startX,
          top: props.startY,
          right: props.startX + props.width,
          bottom: props.startY + props.height,
        };
      }
      case Tool.Ellipse: {
        const props = shape.properties as any;
        return {
          left: props.centerX - props.radiusX,
          top: props.centerY - props.radiusY,
          right: props.centerX + props.radiusX,
          bottom: props.centerY + props.radiusY,
        };
      }
      case Tool.Pencil: {
        const props = shape.properties as any;
        if (props.path.length === 0)
          return { left: 0, top: 0, right: 0, bottom: 0 };

        const xs = props.path.map((p: any) => p.x);
        const ys = props.path.map((p: any) => p.y);
        return {
          left: Math.min(...xs),
          top: Math.min(...ys),
          right: Math.max(...xs),
          bottom: Math.max(...ys),
        };
      }
      default:
        return { left: 0, top: 0, right: 0, bottom: 0 };
    }
  }, []);

  /**
   * Checks if a shape is fully contained within a selection rectangle
   */
  const isShapeContainedInRect = useCallback(
    (
      shape: Shape,
      rect: { startX: number; startY: number; endX: number; endY: number }
    ): boolean => {
      const shapeBounds = getShapeBounds(shape);
      const selectionBounds = {
        left: Math.min(rect.startX, rect.endX),
        top: Math.min(rect.startY, rect.endY),
        right: Math.max(rect.startX, rect.endX),
        bottom: Math.max(rect.startY, rect.endY),
      };

      // Shape must be fully contained within selection rectangle
      return (
        shapeBounds.left >= selectionBounds.left &&
        shapeBounds.right <= selectionBounds.right &&
        shapeBounds.top >= selectionBounds.top &&
        shapeBounds.bottom <= selectionBounds.bottom
      );
    },
    [getShapeBounds]
  );

  return {
    getTool,
    getCanvasCoordinates,
    getShapeAtPosition,
    getShapeBounds,
    isShapeContainedInRect,
  };
}
