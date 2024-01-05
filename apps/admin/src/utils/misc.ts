export const misc = {
	truncate: (input: number, digits: number = 1): number => {
		const multi = Math.pow(10, digits);
		return Math.floor(input * multi) / multi;
	},
};
