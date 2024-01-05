export type ArrayMap<TSource, TDestination> = (
	element: TSource,
	index: number,
	arr: TSource[],
) => TDestination;
