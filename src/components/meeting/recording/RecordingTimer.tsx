interface Props {
  seconds: number;
}

export default function RecordingTimer({ seconds }: Props) {
  const format = (s: number) => {
    const m = Math.floor(s / 60);
    const sec = s % 60;
    return `${m.toString().padStart(2, "0")}:${sec
      .toString()
      .padStart(2, "0")}`;
  };

  return (
    <div className="text-5xl font-light tabular-nums">{format(seconds)}</div>
  );
}
