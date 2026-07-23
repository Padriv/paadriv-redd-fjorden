import { useRef, useState } from "react";
import { countFitting } from "@/lib/skillFitting";
import { useResizeObserver } from "@/lib/useResizeObserver";

export function useSkillFitting(skills: string[], maxRows: number) {
	const containerRef = useRef<HTMLDivElement>(null);
	const measureRef = useRef<HTMLDivElement>(null);
	const [visibleCount, setVisibleCount] = useState(skills.length);

	useResizeObserver(containerRef, () => {
		const container = containerRef.current;
		const measureContainer = measureRef.current;
		if (!container || !measureContainer) return;

		const containerWidth = container.clientWidth;
		const gap = parseFloat(getComputedStyle(container).columnGap) || 0;

		const widths = Array.from(
			measureContainer.querySelectorAll<HTMLElement>("[data-skill]"),
		).map((el) => el.offsetWidth);
		const buttonWidth =
			measureContainer.querySelector<HTMLElement>("[data-more-button]")
				?.offsetWidth ?? 0;

		let fitCount = countFitting(widths, containerWidth, gap, maxRows);

		while (fitCount > 0 && fitCount < widths.length) {
			const withButton = countFitting(
				[...widths.slice(0, fitCount), buttonWidth],
				containerWidth,
				gap,
				maxRows,
			);
			if (withButton === fitCount + 1) break;
			fitCount--;
		}

		setVisibleCount(fitCount);
	}, [skills]);

	return { containerRef, measureRef, visibleCount };
}
