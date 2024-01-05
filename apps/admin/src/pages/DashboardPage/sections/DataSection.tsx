import { useMutation, useQuery } from "react-query";
import { Section } from "./Section";
import { useDropdown } from "@/hooks/useDropdown";
import { useInput } from "@/hooks/useInput";
import { MouseEventHandler, ReactNode } from "react";
import { Sentiment, api } from "@/api";
import { Button } from "@/components/Button";
import { useModal } from "@/hooks/useModal";
import { FaTrash } from "react-icons/fa";
import _ from "lodash";

const DataSectionView: React.FC = () => {
	enum Modes {
		SEARCH = "delete",
		CREATE = "create",
	}

	const { value: textMatcher, Input: TextMatcherInput } = useInput({
		placeholder: "Enter matching text",
	});

	const { value: mode, Dropdown: ModeDropdown } = useDropdown({
		options: [
			{ value: Modes.SEARCH, label: "Find and delete data" },
			{ value: Modes.CREATE, label: "Create additional data" },
		],
		props: { defaultValue: Modes.CREATE, className: "w-full" },
	});

	const { mutateAsync: deleteData } = useMutation({
		mutationKey: ["data", "delete"],
		mutationFn: api.deleteData,
	});

	const { mutateAsync: addData } = useMutation({
		mutationKey: ["data", "create"],
		mutationFn: api.addData,
	});

	const {
		data: matchingData,
		isSuccess: matchingDataSuccess,
		refetch: fetchMatchingData,
	} = useQuery({
		queryKey: ["data", "get", textMatcher],
		queryFn: () => api.getData(textMatcher),
		enabled: false,
	});

	const modalClassNames =
		"bg-slate-800 rounded-xl border border-slate-500 overflow-y-scroll p-4 scrollbar-none max-w-[600px] max-h-[600px] flex flex-col gap-3";

	const { Modal: MatchingDataModal, toggleOpen: toggleOpenMatchingDataModel } =
		useModal({
			Content: ({ toggleOpen }) => (
				<div className={modalClassNames}>
					{matchingData?.length === 0
						? `Unable to find any entries matching "${textMatcher}"`
						: matchingDataSuccess
						? matchingData.map((entry) => (
								<div
									key={entry.id}
									className="flex gap-4 items-center border border-slate-500/50 rounded-md p-4"
								>
									<p className="break-all flex-grow">{entry.text}</p>
									<FaTrash
										size={24}
										className="shrink-0 cursor-pointer"
										onClick={async () => {
											await deleteData(entry);
											toggleOpen();
										}}
									/>
								</div>
						  ))
						: "Loading"}
				</div>
			),
		});

	const handleFindData: MouseEventHandler = async () => {
		await fetchMatchingData();
		toggleOpenMatchingDataModel();
	};

	const {
		Input: NewEntryInput,
		value: newEntryText,
		setValue: setNewEntryText,
	} = useInput({
		placeholder: "Enter text",
		className: "flex-grow",
		size: 1,
	});

	const { Dropdown: NewEntryDropdown, value: newEntrySentiment } = useDropdown({
		options: api.sentiments.map((sentiment) => ({
			label: _.upperFirst(sentiment),
			value: _.upperFirst(sentiment),
		})),
		props: { defaultValue: api.sentiments[0] },
	});

	const Renderer: Record<Modes, ReactNode> = {
		[Modes.CREATE]: (
			<div className="flex flex-col gap-3">
				<div className="flex gap-3">
					{NewEntryInput}
					{NewEntryDropdown}
				</div>
				<Button
					disabled={newEntryText.length === 0}
					onClick={async () => {
						await addData({
							text: newEntryText,
							sentiment: newEntrySentiment as Sentiment,
						});
						setNewEntryText("");
					}}
				>
					Create
				</Button>
			</div>
		),
		[Modes.SEARCH]: (
			<div className="flex gap-3 flex-grow">
				{TextMatcherInput}
				{MatchingDataModal}
				<Button
					variant="secondary"
					className="flex-grow"
					onClick={handleFindData}
				>
					Find
				</Button>
			</div>
		),
	};

	return (
		<div className="flex flex-col gap-3 flex-grow shrink-0">
			{ModeDropdown}
			{Renderer[mode]}
		</div>
	);
};

export const DataSection = (): Section => ({
	title: "Data administration",
	description:
		"Here you can either add new data points, or remove data points from the data set. Once any change is done, the model becomes stale.",
	Content: <DataSectionView />,
});
