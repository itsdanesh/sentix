import { Button } from "@/components/Button";
import { cn } from "@/utils/cn";
import React from "react";
import { Section } from "./Section";
import { api } from "@/api";
import { useMutation, useQuery } from "react-query";
import { misc } from "@/utils/misc";
import { Constants } from "../Constants";

const TrainingSectionView: React.FC = () => {
	const { data: accuracy, isSuccess: isAccuracySuccess } = useQuery({
		queryFn: async () => {
			const accuracies = await api.getAccuracy();

			return {
				before: misc.truncate((accuracies[0] ?? 0) * 100),
				after: misc.truncate((accuracies[1] ?? 0) * 100),
			};
		},
		queryKey: ["accuracy", "get"],
		refetchInterval: Constants.ACCURACY_POLL_INTERVAL,
	});

	const { mutateAsync: startTraining } = useMutation({
		mutationKey: ["train"],
		mutationFn: api.startTraining,
	});

	const { mutateAsync: revertModel } = useMutation({
		mutationKey: ["model", "revert"],
		mutationFn: api.revert,
	});

	return (
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
						<span className="font-semibold">{accuracy.before}%</span>. Current
						model's accuracy is{" "}
						<span className="font-semibold">{accuracy.after}%</span>.{" "}
						{accuracy.before === accuracy.after
							? "In this case, the models are identical."
							: accuracy.before > accuracy.after
							? "In this case, the model should be reverted."
							: ""}
					</React.Fragment>
				) : (
					"Evaluating models..."
				)}
			</div>
		</div>
	);
};

export const TrainingSection = (): Section => ({
	title: "Model training",
	description:
		"Once the model becomes stale, either after reviewing user reports or adding additional data points, it can be re-trained.",
	Content: <TrainingSectionView />,
});
