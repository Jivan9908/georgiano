"use client";

import { useState } from "react";
import { emailPattern, type FieldErrors, TextAreaField, TextField } from "./form-controls";

const initial = { name: "", email: "", phone: "", subject: "", message: "" };

export function ContactForm() {
  const [values, setValues] = useState(initial);
  const [errors, setErrors] = useState<FieldErrors>({});
  const [notice, setNotice] = useState("");
  const update = (key: keyof typeof initial, value: string) => { setValues((current) => ({ ...current, [key]: value })); setErrors((current) => ({ ...current, [key]: "" })); setNotice(""); };
  const submit = (event: React.FormEvent) => {
    event.preventDefault();
    const next: FieldErrors = {};
    if (!values.name.trim()) next.name = "Enter your name.";
    if (!emailPattern.test(values.email)) next.email = "Enter a valid email address.";
    if (!values.subject.trim()) next.subject = "Enter a subject.";
    if (!values.message.trim()) next.message = "Enter your message.";
    setErrors(next);
    setNotice(Object.keys(next).length ? "Please review the highlighted fields." : "Development preview only — this message has not been sent or stored.");
  };
  return <form className="public-form" noValidate onSubmit={submit}><div className="form-grid"><TextField label="Name" name="name" autoComplete="name" required value={values.name} error={errors.name} onChange={(event) => update("name", event.target.value)} /><TextField label="Email" name="email" type="email" autoComplete="email" required value={values.email} error={errors.email} onChange={(event) => update("email", event.target.value)} /><TextField label="Phone" name="phone" type="tel" autoComplete="tel" value={values.phone} onChange={(event) => update("phone", event.target.value)} /><TextField label="Subject" name="subject" required value={values.subject} error={errors.subject} onChange={(event) => update("subject", event.target.value)} /><TextAreaField label="Message" name="message" rows={7} required value={values.message} error={errors.message} onChange={(event) => update("message", event.target.value)} /></div><button className="button" type="submit">Check message</button><p className="form-disclaimer">Development interaction only. No message will be sent.</p>{notice ? <p className="form-notice" role="status">{notice}</p> : null}</form>;
}
