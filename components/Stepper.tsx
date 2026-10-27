"use client";

import { useState } from "react";
import { Icon } from "./Icon";

export function Stepper({
  value, min, max, onChange, label = "Quantity",
}: { value: number; min: number; max: number; onChange: (n: number) => void; label?: string }) {
  const [text, setText] = useState<string | null>(null);
  return (
    <div className="inline-flex items-stretch">
      <button type="button" aria-label={`Decrease ${label.toLowerCase()}`} disabled={value <= min}
        onClick={() => { setText(null); onChange(value - 1); }}
        className="btn btn-secondary rounded-r-none px-0" style={{ width: 44 }}>
        <Icon name="minus" size={20} className="text-current" />
      </button>
      <input
        aria-label={label} inputMode="numeric" pattern="[0-9]*" autoComplete="off"
        className="input w-20 rounded-none border-x-0 text-center"
        value={text ?? String(value)}
        onChange={(e) => {
          const v = e.target.value.replace(/\D/g, "");
          setText(v);
          if (v) onChange(Number(v));
        }}
        onBlur={() => setText(null)}
      />
      <button type="button" aria-label={`Increase ${label.toLowerCase()}`} disabled={value >= max}
        onClick={() => { setText(null); onChange(value + 1); }}
        className="btn btn-secondary rounded-l-none px-0" style={{ width: 44 }}>
        <Icon name="plus" size={20} className="text-current" />
      </button>
    </div>
  );
}
