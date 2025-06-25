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
 * @startX - start X coordinate
 * @startY - start Y coordinate
 * @width - rectangle width
 * @height - rectangle height
 */
export interface RectangleProperty extends BaseShapeProperty {
  startX: number;
  startY: number;
  width: number;
  height: number;
}

/**
 * Ellipse shape properties
 * @startX - start X coordinate (center X)
 * @startY - start Y coordinate (center Y)
 * @centerX - center X coordinate
 * @centerY - center Y coordinate
 * @radiusX - horizontal radius
 * @radiusY - vertical radius
 * @rotation - rotation angle in radians
 * @startAngle - start angle for drawing
 * @endAngle - end angle for drawing
 */
export interface EllipseProperty
  extends Omit<BaseShapeProperty, "borderRadius"> {
  startX: number;
  startY: number;
  centerX: number;
  centerY: number;
  radiusX: number;
  radiusY: number;
  rotation: number;
  startAngle: number;
  endAngle: number;
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

/**
 * Selection rectangle for drag-to-select functionality
 */
export interface SelectionRect {
  startX: number;
  startY: number;
  endX: number;
  endY: number;
}

/**
 * Drag state for tracking shape movement
 */
export interface DragState {
  isDragging: boolean;
  startPosition: { x: number; y: number };
  currentOffset: { x: number; y: number };
  draggedShapes: string[]; // IDs of shapes being dragged
}

// Action types
export type ShapeAction =
  | { type: "ADD_SHAPE"; payload: Shape }
  | { type: "UPDATE_SHAPE"; payload: { id: string; shape: Partial<Shape> } }
  | { type: "DELETE_SHAPE"; payload: string }
  | { type: "SET_SELECTED_TOOL"; payload: Tool }
  | { type: "SET_BASE_PROPERTIES"; payload: BaseShapeProperty }
  | { type: "SET_SELECTED_SHAPES"; payload: string[] }
  | { type: "ADD_SHAPE_TO_SELECTION"; payload: string }
  | { type: "REMOVE_SHAPE_FROM_SELECTION"; payload: string }
  | { type: "CLEAR_SELECTION" }
  | { type: "SET_SELECTION_RECT"; payload: SelectionRect | null }
  | {
      type: "START_DRAG";
      payload: { startPosition: { x: number; y: number }; shapeIds: string[] };
    }
  | { type: "UPDATE_DRAG"; payload: { x: number; y: number } }
  | { type: "END_DRAG" }
  | {
      type: "BATCH_UPDATE_SHAPES";
      payload: { id: string; shape: Partial<Shape> }[];
    };

// State interface
export interface StoreState {
  selectedTool: Tool;
  shapes: Shape[];
  baseProperties: BaseShapeProperty;
  selectedShapes: string[];
  selectionRect: SelectionRect | null;
  dragState: DragState;
}

// Context interface
export interface StoreContextType {
  selectedTool: Tool;
  shapes: Shape[];
  baseProperties: BaseShapeProperty;
  selectedShapes: string[];
  selectionRect: SelectionRect | null;
  dragState: DragState;
  setSelectedTool: (tool: Tool) => void;
  addShape: (shape: Shape) => void;
  updateShape: (id: string, shape: Partial<Shape>) => void;
  deleteShape: (id: string) => void;
  setBaseProperties: (baseProperties: BaseShapeProperty) => void;
  setSelectedShapes: (shapeIds: string[]) => void;
  addShapeToSelection: (shapeId: string) => void;
  removeShapeFromSelection: (shapeId: string) => void;
  clearSelection: () => void;
  setSelectionRect: (rect: SelectionRect | null) => void;
  startDrag: (
    startPosition: { x: number; y: number },
    shapeIds: string[]
  ) => void;
  updateDrag: (position: { x: number; y: number }) => void;
  endDrag: () => void;
  batchUpdateShapes: (updates: { id: string; shape: Partial<Shape> }[]) => void;
}

export enum StoreAction {
  ADD_SHAPE = "ADD_SHAPE",
  UPDATE_SHAPE = "UPDATE_SHAPE",
  DELETE_SHAPE = "DELETE_SHAPE",
  SET_SELECTED_TOOL = "SET_SELECTED_TOOL",
  SET_BASE_PROPERTIES = "SET_BASE_PROPERTIES",
  SET_SELECTED_SHAPES = "SET_SELECTED_SHAPES",
  ADD_SHAPE_TO_SELECTION = "ADD_SHAPE_TO_SELECTION",
  REMOVE_SHAPE_FROM_SELECTION = "REMOVE_SHAPE_FROM_SELECTION",
  CLEAR_SELECTION = "CLEAR_SELECTION",
  SET_SELECTION_RECT = "SET_SELECTION_RECT",
  START_DRAG = "START_DRAG",
  UPDATE_DRAG = "UPDATE_DRAG",
  END_DRAG = "END_DRAG",
  BATCH_UPDATE_SHAPES = "BATCH_UPDATE_SHAPES",
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
  handleIsCursorOnShape: (event: MouseEvent) => boolean;
}

// Generic tool configuration interface
export interface DrawingToolConfig<T> {
  ctx: CanvasRenderingContext2D;
  baseProperty: BaseShapeProperty;
  renderProperty?: T;
}
