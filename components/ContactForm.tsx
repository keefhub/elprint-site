"use client";

import { useRef, useState } from "react";
import { business, mailtoLink, whatsappLink } from "@/lib/site";
import type { ArtworkMeta } from "@/lib/pricing";
import { ErrorSummary, Field } from "./Field";
import { UploadZone } from "./UploadZone";

const inquiryTypes = [
  "Quote for a custom order",
  "Bulk or company order",
  "Help with my artwork",
  "An order I already placed",
  "Delivery or collection",
  "Something else",
];

export function ContactForm() {
  const [v, setV] = useState({ name: "", email: "", phone: "", type: inquiryTypes[0], message: "" });
  const [file, setFile] = useState<ArtworkMeta>();
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [sent, setSent] = useState(false);
  const summaryRef = useRef<HTMLDivElement>(null);
  const set = (patch: Partial<typeof v>) => setV((x) => ({ ...x, ...patch }));

  function submit(e: React.FormEvent) {
    e.preventDefault();
    const er: Record<string, string> = {};
    if (!v.name.trim()) er.name = "Enter your name.";
    if (!/^\S+@\S+\.\S+$/.test(v.email.trim())) er.email = "Enter an email address like name@example.com.";
    if (v.phone && v.phone.replace(/\D/g, "").length < 8) er.phone = "Enter a phone number with at least 8 digits, or leave it blank.";
    if (v.message.trim().length < 10) er.message = "Tell us a little more. Write at least a short sentence.";
    setErrors(er);
    if (Object.keys(er).length) {
      window.requestAnimationFrame(() => summaryRef.current?.focus());
      return;
    }
    setSent(true);
  }

  const subject = `${v.type} from ${v.name}`;
  const body = [
    v.message.trim(), "", `Name: ${v.name}`, `Email: ${v.email}`, v.phone ? `Phone: ${v.phone}` : "",
    file ? `Artwork: ${file.name} (please attach it to this email)` : "",
  ].filter(Boolean).join("\n");

  if (sent) {
    return (
      <div className="card p-6" role="status">
        <h2 className="text-xl">Your message is ready to send</h2>
        <p className="mt-2">
          This site has no server, so nothing has been sent yet. Choose how to send it to EL Print.
          {file && " Attach your artwork file to the email."}
        </p>
        <div className="mt-4 flex flex-wrap gap-3">
          <a href={mailtoLink(subject, body)} className="btn btn-primary btn-lg">Email {business.email}</a>
          <a href={whatsappLink(`${subject}\n\n${body}`)} target="_blank" rel="noreferrer" className="btn btn-secondary btn-lg">Send on WhatsApp</a>
        </div>
        <button type="button" className="btn btn-ghost mt-4 -ml-3" onClick={() => setSent(false)}>Edit message</button>
      </div>
    );
  }

  return (
    <form noValidate onSubmit={submit} className="max-w-[600px] space-y-5" aria-label="Contact form">
      <ErrorSummary errors={Object.values(errors).map((message) => ({ message }))} headingRef={summaryRef} />
      <Field label="Name" required error={errors.name}>
        {(p) => <input {...p} autoComplete="name" value={v.name} onChange={(e) => set({ name: e.target.value })} />}
      </Field>
      <Field label="Email" required error={errors.email}>
        {(p) => <input {...p} type="email" autoComplete="email" value={v.email} onChange={(e) => set({ email: e.target.value })} />}
      </Field>
      <Field label="Phone (optional)" error={errors.phone}>
        {(p) => <input {...p} type="tel" autoComplete="tel" value={v.phone} onChange={(e) => set({ phone: e.target.value })} />}
      </Field>
      <Field label="What do you need?">
        {(p) => (
          <select {...p} value={v.type} onChange={(e) => set({ type: e.target.value })}>
            {inquiryTypes.map((t) => <option key={t}>{t}</option>)}
          </select>
        )}
      </Field>
      <Field label="Message" required error={errors.message} hint="Include what you want printed, how many pieces and when you need them.">
        {(p) => <textarea {...p} rows={5} value={v.message} onChange={(e) => set({ message: e.target.value })} />}
      </Field>
      <UploadZone compact label="Artwork (optional)" value={file} onChange={setFile} />
      <button type="submit" className="btn btn-primary btn-lg">Send message</button>
    </form>
  );
}
