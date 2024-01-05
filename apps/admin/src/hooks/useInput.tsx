import { Input, InputProps } from "@/components/Input";
import { ChangeEventHandler, useState } from "react";

export const useInput = (props?: InputProps) => {
	const [value, setValue] = useState("");

	const handleChangeValue: ChangeEventHandler<HTMLInputElement> = (e) => {
		setValue(e.currentTarget.value);
		props?.onChange && props.onChange(e);
	};

	return {
		Input: <Input value={value} onChange={handleChangeValue} {...props} />,
		value,
		setValue,
	};
};
