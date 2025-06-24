import { EllipseProperty, DrawingToolConfig } from "@repo/types";
import { BaseTool } from "./base-tool";
import { THRESHOLD } from "../utils";

export class EllipseTool extends BaseTool<EllipseProperty> {
  properties = {
    startX: 0,
    startY: 0,
    centerX: 0,
    centerY: 0,
    radiusX: 0,
    radiusY: 0,
    rotation: 0,
    startAngle: 0,
    endAngle: 2 * Math.PI,
  };

  constructor(config: DrawingToolConfig<EllipseProperty>) {
    super(config);
    if (config.renderProperty) {
      this.properties = {
        startX: config.renderProperty.startX,
        startY: config.renderProperty.startY,
        centerX: config.renderProperty.centerX,
        centerY: config.renderProperty.centerY,
        radiusX: config.renderProperty.radiusX,
        radiusY: config.renderProperty.radiusY,
        rotation: config.renderProperty.rotation,
        startAngle: config.renderProperty.startAngle,
        endAngle: config.renderProperty.endAngle,
      };
    }
  }

  protected get isDrawn() {
    return (
      THRESHOLD < Math.max(this.properties.radiusX, this.properties.radiusY)
    );
  }

  handleDraw() {
    if (!this.isDrawn) return;

    this.ctx.strokeStyle = this.baseProperty.strokeStyle;
    this.ctx.lineWidth = this.baseProperty.lineWidth;
    this.ctx.fillStyle = this.baseProperty.fillStyle;
    this.ctx.setLineDash(this.baseProperty.lineDash);
    this.ctx.globalAlpha = this.baseProperty.opacity;
    this.ctx.beginPath();
    this.ctx.ellipse(
      this.properties.centerX,
      this.properties.centerY,
      this.properties.radiusX,
      this.properties.radiusY,
      this.properties.rotation,
      this.properties.startAngle,
      this.properties.endAngle
    );
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
      centerX: coords.x,
      centerY: coords.y,
    };
  }

  handleMouseMove(event: MouseEvent) {
    if (this.isDrawing) {
      const coords = this.getCanvasCoordinates(event);
      const currentX = coords.x;
      const currentY = coords.y;

      this.properties = {
        ...this.properties,
        centerX: (this.properties.startX + currentX) / 2,
        centerY: (this.properties.startY + currentY) / 2,
        radiusX: Math.abs(currentX - this.properties.startX) / 2,
        radiusY: Math.abs(currentY - this.properties.startY) / 2,
      };

      this.handleDraw();
    }
  }

  handleMouseUp() {
    this.isDrawing = false;
    console.log({ ...this.properties });
    return {
      isDrawn: this.isDrawn,
      properties: {
        ...this.properties,
        ...this.baseProperty,
      },
    };
  }
}
