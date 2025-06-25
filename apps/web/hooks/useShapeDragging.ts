import { useCallback } from "react";
import { Shape, Tool } from "@repo/types";
import { useStore } from "./useStore";
import { useDragStore } from "./useDragStore";

/**
 * Handles shape dragging logic including position calculations and updates
 */
export function useShapeDragging() {
  const { shapes } = useStore();
  const { dragState, startDrag, updateDrag, endDrag, batchUpdateShapes } =
    useDragStore();

  /**
   * Calculates new position for a shape based on drag offset
   */
  const calculateNewPosition = useCallback(
    (shape: Shape, offsetX: number, offsetY: number): Partial<Shape> => {
      switch (shape.type) {
        case Tool.Rectangle: {
          const props = shape.properties as any;
          return {
            properties: {
              ...shape.properties,
              startX: props.startX + offsetX,
              startY: props.startY + offsetY,
            },
          };
        }
        case Tool.Ellipse: {
          const props = shape.properties as any;
          return {
            properties: {
              ...shape.properties,
              centerX: props.centerX + offsetX,
              centerY: props.centerY + offsetY,
              startX: props.startX + offsetX,
              startY: props.startY + offsetY,
            },
          };
        }
        case Tool.Pencil: {
          const props = shape.properties as any;
          return {
            properties: {
              ...shape.properties,
              path: props.path.map((point: any) => ({
                x: point.x + offsetX,
                y: point.y + offsetY,
              })),
            },
          };
        }
        default:
          return { properties: shape.properties };
      }
    },
    []
  );

  /**
   * Gets current preview positions for dragged shapes (without committing to store)
   */
  const getDraggedShapesPreview = useCallback(() => {
    if (!dragState.isDragging) return shapes;

    const { currentOffset, draggedShapes } = dragState;

    return shapes.map((shape) => {
      if (draggedShapes.includes(shape.id)) {
        const newPosition = calculateNewPosition(
          shape,
          currentOffset.x,
          currentOffset.y
        );
        return { ...shape, ...newPosition };
      }
      return shape;
    });
  }, [shapes, dragState, calculateNewPosition]);

  /**
   * Commits the current drag positions to the store
   */
  const commitDraggedPositions = useCallback(() => {
    if (!dragState.isDragging) return;

    const { currentOffset, draggedShapes } = dragState;

    const updates = draggedShapes
      .map((shapeId) => {
        const shape = shapes.find((s) => s.id === shapeId);
        if (!shape) return null;

        const newPosition = calculateNewPosition(
          shape,
          currentOffset.x,
          currentOffset.y
        );
        return {
          id: shapeId,
          shape: newPosition,
        };
      })
      .filter(Boolean) as { id: string; shape: Partial<Shape> }[];

    batchUpdateShapes(updates);
  }, [shapes, dragState, calculateNewPosition, batchUpdateShapes]);

  /**
   * Starts dragging the specified shapes
   */
  const startShapeDrag = useCallback(
    (startPosition: { x: number; y: number }, shapeIds: string[]) => {
      startDrag(startPosition, shapeIds);
    },
    [startDrag]
  );

  /**
   * Updates the drag position
   */
  const updateShapeDrag = useCallback(
    (position: { x: number; y: number }) => {
      updateDrag(position);
    },
    [updateDrag]
  );

  /**
   * Ends the drag operation and commits changes
   */
  const endShapeDrag = useCallback(() => {
    commitDraggedPositions();
    endDrag();
  }, [commitDraggedPositions, endDrag]);

  return {
    dragState,
    getDraggedShapesPreview,
    startShapeDrag,
    updateShapeDrag,
    endShapeDrag,
  };
}
