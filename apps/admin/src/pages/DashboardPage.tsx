import { Header, headerHeight } from "@/components/Header";
import { cn } from "@/utils/cn";
import React from "react";

export const DASHBOARD_PAGE_PATH = "/";

export const DashboardPage: React.FC = () => {
	return (
		<React.Fragment>
			<Header />
			<div
				className="flex container mx-auto py-10 gap-10 px-8"
				style={{ height: `calc(100% - ${headerHeight}px)` }}
			>
				<div
					className={cn(
						"flex-grow ",
						"bg-slate-900/80 border border-slate-500/50 rounded-lg p-4 h-full",
					)}
				>
					<h1>User Reports</h1>
				</div>
				<div
					className={cn(
						"flex-grow",
						"bg-slate-900/80 border border-slate-500/50 rounded-lg p-4 h-full",
					)}
				>
					<h1>ML Management</h1>
				</div>
			</div>
		</React.Fragment>
	);
};
