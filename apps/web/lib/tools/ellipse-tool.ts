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
    return {
      isDrawn: this.isDrawn,
      properties: {
        ...this.properties,
        ...this.baseProperty,
      },
    };
  }

  handleIsCursorOnShape(event: MouseEvent) {
    if (!this.config.renderProperty) return false;

    const coords = this.getCanvasCoordinates(event);
    const centerX = this.config.renderProperty.centerX;
    const centerY = this.config.renderProperty.centerY;
    const radiusX = this.config.renderProperty.radiusX;
    const radiusY = this.config.renderProperty.radiusY;

    const dx = coords.x - centerX;
    const dy = coords.y - centerY;

    // Check if shape has fill style - if so, check if cursor is inside the filled area
    const hasFill =
      this.baseProperty.fillStyle &&
      this.baseProperty.fillStyle !== "transparent" &&
      this.baseProperty.fillStyle !== "rgba(0,0,0,0)";

    if (hasFill) {
      // Check if cursor is inside the ellipse (filled area)
      // Use the ellipse equation: (x/radiusX)² + (y/radiusY)² <= 1
      const normalizedDistance =
        (dx * dx) / (radiusX * radiusX) + (dy * dy) / (radiusY * radiusY);
      if (normalizedDistance <= 1) {
        return true;
      }
    }

    // Always check border detection regardless of fill
    const threshold = Math.max(this.baseProperty.lineWidth / 2, 5);
    const distance = this.distanceToEllipseBorder(dx, dy, radiusX, radiusY);

    return distance <= threshold;
  }

  getShapeBounds() {
    if (!this.config.renderProperty)
      return { left: 0, top: 0, right: 0, bottom: 0 };

    const centerX = this.config.renderProperty.centerX;
    const centerY = this.config.renderProperty.centerY;
    const radiusX = this.config.renderProperty.radiusX;
    const radiusY = this.config.renderProperty.radiusY;

    return {
      left: centerX - radiusX,
      top: centerY - radiusY,
      right: centerX + radiusX,
      bottom: centerY + radiusY,
    };
  }

  private distanceToEllipseBorder(
    dx: number,
    dy: number,
    radiusX: number,
    radiusY: number
  ): number {
    // Normalize the point to unit circle space
    const normalizedX = dx / radiusX;
    const normalizedY = dy / radiusY;

    // Distance from center in normalized space
    const distanceFromCenter = Math.sqrt(
      normalizedX * normalizedX + normalizedY * normalizedY
    );

    // If point is at center, return the minimum radius
    if (distanceFromCenter === 0) {
      return Math.min(radiusX, radiusY);
    }

    // Calculate the point on the ellipse border in the direction of the given point
    const angle = Math.atan2(normalizedY, normalizedX);
    const borderX = radiusX * Math.cos(angle);
    const borderY = radiusY * Math.sin(angle);

    // Calculate actual distance to border
    const actualDistance = Math.sqrt(dx * dx + dy * dy);
    const borderDistance = Math.sqrt(borderX * borderX + borderY * borderY);

    return Math.abs(actualDistance - borderDistance);
  }
}
