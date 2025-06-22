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

    case StoreAction.DELETE_SHAPE:
      return {
        ...state,
        shapes: state.shapes.filter((shape) => shape.id !== action.payload),
      };

    case StoreAction.SET_SELECTED_TOOL:
      return {
        ...state,
        selectedTool: action.payload,
      };

    case StoreAction.SET_BASE_PROPERTIES:
      return {
        ...state,
        baseProperties: action.payload,
      };

    default:
      return state;
  }
};
