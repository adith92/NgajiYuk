import { motion, HTMLMotionProps } from 'motion/react';
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export interface ClayButtonProps extends HTMLMotionProps<"button"> {
  colorClass?: string;
}

export function ClayButton({ colorClass, className, children, ...props }: ClayButtonProps) {
  return (
    <motion.button
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
      className={cn(
        "flex flex-col items-center justify-center p-4 rounded-3xl clay-btn text-white font-extrabold text-center hover:brightness-105 transition-all duration-150 cursor-pointer select-none focus:outline-none",
        colorClass,
        className
      )}
      {...props}
    >
      {children}
    </motion.button>
  );
}
