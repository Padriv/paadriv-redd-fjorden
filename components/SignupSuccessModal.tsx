"use client";

import CheckmarkIcon from "./CheckmarkIcon";
import Modal from "./Modal";

export default function SignupSuccessModal({
	tittel,
	avsnitt1,
	avsnitt2,
	lukk,
	onClose,
}: {
	tittel: string;
	avsnitt1: string;
	avsnitt2: string;
	lukk: string;
	onClose: () => void;
}) {
	return (
		<Modal onClose={onClose}>
			<div className="flex flex-col items-center gap-inline text-center">
				<div className="flex h-14 w-14 items-center justify-center rounded-full bg-green/10">
					<CheckmarkIcon />
				</div>
				<h2 className="text-subheading font-semibold text-ink">{tittel}</h2>
				<p className="text-body text-copy">{avsnitt1}</p>
				<p className="text-body text-copy">{avsnitt2}</p>
				<button
					type="button"
					onClick={onClose}
					className="mt-group flex h-12 items-center justify-center rounded-full bg-accent px-8 text-button font-medium text-on-accent transition-colors hover:bg-accent-hover"
				>
					{lukk}
				</button>
			</div>
		</Modal>
	);
}
