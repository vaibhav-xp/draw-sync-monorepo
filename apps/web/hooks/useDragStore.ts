import { useStore } from "./useStore";

export function useDragStore() {
  const { dragState, startDrag, updateDrag, endDrag, batchUpdateShapes } =
    useStore();

  return {
    dragState,
    startDrag,
    updateDrag,
    endDrag,
    batchUpdateShapes,
  };
}
