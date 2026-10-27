"use client";

import { useId, useState } from "react";
import type { ArtworkMeta } from "@/lib/pricing";
import { Icon } from "./Icon";

const ACCEPT = [".png", ".jpg", ".jpeg", ".pdf", ".ai", ".eps"];
const MAX_BYTES = 50 * 1024 * 1024;

export const formatBytes = (n: number) =>
  n >= 1024 * 1024 ? `${(n / 1024 / 1024).toFixed(1)} MB` : `${Math.max(1, Math.round(n / 1024))} KB`;

/** Shrink an image to a small WebP data URL so it can be saved in localStorage. */
function makeThumb(file: File): Promise<string | undefined> {
  return new Promise((resolve) => {
    if (!file.type.startsWith("image/")) return resolve(undefined);
    const url = URL.createObjectURL(file);
    const img = new Image();
    img.onload = () => {
      const scale = Math.min(1, 480 / Math.max(img.width, img.height));
      const canvas = document.createElement("canvas");
      canvas.width = Math.max(1, Math.round(img.width * scale));
      canvas.height = Math.max(1, Math.round(img.height * scale));
      canvas.getContext("2d")?.drawImage(img, 0, 0, canvas.width, canvas.height);
      URL.revokeObjectURL(url);
      try {
        resolve(canvas.toDataURL("image/webp", 0.85));
      } catch {
        resolve(undefined);
      }
    };
    img.onerror = () => {
      URL.revokeObjectURL(url);
      resolve(undefined);
    };
    img.src = url;
  });
}

export function UploadZone({
  value, onChange, label = "Artwork", compact = false,
}: { value?: ArtworkMeta; onChange: (a: ArtworkMeta | undefined) => void; label?: string; compact?: boolean }) {
  const uid = useId().replace(/:/g, "");
  const inputId = `up${uid}`;
  const capId = `cap${uid}`;
  const errId = `err${uid}`;
  const [over, setOver] = useState(false);
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);

  async function handle(file?: File) {
    if (!file) return;
    const ext = file.name.slice(file.name.lastIndexOf(".")).toLowerCase();
    if (!ACCEPT.includes(ext)) {
      setError(`${file.name} is a ${ext || "unknown"} file. Upload a PNG, JPG, PDF, AI or EPS file.`);
      return;
    }
    if (file.size > MAX_BYTES) {
      setError(`This file is ${formatBytes(file.size)}. The limit is 50 MB. Compress it, or send it to us on WhatsApp.`);
      return;
    }
    setError("");
    setBusy(true);
    const thumb = await makeThumb(file);
    setBusy(false);
    onChange({ name: file.name, size: file.size, type: file.type || ext, thumb });
  }

  if (value) {
    return (
      <div>
        <p className="field-label">{label}</p>
        <div className="flex items-center gap-3 rounded-lg border border-line bg-surface p-3">
          <div className="flex h-16 w-16 shrink-0 items-center justify-center overflow-hidden rounded bg-white">
            {value.thumb ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img src={value.thumb} alt={`Preview of ${value.name}`} className="h-full w-full object-contain" />
            ) : (
              <Icon name="file" size={28} />
            )}
          </div>
          <div className="min-w-0 flex-1">
            <p className="flex items-center gap-1 truncate font-semibold">
              <Icon name="check" size={16} className="text-success-ink" />
              <span className="truncate">{value.name}</span>
            </p>
            <p className="caption">{formatBytes(value.size)}{value.thumb ? "" : ". Preview not available for this file type."}</p>
          </div>
          <label htmlFor={inputId} className="btn btn-ghost cursor-pointer">Replace</label>
          <button type="button" className="btn btn-ghost" onClick={() => onChange(undefined)} aria-label={`Remove ${value.name}`}>
            Remove
          </button>
        </div>
        <input id={inputId} type="file" accept={ACCEPT.join(",")} className="sr-only-input" onChange={(e) => handle(e.target.files?.[0])} />
        {error && <p id={errId} role="alert" className="field-error">{error}</p>}
      </div>
    );
  }

  return (
    <div>
      <p className="field-label" id={`${inputId}-l`}>{label}</p>
      <label
        htmlFor={inputId}
        onDragOver={(e) => { e.preventDefault(); setOver(true); }}
        onDragLeave={() => setOver(false)}
        onDrop={(e) => { e.preventDefault(); setOver(false); handle(e.dataTransfer.files?.[0]); }}
        className={`crop flex cursor-pointer flex-col items-center justify-center gap-1 rounded-lg border-2 border-dashed text-center transition-colors focus-within:outline focus-within:outline-3 focus-within:outline-offset-2 focus-within:outline-teal ${
          compact ? "px-6 py-6" : "px-6 py-8"
        } ${over ? "border-teal bg-teal-tint" : "border-line bg-surface hover:border-teal"}`}
        style={{ ["--crop-inset" as string]: "8px" }}
      >
        <Icon name="upload" />
        <span className="font-semibold">
          {busy ? "Reading file…" : over ? "Drop to upload" : <>Drag a file here or <span className="text-teal underline">browse</span></>}
        </span>
        <span id={capId} className="caption">
          PNG, JPG, PDF, AI or EPS. Up to 50 MB. 300 DPI and a transparent background work best.
        </span>
        <input
          id={inputId} type="file" accept={ACCEPT.join(",")} className="sr-only-input"
          aria-labelledby={`${inputId}-l`} aria-describedby={error ? `${capId} ${errId}` : capId}
          onChange={(e) => handle(e.target.files?.[0])}
        />
      </label>
      {error && (
        <p id={errId} role="alert" className="field-error">
          <Icon name="alert" size={16} className="mt-0.5 text-error" /><span>{error}</span>
        </p>
      )}
    </div>
  );
}
