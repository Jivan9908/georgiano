"use client";

import { useState } from "react";
import { emailPattern, type FieldErrors, SelectField, TextAreaField, TextField } from "./form-controls";

type ReservationData = {
  partySize: string; date: string; time: string; name: string; email: string;
  phone: string; occasion: string; requests: string;
};

const initialData: ReservationData = { partySize: "", date: "", time: "", name: "", email: "", phone: "", occasion: "", requests: "" };
const steps = ["Party size", "Date", "Time", "Guest details", "Review"];
const demoTimes = ["5:00 PM", "5:45 PM", "6:30 PM", "7:15 PM", "8:00 PM", "8:45 PM"];

export function ReservationFlow() {
  const [step, setStep] = useState(0);
  const [data, setData] = useState(initialData);
  const [errors, setErrors] = useState<FieldErrors>({});
  const [notice, setNotice] = useState("");

  const setValue = (key: keyof ReservationData, value: string) => {
    setData((current) => ({ ...current, [key]: value }));
    setErrors((current) => ({ ...current, [key]: "" }));
    setNotice("");
  };

  const validateStep = () => {
    const nextErrors: FieldErrors = {};
    if (step === 0 && !data.partySize) nextErrors.partySize = "Choose a party size.";
    if (step === 1 && !data.date) nextErrors.date = "Choose a preferred date.";
    if (step === 2 && !data.time) nextErrors.time = "Choose a demonstration time.";
    if (step === 3) {
      if (!data.name.trim()) nextErrors.name = "Enter your name.";
      if (!emailPattern.test(data.email)) nextErrors.email = "Enter a valid email address.";
      if (!data.phone.trim()) nextErrors.phone = "Enter your phone number.";
    }
    setErrors(nextErrors);
    return Object.keys(nextErrors).length === 0;
  };

  const next = () => {
    if (!validateStep()) return;
    setStep((current) => Math.min(current + 1, steps.length - 1));
  };

  const reviewDemo = () => setNotice("Development preview only — no reservation has been submitted or confirmed.");

  return <section className="reservation-panel" aria-labelledby="reservation-flow-title">
    <div className="reservation-progress" aria-label="Reservation steps">{steps.map((label, index) => <button key={label} type="button" disabled={index > step} className={index === step ? "is-active" : index < step ? "is-complete" : ""} aria-current={index === step ? "step" : undefined} onClick={() => index < step && setStep(index)}><span>{String(index + 1).padStart(2, "0")}</span>{label}</button>)}</div>
    <div className="reservation-card">
      <p className="eyebrow">Step {step + 1} of {steps.length}</p>
      <h2 id="reservation-flow-title">{steps[step]}</h2>
      {step === 0 ? <div className="form-grid"><SelectField label="Party size" name="partySize" value={data.partySize} error={errors.partySize} required onChange={(event) => setValue("partySize", event.target.value)}><option value="">Select guests</option>{Array.from({ length: 12 }, (_, index) => <option key={index + 1} value={String(index + 1)}>{index + 1} {index === 0 ? "guest" : "guests"}</option>)}</SelectField></div> : null}
      {step === 1 ? <div className="form-grid"><TextField label="Date" name="date" type="date" value={data.date} error={errors.date} required hint="Dates are displayed in America/Los_Angeles time." onChange={(event) => setValue("date", event.target.value)} /></div> : null}
      {step === 2 ? <fieldset className="time-fieldset"><legend>Available time <span>Demo availability</span></legend><p>These times are for interface development only and do not represent live availability.</p><div className="time-options">{demoTimes.map((time) => <button key={time} type="button" className={data.time === time ? "is-selected" : ""} aria-pressed={data.time === time} onClick={() => setValue("time", time)}>{time}</button>)}</div>{errors.time ? <p className="field-error">{errors.time}</p> : null}</fieldset> : null}
      {step === 3 ? <div className="form-grid"><TextField label="Name" name="name" autoComplete="name" value={data.name} error={errors.name} required onChange={(event) => setValue("name", event.target.value)} /><TextField label="Email" name="email" type="email" autoComplete="email" value={data.email} error={errors.email} required onChange={(event) => setValue("email", event.target.value)} /><TextField label="Phone" name="phone" type="tel" autoComplete="tel" value={data.phone} error={errors.phone} required onChange={(event) => setValue("phone", event.target.value)} /><SelectField label="Special occasion" name="occasion" value={data.occasion} onChange={(event) => setValue("occasion", event.target.value)}><option value="">None selected</option><option>Birthday</option><option>Anniversary</option><option>Business dinner</option><option>Other gathering</option></SelectField><TextAreaField label="Special requests" name="requests" rows={5} value={data.requests} onChange={(event) => setValue("requests", event.target.value)} /></div> : null}
      {step === 4 ? <div className="reservation-review"><p className="development-banner">Review only · live confirmation is unavailable during Stage 4 development.</p><dl><div><dt>Party</dt><dd>{data.partySize} guests</dd></div><div><dt>Date</dt><dd>{data.date}</dd></div><div><dt>Demo time</dt><dd>{data.time}</dd></div><div><dt>Guest</dt><dd>{data.name}</dd></div><div><dt>Contact</dt><dd>{data.email}<br />{data.phone}</dd></div><div><dt>Occasion</dt><dd>{data.occasion || "Not specified"}</dd></div><div className="wide"><dt>Special requests</dt><dd>{data.requests || "None"}</dd></div></dl></div> : null}
      <div className="form-actions">{step > 0 ? <button className="text-button" type="button" onClick={() => { setStep((current) => current - 1); setNotice(""); }}>Back</button> : <span />}{step < 4 ? <button className="button" type="button" onClick={next}>Continue</button> : <button className="button" type="button" onClick={reviewDemo}>Check development summary</button>}</div>
      {notice ? <p className="form-notice" role="status">{notice}</p> : null}
    </div>
  </section>;
}
