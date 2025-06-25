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
      ...this.properties,
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

  handleIsCursorOnShape(event: MouseEvent) {
    if (!this.config.renderProperty) return false;

    const coords = this.getCanvasCoordinates(event);
    const threshold = Math.max(this.baseProperty.lineWidth / 2, 5);

    for (let i = 0; i < this.config.renderProperty.path.length - 1; i++) {
      const point1 = this.config.renderProperty.path[i];
      const point2 = this.config.renderProperty.path[i + 1];

      if (!point1 || !point2) continue;

      const distance = this.distanceToLineSegment(coords, point1, point2);

      if (distance <= threshold) {
        return true;
      }
    }

    return false;
  }

  getShapeBounds() {
    if (
      !this.config.renderProperty ||
      this.config.renderProperty.path.length === 0
    ) {
      return { left: 0, top: 0, right: 0, bottom: 0 };
    }

    const path = this.config.renderProperty.path;
    const xs = path.map((p) => p.x);
    const ys = path.map((p) => p.y);

    return {
      left: Math.min(...xs),
      top: Math.min(...ys),
      right: Math.max(...xs),
      bottom: Math.max(...ys),
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
