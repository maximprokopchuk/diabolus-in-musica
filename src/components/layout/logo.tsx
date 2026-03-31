export function Logo({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 32 32"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      aria-hidden="true"
    >
      {/* Left horn — curved */}
      <path
        d="M14 18 C13 14, 10 10, 7 3"
        stroke="currentColor"
        strokeWidth="2.2"
        strokeLinecap="round"
        fill="none"
      />
      {/* Right horn — curved */}
      <path
        d="M18 18 C19 14, 22 10, 25 3"
        stroke="currentColor"
        strokeWidth="2.2"
        strokeLinecap="round"
        fill="none"
      />
      {/* Horn tips flare left */}
      <path
        d="M7 3 C5.5 5, 4 5.5, 3 5"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
        fill="none"
      />
      {/* Horn tips flare right */}
      <path
        d="M25 3 C26.5 5, 28 5.5, 29 5"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
        fill="none"
      />
      {/* Note head — solid ellipse rotated */}
      <ellipse
        cx="16"
        cy="24"
        rx="7"
        ry="5"
        transform="rotate(-12 16 24)"
        fill="currentColor"
      />
      {/* Stem */}
      <line
        x1="22"
        y1="22"
        x2="22"
        y2="11"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
      />
    </svg>
  );
}
