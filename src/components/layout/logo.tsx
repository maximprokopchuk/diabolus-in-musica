export function Logo({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 32 32"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      aria-hidden="true"
    >
      {/*
        The Tritone Glyph
        ─────────────────
        Two noteheads represent the two pitches of the tritone interval
        (augmented fourth — the "diabolus in musica").

        Upper notehead: sits high-right, stem rising and curling left
        like a devil's horn / serpent tail.

        Lower notehead: sits low-left, completing the falling tritone.

        A single sinuous S-curve connects them — the forbidden interval
        made visible. The upper stem tip curls into a flag, echoing a
        treble-clef swash and a horn simultaneously.

        Both noteheads are filled currentColor.
        The connecting arc is stroked currentColor (thinner).
        One small accent dot (the flag tip) uses text-primary via
        a CSS variable trick — left as currentColor so the parent
        can colorize the whole glyph at once.
      */}

      {/* ── Lower notehead (tritone root) — tilted ellipse, low-left ── */}
      <ellipse
        cx="10"
        cy="23.5"
        rx="4"
        ry="2.8"
        transform="rotate(-18 10 23.5)"
        fill="currentColor"
      />

      {/* ── Lower stem — rises from right edge of lower notehead ── */}
      <line
        x1="13.6"
        y1="22.2"
        x2="13.6"
        y2="11"
        stroke="currentColor"
        strokeWidth="1.9"
        strokeLinecap="round"
      />

      {/* ── Connecting S-curve arc between the two pitch levels ──
           Starts at the top of the lower stem (13.6, 11),
           swings left through the midpoint, arrives at the
           bottom of the upper stem (19, 14).
           This is the "serpent" / tritone leap made visible.      ── */}
      <path
        d="M13.6 11 C11 7, 21 7, 19 14"
        stroke="currentColor"
        strokeWidth="1.7"
        strokeLinecap="round"
        fill="none"
      />

      {/* ── Upper stem — descends from arc landing into upper notehead ── */}
      <line
        x1="19"
        y1="14"
        x2="19"
        y2="19.8"
        stroke="currentColor"
        strokeWidth="1.9"
        strokeLinecap="round"
      />

      {/* ── Upper notehead (tritone fifth) — tilted ellipse, upper-right ── */}
      <ellipse
        cx="15.2"
        cy="21.2"
        rx="4"
        ry="2.8"
        transform="rotate(-18 15.2 21.2)"
        fill="currentColor"
      />

      {/* ── Horn/flag curl at top of lower stem (the "devil" flourish) ──
           A small swash curling left off the top of the lower stem,
           referencing both a note flag and a devil's horn tip.          ── */}
      <path
        d="M13.6 11 C12.4 8.5, 9.5 8, 9 6"
        stroke="currentColor"
        strokeWidth="1.6"
        strokeLinecap="round"
        fill="none"
      />

      {/* ── Accent dot — tip of the horn curl ──
           A small filled circle at the end of the swash
           acts as a visual period / the "point" of the devil's horn.   ── */}
      <circle
        cx="9"
        cy="6"
        r="1.1"
        fill="currentColor"
        className="text-primary"
        style={{ fill: "var(--color-primary, currentColor)" }}
      />
    </svg>
  );
}

/**
 * Simplified favicon variant — readable at 16×16.
 *
 * Strips the S-curve connector and the horn flourish.
 * Keeps only the two bold noteheads + a single straight
 * connecting stem: the tritone interval at a glance.
 */
export function LogoFavicon({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 16 16"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      aria-hidden="true"
    >
      {/* Lower notehead */}
      <ellipse
        cx="5"
        cy="12.5"
        rx="2.8"
        ry="1.9"
        transform="rotate(-18 5 12.5)"
        fill="currentColor"
      />

      {/* Shared stem */}
      <line
        x1="7.4"
        y1="11.4"
        x2="7.4"
        y2="4"
        stroke="currentColor"
        strokeWidth="1.4"
        strokeLinecap="round"
      />

      {/* Cross beam — the augmented-fourth "interval bar" */}
      <line
        x1="7.4"
        y1="7"
        x2="10.5"
        y2="7"
        stroke="currentColor"
        strokeWidth="1.2"
        strokeLinecap="round"
      />

      {/* Upper notehead */}
      <ellipse
        cx="9.2"
        cy="10"
        rx="2.8"
        ry="1.9"
        transform="rotate(-18 9.2 10)"
        fill="currentColor"
      />
    </svg>
  );
}
