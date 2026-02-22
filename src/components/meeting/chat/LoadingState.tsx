"use client";

import { Loader2 } from "lucide-react";

export function LoadingState() {
  return (
    <div className="h-full flex items-center justify-center">
      <Loader2 className="w-6 h-6 text-(--color-green) animate-spin" />
    </div>
  );
}
