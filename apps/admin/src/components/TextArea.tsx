import { cn } from "@/utils/cn";
import { DetailedHTMLProps, TextareaHTMLAttributes, forwardRef } from "react";

export type TextAreaProps = DetailedHTMLProps<
	TextareaHTMLAttributes<HTMLTextAreaElement>,
	HTMLTextAreaElement
>;

export const TextArea = forwardRef<HTMLTextAreaElement, TextAreaProps>(
	({ className, ...props }, ref) => (
		<textarea
			className={cn(
				"border border-slate-500/50 bg-slate-500/10 px-3 py-2 rounded-2xl",
				"text-slate-400 placeholder-slate-400/50 hover:border-slate-500/90 transition-colors",
				className,
			)}
			ref={ref}
			{...props}
		/>
	),
);
