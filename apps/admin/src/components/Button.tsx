import { cn } from "@/utils/cn";
import { DetailedHTMLProps, ButtonHTMLAttributes, forwardRef } from "react";

export type ButtonProps = DetailedHTMLProps<
	ButtonHTMLAttributes<HTMLButtonElement>,
	HTMLButtonElement
> & {
	variant?: "primary" | "secondary";
};

const variantClassNames: Record<NonNullable<ButtonProps["variant"]>, string> = {
	primary:
		"border-2 border-slate-500/70 bg-slate-500/70 text-slate-950 hover:bg-slate-500/90 active:bg-slate-500/100 ",
	secondary:
		"border-2 border-slate-500/70 hover:bg-slate-500/10 active:bg-slate-500/20",
};

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
	({ className, disabled, variant = "primary", ...props }, ref) => (
		<button
			className={cn(
				"px-3 py-2 rounded-2xl transition-colors",
				disabled && "opacity-50 cursor-not-allowed",
				variantClassNames[variant],
				className,
			)}
			ref={ref}
			{...props}
		/>
	),
);
