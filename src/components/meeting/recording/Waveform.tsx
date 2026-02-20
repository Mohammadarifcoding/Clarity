export default function Waveform() {
  return (
    <div className="flex items-end justify-center gap-1 h-16 bg-gray-50 rounded-xl px-4">
      {[...Array(24)].map((_, i) => (
        <div
          key={i}
          className="w-1 bg-(--color-green) rounded-full origin-bottom"
          style={{
            height: "100%",
            animation: "waveform 1.2s ease-in-out infinite",
            animationDelay: `${i * 0.05}s`,
          }}
        />
      ))}
    </div>
  );
}
