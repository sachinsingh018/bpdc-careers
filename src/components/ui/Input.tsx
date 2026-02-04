import type { InputHTMLAttributes } from "react";

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
}

export function Input({ label, error, id, className = "", ...props }: InputProps) {
  const inputId = id ?? label?.toLowerCase().replace(/\s/g, "-");
  return (
    <div className="w-full">
      {label && (
        <label htmlFor={inputId} className="mb-1.5 block text-sm font-medium text-neutral-700">
          {label}
        </label>
      )}
      <input
        id={inputId}
        className={`w-full rounded-lg border border-neutral-300 px-4 py-3 text-base text-neutral-900 placeholder:text-neutral-400 focus:border-neutral-900 focus:outline-none focus:ring-1 focus:ring-neutral-900 ${error ? "border-red-500" : ""} ${className}`}
        {...props}
      />
      {error && <p className="mt-1 text-sm text-red-600">{error}</p>}
    </div>
  );
}
