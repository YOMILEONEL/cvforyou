// Friendly robot face — marks anything related to the AI job-match feature
// so it reads as "AI-powered" at a glance (nav item, landing-page card,
// panel intro, onboarding tip).
export function RobotIcon({ className = "h-6 w-6" }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 24 24"
      aria-hidden="true"
      className={className}
      fill="none"
      stroke="currentColor"
      strokeWidth="1.6"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M12 2v3" />
      <circle cx="12" cy="1.6" r="0.9" fill="currentColor" stroke="none" />
      <rect x="4.5" y="5" width="15" height="13" rx="3.5" />
      <circle cx="9" cy="11.2" r="1.3" fill="currentColor" stroke="none" />
      <circle cx="15" cy="11.2" r="1.3" fill="currentColor" stroke="none" />
      <path d="M9 15h6" />
      <path d="M1.5 10h3" />
      <path d="M19.5 10h3" />
    </svg>
  );
}
