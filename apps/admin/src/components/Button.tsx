import { cn } from "@/utils/cn";
import { DetailedHTMLProps, ButtonHTMLAttributes, forwardRef } from "react";

export type ButtonProps = DetailedHTMLProps<
	ButtonHTMLAttributes<HTMLButtonElement>,
	HTMLButtonElement
>;

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
	({ className, disabled, ...props }, ref) => (
		<button
			className={cn(
				"bg-slate-500/70 text-slate-950 px-3 py-2 rounded-2xl",
				"hover:bg-slate-500/90 active:bg-slate-500/100 transition-colors",
				disabled && "opacity-50 cursor-not-allowed",
				className,
			)}
			ref={ref}
			{...props}
		/>
	),
);
