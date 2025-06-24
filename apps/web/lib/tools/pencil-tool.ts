import { PencilProperty, DrawingToolConfig } from "@repo/types";
import { BaseTool } from "./base-tool";

export class PencilTool extends BaseTool<PencilProperty> {
  properties = {
    path: [] as { x: number; y: number }[],
  };

  constructor(config: DrawingToolConfig<PencilProperty>) {
    super(config);
    if (config.renderProperty) {
      this.properties = {
        path: [...config.renderProperty.path],
      };
    }
  }

  handleDraw() {
    if (!this.isDrawn) return;

    this.ctx.strokeStyle = this.baseProperty.strokeStyle;
    this.ctx.lineWidth = this.baseProperty.lineWidth;
    this.ctx.setLineDash(this.baseProperty.lineDash);
    this.ctx.globalAlpha = this.baseProperty.opacity;
    this.ctx.lineCap = "round";
    this.ctx.lineJoin = "round";

    this.ctx.beginPath();

    const firstPoint = this.properties.path[0];
    if (firstPoint) {
      this.ctx.moveTo(firstPoint.x, firstPoint.y);
    }

    for (let i = 1; i < this.properties.path.length; i++) {
      const point = this.properties.path[i];
      if (point) {
        this.ctx.lineTo(point.x, point.y);
      }
    }

    this.ctx.stroke();
    this.ctx.closePath();
  }

  handleMouseDown(event: MouseEvent) {
    this.isDrawing = true;
    const coords = this.getCanvasCoordinates(event);

    this.properties = {
      path: [{ x: coords.x, y: coords.y }],
    };
  }

  handleMouseMove(event: MouseEvent) {
    if (this.isDrawing) {
      const coords = this.getCanvasCoordinates(event);

      this.properties.path.push({ x: coords.x, y: coords.y });

      this.handleDraw();
    }
  }

  handleMouseUp() {
    this.isDrawing = false;
    return {
      isDrawn: this.isDrawn,
      properties: {
        ...this.properties,
        ...this.baseProperty,
      },
    };
  }
}
