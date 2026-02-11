import type { ButtonHTMLAttributes } from "react";
import { cn } from "@/utils/cn";

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "default" | "secondary" | "outline" | "ghost";
  size?: "default" | "sm" | "lg" | "icon";
}

export function Button({ 
  className, 
  variant = "default", 
  size = "default",
  type = "button",
  ...props 
}: ButtonProps) {
  return (
    <button
      type={type}
      className={cn(
        "inline-flex items-center justify-center rounded-md font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2 disabled:opacity-50 disabled:pointer-events-none",
        {
          "bg-zinc-900 text-white shadow-sm hover:bg-zinc-800 dark:bg-zinc-100 dark:text-zinc-900 dark:hover:bg-white": variant === "default",
          "bg-zinc-100 text-zinc-900 hover:bg-zinc-200 dark:bg-zinc-800 dark:text-zinc-100 dark:hover:bg-zinc-700": variant === "secondary",
          "border border-zinc-200 bg-transparent hover:bg-zinc-100 dark:border-zinc-800 dark:hover:bg-zinc-800": variant === "outline",
          "hover:bg-zinc-100 dark:hover:bg-zinc-800": variant === "ghost",
          "px-3 py-2 text-sm": size === "default",
          "px-2 py-1 text-xs": size === "sm",
          "px-4 py-3 text-base": size === "lg",
          "p-2 text-sm": size === "icon",
        },
        className
      )}
      {...props}
    />
  );
}
