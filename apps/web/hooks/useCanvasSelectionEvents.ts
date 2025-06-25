import { useCallback, useEffect, useState, useRef } from "react";
import { Tool } from "@repo/types";
import { useStore } from "./useStore";
import { useSelectionStore } from "./useSelectionStore";
import { useShapeHitTesting } from "./useShapeHitTesting";
import { useShapeDragging } from "./useShapeDragging";

/**
 * Handles all canvas selection events including single selection,
 * multi-selection, drag-to-select, and shape dragging functionality
 */
export function useCanvasSelectionEvents({
  canvas,
  context,
}: {
  canvas: HTMLCanvasElement | null;
  context: CanvasRenderingContext2D | null;
}) {
  const { shapes, selectedTool } = useStore();
  const {
    selectedShapes,
    selectionRect,
    setSelectedShapes,
    addShapeToSelection,
    removeShapeFromSelection,
    clearSelection,
    setSelectionRect,
  } = useSelectionStore();

  const { getCanvasCoordinates, getShapeAtPosition, isShapeContainedInRect } =
    useShapeHitTesting({ canvas, context });

  const { dragState, startShapeDrag, updateShapeDrag, endShapeDrag } =
    useShapeDragging();

  const [isShiftPressed, setIsShiftPressed] = useState(false);
  const [isDragSelection, setIsDragSelection] = useState(false);
  const [dragStart, setDragStart] = useState<{ x: number; y: number } | null>(
    null
  );
  const isMouseDownRef = useRef(false);

  /**
   * Handles mouse down events for selection and drag initiation
   */
  const handleMouseDown = useCallback(
    (event: MouseEvent) => {
      if (selectedTool !== Tool.Cursor) return;

      isMouseDownRef.current = true;
      const coords = getCanvasCoordinates(event);
      const clickedShape = getShapeAtPosition(event);

      if (clickedShape && selectedShapes.includes(clickedShape.id)) {
        // Clicked on a selected shape - start dragging
        startShapeDrag(coords, selectedShapes);
      } else if (clickedShape) {
        // Clicked on an unselected shape - handle selection
        if (isShiftPressed) {
          // Multi-selection: toggle shape in selection
          if (selectedShapes.includes(clickedShape.id)) {
            removeShapeFromSelection(clickedShape.id);
          } else {
            addShapeToSelection(clickedShape.id);
          }
        } else {
          // Single selection: select only this shape
          setSelectedShapes([clickedShape.id]);
        }
      } else {
        // Clicked on empty space - start drag selection
        if (!isShiftPressed) {
          clearSelection();
        }
        setDragStart(coords);
        setIsDragSelection(true);
        setSelectionRect({
          startX: coords.x,
          startY: coords.y,
          endX: coords.x,
          endY: coords.y,
        });
      }
    },
    [
      selectedTool,
      isShiftPressed,
      selectedShapes,
      getCanvasCoordinates,
      getShapeAtPosition,
      removeShapeFromSelection,
      addShapeToSelection,
      setSelectedShapes,
      clearSelection,
      setSelectionRect,
      startShapeDrag,
    ]
  );

  /**
   * Handles mouse move events for drag selection and shape dragging
   */
  const handleMouseMove = useCallback(
    (event: MouseEvent) => {
      if (selectedTool !== Tool.Cursor || !isMouseDownRef.current) return;

      const coords = getCanvasCoordinates(event);

      if (dragState.isDragging) {
        // Update shape drag positions
        updateShapeDrag(coords);
      } else if (isDragSelection && dragStart && selectionRect) {
        // Update selection rectangle
        setSelectionRect({
          ...selectionRect,
          endX: coords.x,
          endY: coords.y,
        });
      }
    },
    [
      selectedTool,
      dragState.isDragging,
      isDragSelection,
      dragStart,
      selectionRect,
      getCanvasCoordinates,
      setSelectionRect,
      updateShapeDrag,
    ]
  );

  /**
   * Handles mouse up events to complete selection or dragging
   */
  const handleMouseUp = useCallback(
    (event: MouseEvent) => {
      if (selectedTool !== Tool.Cursor || !isMouseDownRef.current) return;

      isMouseDownRef.current = false;

      if (dragState.isDragging) {
        // Complete shape dragging
        endShapeDrag();
      } else if (isDragSelection && selectionRect) {
        // Complete drag selection - only select shapes fully contained in rectangle
        const containedShapes = shapes.filter((shape) =>
          isShapeContainedInRect(shape, selectionRect)
        );

        if (isShiftPressed) {
          // Add to existing selection
          const newSelectedShapes = [...selectedShapes];
          containedShapes.forEach((shape) => {
            if (!newSelectedShapes.includes(shape.id)) {
              newSelectedShapes.push(shape.id);
            }
          });
          setSelectedShapes(newSelectedShapes);
        } else {
          // Replace selection
          setSelectedShapes(containedShapes.map((shape) => shape.id));
        }
      }

      // Clean up selection state
      setIsDragSelection(false);
      setDragStart(null);
      setSelectionRect(null);
    },
    [
      selectedTool,
      dragState.isDragging,
      isDragSelection,
      selectionRect,
      shapes,
      isShapeContainedInRect,
      isShiftPressed,
      selectedShapes,
      setSelectedShapes,
      setSelectionRect,
      endShapeDrag,
    ]
  );

  /**
   * Handles cursor styling based on hover state and drag state
   */
  const handleCursorUpdate = useCallback(
    (event: MouseEvent) => {
      if (!canvas || selectedTool !== Tool.Cursor) return;

      if (dragState.isDragging) {
        canvas.style.cursor = "grabbing";
      } else {
        const clickedShape = getShapeAtPosition(event);
        if (clickedShape && selectedShapes.includes(clickedShape.id)) {
          canvas.style.cursor = "grab";
        } else if (clickedShape) {
          canvas.style.cursor = "move";
        } else {
          canvas.style.cursor = "default";
        }
      }
    },
    [
      canvas,
      selectedTool,
      dragState.isDragging,
      selectedShapes,
      getShapeAtPosition,
    ]
  );

  // Handle keyboard events for Shift key
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Shift") {
        setIsShiftPressed(true);
      }
    };

    const handleKeyUp = (event: KeyboardEvent) => {
      if (event.key === "Shift") {
        setIsShiftPressed(false);
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    window.addEventListener("keyup", handleKeyUp);

    return () => {
      window.removeEventListener("keydown", handleKeyDown);
      window.removeEventListener("keyup", handleKeyUp);
    };
  }, []);

  // Attach canvas event listeners
  useEffect(() => {
    if (!canvas || selectedTool !== Tool.Cursor) return;

    canvas.addEventListener("mousedown", handleMouseDown);
    canvas.addEventListener("mousemove", handleMouseMove);
    canvas.addEventListener("mouseup", handleMouseUp);
    canvas.addEventListener("mousemove", handleCursorUpdate);

    return () => {
      canvas.removeEventListener("mousedown", handleMouseDown);
      canvas.removeEventListener("mousemove", handleMouseMove);
      canvas.removeEventListener("mouseup", handleMouseUp);
      canvas.removeEventListener("mousemove", handleCursorUpdate);
    };
  }, [
    canvas,
    selectedTool,
    handleMouseDown,
    handleMouseMove,
    handleMouseUp,
    handleCursorUpdate,
  ]);

  return {
    selectedShapes,
    selectionRect,
    isShiftPressed,
    isDragSelection,
    dragState,
  };
}
