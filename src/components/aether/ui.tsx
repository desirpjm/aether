import type { ReactNode } from "react";
import { cn } from "@/lib/utils";

export const Dot = ({ className }: { className?: string }) => <span className={cn("inline-block h-2 w-2 rounded-full bg-alert", className)} />;
export const TiltLine = ({ className }: { className?: string }) => <div aria-hidden className={cn("tilt-line self-stretch", className)} />;
export const Label = ({ children, className }: { children: ReactNode; className?: string }) => <div className={cn("font-sc text-sm tracking-[0.12em]", className)}>{children}</div>;

export function Frame({ label, children, onClose, className }: { label?: string; children: ReactNode; onClose?: () => void; className?: string }) {
  const cross = "absolute h-3 w-3 before:absolute before:left-1/2 before:top-0 before:h-full before:w-px before:bg-foreground after:absolute after:top-1/2 after:left-0 after:h-px after:w-full after:bg-foreground";
  return (
    <div className={cn("relative border-[3px] border-foreground p-6 md:p-8", className)}>
      <span className={cn(cross, "-left-[9px] -top-[9px]")} /><span className={cn(cross, "-bottom-[9px] -left-[9px]")} /><span className={cn(cross, "-bottom-[9px] -right-[9px]")} />
      {label && <div className="meta -mt-2 mb-4 !text-foreground">{label}</div>}
      <button onClick={onClose} aria-label="Reset" className="absolute right-3 top-2 font-sans text-lg leading-none hover:opacity-60">×</button>
      {children}
    </div>
  );
}

export function Node({ handle, active, onClick, size = 72 }: { handle: string; active?: boolean; onClick?: () => void; size?: number }) {
  return (
    <button onClick={onClick} className="group flex flex-col items-center gap-2">
      <span style={{ width: size, height: size }} className={cn("rounded-full bg-node transition", active ? "ring-1 ring-foreground ring-offset-4 ring-offset-background" : "group-hover:opacity-70")} />
      <span className={cn("font-sans text-xs tracking-widest", active && "underline underline-offset-4")}>{handle}</span>
    </button>
  );
}
