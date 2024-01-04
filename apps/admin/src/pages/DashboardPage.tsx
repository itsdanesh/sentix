import { ModelStatus, SentimentOutput, UserReport, api } from "@/api";
import { Button } from "@/components/Button";
import { Header, headerHeight } from "@/components/Header";
import { TextArea } from "@/components/TextArea";
import { cn } from "@/utils/cn";
import React, { ChangeEventHandler, ReactNode, useState } from "react";
import { useMutation, useQuery, useQueryClient } from "react-query";
import { FaTrash, FaCheck } from "react-icons/fa";
import { useModal } from "@/hooks/useModal";
import { useDropdown } from "@/hooks/useDropdown";

export const DASHBOARD_PAGE_PATH = "/";
const STATUS_POLL_INTERVAL = 2000;
const REPORTS_POLL_INTERVAL = 2000;
const ACCURACY_POLL_INTERVAL = 5000;

const ReportView: React.FC<{ report: UserReport }> = ({
	report: { id, sentiment, text },
}) => {
	const queryClient = useQueryClient();

	const allowedSentiments = [
		"Positive",
		"Negative",
		"Neutral",
		"Irrelevant",
	] as const;

	const { Dropdown: SentimentDropdown, value: newSentiment } = useDropdown({
		options: allowedSentiments.map((sentiment) => ({
			label: sentiment,
			value: sentiment,
		})),
		props: {
			placeholder: "New sentiment",
			defaultValue: allowedSentiments[0],
		},
	});

	const { mutateAsync: approveReport } = useMutation({
		mutationKey: ["reports", "approve", id, newSentiment],
		mutationFn: async () =>
			await api.approveReport({
				sentiment: newSentiment as SentimentOutput,
				text,
			}),
	});

	const { mutateAsync: ignoreReport } = useMutation({
		mutationKey: ["reports", "ignore", id],
		mutationFn: async () => api.ignoreReport({ text }),
	});

	const modalClassNames =
		"bg-slate-800 rounded-xl border border-slate-500 overflow-hidden scrollbar-none w-[400px]";

	const { Modal: IgnoreModal, toggleOpen: toggleIgnoreModal } = useModal({
		Content: ({ toggleOpen }) => (
			<div className={cn(modalClassNames, "")}>
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
							onClick={async () => {
								await ignoreReport();
								queryClient.invalidateQueries(["reports", "get"]);
								toggleOpen();
							}}
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
								!allowedSentiments.includes(newSentiment as SentimentOutput) ||
								newSentiment === sentiment
							}
							className="flex-grow"
							variant="primary"
							onClick={async () => {
								await approveReport();
								queryClient.invalidateQueries(["status", "get"]);
								queryClient.invalidateQueries(["reports", "get"]);
								toggleOpen();
							}}
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
			<span className="px-3 py-2">
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

export const DashboardPage: React.FC = () => {
	const { data: accuracy, isSuccess: isAccuracySuccess } = useQuery({
		queryFn: api.getAccuracy,
		queryKey: ["accuracy", "get"],
		refetchInterval: ACCURACY_POLL_INTERVAL,
	});

	const { data: status, isSuccess: isStatusSuccess } = useQuery({
		queryFn: api.getStatus,
		queryKey: ["status", "get"],
		refetchInterval: STATUS_POLL_INTERVAL,
	});

	const [explainable, setExplainable] = useState("");

	const { data: reports, isSuccess: isReportsSuccess } = useQuery({
		queryFn: api.getReports,
		queryKey: ["reports", "get"],
		refetchInterval: REPORTS_POLL_INTERVAL,
	});

	const [explanation, setExplanation] = useState("");

	const { Modal: PredictionModal, toggleOpen: togglePredictionModal } =
		useModal({
			Content: () => (
				<div className="flex flex-col gap-3 p-3 rounded-lg border border-slate-500/50 bg-slate-800 w-[500px]">
					<h1 className="font-medium text-lg">LIME Explanation</h1>
					<iframe
						srcDoc={explanation}
						style={{ width: "100%", height: 300, border: "none" }}
						className="bg-white p-4 rounded-md"
						title="HTML Content"
						sandbox="allow-scripts"
					/>
				</div>
			),
		});

	const { isLoading: explanationLoading, mutateAsync: handleExplain } =
		useMutation({
			mutationKey: ["predict", explainable],
			mutationFn: async () => {
				setExplanation(await api.explainText(explainable));
				togglePredictionModal();
			},
		});

	const { mutateAsync: startTraining } = useMutation({
		mutationKey: ["train"],
		mutationFn: api.startTraining,
	});

	const { mutateAsync: revertModel } = useMutation({
		mutationKey: ["model", "revert"],
		mutationFn: api.revert,
	});

	const handleChangePredictable: ChangeEventHandler<HTMLTextAreaElement> = (
		e,
	) => {
		setExplainable(e.currentTarget.value);
	};

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

	const accuracyBefore = (accuracy?.at(0) ?? 0) * 100;
	const accuracyAfter = (accuracy?.at(1) ?? 0) * 100;

	const Sections: { title: string; Content: ReactNode; description: string }[] =
		[
			{
				title: "Status",
				description: `The status of the model is displayed here. It is polled once every ${
					STATUS_POLL_INTERVAL / 1000
				} seconds. The model can be either up to date, stale (missing data), or training.`,
				Content: (
					<span
						className={cn(
							"border border-slate-500/50 rounded-xl px-3 py-2 bg-slate-500/10",
							(status === "train" || status === undefined) && "animate-pulse",
						)}
					>
						{isStatusSuccess ? StatusDisplay[status] : "Pinging model..."}
					</span>
				),
			},
			{
				title: "Predict sentiment",
				description:
					"Here you can enter arbitrary text and calculate its predicted sentiment. You will also be able to see how much words of interest contributed towards the result.",
				Content: (
					<div className="flex items-center gap-4">
						<TextArea
							value={explainable}
							onChange={handleChangePredictable}
							placeholder="Enter text to analyze sentiment"
							className="flex-grow resize-none h-[100px]"
						/>
						<Button
							variant="secondary"
							onClick={() => handleExplain()}
							disabled={explanationLoading}
						>
							Explain
						</Button>
					</div>
				),
			},
			{
				title: "Model training",
				description:
					"Once the model becomes stale, either after reviewing user reports or adding additional data points, it can be re-trained.",
				Content: (
					<div className="flex flex-col gap-3">
						<div className="flex gap-3">
							<Button
								variant="secondary"
								onClick={() => revertModel()}
								disabled={status === "train"}
								className="w-full h-full"
							>
								Revert model
							</Button>
							<Button
								onClick={() => startTraining()}
								disabled={status === "train"}
								className="w-full h-full"
							>
								Re-train the model
							</Button>
						</div>
						<div
							className={cn(
								"border border-slate-500/50 rounded-xl px-3 py-2 bg-slate-500/10",
								!isAccuracySuccess && "animate-pulse",
							)}
						>
							{isAccuracySuccess ? (
								<React.Fragment>
									Old model's accuracy was{" "}
									<span className="font-semibold">{accuracyBefore}%</span>.
									Current model's accuracy is{" "}
									<span className="font-semibold">{accuracyAfter}%</span>.{" "}
									{accuracyBefore === accuracyAfter
										? "In this case, the models are identical."
										: accuracyBefore > accuracyAfter
										? "In this case, the model should be reverted."
										: ""}
								</React.Fragment>
							) : (
								"Evaluating models..."
							)}
						</div>
					</div>
				),
			},
			{
				title: "Data administration",
				description:
					"Here you can either add new data points, or remove data points from the data set. Once any change is done, the model becomes stale.",
				Content: <div></div>,
			},
		];

	return (
		<React.Fragment>
			<Header />
			{PredictionModal}
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
						{isReportsSuccess ? (
							reports.map((report) => (
								<ReportView key={report.id} report={report} />
							))
						) : (
							<div className="animate-pulse border border-slate-500/50 rounded-xl px-3 py-2 bg-slate-500/10">
								Loading User reports...
							</div>
						)}
						{reports?.length === 0 && (
							<span
								className={cn(
									"border border-slate-500/50 rounded-xl px-3 py-2 bg-slate-500/10",
								)}
							>
								No more reports left; Good job!
							</span>
						)}
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
					<div className="flex flex-col">
						{Sections.map((section, sectionIndex) => (
							<React.Fragment key={section.title}>
								<div
									className={cn(
										"flex gap-4 px-4 py-5 hover:bg-slate-500/5 transition-colors",
									)}
								>
									<div className={cn("flex flex-col basis-[300px] shrink-0")}>
										<h2 className={cn("font-medium text-md")}>
											{section.title}
										</h2>
										<p className="text-sm font-light">{section.description}</p>
									</div>
									<div className="grow my-auto">{section.Content}</div>
								</div>
								{sectionIndex !== Sections.length && (
									<div className="h-[1px] w-full bg-slate-500/50" />
								)}
							</React.Fragment>
						))}
					</div>
				</div>
			</div>
		</React.Fragment>
	);
};
