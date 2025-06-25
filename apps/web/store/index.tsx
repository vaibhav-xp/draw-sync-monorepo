"use client";

import {
  createContext,
  useReducer,
  ReactNode,
  useCallback,
  useMemo,
  useEffect,
} from "react";
import {
  Tool,
  Shape,
  StoreContextType,
  BaseShapeProperty,
  StoreAction,
  SelectionRect,
  DragState,
} from "@repo/types";
import { storeReducer, initialState, initialBaseProperties } from "./reducer";
import { useTheme } from "next-themes";

export const StoreContext = createContext<StoreContextType>({
  selectedTool: Tool.Cursor,
  shapes: [],
  selectedShapes: [],
  selectionRect: null,
  dragState: {
    isDragging: false,
    startPosition: { x: 0, y: 0 },
    currentOffset: { x: 0, y: 0 },
    draggedShapes: [],
  },
  setSelectedTool: () => {},
  baseProperties: initialBaseProperties,
  addShape: () => {},
  updateShape: () => {},
  deleteShape: () => {},
  setBaseProperties: () => {},
  setSelectedShapes: () => {},
  addShapeToSelection: () => {},
  removeShapeFromSelection: () => {},
  clearSelection: () => {},
  setSelectionRect: () => {},
  startDrag: () => {},
  updateDrag: () => {},
  endDrag: () => {},
  batchUpdateShapes: () => {},
});

export const StoreContextProvider = ({ children }: { children: ReactNode }) => {
  const [state, dispatch] = useReducer(storeReducer, initialState);
  const { resolvedTheme } = useTheme();

  const setSelectedTool = useCallback((tool: Tool) => {
    dispatch({ type: StoreAction.SET_SELECTED_TOOL, payload: tool });
  }, []);

  const addShape = useCallback((shape: Shape) => {
    dispatch({ type: StoreAction.ADD_SHAPE, payload: shape });
  }, []);

  const updateShape = useCallback((id: string, shape: Partial<Shape>) => {
    dispatch({ type: StoreAction.UPDATE_SHAPE, payload: { id, shape } });
  }, []);

  const deleteShape = useCallback((id: string) => {
    dispatch({ type: StoreAction.DELETE_SHAPE, payload: id });
  }, []);

  const setBaseProperties = useCallback((baseProperties: BaseShapeProperty) => {
    dispatch({
      type: StoreAction.SET_BASE_PROPERTIES,
      payload: baseProperties,
    });
  }, []);

  const setSelectedShapes = useCallback((shapeIds: string[]) => {
    dispatch({ type: StoreAction.SET_SELECTED_SHAPES, payload: shapeIds });
  }, []);

  const addShapeToSelection = useCallback((shapeId: string) => {
    dispatch({ type: StoreAction.ADD_SHAPE_TO_SELECTION, payload: shapeId });
  }, []);

  const removeShapeFromSelection = useCallback((shapeId: string) => {
    dispatch({
      type: StoreAction.REMOVE_SHAPE_FROM_SELECTION,
      payload: shapeId,
    });
  }, []);

  const clearSelection = useCallback(() => {
    dispatch({ type: StoreAction.CLEAR_SELECTION });
  }, []);

  const setSelectionRect = useCallback((rect: SelectionRect | null) => {
    dispatch({ type: StoreAction.SET_SELECTION_RECT, payload: rect });
  }, []);

  const startDrag = useCallback(
    (startPosition: { x: number; y: number }, shapeIds: string[]) => {
      dispatch({
        type: StoreAction.START_DRAG,
        payload: { startPosition, shapeIds },
      });
    },
    []
  );

  const updateDrag = useCallback((position: { x: number; y: number }) => {
    dispatch({ type: StoreAction.UPDATE_DRAG, payload: position });
  }, []);

  const endDrag = useCallback(() => {
    dispatch({ type: StoreAction.END_DRAG });
  }, []);

  const batchUpdateShapes = useCallback(
    (updates: { id: string; shape: Partial<Shape> }[]) => {
      dispatch({ type: StoreAction.BATCH_UPDATE_SHAPES, payload: updates });
    },
    []
  );

  // Sync base properties with theme
  useEffect(() => {
    if (!resolvedTheme) return;
    const isDark = resolvedTheme === "dark";
    const strokeColor = isDark ? "white" : "black";
    setBaseProperties({
      ...state.baseProperties,
      strokeStyle: strokeColor,
    });
  }, [resolvedTheme, setBaseProperties]);

  const contextValue: StoreContextType = useMemo(
    () => ({
      selectedTool: state.selectedTool,
      shapes: state.shapes,
      baseProperties: state.baseProperties,
      selectedShapes: state.selectedShapes,
      selectionRect: state.selectionRect,
      dragState: state.dragState,
      setSelectedTool,
      addShape,
      updateShape,
      deleteShape,
      setBaseProperties,
      setSelectedShapes,
      addShapeToSelection,
      removeShapeFromSelection,
      clearSelection,
      setSelectionRect,
      startDrag,
      updateDrag,
      endDrag,
      batchUpdateShapes,
    }),
    [
      state.selectedTool,
      state.shapes,
      state.baseProperties,
      state.selectedShapes,
      state.selectionRect,
      state.dragState,
      setSelectedTool,
      addShape,
      updateShape,
      deleteShape,
      setBaseProperties,
      setSelectedShapes,
      addShapeToSelection,
      removeShapeFromSelection,
      clearSelection,
      setSelectionRect,
      startDrag,
      updateDrag,
      endDrag,
      batchUpdateShapes,
    ]
  );

  return (
    <StoreContext.Provider value={contextValue}>
      {children}
    </StoreContext.Provider>
  );
};
