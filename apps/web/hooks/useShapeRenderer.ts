import { RefObject, useCallback, useMemo } from "react";
import {
  RectangleProperty,
  EllipseProperty,
  PencilProperty,
  Tool,
  Shape,
  BaseShapeProperty,
} from "@repo/types";

import { RectangleTool } from "@/lib/tool/rectangle-tool";
import { EllipseTool } from "@/lib/tool/ellipse-tool";
import { PencilTool } from "@/lib/tool/pencil-tool";

import { useStore } from "./useStore";
import { getThemeColors } from "@/lib/utils";

/**
 * Custom hook to render shapes on the canvas
 * Handles theme-aware rendering and tool-specific shape drawing
 * @param canvasRef - Reference to the canvas element
 * @returns Object containing the renderAllShapes function
 */
export const useShapeRenderer = (
  canvasRef: RefObject<HTMLCanvasElement | null>
) => {
  const { shapes } = useStore();

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
   * Renders all shapes on the canvas
   */
  const renderAllShapes = useCallback(() => {
    const ctx = canvasRef.current?.getContext("2d");
    if (!ctx) return;

    shapes.forEach((shape) => {
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
    });
  }, [canvasRef, shapes, setThemeColor]);

  return useMemo(() => ({ renderAllShapes }), [renderAllShapes]);
};
