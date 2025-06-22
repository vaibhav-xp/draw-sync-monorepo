import { EllipseProperty, DrawingToolConfig } from "@repo/types";
import { BaseTool } from "./base-tool";
import { THRESHOLD } from "../utils";

export class EllipseTool extends BaseTool<EllipseProperty> {
  properties = {
    y: 0,
    radiusX: 0,
    radiusY: 0,
    rotation: 0,
    startAngle: 0,
    endAngle: 2 * Math.PI,
    centerX: 0,
  };
  private startX: number = 0;
  private startY: number = 0;

  constructor(config: DrawingToolConfig<EllipseProperty>) {
    super(config);
    if (config.renderProperty) {
      this.properties = {
        y: config.renderProperty.y,
        radiusX: config.renderProperty.radiusX,
        radiusY: config.renderProperty.radiusY,
        rotation: config.renderProperty.rotation,
        startAngle: config.renderProperty.startAngle,
        endAngle: config.renderProperty.endAngle,
        centerX: config.renderProperty.centerX,
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
      this.properties.y,
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
    this.startX = coords.x;
    this.startY = coords.y;

    this.properties = {
      y: this.startY,
      radiusX: 0,
      radiusY: 0,
      rotation: 0,
      startAngle: 0,
      endAngle: 2 * Math.PI,
      centerX: this.startX,
    };
  }

  handleMouseMove(event: MouseEvent) {
    if (this.isDrawing) {
      const coords = this.getCanvasCoordinates(event);
      const currentX = coords.x;
      const currentY = coords.y;
      const centerY = (this.startY + currentY) / 2;

      this.properties = {
        y: centerY,
        radiusX: Math.abs(currentX - this.startX) / 2,
        radiusY: Math.abs(currentY - this.startY) / 2,
        rotation: 0,
        startAngle: 0,
        endAngle: 2 * Math.PI,
        centerX: (this.startX + currentX) / 2,
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
