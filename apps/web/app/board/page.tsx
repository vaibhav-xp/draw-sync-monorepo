import { Metadata } from "next";
import BoardPage from "@/components/board/BoardPage";
import { StoreContextProvider } from "@/store";

export const metadata: Metadata = {
  title: "Draw Sync - Board",
  description: "Draw Sync - Board",
};

export default function Board() {
  return (
    <StoreContextProvider>
      <BoardPage />
    </StoreContextProvider>
  );
}
