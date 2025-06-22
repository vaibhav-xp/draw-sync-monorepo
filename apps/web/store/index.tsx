"use client";

import {
  createContext,
  useReducer,
  ReactNode,
  useCallback,
  useMemo,
} from "react";
import {
  Tool,
  Shape,
  StoreContextType,
  BaseShapeProperty,
  StoreAction,
} from "@repo/types";
import { storeReducer, initialState, initialBaseProperties } from "./reducer";

export const StoreContext = createContext<StoreContextType>({
  selectedTool: Tool.Cursor,
  shapes: [],
  setSelectedTool: () => {},
  baseProperties: initialBaseProperties,
  addShape: () => {},
  updateShape: () => {},
  deleteShape: () => {},
  setBaseProperties: () => {},
});

export const StoreContextProvider = ({ children }: { children: ReactNode }) => {
  const [state, dispatch] = useReducer(storeReducer, initialState);

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

  const contextValue: StoreContextType = useMemo(
    () => ({
      selectedTool: state.selectedTool,
      shapes: state.shapes,
      baseProperties: state.baseProperties,
      setSelectedTool,
      addShape,
      updateShape,
      deleteShape,
      setBaseProperties,
    }),
    [
      state.selectedTool,
      state.shapes,
      state.baseProperties,
      setSelectedTool,
      addShape,
      updateShape,
      deleteShape,
      setBaseProperties,
    ]
  );

  return (
    <StoreContext.Provider value={contextValue}>
      {children}
    </StoreContext.Provider>
  );
};
