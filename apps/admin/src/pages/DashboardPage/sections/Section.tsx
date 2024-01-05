import { cn } from "@/utils/cn";
import { ArrayMap } from "@/utils/types";
import React from "react";
import { ReactNode } from "react";

export type Section = {
	title: string;
	Content: ReactNode;
	description: string;
	wrapperClassName?: string;
};

export const sectionRenderer: ArrayMap<Section, ReactNode> = (
	{ Content, description, title, wrapperClassName },
	index,
	sections,
) => (
	<React.Fragment key={title}>
		<div
			className={cn(
				"flex gap-4 px-4 py-5 hover:bg-slate-500/5 transition-colors",
				wrapperClassName,
			)}
		>
			<div className={cn("flex flex-col basis-[300px] shrink-0")}>
				<h2 className={cn("font-medium text-md")}>{title}</h2>
				<p className="text-sm font-light">{description}</p>
			</div>
			{Content}
		</div>
		{index !== sections.length && (
			<div className="h-[1px] w-full bg-slate-500/50" />
		)}
	</React.Fragment>
);
