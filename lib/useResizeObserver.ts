import { type DependencyList, type RefObject, useLayoutEffect } from "react";

export function useResizeObserver(
	ref: RefObject<Element | null>,
	onResize: () => void,
	deps: DependencyList = [],
) {
	useLayoutEffect(() => {
		const el = ref.current;
		if (!el) return;

		onResize();
		const observer = new ResizeObserver(onResize);
		observer.observe(el);
		return () => observer.disconnect();
	}, deps);
}
