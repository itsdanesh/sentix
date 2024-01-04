import { cn } from "@/utils/cn";
import {
	ChangeEventHandler,
	DetailedHTMLProps,
	SelectHTMLAttributes,
	useState,
} from "react";

export const useDropdown = ({
	options,
	props,
}: {
	options: { label: string; value: string }[];
	props?: DetailedHTMLProps<
		SelectHTMLAttributes<HTMLSelectElement>,
		HTMLSelectElement
	>;
}): { value: string; Dropdown: JSX.Element } => {
	const [value, setValue] = useState(props?.defaultValue ?? "");

	const handleChangeValue: ChangeEventHandler<HTMLSelectElement> = (e) => {
		setValue(e.currentTarget.value);
	};

	const Dropdown = (
		<select
			onChange={handleChangeValue}
			{...props}
			className={cn(
				props?.className,
				"bg-transparent border border-slate-500 px-3 py-2 rounded-xl",
			)}
		>
			{options.map(({ label, value }) => (
				<option key={label} value={value}>
					{label}
				</option>
			))}
		</select>
	);

	return { Dropdown, value };
};
