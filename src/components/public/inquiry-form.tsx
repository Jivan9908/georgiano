"use client";

import { useState } from "react";
import { emailPattern, type FieldErrors, SelectField, TextAreaField, TextField } from "./form-controls";

const initial = { name: "", email: "", phone: "", eventType: "", date: "", guests: "", details: "" };

export function InquiryForm() {
  const [values, setValues] = useState(initial);
  const [errors, setErrors] = useState<FieldErrors>({});
  const [notice, setNotice] = useState("");
  const update = (key: keyof typeof initial, value: string) => { setValues((current) => ({ ...current, [key]: value })); setErrors((current) => ({ ...current, [key]: "" })); setNotice(""); };
  const submit = (event: React.FormEvent) => {
    event.preventDefault();
    const next: FieldErrors = {};
    if (!values.name.trim()) next.name = "Enter your full name.";
    if (!emailPattern.test(values.email)) next.email = "Enter a valid email address.";
    if (!values.phone.trim()) next.phone = "Enter your phone number.";
    if (!values.eventType) next.eventType = "Choose an event type.";
    if (!values.date) next.date = "Choose a preferred date.";
    if (!values.guests.trim()) next.guests = "Enter an estimated guest count.";
    setErrors(next);
    setNotice(Object.keys(next).length ? "Please review the highlighted fields." : "Development preview only — this inquiry has not been sent or stored.");
  };
  return <form className="public-form" noValidate onSubmit={submit}><div className="form-grid"><TextField label="Full name" name="name" autoComplete="name" required value={values.name} error={errors.name} onChange={(event) => update("name", event.target.value)} /><TextField label="Email" name="email" type="email" autoComplete="email" required value={values.email} error={errors.email} onChange={(event) => update("email", event.target.value)} /><TextField label="Phone" name="phone" type="tel" autoComplete="tel" required value={values.phone} error={errors.phone} onChange={(event) => update("phone", event.target.value)} /><SelectField label="Event type" name="eventType" required value={values.eventType} error={errors.eventType} onChange={(event) => update("eventType", event.target.value)}><option value="">Select an event</option><option>Celebration</option><option>Wedding gathering</option><option>Corporate dinner</option><option>Family occasion</option><option>Other</option></SelectField><TextField label="Preferred date" name="date" type="date" required value={values.date} error={errors.date} onChange={(event) => update("date", event.target.value)} /><TextField label="Guest count" name="guests" type="number" min="1" inputMode="numeric" required value={values.guests} error={errors.guests} onChange={(event) => update("guests", event.target.value)} /><TextAreaField label="Event details" name="details" rows={6} value={values.details} onChange={(event) => update("details", event.target.value)} /></div><button className="button" type="submit">Check inquiry details</button><p className="form-disclaimer">Development interaction only. No inquiry will be sent.</p>{notice ? <p className="form-notice" role="status">{notice}</p> : null}</form>;
}
