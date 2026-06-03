// Aniq brend SVG logolari — matn yo'q, faqat logo

export function AppleLogo({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" className={className}>
      <path d="M12.152 6.896c-.948 0-2.415-1.078-3.96-1.04-2.04.027-3.91 1.183-4.961 3.014-2.117 3.675-.546 9.103 1.519 12.09 1.013 1.454 2.208 3.09 3.792 3.039 1.52-.065 2.09-.987 3.935-.987 1.831 0 2.35.987 3.96.948 1.637-.026 2.676-1.48 3.676-2.948 1.156-1.688 1.636-3.325 1.662-3.415-.039-.013-3.182-1.221-3.22-4.857-.026-3.04 2.48-4.494 2.597-4.559-1.429-2.09-3.623-2.324-4.39-2.376-2-.156-3.675 1.09-4.61 1.09zM15.53 3.83c.843-1.012 1.4-2.427 1.245-3.83-1.207.052-2.662.805-3.532 1.818-.78.896-1.454 2.338-1.273 3.714 1.338.104 2.715-.688 3.559-1.701" />
    </svg>
  )
}

export function SamsungLogo({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 110 18" fill="currentColor" className={className}>
      <text
        x="55" y="14"
        textAnchor="middle"
        fontFamily="Arial, sans-serif"
        fontWeight="700"
        fontSize="14"
        letterSpacing="2.5"
      >
        SAMSUNG
      </text>
    </svg>
  )
}

export function XiaomiLogo({ className }: { className?: string }) {
  // Mi squircle logo — Xiaomi ning rasmiy MI logotipi
  return (
    <svg viewBox="0 0 48 48" fill="none" className={className}>
      {/* Squircle background */}
      <rect x="2" y="2" width="44" height="44" rx="14" fill="#FF6900" />
      {/* "mi" text paths — Xiaomi Mi logosi */}
      <text
        x="24" y="32"
        textAnchor="middle"
        fontFamily="Arial, sans-serif"
        fontWeight="900"
        fontSize="20"
        fill="white"
        letterSpacing="-0.5"
      >
        mi
      </text>
    </svg>
  )
}

export function RedmiLogo({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 90 22" fill="currentColor" className={className}>
      <text
        x="45" y="17"
        textAnchor="middle"
        fontFamily="Arial, sans-serif"
        fontWeight="700"
        fontSize="16"
        letterSpacing="0.5"
      >
        Redmi
      </text>
    </svg>
  )
}

export function RealmeLogo({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 90 22" fill="currentColor" className={className}>
      <text
        x="45" y="17"
        textAnchor="middle"
        fontFamily="Arial, sans-serif"
        fontWeight="700"
        fontSize="15"
        letterSpacing="0.3"
      >
        realme
      </text>
    </svg>
  )
}

export function OppoLogo({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 80 22" fill="currentColor" className={className}>
      <text
        x="40" y="17"
        textAnchor="middle"
        fontFamily="Arial, sans-serif"
        fontWeight="800"
        fontSize="16"
        letterSpacing="1"
      >
        OPPO
      </text>
    </svg>
  )
}

export const BRAND_LOGOS: Record<string, React.FC<{ className?: string }>> = {
  Apple:   AppleLogo,
  Samsung: SamsungLogo,
  Xiaomi:  XiaomiLogo,
  Redmi:   RedmiLogo,
  Realme:  RealmeLogo,
  OPPO:    OppoLogo,
}
