"use client";

import { createContext, useContext, useRef } from "react";
import { revealClassName, revealTransitionDelay } from "@/lib/revealStyle";
import { useInViewOnce } from "@/lib/useInViewOnce";

const RevealGroupContext = createContext(false);

export function RevealGroup({
	children,
	className = "",
	threshold = 0.01,
}: {
	children: React.ReactNode;
	className?: string;
	threshold?: number;
}) {
	const ref = useRef<HTMLDivElement>(null);
	const isVisible = useInViewOnce(ref, threshold);

	return (
		<div ref={ref} className={className}>
			<RevealGroupContext.Provider value={isVisible}>
				{children}
			</RevealGroupContext.Provider>
		</div>
	);
}

export function RevealItem({
	children,
	delayMs = 0,
	className = "",
}: {
	children: React.ReactNode;
	delayMs?: number;
	className?: string;
}) {
	const isVisible = useContext(RevealGroupContext);

	return (
		<div
			style={revealTransitionDelay(isVisible, delayMs)}
			className={revealClassName(isVisible, className)}
		>
			{children}
		</div>
	);
}
