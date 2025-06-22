"use client";

import useCanvas from "@/hooks/useCanvas";
import MenuBar from "./MenuBar";
import { PropertySidebar } from "./PropertySidebar";

export default function BoardPage() {
  const { canvasRef } = useCanvas();

  return (
    <section className="relative">
      <MenuBar />
      <canvas id="canvas" ref={canvasRef}></canvas>
      <PropertySidebar />
    </section>
  );
}
