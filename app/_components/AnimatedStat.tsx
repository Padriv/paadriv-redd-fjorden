"use client";

import { useEffect, useRef, useState } from "react";

type AnimatedStatProps = {
	target: number | null;
	label: string;
	decimals?: number;
	suffix?: string;
};

function formatNumber(value: number, decimals: number) {
	return value.toLocaleString("nb-NO", {
		minimumFractionDigits: decimals,
		maximumFractionDigits: decimals,
	});
}

const DURATION_MS = 1200;

export default function AnimatedStat({
	target,
	label,
	decimals = 0,
	suffix = "",
}: AnimatedStatProps) {
	const [display, setDisplay] = useState(
		target === null ? "–" : formatNumber(0, decimals),
	);
	const spanRef = useRef<HTMLSpanElement>(null);
	const animationFrame = useRef<number>(0);

	useEffect(() => {
		if (target === null || !spanRef.current) return;
		const targetValue = target;

		const observer = new IntersectionObserver(
			([entry]) => {
				if (!entry.isIntersecting) return;
				observer.disconnect();

				const prefersReducedMotion = window.matchMedia(
					"(prefers-reduced-motion: reduce)",
				).matches;
				if (prefersReducedMotion) {
					setDisplay(formatNumber(targetValue, decimals));
					return;
				}

				const start = performance.now();

				function tick(now: number) {
					const progress = Math.min((now - start) / DURATION_MS, 1);
					setDisplay(formatNumber(progress * targetValue, decimals));
					if (progress < 1)
						animationFrame.current = requestAnimationFrame(tick);
				}

				animationFrame.current = requestAnimationFrame(tick);
			},
			{ threshold: 0.4 },
		);

		observer.observe(spanRef.current);

		return () => {
			observer.disconnect();
			cancelAnimationFrame(animationFrame.current);
		};
	}, [target, decimals]);

	return (
		<div className="flex flex-col items-center gap-tight text-center">
			<span ref={spanRef} className="text-heading font-semibold text-ink">
				{display}
				{suffix}
			</span>
			<span className="text-body whitespace-pre-line text-copy">{label}</span>
		</div>
	);
}
