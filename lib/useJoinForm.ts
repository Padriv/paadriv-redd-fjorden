import { useState } from "react";

export function useJoinForm(anchorId: string) {
	const [showForm, setShowForm] = useState(false);

	function onJoinClick() {
		setShowForm(true);
		document.getElementById(anchorId)?.scrollIntoView({
			behavior: "smooth",
			block: "start",
		});
	}

	function onCloseForm() {
		setShowForm(false);
	}

	return { anchorId, showForm, onJoinClick, onCloseForm };
}
