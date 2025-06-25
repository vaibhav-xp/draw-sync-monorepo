import {
  Tool,
  StoreState,
  ShapeAction,
  StoreAction,
  BaseShapeProperty,
} from "@repo/types";

export const initialBaseProperties: BaseShapeProperty = {
  strokeStyle: "black",
  lineWidth: 1,
  fillStyle: "transparent",
  lineDash: [],
  borderRadius: 8,
  opacity: 1,
};

export const initialState: StoreState = {
  selectedTool: Tool.Rectangle,
  shapes: [],
  baseProperties: initialBaseProperties,
  selectedShapes: [],
  selectionRect: null,
  dragState: {
    isDragging: false,
    startPosition: { x: 0, y: 0 },
    currentOffset: { x: 0, y: 0 },
    draggedShapes: [],
  },
};

export const storeReducer = (
  state: StoreState,
  action: ShapeAction
): StoreState => {
  switch (action.type) {
    case StoreAction.ADD_SHAPE:
      return {
        ...state,
        shapes: [...state.shapes, action.payload],
      };

    case StoreAction.UPDATE_SHAPE:
      return {
        ...state,
        shapes: state.shapes.map((shape) =>
          shape.id === action.payload.id
            ? { ...shape, ...action.payload.shape }
            : shape
        ),
      };

    case StoreAction.BATCH_UPDATE_SHAPES:
      return {
        ...state,
        shapes: state.shapes.map((shape) => {
          const update = action.payload.find((u) => u.id === shape.id);
          return update ? { ...shape, ...update.shape } : shape;
        }),
      };

    case StoreAction.DELETE_SHAPE:
      return {
        ...state,
        shapes: state.shapes.filter((shape) => shape.id !== action.payload),
        selectedShapes: state.selectedShapes.filter(
          (id) => id !== action.payload
        ),
      };

    case StoreAction.SET_SELECTED_TOOL:
      return {
        ...state,
        selectedTool: action.payload,
        selectedShapes:
          action.payload === Tool.Cursor ? state.selectedShapes : [],
        selectionRect: null,
        dragState: {
          isDragging: false,
          startPosition: { x: 0, y: 0 },
          currentOffset: { x: 0, y: 0 },
          draggedShapes: [],
        },
      };

    case StoreAction.SET_BASE_PROPERTIES:
      return {
        ...state,
        baseProperties: action.payload,
      };

    case StoreAction.SET_SELECTED_SHAPES:
      return {
        ...state,
        selectedShapes: action.payload,
      };

    case StoreAction.ADD_SHAPE_TO_SELECTION:
      return {
        ...state,
        selectedShapes: state.selectedShapes.includes(action.payload)
          ? state.selectedShapes
          : [...state.selectedShapes, action.payload],
      };

    case StoreAction.REMOVE_SHAPE_FROM_SELECTION:
      return {
        ...state,
        selectedShapes: state.selectedShapes.filter(
          (id) => id !== action.payload
        ),
      };

    case StoreAction.CLEAR_SELECTION:
      return {
        ...state,
        selectedShapes: [],
      };

    case StoreAction.SET_SELECTION_RECT:
      return {
        ...state,
        selectionRect: action.payload,
      };

    case StoreAction.START_DRAG:
      return {
        ...state,
        dragState: {
          isDragging: true,
          startPosition: action.payload.startPosition,
          currentOffset: { x: 0, y: 0 },
          draggedShapes: action.payload.shapeIds,
        },
      };

    case StoreAction.UPDATE_DRAG:
      if (!state.dragState.isDragging) return state;
      return {
        ...state,
        dragState: {
          ...state.dragState,
          currentOffset: {
            x: action.payload.x - state.dragState.startPosition.x,
            y: action.payload.y - state.dragState.startPosition.y,
          },
        },
      };

    case StoreAction.END_DRAG:
      return {
        ...state,
        dragState: {
          isDragging: false,
          startPosition: { x: 0, y: 0 },
          currentOffset: { x: 0, y: 0 },
          draggedShapes: [],
        },
      };

    default:
      return state;
  }
};
