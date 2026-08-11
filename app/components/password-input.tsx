"use client";

import { forwardRef, useState } from "react";

import { useDictionary } from "@/app/lib/i18n/dictionary-context";

type PasswordInputProps = {
  name: string;
  autoComplete: string;
  placeholder?: string;
  required?: boolean;
};

export const PasswordInput = forwardRef<HTMLInputElement, PasswordInputProps>(
  function PasswordInput({ name, autoComplete, placeholder, required }, ref) {
    const [visible, setVisible] = useState(false);
    const { dict } = useDictionary();
    const { shared } = dict.auth;

    return (
      <div className="relative">
        <input
          ref={ref}
          type={visible ? "text" : "password"}
          name={name}
          required={required}
          autoComplete={autoComplete}
          placeholder={placeholder}
          className="w-full border border-ink/30 bg-paper px-3 py-2 pr-10 text-sm text-ink outline-none focus:border-rust dark:border-ink-dark/30 dark:bg-paper-dark dark:text-ink-dark"
        />
        <button
          type="button"
          onClick={() => setVisible((current) => !current)}
          aria-label={visible ? shared.hidePassword : shared.showPassword}
          className="absolute inset-y-0 right-0 flex w-10 items-center justify-center text-ink/50 hover:text-ink dark:text-ink-dark/50 dark:hover:text-ink-dark"
        >
          {visible ? (
            <EyeOffIcon className="h-4 w-4" />
          ) : (
            <EyeIcon className="h-4 w-4" />
          )}
        </button>
      </div>
    );
  },
);

function EyeIcon({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      className={className}
    >
      <path d="M2 12S5.6 5 12 5s10 7 10 7-3.6 7-10 7-10-7-10-7Z" />
      <circle cx="12" cy="12" r="3" />
    </svg>
  );
}

function EyeOffIcon({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      className={className}
    >
      <path d="M3 3l18 18" />
      <path d="M10.6 5.1A10.9 10.9 0 0 1 12 5c6.4 0 10 7 10 7a18 18 0 0 1-3.4 4.3M6.7 6.7C4 8.5 2 12 2 12s3.6 7 10 7a10 10 0 0 0 4.3-.9" />
      <path d="M9.5 9.7A3 3 0 0 0 12 15a3 3 0 0 0 2.3-1.1" />
    </svg>
  );
}
