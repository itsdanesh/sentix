import { ModelStatus, api } from "@/api";
import HtmlRenderer from './LimeExplainer'; // Adjust the path as needed
import { Button } from "@/components/Button";
import { Header, headerHeight } from "@/components/Header";
import { TextArea } from "@/components/TextArea";
import { cn } from "@/utils/cn";
import React, { ChangeEventHandler, ReactNode, useState } from "react";
import { useMutation, useQuery } from "react-query";

export const DASHBOARD_PAGE_PATH = "/";
const POLL_INTERVAL = 2000;

export const DashboardPage: React.FC = () => {
	const { data: status, isSuccess: isStatusSuccess } = useQuery({
		queryFn: api.getStatus,
		queryKey: ["status", "get"],
		refetchInterval: POLL_INTERVAL,
	});

	const [predictable, setPredictable] = useState("");

	const { mutateAsync: predict } = useMutation({
		mutationKey: ["predict", predictable],
		mutationFn: async () => {
			const prediction = await api.predict(predictable);
			setPredictable(prediction);
		},
	});

	const { mutateAsync: startTraining } = useMutation({
		mutationKey: ["train"],
		mutationFn: api.startTraining,
	});

	const handleChangePredictable: ChangeEventHandler<HTMLTextAreaElement> = (
		e,
	) => {
		setPredictable(e.currentTarget.value);
	};

	const StatusDisplay: Record<ModelStatus, ReactNode> = {
		train: (
			<span>
				Please be patient. The model is currently{" "}
				<span className="font-semibold">training</span>...
			</span>
		),
		stale: <span>Please update me :(</span>,
		good: (
			<span>
				Good news! The model is{" "}
				<span className="font-semibold">up to date</span>! 🎉
			</span>
		),
	};

	const titleClassName = "w-[300px]";

	const Sections: { title: string; Content: ReactNode; description: string }[] =
		[
			{
				title: "Status",
				description: `The status of the model is displayed here. It is polled once every ${POLL_INTERVAL / 1000
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
					"Here you can enter arbitrary text and calculate its predicted sentiment. Sentiment can be either positive, negative, neutral, or irrelevant (not applicable).",
				Content: (
					<div className="flex items-center gap-4">
						<TextArea
							value={predictable}
							onChange={handleChangePredictable}
							placeholder="Enter text to analyze sentiment"
							className="flex-grow resize-none"
						/>
						<Button onClick={() => predict()}>Predict</Button>
					</div>
				),
			},
			{
				title: "Model training",
				description:
					"Once the model becomes stale, either after reviewing user reports or adding additional data points, it can be re-trained.",
				Content: (
					<Button
						onClick={() => startTraining()}
						disabled={status === "train"}
						className="w-full h-full"
					>
						Re-train the model
					</Button>
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
			<div
				className="flex container mx-auto py-10 gap-10 px-8"
				style={{ height: `calc(100% - ${headerHeight}px)` }}
			>
				<div
					className={cn(
						"flex flex-col overflow-hidden",
						"bg-slate-900/80 border border-slate-500/50 rounded-lg h-full",
					)}
					style={{ width: '80%' }} // Set the width to 80%
				>
					<h1 className="text-lg font-medium px-4 py-3 border-b border-b-slate-500/50 bg-slate-900">
						ML Management: LIME
					</h1>
					<HtmlRenderer />
				</div>
				<div
					className={cn(
						"flex flex-col overflow-hidden w-3/5",
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
										"flex gap-4 px-4 py-5 items-center hover:bg-slate-500/5 transition-colors",
									)}
								>
									<div className={cn("flex flex-col", titleClassName)}>
										<h2 className={cn("font-medium text-md")}>
											{section.title}
										</h2>
										<p className="text-sm font-light">{section.description}</p>
									</div>
									<div className="grow">{section.Content}</div>
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
