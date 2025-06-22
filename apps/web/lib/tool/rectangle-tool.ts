import { RectangleProperty, DrawingToolConfig } from "@repo/types";
import { BaseTool } from "./base-tool";
import { THRESHOLD } from "../utils";

export class RectangleTool extends BaseTool<RectangleProperty> {
  properties = {
    x: 0,
    y: 0,
    width: 0,
    height: 0,
  };
  private startX: number = 0;
  private startY: number = 0;

  constructor(config: DrawingToolConfig<RectangleProperty>) {
    super(config);
    if (config.renderProperty) {
      this.properties = {
        x: config.renderProperty.x,
        y: config.renderProperty.y,
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
      this.properties.x,
      this.properties.y,
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
    this.startX = coords.x;
    this.startY = coords.y;

    this.properties = {
      x: this.startX,
      y: this.startY,
      width: 0,
      height: 0,
    };
  }

  handleMouseMove(event: MouseEvent) {
    if (this.isDrawing) {
      const coords = this.getCanvasCoordinates(event);
      const currentX = coords.x;
      const currentY = coords.y;

      this.properties = {
        x: Math.min(this.startX, currentX),
        y: Math.min(this.startY, currentY),
        width: Math.abs(currentX - this.startX),
        height: Math.abs(currentY - this.startY),
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
