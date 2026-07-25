import * as React from "react";
import { cn } from "@/lib/utils";

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?:
    | "default"
    | "secondary"
    | "destructive"
    | "outline"
    | "ghost"
    | "link";
  size?: "default" | "sm" | "lg" | "icon";
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = "default", size = "default", ...props }, ref) => {
    const variantStyles = {
      default:
        "brand-gradient brand-gradient-hover text-primary-foreground shadow-sm shadow-violet-500/20 active:scale-[0.98]",
      secondary:
        "bg-secondary text-secondary-foreground hover:bg-secondary/80 active:bg-secondary/70",
      destructive:
        "bg-destructive text-destructive-foreground hover:bg-destructive/90 active:bg-destructive/80",
      outline:
        "border border-input bg-background text-foreground hover:bg-accent hover:text-accent-foreground",
      ghost: "hover:bg-accent hover:text-accent-foreground",
      link: "text-primary underline-offset-4 hover:underline",
    };

    const sizeStyles = {
      default: "h-10 px-4 py-2 text-sm font-medium",
      sm: "h-9 px-3 text-xs font-medium",
      lg: "h-12 px-8 text-base font-medium",
      icon: "h-10 w-10",
    };

    return (
      <button
        ref={ref}
        className={cn(
          "inline-flex items-center justify-center rounded-lg transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed",
          variantStyles[variant],
          sizeStyles[size],
          className
        )}
        {...props}
      />
    );
  }
);

Button.displayName = "Button";

export { Button };
