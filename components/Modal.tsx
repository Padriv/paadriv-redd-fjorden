"use client";

import { useEffect } from "react";
import { createPortal } from "react-dom";

export default function Modal({
	onClose,
	children,
}: {
	onClose: () => void;
	children: React.ReactNode;
}) {
	useEffect(() => {
		function onKeyDown(e: KeyboardEvent) {
			if (e.key === "Escape") onClose();
		}
		document.addEventListener("keydown", onKeyDown);
		const { overflow } = document.body.style;
		document.body.style.overflow = "hidden";
		return () => {
			document.removeEventListener("keydown", onKeyDown);
			document.body.style.overflow = overflow;
		};
	}, [onClose]);

	return createPortal(
		<div className="fixed inset-0 z-50 flex items-center justify-center p-4">
			<button
				type="button"
				aria-label="Lukk"
				onClick={onClose}
				className="absolute inset-0 bg-black/50"
			/>
			<div
				role="dialog"
				aria-modal="true"
				className="relative w-full max-w-md rounded-2xl bg-cream p-8 shadow-xl"
			>
				{children}
			</div>
		</div>,
		document.body,
	);
}
