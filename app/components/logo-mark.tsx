export function LogoMark({ className = "h-6 w-6" }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 32 32"
      aria-hidden="true"
      className={`rotate-[-8deg] ${className}`}
    >
      <circle
        cx="16"
        cy="16"
        r="13"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeDasharray="3 3"
      />
      <path
        d="M10 16.5l4 4 8-9"
        fill="none"
        stroke="currentColor"
        strokeWidth="2.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}
