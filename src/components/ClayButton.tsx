import { motion, HTMLMotionProps } from 'motion/react';
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export interface ClayButtonProps extends HTMLMotionProps<"button"> {
  colorClass?: 'emerald' | 'amber' | 'orange' | 'cyan' | 'indigo' | 'rose' | 'violet' | string;
}

const colorPresets: Record<string, string> = {
  emerald: 'bg-gradient-to-b from-emerald-400 to-emerald-500 hover:from-emerald-350 hover:to-emerald-450 text-white',
  amber: 'bg-gradient-to-b from-amber-400 to-amber-500 hover:from-amber-350 hover:to-amber-450 text-emerald-950',
  orange: 'bg-gradient-to-b from-orange-400 to-orange-500 hover:from-orange-350 hover:to-orange-450 text-white',
  cyan: 'bg-gradient-to-b from-cyan-400 to-cyan-500 hover:from-cyan-350 hover:to-cyan-450 text-white',
  indigo: 'bg-gradient-to-b from-indigo-400 to-indigo-500 hover:from-indigo-350 hover:to-indigo-450 text-white',
  rose: 'bg-gradient-to-b from-rose-400 to-rose-500 hover:from-rose-350 hover:to-rose-450 text-white',
  violet: 'bg-gradient-to-b from-violet-400 to-violet-500 hover:from-violet-350 hover:to-violet-450 text-white',
  pink: 'bg-gradient-to-b from-pink-400 to-pink-500 hover:from-pink-350 hover:to-pink-450 text-white',
};

export function ClayButton({ colorClass = 'emerald', className, children, ...props }: ClayButtonProps) {
  const resolvedColor = colorPresets[colorClass] || colorClass;
  return (
    <motion.button
      whileHover={{ scale: 1.04, y: -2 }}
      whileTap={{ scale: 0.96, y: 1 }}
      className={cn(
        "flex flex-col items-center justify-center p-4 rounded-3xl clay-btn font-extrabold text-center hover:brightness-105 active:brightness-95 transition-all duration-150 cursor-pointer select-none focus:outline-none shadow-md",
        resolvedColor,
        className
      )}
      {...props}
    >
      {children}
    </motion.button>
  );
}
