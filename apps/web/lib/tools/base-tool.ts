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
}
