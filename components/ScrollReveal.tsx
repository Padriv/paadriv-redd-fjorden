"use client";

import { useRef } from "react";
import { revealClassName, revealTransitionDelay } from "@/lib/revealStyle";
import { useInViewOnce } from "@/lib/useInViewOnce";

export default function ScrollReveal({
	children,
	delayMs = 0,
	className = "",
}: {
	children: React.ReactNode;
	delayMs?: number;
	className?: string;
}) {
	const ref = useRef<HTMLDivElement>(null);
	const isVisible = useInViewOnce(ref, 0.2);

	return (
		<div
			ref={ref}
			style={revealTransitionDelay(isVisible, delayMs)}
			className={revealClassName(isVisible, className)}
		>
			{children}
		</div>
	);
}
