import { cn } from "@/lib/utils";
import { CONTENT_STATUS_LABELS, STATUS_COLORS } from "@/lib/constants";

interface StatusChipProps {
  status: string;
  className?: string;
  size?: "sm" | "md";
}

export function StatusChip({ status, className, size = "md" }: StatusChipProps) {
  const label = CONTENT_STATUS_LABELS[status] ?? status;
  const colorClass = STATUS_COLORS[status] ?? "bg-gray-100 text-gray-600";

  return (
    <span
      className={cn(
        "inline-flex items-center rounded-full font-semibold",
        size === "sm" ? "px-2 py-0.5 text-xs" : "px-3 py-1 text-xs",
        colorClass,
        className
      )}
    >
      <span className={cn(
        "mr-1.5 inline-block h-1.5 w-1.5 rounded-full",
        status === "PUBLISHED" || status === "APPROVED" ? "bg-teal-500" :
        status === "CHANGES_REQUESTED" ? "bg-rose-500" :
        status === "REJECTED" ? "bg-red-500" :
        status === "IN_REVIEW" || status === "SUBMITTED" ? "bg-amber-500" :
        "bg-purple-400"
      )} />
      {label}
    </span>
  );
}
