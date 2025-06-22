import {
  RectangleProperty,
  EllipseProperty,
  PencilProperty,
  Tool,
  Shape,
  BaseShapeProperty,
} from "@repo/types";
import { useStore } from "./useStore";
import { RectangleTool } from "@/lib/tool/rectangle-tool";
import { EllipseTool } from "@/lib/tool/ellipse-tool";
import { PencilTool } from "@/lib/tool/pencil-tool";
import { RefObject } from "react";

export default function useShapeRenderer(
  canvasRef: RefObject<HTMLCanvasElement | null>
) {
  const { shapes } = useStore();

  function setThemeColor(shape: Shape) {
    const computedStyle = window.getComputedStyle(document.body);
    const color = computedStyle.colorScheme === "dark" ? "white" : "black";

    if (
      shape.properties.fillStyle === "white" ||
      shape.properties.fillStyle === "black"
    ) {
      shape.properties.fillStyle = color;
    }

    if (
      shape.properties.strokeStyle === "white" ||
      shape.properties.strokeStyle === "black"
    ) {
      shape.properties.strokeStyle = color;
    }
  }

  function renderAllShapes() {
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
        borderRadius: (shape.properties as any).borderRadius ?? 0,
      };

      switch (shape.type) {
        case Tool.Rectangle:
          const rectTool = new RectangleTool({
            ctx,
            baseProperty,
            renderProperty: shape.properties as RectangleProperty,
          });
          rectTool.handleDraw();
          break;

        case Tool.Ellipse:
          const ellipseTool = new EllipseTool({
            ctx,
            baseProperty,
            renderProperty: shape.properties as EllipseProperty,
          });
          ellipseTool.handleDraw();
          break;

        case Tool.Pencil:
          const pencilTool = new PencilTool({
            ctx,
            baseProperty,
            renderProperty: shape.properties as PencilProperty,
          });
          pencilTool.handleDraw();
          break;
      }
    });
  }

  return { renderAllShapes };
}
