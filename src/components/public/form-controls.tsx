import type { InputHTMLAttributes, SelectHTMLAttributes, TextareaHTMLAttributes } from "react";

export type FieldErrors = Record<string, string>;

type CommonProps = { label: string; name: string; error?: string; hint?: string };

export function TextField({ label, name, error, hint, ...props }: CommonProps & InputHTMLAttributes<HTMLInputElement>) {
  const helpId = `${name}-${error ? "error" : "hint"}`;
  return <div className="form-field"><label htmlFor={name}>{label}{props.required ? <span aria-hidden="true"> *</span> : null}</label><input id={name} name={name} aria-invalid={Boolean(error)} aria-describedby={error || hint ? helpId : undefined} {...props} />{error ? <p className="field-error" id={helpId}>{error}</p> : hint ? <p className="field-hint" id={helpId}>{hint}</p> : null}</div>;
}

export function SelectField({ label, name, error, children, ...props }: CommonProps & SelectHTMLAttributes<HTMLSelectElement>) {
  const errorId = `${name}-error`;
  return <div className="form-field"><label htmlFor={name}>{label}{props.required ? <span aria-hidden="true"> *</span> : null}</label><select id={name} name={name} aria-invalid={Boolean(error)} aria-describedby={error ? errorId : undefined} {...props}>{children}</select>{error ? <p className="field-error" id={errorId}>{error}</p> : null}</div>;
}

export function TextAreaField({ label, name, error, ...props }: CommonProps & TextareaHTMLAttributes<HTMLTextAreaElement>) {
  const errorId = `${name}-error`;
  return <div className="form-field form-field--wide"><label htmlFor={name}>{label}{props.required ? <span aria-hidden="true"> *</span> : null}</label><textarea id={name} name={name} aria-invalid={Boolean(error)} aria-describedby={error ? errorId : undefined} {...props} />{error ? <p className="field-error" id={errorId}>{error}</p> : null}</div>;
}

export const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
