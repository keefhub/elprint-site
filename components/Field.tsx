"use client";

import { useId, type ReactNode } from "react";
import { Icon } from "./Icon";

interface RenderProps {
  id: string;
  "aria-describedby"?: string;
  "aria-invalid"?: boolean;
  className: string;
}

/** Label above the input, optional hint, error text below. */
export function Field({
  label, hint, error, required, valid, children,
}: {
  label: string; hint?: string; error?: string; required?: boolean; valid?: boolean;
  children: (p: RenderProps) => ReactNode;
}) {
  const uid = useId();
  const id = `f${uid.replace(/:/g, "")}`;
  const hintId = hint ? `${id}-hint` : undefined;
  const errId = error ? `${id}-err` : undefined;
  const describedBy = [hintId, errId].filter(Boolean).join(" ") || undefined;
  return (
    <div>
      <label htmlFor={id} className="field-label">
        {label}
        {required && <span className="font-normal text-muted"> (required)</span>}
      </label>
      {hint && <span id={hintId} className="field-hint">{hint}</span>}
      {children({
        id,
        "aria-describedby": describedBy,
        "aria-invalid": error ? true : undefined,
        className: `input ${valid && !error ? "is-valid" : ""}`,
      })}
      {error && (
        <p id={errId} className="field-error">
          <Icon name="alert" size={16} className="mt-0.5 text-error" />
          <span>{error}</span>
        </p>
      )}
    </div>
  );
}

export function ErrorSummary({
  errors, headingRef,
}: { errors: { id?: string; message: string }[]; headingRef?: React.Ref<HTMLDivElement> }) {
  if (!errors.length) return null;
  return (
    <div ref={headingRef} tabIndex={-1} role="alert" className="mb-6 rounded-md border-2 border-error bg-white p-4">
      <p className="font-semibold text-error">Fix {errors.length === 1 ? "this" : "these"} before you continue:</p>
      <ul className="mt-2 list-disc pl-6">
        {errors.map((e) => <li key={e.message}>{e.message}</li>)}
      </ul>
    </div>
  );
}
