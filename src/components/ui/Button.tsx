import type { ButtonHTMLAttributes } from "react";

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "secondary" | "ghost";
  fullWidth?: boolean;
  isLoading?: boolean;
  loadingText?: string;
}

export function Button({
  variant = "primary",
  fullWidth,
  className = "",
  children,
  isLoading,
  loadingText,
  disabled,
  ...props
}: ButtonProps) {
  const base =
    "inline-flex items-center justify-center rounded-lg px-6 py-3 text-base font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-50 disabled:pointer-events-none";
  const variants = {
    primary: "bg-neutral-900 text-white hover:bg-neutral-800 focus:ring-neutral-900",
    secondary: "bg-neutral-100 text-neutral-900 hover:bg-neutral-200 focus:ring-neutral-500 border border-neutral-200",
    ghost: "text-neutral-900 hover:bg-neutral-100 focus:ring-neutral-500",
  };
  const isDisabled = disabled || isLoading;
  const spinner = (
    <span className="mr-2 inline-flex h-4 w-4 items-center justify-center text-current">
      <span className="h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent" />
    </span>
  );

  return (
    <button
      className={`${base} ${variants[variant]} ${fullWidth ? "w-full" : ""} ${className}`}
      disabled={isDisabled}
      {...props}
    >
      {isLoading ? (
        <>
          {spinner}
          {loadingText ?? "Loading..."}
        </>
      ) : (
        children
      )}
    </button>
  );
}
