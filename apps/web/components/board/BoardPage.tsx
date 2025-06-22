"use client";

import { useTheme } from "next-themes";
import { useCanvas } from "@/hooks/useCanvas";
import { ScreenLoader } from "@/components/ui/screen-loader";
import MenuBar from "./MenuBar";
import { Sidebar } from "./Sidebar";

export default function BoardPage() {
  const { resolvedTheme } = useTheme();
  const { canvasRef } = useCanvas();

  const isLoading = !resolvedTheme;

  return (
    <>
      <ScreenLoader isLoading={isLoading} />

      {!isLoading && (
        <section className="relative">
          <MenuBar />
          <canvas id="canvas" ref={canvasRef}></canvas>
          <Sidebar />
        </section>
      )}
    </>
  );
}
