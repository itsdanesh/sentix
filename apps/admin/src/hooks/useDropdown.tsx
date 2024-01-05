import { cn } from "@/utils/cn";
import {
	ChangeEventHandler,
	DetailedHTMLProps,
	SelectHTMLAttributes,
	useState,
} from "react";

export const useDropdown = <
	TOptions extends { label: string; value: string }[],
>({
	options,
	props,
}: {
	options: TOptions;
	props?: DetailedHTMLProps<
		SelectHTMLAttributes<HTMLSelectElement>,
		HTMLSelectElement
	>;
}): { value: TOptions[number]["value"]; Dropdown: JSX.Element } => {
	const [value, setValue] = useState<string>(
		(props?.defaultValue as string) ?? "",
	);

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
