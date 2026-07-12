import type { ReactNode } from "react";

interface StatusBadgeProps {
  icon?: ReactNode;
  children: ReactNode;
  tone?: "violet" | "amber" | "emerald" | "sky" | "rose";
}

const toneClasses = {
  violet: "border-violet-200 bg-violet-50 text-violet-700",
  amber: "border-amber-200 bg-amber-50 text-amber-700",
  emerald: "border-emerald-200 bg-emerald-50 text-emerald-700",
  sky: "border-sky-200 bg-sky-50 text-sky-700",
  rose: "border-rose-200 bg-rose-50 text-rose-700",
};

export function StatusBadge({ icon, children, tone = "violet" }: StatusBadgeProps) {
  return (
    <span className={`inline-flex items-center gap-1.5 rounded-full border px-3 py-1 text-xs font-extrabold ${toneClasses[tone]}`}>
      {icon}
      {children}
    </span>
  );
}
