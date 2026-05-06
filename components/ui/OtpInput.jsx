"use client";

import { useEffect, useRef, useState } from "react";
import { cn } from "@/lib/utils/cn";

/**
 * OtpInput — N case OTP with auto-advance, paste-to-fill, backspace-to-prev.
 *
 * Props:
 *  - length (default 6)
 *  - value: controlled string of digits ("" or "123")
 *  - onChange(next): fires with the new joined string
 *  - onComplete(code): fires when all N cases are filled
 *  - autoFocus: focus the first cell on mount
 *  - disabled: disables all inputs
 *  - error: red border state
 */
export function OtpInput({
  length = 6,
  value = "",
  onChange,
  onComplete,
  autoFocus = true,
  disabled = false,
  error = false,
}) {
  const refs = useRef([]);
  const [digits, setDigits] = useState(() => splitDigits(value, length));

  // Sync external value
  useEffect(() => {
    setDigits(splitDigits(value, length));
  }, [value, length]);

  // Auto-focus first
  useEffect(() => {
    if (autoFocus) refs.current[0]?.focus();
  }, [autoFocus]);

  const emit = (next) => {
    const joined = next.join("");
    onChange?.(joined);
    if (joined.length === length && next.every(Boolean)) {
      onComplete?.(joined);
    }
  };

  const handleChange = (i, raw) => {
    if (disabled) return;
    const cleaned = raw.replace(/\D/g, "");
    if (!cleaned) {
      const next = [...digits];
      next[i] = "";
      setDigits(next);
      emit(next);
      return;
    }
    // Multi-digit paste landing on a single cell
    if (cleaned.length > 1) {
      handlePaste(cleaned, i);
      return;
    }
    const next = [...digits];
    next[i] = cleaned[0];
    setDigits(next);
    emit(next);
    if (i < length - 1) refs.current[i + 1]?.focus();
  };

  const handleKeyDown = (i, e) => {
    if (disabled) return;
    if (e.key === "Backspace") {
      if (digits[i]) {
        const next = [...digits];
        next[i] = "";
        setDigits(next);
        emit(next);
      } else if (i > 0) {
        refs.current[i - 1]?.focus();
        const next = [...digits];
        next[i - 1] = "";
        setDigits(next);
        emit(next);
      }
    } else if (e.key === "ArrowLeft" && i > 0) {
      refs.current[i - 1]?.focus();
    } else if (e.key === "ArrowRight" && i < length - 1) {
      refs.current[i + 1]?.focus();
    }
  };

  const handlePaste = (pastedRaw, startAt = 0) => {
    if (disabled) return;
    const cleaned = pastedRaw.replace(/\D/g, "").slice(0, length - startAt);
    if (!cleaned.length) return;
    const next = [...digits];
    for (let k = 0; k < cleaned.length; k++) next[startAt + k] = cleaned[k];
    setDigits(next);
    emit(next);
    const focusAt = Math.min(startAt + cleaned.length, length - 1);
    refs.current[focusAt]?.focus();
  };

  return (
    <div
      className="flex items-center justify-center gap-2 sm:gap-3"
      role="group"
      aria-label="Code de vérification"
    >
      {digits.map((d, i) => (
        <input
          key={i}
          ref={(el) => (refs.current[i] = el)}
          type="text"
          inputMode="numeric"
          autoComplete="one-time-code"
          maxLength={i === 0 ? length : 1}
          value={d}
          disabled={disabled}
          aria-label={`Chiffre ${i + 1}`}
          onChange={(e) => handleChange(i, e.target.value)}
          onKeyDown={(e) => handleKeyDown(i, e)}
          onPaste={(e) => {
            e.preventDefault();
            handlePaste(e.clipboardData.getData("text"), i);
          }}
          className={cn(
            "w-11 h-12 sm:w-12 sm:h-14 rounded-md text-center text-xl font-medium",
            "bg-surface text-foreground border border-border",
            "focus:border-accent focus:outline-none focus:shadow-glow-accent",
            "transition-all duration-200",
            error && "border-danger focus:border-danger focus:shadow-none",
            disabled && "opacity-50 cursor-not-allowed"
          )}
        />
      ))}
    </div>
  );
}

function splitDigits(value, length) {
  const cleaned = (value || "").replace(/\D/g, "").slice(0, length);
  const out = new Array(length).fill("");
  for (let i = 0; i < cleaned.length; i++) out[i] = cleaned[i];
  return out;
}
