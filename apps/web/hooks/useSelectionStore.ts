import { useStore } from "./useStore";

export function useSelectionStore() {
  const {
    selectedShapes,
    selectionRect,
    setSelectedShapes,
    addShapeToSelection,
    removeShapeFromSelection,
    clearSelection,
    setSelectionRect,
  } = useStore();

  return {
    selectedShapes,
    selectionRect,
    setSelectedShapes,
    addShapeToSelection,
    removeShapeFromSelection,
    clearSelection,
    setSelectionRect,
  };
}
