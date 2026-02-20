import { Loader2 } from "lucide-react";

export default function ProcessingState() {
  return (
    <div className="text-center py-16">
      <Loader2 className="w-16 h-16 animate-spin mx-auto mb-4 text-[var(--color-green)]" />
      <h3 className="text-xl font-medium mb-2">Processing Recording</h3>
      <p className="text-gray-600">
        AI is transcribing and analyzing your meeting...
      </p>
    </div>
  );
}
