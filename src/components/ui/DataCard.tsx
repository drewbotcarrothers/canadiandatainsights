import { cn } from "@/lib/utils";

interface DataCardProps {
  label: string;
  value: string | number;
  subValue?: string;
  delta?: {
    value: string;
    isPositive: boolean;
  };
  className?: string;
  hasAccent?: boolean;
}

export default function DataCard({
  label,
  value,
  subValue,
  delta,
  className,
  hasAccent = false,
}: DataCardProps) {
  return (
    <div className={cn(
      "card-tonal p-6 rounded-md shadow-sm border border-outline-variant/10 transition-all hover:shadow-ambient",
      hasAccent && "accent-bar",
      className
    )}>
      <span className="text-on_surface-variant font-inter text-[10px] uppercase tracking-[0.15em] font-bold block mb-2">
        {label}
      </span>
      <div className="flex items-baseline gap-3">
        <span className="text-primary font-manrope text-3xl font-bold tracking-tight">
          {value}
        </span>
        {delta && (
          <span className={cn(
            "text-[10px] font-inter font-bold px-1.5 py-0.5 rounded-sm",
            delta.isPositive ? "bg-primary/10 text-primary" : "bg-tertiary/10 text-tertiary"
          )}>
            {delta.isPositive ? "+" : ""}{delta.value}
          </span>
        )}
      </div>
      {subValue && (
        <span className="text-on_surface-variant font-inter text-xs italic mt-2 block">
          {subValue}
        </span>
      )}
    </div>
  );
}
