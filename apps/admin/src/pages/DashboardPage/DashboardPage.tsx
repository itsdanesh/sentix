import { api } from "@/api";
import { Header, headerHeight } from "@/components/Header";
import { cn } from "@/utils/cn";
import React from "react";
import { useQuery } from "react-query";
import { Constants } from "./Constants";
import { ReportView } from "./ReportView";
import { StatusSection } from "./sections/StatusSection";
import { Section, sectionRenderer } from "./sections/Section";
import { ExplanationSection } from "./sections/ExplanationSection";
import { TrainingSection } from "./sections/TrainingSection";
import { DataSection } from "./sections/DataSection";

export const DashboardPage: React.FC = () => {
	const { data: status, isSuccess: isStatusSuccess } = useQuery({
		queryFn: api.getStatus,
		queryKey: ["status", "get"],
		refetchInterval: Constants.STATUS_POLL_INTERVAL,
	});

	const { data: reports, isSuccess: isReportsSuccess } = useQuery({
		queryFn: api.getReports,
		queryKey: ["reports", "get"],
		refetchInterval: Constants.REPORTS_POLL_INTERVAL,
	});

	const Sections: Section[] = [
		StatusSection({ isStatusSuccess, status }),
		ExplanationSection(),
		TrainingSection(),
		DataSection(),
	];

	const UserReports = (() => {
		if (reports?.length === 0) {
			return (
				<span
					className={cn(
						"border border-slate-500/50 rounded-xl px-3 py-2 bg-slate-500/10",
					)}
				>
					No more reports left; Good job!
				</span>
			);
		}

		if (isReportsSuccess) {
			return reports.map((report) => (
				<ReportView key={report.id} report={report} />
			));
		}

		return (
			<div className="animate-pulse border border-slate-500/50 rounded-xl px-3 py-2 bg-slate-500/10">
				Loading User reports...
			</div>
		);
	})();

	return (
		<React.Fragment>
			<Header />
			<div
				className="flex container mx-auto py-10 gap-10 px-8"
				style={{ height: `calc(100% - ${headerHeight}px)` }}
			>
				<div
					className={cn(
						"flex flex-col overflow-hidden w-1/2",
						"bg-slate-900/80 border border-slate-500/50 rounded-lg h-full",
					)}
				>
					<h1 className="text-lg font-medium px-4 py-3 border-b border-b-slate-500/50 bg-slate-900">
						User Reports
					</h1>
					<div className="flex flex-col p-4 overflow-y-scroll scrollbar-none gap-3">
						{UserReports}
					</div>
				</div>
				<div
					className={cn(
						"flex flex-col overflow-hidden flex-grow w-1/2",
						"bg-slate-900/80 border border-slate-500/50 rounded-lg h-full",
					)}
				>
					<h1 className="text-lg font-medium px-4 py-3 border-b border-b-slate-500/50 bg-slate-900">
						ML Management: Backend model administration
					</h1>
					<div className="flex flex-col h-full">
						{Sections.map(sectionRenderer)}
					</div>
				</div>
			</div>
		</React.Fragment>
	);
};
