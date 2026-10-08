import type { SVGProps } from "react";

type IconProps = SVGProps<SVGSVGElement> & { size?: number };

const base = (size = 20) => ({
  width: size,
  height: size,
  viewBox: "0 0 24 24",
  fill: "none",
  stroke: "currentColor",
  strokeWidth: 1.8,
  strokeLinecap: "round" as const,
  strokeLinejoin: "round" as const,
});

export function IconHome(p: IconProps) {
  const { size = 20, ...rest } = p;
  return (
    <svg {...base(size)} {...rest}>
      <path d="M3 10.5 12 3l9 7.5" />
      <path d="M5 10v9a1 1 0 0 0 1 1h4v-6h4v6h4a1 1 0 0 0 1-1v-9" />
    </svg>
  );
}

export function IconTransfer(p: IconProps) {
  const { size = 20, ...rest } = p;
  return (
    <svg {...base(size)} {...rest}>
      <path d="M7 7h13M16 3l4 4-4 4" />
      <path d="M17 17H4M8 13l-4 4 4 4" />
    </svg>
  );
}

export function IconGlobe(p: IconProps) {
  const { size = 20, ...rest } = p;
  return (
    <svg {...base(size)} {...rest}>
      <circle cx="12" cy="12" r="9" />
      <path d="M3 12h18" />
      <path d="M12 3a14 14 0 0 1 0 18 14 14 0 0 1 0-18Z" />
    </svg>
  );
}

export function IconPlus(p: IconProps) {
  const { size = 20, ...rest } = p;
  return (
    <svg {...base(size)} {...rest}>
      <path d="M12 5v14M5 12h14" />
    </svg>
  );
}

export function IconWallet(p: IconProps) {
  const { size = 20, ...rest } = p;
  return (
    <svg {...base(size)} {...rest}>
      <rect x="3" y="6" width="18" height="13" rx="2" />
      <path d="M3 10h18" />
      <path d="M16 14.5h.01" />
    </svg>
  );
}

export function IconCard(p: IconProps) {
  const { size = 20, ...rest } = p;
  return (
    <svg {...base(size)} {...rest}>
      <rect x="2.5" y="5" width="19" height="14" rx="2" />
      <path d="M2.5 9.5h19" />
      <path d="M7 15h3" />
    </svg>
  );
}

export function IconPayments(p: IconProps) {
  const { size = 20, ...rest } = p;
  return (
    <svg {...base(size)} {...rest}>
      <path d="M8 7h11a2 2 0 0 1 2 2v10H8a2 2 0 0 1-2-2V7Z" />
      <path d="M6 17V7a2 2 0 0 1 2-2h8" />
      <path d="M11 11h6M11 15h4" />
    </svg>
  );
}

export function IconCoins(p: IconProps) {
  const { size = 20, ...rest } = p;
  return (
    <svg {...base(size)} {...rest}>
      <ellipse cx="12" cy="6" rx="7" ry="3" />
      <path d="M5 6v4c0 1.7 3.1 3 7 3s7-1.3 7-3V6" />
      <path d="M5 10v4c0 1.7 3.1 3 7 3s7-1.3 7-3v-4" />
    </svg>
  );
}

export function IconGear(p: IconProps) {
  const { size = 20, ...rest } = p;
  return (
    <svg {...base(size)} {...rest}>
      <circle cx="12" cy="12" r="3" />
      <path d="M12 3.5v2.2M12 18.3v2.2M4.9 6.5l1.6 1.6M17.5 15.9l1.6 1.6M3.5 12h2.2M18.3 12h2.2M4.9 17.5l1.6-1.6M17.5 8.1l1.6-1.6" />
    </svg>
  );
}

export function IconChart(p: IconProps) {
  const { size = 20, ...rest } = p;
  return (
    <svg {...base(size)} {...rest}>
      <path d="M4 19V5" />
      <path d="M4 19h16" />
      <path d="M8 16v-5M12 16V8M16 16v-8" />
    </svg>
  );
}

export function IconBell(p: IconProps) {
  const { size = 20, ...rest } = p;
  return (
    <svg {...base(size)} {...rest}>
      <path d="M6 9a6 6 0 1 1 12 0c0 7 2 8 2 8H4s2-1 2-8Z" />
      <path d="M10 20a2 2 0 0 0 4 0" />
    </svg>
  );
}

export function IconSearch(p: IconProps) {
  const { size = 20, ...rest } = p;
  return (
    <svg {...base(size)} {...rest}>
      <circle cx="11" cy="11" r="7" />
      <path d="M20 20l-3.5-3.5" />
    </svg>
  );
}

export function IconUser(p: IconProps) {
  const { size = 20, ...rest } = p;
  return (
    <svg {...base(size)} {...rest}>
      <circle cx="12" cy="8" r="3.2" />
      <path d="M5 19c1.2-3.2 3.6-5 7-5s5.8 1.8 7 5" />
    </svg>
  );
}

export function IconSend(p: IconProps) {
  const { size = 20, ...rest } = p;
  return (
    <svg {...base(size)} {...rest}>
      <path d="M4 12 20 4l-6 16-2.5-6.5L4 12Z" />
    </svg>
  );
}

export function IconX(p: IconProps) {
  const { size = 20, ...rest } = p;
  return (
    <svg {...base(size)} {...rest}>
      <path d="M6 6l12 12M18 6 6 18" />
    </svg>
  );
}

export function IconCheck(p: IconProps) {
  const { size = 20, ...rest } = p;
  return (
    <svg {...base(size)} {...rest}>
      <path d="M5 12.5 9.5 17 19 7" />
    </svg>
  );
}

export function IconFile(p: IconProps) {
  const { size = 20, ...rest } = p;
  return (
    <svg {...base(size)} {...rest}>
      <path d="M7 3h7l5 5v13a1 1 0 0 1-1 1H7a1 1 0 0 1-1-1V4a1 1 0 0 1 1-1Z" />
      <path d="M14 3v6h6" />
    </svg>
  );
}

export function IconCalendar(p: IconProps) {
  const { size = 20, ...rest } = p;
  return (
    <svg {...base(size)} {...rest}>
      <rect x="3.5" y="5" width="17" height="15" rx="2" />
      <path d="M8 3.5V7M16 3.5V7M3.5 10h17" />
    </svg>
  );
}

export function IconClock(p: IconProps) {
  const { size = 20, ...rest } = p;
  return (
    <svg {...base(size)} {...rest}>
      <circle cx="12" cy="12" r="9" />
      <path d="M12 7v5l3.5 2" />
    </svg>
  );
}

export function IconBank(p: IconProps) {
  const { size = 20, ...rest } = p;
  return (
    <svg {...base(size)} {...rest}>
      <path d="M3 10 12 4l9 6" />
      <path d="M5 10v8M9 10v8M15 10v8M19 10v8" />
      <path d="M3 18h18" />
    </svg>
  );
}

export function IconInfo(p: IconProps) {
  const { size = 20, ...rest } = p;
  return (
    <svg {...base(size)} {...rest}>
      <circle cx="12" cy="12" r="9" />
      <path d="M12 11v5M12 8h.01" />
    </svg>
  );
}

export function IconChevron(p: IconProps) {
  const { size = 20, ...rest } = p;
  return (
    <svg {...base(size)} {...rest}>
      <path d="M6 9l6 6 6-6" />
    </svg>
  );
}

export function IconMenu(p: IconProps) {
  const { size = 20, ...rest } = p;
  return (
    <svg {...base(size)} {...rest}>
      <path d="M4 7h16M4 12h16M4 17h16" />
    </svg>
  );
}

export function IconPrint(p: IconProps) {
  const { size = 20, ...rest } = p;
  return (
    <svg {...base(size)} {...rest}>
      <path d="M7 8V4h10v4" />
      <rect x="5" y="8" width="14" height="8" rx="1.5" />
      <path d="M7 16v4h10v-4" />
    </svg>
  );
}

export function IconDownload(p: IconProps) {
  const { size = 20, ...rest } = p;
  return (
    <svg {...base(size)} {...rest}>
      <path d="M12 4v12M7 11l5 5 5-5" />
      <path d="M5 20h14" />
    </svg>
  );
}

export function IconEye(p: IconProps) {
  const { size = 20, ...rest } = p;
  return (
    <svg {...base(size)} {...rest}>
      <path d="M2 12s3.5-7 10-7 10 7 10 7-3.5 7-10 7S2 12 2 12Z" />
      <circle cx="12" cy="12" r="3" />
    </svg>
  );
}

export function IconEyeOff(p: IconProps) {
  const { size = 20, ...rest } = p;
  return (
    <svg {...base(size)} {...rest}>
      <path d="M3 3l18 18" />
      <path d="M10.5 6.2A10 10 0 0 1 12 5c6.5 0 10 7 10 7a16 16 0 0 1-3.2 4.1" />
      <path d="M6.6 6.6C3.9 8.4 2 12 2 12s3.5 7 10 7a10 10 0 0 0 4.4-1" />
    </svg>
  );
}

export function IconLock(p: IconProps) {
  const { size = 20, ...rest } = p;
  return (
    <svg {...base(size)} {...rest}>
      <rect x="5" y="11" width="14" height="10" rx="2" />
      <path d="M8 11V8a4 4 0 0 1 8 0v3" />
    </svg>
  );
}

export function IconPhone(p: IconProps) {
  const { size = 20, ...rest } = p;
  return (
    <svg {...base(size)} {...rest}>
      <rect x="7" y="2.5" width="10" height="19" rx="2" />
      <path d="M11 18h2" />
    </svg>
  );
}

export function IconSpark(p: IconProps) {
  const { size = 20, ...rest } = p;
  return (
    <svg {...base(size)} {...rest}>
      <path d="M12 3l1.6 5.2L19 10l-5.4 1.8L12 17l-1.6-5.2L5 10l5.4-1.8L12 3Z" />
    </svg>
  );
}

export function IconCopy(p: IconProps) {
  const { size = 20, ...rest } = p;
  return (
    <svg {...base(size)} {...rest}>
      <rect x="8" y="8" width="12" height="12" rx="2" />
      <path d="M6 16H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1" />
    </svg>
  );
}

export function IconLogout(p: IconProps) {
  const { size = 20, ...rest } = p;
  return (
    <svg {...base(size)} {...rest}>
      <path d="M10 17H6a2 2 0 0 1-2-2V7a2 2 0 0 1 2-2h4" />
      <path d="M14 16l5-5-5-5M19 11H10" />
    </svg>
  );
}

export function IconShield(p: IconProps) {
  const { size = 20, ...rest } = p;
  return (
    <svg {...base(size)} {...rest}>
      <path d="M12 3 5 6v6c0 4.5 3.2 7.5 7 9 3.8-1.5 7-4.5 7-9V6l-7-3Z" />
      <path d="M9 12l2 2 4-4" />
    </svg>
  );
}

export function IconArrowLeft(p: IconProps) {
  const { size = 20, ...rest } = p;
  return (
    <svg {...base(size)} {...rest}>
      <path d="M19 12H5M11 6l-6 6 6 6" />
    </svg>
  );
}

export function IconSun(p: IconProps) {
  const { size = 20, ...rest } = p;
  return (
    <svg {...base(size)} {...rest}>
      <circle cx="12" cy="12" r="4" />
      <path d="M12 2v2M12 20v2M4.93 4.93l1.42 1.42m11.3 11.3 1.42 1.42M2 12h2m16 0h2M4.93 19.07l1.42-1.42m11.3-11.3 1.42-1.42" />
    </svg>
  );
}

export function IconMoon(p: IconProps) {
  const { size = 20, ...rest } = p;
  return (
    <svg {...base(size)} {...rest}>
      <path d="M20.2 15.6A8.5 8.5 0 0 1 8.4 3.8 8.5 8.5 0 1 0 20.2 15.6Z" />
    </svg>
  );
}

export function LogoMark({ size = 36 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 64 64" fill="none">
      <defs>
        <linearGradient id="lg" x1="8" y1="6" x2="56" y2="58" gradientUnits="userSpaceOnUse">
          <stop stopColor="#ffffff" />
          <stop offset="1" stopColor="#cfe3ff" />
        </linearGradient>
      </defs>
      <path
        d="M32 4 56 18v28L32 60 8 46V18L32 4Z"
        stroke="url(#lg)"
        strokeWidth="3.2"
        fill="none"
      />
      <path
        d="M32 14 48 23v18L32 50 16 41V23L32 14Z"
        fill="rgba(255,255,255,0.12)"
        stroke="#fff"
        strokeWidth="2.2"
      />
      <path d="M32 14v36M16 23l16 9 16-9M16 41l16-9 16 9" stroke="#fff" strokeWidth="1.7" />
    </svg>
  );
}

export function UaeFlag({ className = "h-5 w-7" }: { className?: string }) {
  return (
    <svg viewBox="0 0 12 8" className={`rounded-sm shadow-sm ${className}`}>
      <rect width="12" height="8" fill="#00732F" />
      <rect width="12" height="5.34" fill="#fff" />
      <rect width="12" height="2.67" fill="#000" />
      <rect width="3.2" height="8" fill="#FF0000" />
    </svg>
  );
}
