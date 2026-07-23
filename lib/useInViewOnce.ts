import { type RefObject, useEffect, useState } from "react";

export function useInViewOnce(ref: RefObject<Element | null>, threshold = 0.2) {
	const [isVisible, setIsVisible] = useState(false);

	useEffect(() => {
		const el = ref.current;
		if (!el) return;

		const observer = new IntersectionObserver(
			([entry]) => {
				if (entry.isIntersecting) {
					setIsVisible(true);
					observer.disconnect();
				}
			},
			{ threshold },
		);
		observer.observe(el);
		return () => observer.disconnect();
	}, [ref, threshold]);

	return isVisible;
}
