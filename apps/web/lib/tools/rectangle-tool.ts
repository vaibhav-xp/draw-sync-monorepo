import { RectangleProperty, DrawingToolConfig } from "@repo/types";
import { BaseTool } from "./base-tool";
import { THRESHOLD } from "../utils";

export class RectangleTool extends BaseTool<RectangleProperty> {
  properties = {
    startX: 0,
    startY: 0,
    width: 0,
    height: 0,
  };

  constructor(config: DrawingToolConfig<RectangleProperty>) {
    super(config);
    if (config.renderProperty) {
      this.properties = {
        startX: config.renderProperty.startX,
        startY: config.renderProperty.startY,
        width: config.renderProperty.width,
        height: config.renderProperty.height,
      };
    }
  }

  protected get isDrawn() {
    return THRESHOLD < Math.max(this.properties.width, this.properties.height);
  }

  handleDraw() {
    if (!this.isDrawn) return;
    this.ctx.strokeStyle = this.baseProperty.strokeStyle;
    this.ctx.lineWidth = this.baseProperty.lineWidth;
    this.ctx.setLineDash(this.baseProperty.lineDash);

    this.ctx.beginPath();
    this.ctx.roundRect(
      this.properties.startX,
      this.properties.startY,
      this.properties.width,
      this.properties.height,
      this.baseProperty.borderRadius
    );
    this.ctx.fillStyle = this.baseProperty.fillStyle;
    this.ctx.stroke();
    this.ctx.closePath();
    this.ctx.fill();
  }

  handleMouseDown(event: MouseEvent) {
    this.isDrawing = true;
    const coords = this.getCanvasCoordinates(event);
    this.properties = {
      ...this.properties,
      startX: coords.x,
      startY: coords.y,
    };

    this.properties = {
      ...this.properties,
      startX: this.properties.startX,
      startY: this.properties.startY,
    };
  }

  handleMouseMove(event: MouseEvent) {
    if (this.isDrawing) {
      const coords = this.getCanvasCoordinates(event);
      const currentX = coords.x;
      const currentY = coords.y;

      this.properties = {
        startX: Math.min(this.properties.startX, currentX),
        startY: Math.min(this.properties.startY, currentY),
        width: Math.abs(currentX - this.properties.startX),
        height: Math.abs(currentY - this.properties.startY),
      };

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
