"use client";

import { useEffect, useRef, useState } from "react";

/**
 * Counts down from initialSeconds to 0 once "started".
 * Call reset() to restart from initialSeconds.
 */
export function useOtpTimer({ initialSeconds = 300, autoStart = true } = {}) {
  const [secondsLeft, setSecondsLeft] = useState(initialSeconds);
  const [running, setRunning] = useState(autoStart);
  const intervalRef = useRef(null);

  useEffect(() => {
    if (!running) return;
    intervalRef.current = setInterval(() => {
      setSecondsLeft((s) => {
        if (s <= 1) {
          clearInterval(intervalRef.current);
          setRunning(false);
          return 0;
        }
        return s - 1;
      });
    }, 1000);
    return () => clearInterval(intervalRef.current);
  }, [running]);

  const reset = () => {
    clearInterval(intervalRef.current);
    setSecondsLeft(initialSeconds);
    setRunning(true);
  };

  const minutes = Math.floor(secondsLeft / 60);
  const seconds = secondsLeft % 60;
  const display = `${minutes}:${String(seconds).padStart(2, "0")}`;

  return { secondsLeft, display, running, reset };
}
