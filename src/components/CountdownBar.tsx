import { useState, useEffect } from "react";
import "./CountdownBar.css";

interface CountdownBarProps {
  timerEnd: number | null | undefined;
}

export default function CountdownBar({ timerEnd }: CountdownBarProps) {
  const [secondsLeft, setSecondsLeft] = useState<number | null>(null);
  const [totalSeconds, setTotalSeconds] = useState<number>(0);

  useEffect(() => {
    if (!timerEnd) {
      setSecondsLeft(null);
      return;
    }

    const total = Math.max(0, Math.ceil((timerEnd - Date.now()) / 1000));
    setTotalSeconds(total);
    setSecondsLeft(total);

    const interval = setInterval(() => {
      const remaining = Math.max(0, Math.ceil((timerEnd - Date.now()) / 1000));
      setSecondsLeft(remaining);
      if (remaining <= 0) {
        clearInterval(interval);
      }
    }, 200);

    return () => clearInterval(interval);
  }, [timerEnd]);

  if (secondsLeft === null || totalSeconds === 0) return null;

  const progress = totalSeconds > 0 ? secondsLeft / totalSeconds : 0;
  const isUrgent = secondsLeft <= 5;

  return (
    <div className="countdown-bar">
      <div
        className={`countdown-bar__fill ${isUrgent ? "countdown-bar__fill--urgent" : ""}`}
        style={{ width: `${progress * 100}%` }}
      />
      <span className={`countdown-bar__text ${isUrgent ? "countdown-bar__text--urgent" : ""}`}>
        {secondsLeft}s
      </span>
    </div>
  );
}
