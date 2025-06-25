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
        ...this.properties,
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

  handleIsCursorOnShape(event: MouseEvent) {
    if (!this.config.renderProperty) return false;

    const coords = this.getCanvasCoordinates(event);
    const startX = this.config.renderProperty.startX;
    const startY = this.config.renderProperty.startY;
    const width = this.config.renderProperty.width;
    const height = this.config.renderProperty.height;

    // Check if shape has fill style - if so, check if cursor is inside the filled area
    const hasFill =
      this.baseProperty.fillStyle &&
      this.baseProperty.fillStyle !== "transparent" &&
      this.baseProperty.fillStyle !== "rgba(0,0,0,0)";

    if (hasFill) {
      // Check if cursor is inside the rectangle (filled area)
      if (
        coords.x >= startX &&
        coords.x <= startX + width &&
        coords.y >= startY &&
        coords.y <= startY + height
      ) {
        return true;
      }
    }

    // Always check border/edge detection regardless of fill
    const threshold = Math.max(this.baseProperty.lineWidth / 2, 5);
    const edges = [
      // Top edge
      {
        start: { x: startX, y: startY },
        end: { x: startX + width, y: startY },
      },
      // Right edge
      {
        start: { x: startX + width, y: startY },
        end: { x: startX + width, y: startY + height },
      },
      // Bottom edge
      {
        start: { x: startX + width, y: startY + height },
        end: { x: startX, y: startY + height },
      },
      // Left edge
      {
        start: { x: startX, y: startY + height },
        end: { x: startX, y: startY },
      },
    ];

    for (const edge of edges) {
      const distance = this.distanceToLineSegment(coords, edge.start, edge.end);
      if (distance <= threshold) {
        return true;
      }
    }

    return false;
  }

  getShapeBounds() {
    if (!this.config.renderProperty)
      return { left: 0, top: 0, right: 0, bottom: 0 };

    const startX = this.config.renderProperty.startX;
    const startY = this.config.renderProperty.startY;
    const width = this.config.renderProperty.width;
    const height = this.config.renderProperty.height;

    return {
      left: startX,
      top: startY,
      right: startX + width,
      bottom: startY + height,
    };
  }

  private distanceToLineSegment(
    point: { x: number; y: number },
    lineStart: { x: number; y: number },
    lineEnd: { x: number; y: number }
  ): number {
    const A = point.x - lineStart.x;
    const B = point.y - lineStart.y;
    const C = lineEnd.x - lineStart.x;
    const D = lineEnd.y - lineStart.y;

    const dot = A * C + B * D;
    const lenSq = C * C + D * D;

    if (lenSq === 0) {
      return Math.sqrt(A * A + B * B);
    }

    let param = dot / lenSq;

    let xx: number, yy: number;

    if (param < 0) {
      xx = lineStart.x;
      yy = lineStart.y;
    } else if (param > 1) {
      xx = lineEnd.x;
      yy = lineEnd.y;
    } else {
      xx = lineStart.x + param * C;
      yy = lineStart.y + param * D;
    }

    const dx = point.x - xx;
    const dy = point.y - yy;

    return Math.sqrt(dx * dx + dy * dy);
  }
}
