"use client";

import { useEffect, useRef } from "react";
import CloseButton from "./CloseButton";

export default function Modal({
	onClose,
	children,
	ariaLabelledBy,
	className = "m-auto w-[calc(100vw-2rem)] max-w-md rounded-2xl bg-cream p-8 shadow-xl backdrop:bg-black/50",
	closeButtonClassName = "absolute -right-2 -top-2 flex h-8 w-8 items-center justify-center rounded-full text-copy transition-colors hover:bg-green/10 hover:text-ink",
}: {
	onClose: () => void;
	children: React.ReactNode;
	ariaLabelledBy?: string;
	className?: string;
	closeButtonClassName?: string;
}) {
	const dialogRef = useRef<HTMLDialogElement>(null);

	useEffect(() => {
		const dialog = dialogRef.current;
		if (!dialog) return;

		dialog.showModal();
		return () => dialog.close();
	}, []);

	return (
		<dialog
			ref={dialogRef}
			aria-labelledby={ariaLabelledBy}
			onCancel={(event) => {
				event.preventDefault();
				onClose();
			}}
			onClick={(event) => {
				if (event.target === dialogRef.current) onClose();
			}}
			className={className}
		>
			<div className="relative">
				<CloseButton onClick={onClose} className={closeButtonClassName} />
				{children}
			</div>
		</dialog>
	);
}
