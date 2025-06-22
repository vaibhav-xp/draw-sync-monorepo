export enum Tool {
  Cursor = "cursor",
  Rectangle = "rectangle",
  Ellipse = "ellipse",
  Pencil = "pencil",
  Eraser = "eraser",
}

/**
 * Base shape properties shared across all drawing tools
 * @strokeStyle - stroke color
 * @lineWidth - stroke width
 * @fillStyle - background color
 * @lineDash - line dash pattern
 * @borderRadius - border radius
 * @opacity - opacity level
 */
export interface BaseShapeProperty {
  strokeStyle: string;
  lineWidth: number;
  fillStyle: string;
  lineDash: number[];
  borderRadius: number;
  opacity: number;
}

/**
 * Rectangle shape properties
 * @x - x axis position
 * @y - y axis position
 * @width - rectangle width
 * @height - rectangle height
 */
export interface RectangleProperty extends BaseShapeProperty {
  x: number;
  y: number;
  width: number;
  height: number;
}

/**
 * Ellipse shape properties
 * @y - y axis position (center Y)
 * @radiusX - horizontal radius
 * @radiusY - vertical radius
 * @rotation - rotation angle in radians
 * @startAngle - start angle for drawing
 * @endAngle - end angle for drawing
 * @centerX - center X coordinate
 */
export interface EllipseProperty
  extends Omit<BaseShapeProperty, "borderRadius"> {
  y: number;
  radiusX: number;
  radiusY: number;
  rotation: number;
  startAngle: number;
  endAngle: number;
  centerX: number;
}

/**
 * Pencil drawing properties
 * @path - array of coordinate points defining the drawing path
 */
export interface PencilProperty extends BaseShapeProperty {
  path: {
    x: number;
    y: number;
  }[];
}

/**
 * Base shape with unique identifier
 * @id - unique shape identifier
 * @type - shape type
 * @properties - shape-specific properties
 */
export interface Shape {
  id: string;
  type: Tool;
  properties: RectangleProperty | EllipseProperty | PencilProperty;
}

// Action types
export type ShapeAction =
  | { type: "ADD_SHAPE"; payload: Shape }
  | { type: "UPDATE_SHAPE"; payload: { id: string; shape: Partial<Shape> } }
  | { type: "DELETE_SHAPE"; payload: string }
  | { type: "SET_SELECTED_TOOL"; payload: Tool }
  | { type: "SET_BASE_PROPERTIES"; payload: BaseShapeProperty };

// State interface
export interface StoreState {
  selectedTool: Tool;
  shapes: Shape[];
  baseProperties: BaseShapeProperty;
}

// Context interface
export interface StoreContextType {
  selectedTool: Tool;
  shapes: Shape[];
  baseProperties: BaseShapeProperty;
  setSelectedTool: (tool: Tool) => void;
  addShape: (shape: Shape) => void;
  updateShape: (id: string, shape: Partial<Shape>) => void;
  deleteShape: (id: string) => void;
  setBaseProperties: (baseProperties: BaseShapeProperty) => void;
}

export enum StoreAction {
  ADD_SHAPE = "ADD_SHAPE",
  UPDATE_SHAPE = "UPDATE_SHAPE",
  DELETE_SHAPE = "DELETE_SHAPE",
  SET_SELECTED_TOOL = "SET_SELECTED_TOOL",
  SET_BASE_PROPERTIES = "SET_BASE_PROPERTIES",
}

export interface IDrawingHandler<T> {
  properties: Omit<
    T,
    | "strokeStyle"
    | "lineWidth"
    | "fillStyle"
    | "lineDash"
    | "borderRadius"
    | "opacity"
  >;
  handleDraw: () => void;
  handleMouseDown: (event: MouseEvent) => void;
  handleMouseMove: (event: MouseEvent) => void;
  handleMouseUp: (event?: MouseEvent) => {
    isDrawn: boolean;
    properties: T;
  };
}

// Generic tool configuration interface
export interface DrawingToolConfig<T> {
  ctx: CanvasRenderingContext2D;
  baseProperty: BaseShapeProperty;
  renderProperty?: T;
}
