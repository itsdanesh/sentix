import React, { ReactNode } from "react";
import { Constants } from "../Constants";
import { Section } from "./Section";
import { ModelStatus } from "@/api";
import { cn } from "@/utils/cn";

type StatusSectionContext = {
	isStatusSuccess: boolean;
	status: ModelStatus | undefined;
};

const StatusSectionView: React.FC<StatusSectionContext> = ({
	isStatusSuccess,
	status,
}) => {
	const StatusDisplay: Record<ModelStatus, ReactNode> = {
		train: (
			<span>
				Please be patient. The model is currently{" "}
				<span className="font-semibold">training</span>...
			</span>
		),
		stale: <span>Model out of sync with data. Training required!</span>,
		good: (
			<span>
				Good news! The model is{" "}
				<span className="font-semibold">up to date</span>! 🎉
			</span>
		),
	};

	return (
		<div className="flex items-center justify-center">
			<div
				className={cn(
					"inline-block border border-slate-500/50 rounded-xl px-3 py-2 bg-slate-500/10",
					(status === "train" || status === undefined) && "animate-pulse",
				)}
			>
				{isStatusSuccess ? StatusDisplay[status!] : "Pinging model..."}
			</div>
		</div>
	);
};

export const StatusSection = (context: StatusSectionContext): Section => ({
	title: "Status",
	description: `The status of the model is displayed here. It is polled once every ${
		Constants.STATUS_POLL_INTERVAL / 1000
	} seconds. The model can be either up to date, stale (missing data), or training.`,
	Content: <StatusSectionView {...context} />,
});
