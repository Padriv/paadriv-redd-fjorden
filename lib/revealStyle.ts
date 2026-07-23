export function revealTransitionDelay(isVisible: boolean, delayMs: number) {
	return { transitionDelay: isVisible ? `${delayMs}ms` : "0ms" };
}

export function revealClassName(isVisible: boolean, className = "") {
	return `transition-all duration-700 ease-out motion-reduce:transition-none motion-reduce:opacity-100 motion-reduce:translate-y-0 ${
		isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
	} ${className}`;
}
