"use client";
import { Toaster } from "sonner";

export default function Providers({ children }: { children: React.ReactNode }) {
  return (
    <>
      {children}
      <Toaster
        position="bottom-right"
        richColors
        expand
        closeButton
        className="bg-pink-arch font-jetbrains text-white"
      />
    </>
  );
}
