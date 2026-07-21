import { useRef, useState } from "react";

export function useJoinForm(anchorId: string) {
	const [showForm, setShowForm] = useState(false);
	const scrollPositionRef = useRef(0);

	function onJoinClick() {
		scrollPositionRef.current = window.scrollY;
		setShowForm(true);
		document.getElementById(anchorId)?.scrollIntoView({
			behavior: "smooth",
			block: "start",
		});
	}

	function onCloseForm() {
		setShowForm(false);
		requestAnimationFrame(() => {
			window.scrollTo({ top: scrollPositionRef.current, behavior: "smooth" });
		});
	}

	return { anchorId, showForm, onJoinClick, onCloseForm };
}
