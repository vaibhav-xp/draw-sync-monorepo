import { IDrawingHandler, DrawingToolConfig } from "@repo/types";

export abstract class BaseTool<T> implements IDrawingHandler<T> {
  protected isDrawing: boolean = false;

  constructor(protected config: DrawingToolConfig<T>) {}

  protected get ctx() {
    return this.config.ctx;
  }

  protected get baseProperty() {
    return this.config.baseProperty;
  }

  protected get isDrawn() {
    return true;
  }

  protected getCanvasCoordinates(event: MouseEvent) {
    const canvas = this.ctx.canvas;
    const rect = canvas.getBoundingClientRect();
    return {
      x: event.clientX - rect.left,
      y: event.clientY - rect.top,
    };
  }

  /**
   * Gets the bounding rectangle of the shape for selection indicator
   */
  abstract getShapeBounds(): {
    left: number;
    top: number;
    right: number;
    bottom: number;
  };

  /**
   * Draws a standard rectangular selection indicator around the shape
   * This is consistent for all shapes to support resize handles
   */
  drawSelectionIndicator(): void {
    if (!this.config.renderProperty) return;

    const bounds = this.getShapeBounds();
    const padding = 8;

    this.ctx.save();
    this.ctx.strokeStyle = "#007ACC";
    this.ctx.lineWidth = 2;
    this.ctx.setLineDash([5, 5]);
    this.ctx.globalAlpha = 0.8;

    this.ctx.strokeRect(
      bounds.left - padding,
      bounds.top - padding,
      bounds.right - bounds.left + 2 * padding,
      bounds.bottom - bounds.top + 2 * padding
    );

    this.ctx.restore();
  }

  abstract properties: Omit<
    T,
    | "strokeStyle"
    | "lineWidth"
    | "fillStyle"
    | "lineDash"
    | "borderRadius"
    | "opacity"
  >;

  abstract handleDraw(): void;
  abstract handleMouseDown(event: MouseEvent): void;
  abstract handleMouseMove(event: MouseEvent): void;
  abstract handleMouseUp(event?: MouseEvent): {
    isDrawn: boolean;
    properties: T;
  };
  abstract handleIsCursorOnShape(event: MouseEvent): boolean;
}
