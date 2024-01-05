import { Sentiment, UserReport, api } from "@/api";
import { Button } from "@/components/Button";
import { useDropdown } from "@/hooks/useDropdown";
import { useModal } from "@/hooks/useModal";
import { cn } from "@/utils/cn";
import { MouseEventHandler } from "react";
import { FaTrash, FaCheck } from "react-icons/fa";
import { useQueryClient, useMutation } from "react-query";

export type ReportViewProps = {
	report: UserReport;
};

export const ReportView: React.FC<ReportViewProps> = ({
	report: { id, sentiment, text },
}) => {
	const queryClient = useQueryClient();

	const { Dropdown: SentimentDropdown, value: newSentiment } = useDropdown({
		options: api.sentiments.map((sentiment) => ({
			label: sentiment,
			value: sentiment,
		})),
		props: {
			placeholder: "New sentiment",
			defaultValue: api.sentiments[0],
		},
	});

	const { mutateAsync: approveReport } = useMutation({
		mutationKey: ["reports", "approve", id, newSentiment],
		mutationFn: async () =>
			await api.approveReport({
				sentiment: newSentiment as Sentiment,
				text,
			}),
	});

	const { mutateAsync: ignoreReport } = useMutation({
		mutationKey: ["reports", "ignore", id],
		mutationFn: async () => api.ignoreReport({ text }),
	});

	const modalClassNames =
		"bg-slate-800 rounded-xl border border-slate-500 overflow-hidden scrollbar-none w-[400px]";

	const getIgnoreReportHandler =
		(toggleOpen: () => void): MouseEventHandler =>
		async () => {
			await ignoreReport();
			queryClient.invalidateQueries(["reports", "get"]);
			toggleOpen();
		};

	const getApproveReportHandler =
		(toggleOpen: () => void): MouseEventHandler =>
		async () => {
			await approveReport();
			queryClient.invalidateQueries(["status", "get"]);
			queryClient.invalidateQueries(["reports", "get"]);
			toggleOpen();
		};

	const { Modal: IgnoreModal, toggleOpen: toggleIgnoreModal } = useModal({
		Content: ({ toggleOpen }) => (
			<div className={cn(modalClassNames)}>
				<h3 className="bg-slate-800 px-4 py-3 text-lg font-medium">
					Confirm deletion
				</h3>
				<div className="w-full h-[1px] bg-slate-500" />
				<div className="flex flex-col gap-4 p-4">
					<div>Are you sure you want to delete "{text}"?</div>
					<div className="flex gap-4">
						<Button
							className="flex-grow"
							variant="secondary"
							onClick={toggleOpen}
						>
							Nah
						</Button>
						<Button
							className="flex-grow"
							variant="primary"
							onClick={getIgnoreReportHandler(toggleOpen)}
						>
							Yes, delete
						</Button>
					</div>
				</div>
			</div>
		),
	});

	const { Modal: ApproveModal, toggleOpen: toggleApproveModal } = useModal({
		Content: ({ toggleOpen }) => (
			<div className={cn(modalClassNames, "")}>
				<h3 className="bg-slate-900 px-4 py-3 text-lg font-medium">
					Confirm addition
				</h3>
				<div className="w-full h-[1px] bg-slate-500" />
				<div className="flex flex-col gap-4 p-4">
					<div>
						In order to modify "{text}", please select its new sentiment rating.
					</div>
					{SentimentDropdown}
					<div className="flex gap-4">
						<Button
							className="flex-grow"
							variant="secondary"
							onClick={toggleOpen}
						>
							Cancel
						</Button>
						<Button
							disabled={
								!api.sentiments.includes(newSentiment as Sentiment) ||
								newSentiment === sentiment
							}
							className="flex-grow"
							variant="primary"
							onClick={getApproveReportHandler(toggleOpen)}
						>
							Approve
						</Button>
					</div>
				</div>
			</div>
		),
	});

	return (
		<div
			className={cn("flex border border-slate-500 rounded-xl justify-between")}
		>
			{IgnoreModal}
			{ApproveModal}
			<span className="px-3 py-2 break-all">
				"{text}" was mistakenly rated as{" "}
				<span className="font-semibold">{sentiment.toLowerCase()}</span>.
			</span>
			<div className="flex items-center">
				<div className="bg-slate-500 w-[1px] h-full" />
				<div className="flex items-center gap-3 p-3">
					<FaTrash className="cursor-pointer" onClick={toggleIgnoreModal} />
					<FaCheck className="cursor-pointer" onClick={toggleApproveModal} />
				</div>
			</div>
		</div>
	);
};
