"use client";

import { forwardRef, type InputHTMLAttributes } from "react";

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  hint?: string;
}

export const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ label, error, hint, className = "", id, ...props }, ref) => {
    const inputId = id || label?.toLowerCase().replace(/\s+/g, "-");

    return (
      <div className="flex flex-col gap-1.5">
        {label && (
          <label
            htmlFor={inputId}
            className="text-sm font-medium text-[var(--foreground)]"
          >
            {label}
          </label>
        )}
        <input
          ref={ref}
          id={inputId}
          className={`
            w-full px-4 py-3 text-sm
            bg-[var(--surface)] border
            rounded-[var(--radius-md)]
            text-[var(--foreground)]
            placeholder:text-[var(--muted)]
            transition-all duration-[var(--transition-fast)]
            focus:outline-none focus:ring-2 focus:ring-[var(--accent)] focus:border-[var(--accent)]
            disabled:opacity-50 disabled:cursor-not-allowed disabled:bg-[var(--neutral-100)]
            ${error ? "border-[var(--error)] focus:ring-[var(--error)] focus:border-[var(--error)]" : "border-[var(--border)] hover:border-[var(--border-strong)]"}
            ${className}
          `}
          aria-invalid={!!error}
          aria-describedby={error ? `${inputId}-error` : hint ? `${inputId}-hint` : undefined}
          {...props}
        />
        {error && (
          <span id={`${inputId}-error`} className="text-xs text-[var(--error)]" role="alert">
            {error}
          </span>
        )}
        {hint && !error && (
          <span id={`${inputId}-hint`} className="text-xs text-[var(--muted)]">
            {hint}
          </span>
        )}
      </div>
    );
  }
);

Input.displayName = "Input";
