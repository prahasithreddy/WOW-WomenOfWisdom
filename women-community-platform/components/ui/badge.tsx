import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

const badgeVariants = cva(
  "inline-flex items-center gap-1 rounded-sm px-2.5 py-0.5 text-xs font-bold transition-colors",
  {
    variants: {
      variant: {
        default:     "bg-purple-100 text-purple-700",
        secondary:   "bg-lavender-300 text-violet-800",
        teal:        "bg-rose-100 text-rose-500",
        blush:       "bg-rose-100 text-rose-500",
        outline:     "border border-border text-foreground bg-transparent",
        success:     "bg-green-100 text-green-700",
        warning:     "bg-amber-100 text-amber-700",
        destructive: "bg-red-100 text-red-700",
        ghost:       "bg-lavender-200 text-muted",
        ink:         "bg-violet-800 text-purple-200",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  }
);

export interface BadgeProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof badgeVariants> {}

function Badge({ className, variant, ...props }: BadgeProps) {
  return (
    <div className={cn(badgeVariants({ variant }), className)} {...props} />
  );
}

export { Badge, badgeVariants };
