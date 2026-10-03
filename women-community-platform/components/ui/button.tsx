"use client";

import * as React from "react";
import { Slot } from "@radix-ui/react-slot";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-full text-sm font-semibold transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50",
  {
    variants: {
      variant: {
        default:     "bg-violet-950 text-purple-200 hover:scale-[1.02] [box-shadow:var(--shadow-violet)] hover:[box-shadow:var(--shadow-purple)]",
        secondary:   "border border-purple-400 bg-transparent text-purple-600 hover:bg-purple-50 hover:border-purple-500",
        gold:        "bg-purple-gradient text-white font-bold [box-shadow:var(--shadow-purple)] hover:scale-[1.02]",
        ghost:       "hover:bg-lavender-200 text-muted",
        destructive: "bg-red-600 text-white hover:bg-red-700",
        outline:     "border border-border bg-white hover:bg-lavender-200 text-foreground",
        link:        "text-purple-600 underline-offset-4 hover:underline",
        ink:         "bg-violet-800 text-lavender-100 hover:bg-violet-700 hover:scale-[1.02]",
        teal:        "bg-rose-100 text-rose-500 hover:bg-rose-200",
        lavender:    "bg-purple-50 text-purple-700 hover:bg-purple-100",
      },
      size: {
        default: "h-10 px-6 py-2.5",
        sm:      "h-8 px-4 text-xs",
        lg:      "h-12 px-8 text-base",
        xl:      "h-14 px-10 text-base",
        icon:    "h-9 w-9 rounded-full",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
);

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean;
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, asChild = false, ...props }, ref) => {
    const Comp = asChild ? Slot : "button";
    return (
      <Comp
        className={cn(buttonVariants({ variant, size, className }))}
        ref={ref}
        {...props}
      />
    );
  }
);
Button.displayName = "Button";

export { Button, buttonVariants };
