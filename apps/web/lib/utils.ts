import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export const THRESHOLD = 5;

export function clearCanvas(canvas: HTMLCanvasElement) {
  const ctx = canvas.getContext("2d");
  if (!ctx) return;

  ctx.clearRect(0, 0, canvas.width, canvas.height);
  const computedStyle = window.getComputedStyle(document.body);
  const backgroundColor = computedStyle.backgroundColor;
  ctx.fillStyle = backgroundColor;
  ctx.fillRect(0, 0, canvas.width, canvas.height);
}

export function getThemeColors() {
  const computedStyle = window.getComputedStyle(document.body);
  const isDark = computedStyle.colorScheme === "dark";
  return {
    isDark,
    backgroundColor: computedStyle.backgroundColor,
    strokeColor: isDark ? "white" : "black",
  };
}
