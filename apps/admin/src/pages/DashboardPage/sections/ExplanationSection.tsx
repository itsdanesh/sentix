import { Button } from "@/components/Button";
import { TextArea } from "@/components/TextArea";
import { Section } from "./Section";
import { ChangeEventHandler, useState } from "react";
import { useMutation } from "react-query";
import { api } from "@/api";
import { useModal } from "@/hooks/useModal";

const ExplanationSectionView: React.FC = () => {
	const [explainable, setExplainable] = useState("");

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

	const handleChangeExplainable: ChangeEventHandler<HTMLTextAreaElement> = (
		e,
	) => {
		setExplainable(e.currentTarget.value);
	};

	return (
		<div className="flex items-center gap-4">
			{PredictionModal}
			<TextArea
				value={explainable}
				onChange={handleChangeExplainable}
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
	);
};

export const ExplanationSection = (): Section => ({
	title: "Predict sentiment",
	description:
		"Here you can enter arbitrary text and calculate its predicted sentiment. You will also be able to see how much words of interest contributed towards the result.",
	Content: <ExplanationSectionView />,
});
