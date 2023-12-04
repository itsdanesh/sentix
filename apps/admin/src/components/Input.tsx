import { cn } from "@/utils/cn";
import { DetailedHTMLProps, InputHTMLAttributes, forwardRef } from "react";

export type InputProps = DetailedHTMLProps<
	InputHTMLAttributes<HTMLInputElement>,
	HTMLInputElement
>;

export const Input = forwardRef<HTMLInputElement, InputProps>(
	({ className, ...props }, ref) => (
		<input
			className={cn(
				"bg-transparent border-2 border-slate-500/70 px-3 py-2 rounded-2xl",
				"text-slate-400 placeholder-slate-400/50 hover:border-slate-500/90 transition-colors",
				className,
			)}
			ref={ref}
			{...props}
		/>
	),
);
