"use client";

import CheckmarkIcon from "./CheckmarkIcon";
import Modal from "./Modal";

export default function SignupSuccessModal({
	audience,
	onClose,
}: {
	audience: "pådriver" | "partner";
	onClose: () => void;
}) {
	return (
		<Modal onClose={onClose}>
			<div className="flex flex-col items-center gap-inline text-center">
				<div className="flex h-14 w-14 items-center justify-center rounded-full bg-green/10">
					<CheckmarkIcon />
				</div>
				<h2 className="text-subheading font-semibold text-ink">
					Tusen takk for interessen!
				</h2>
				<p className="text-body text-copy">
					Vi har mottatt registreringen din om å bli {audience} for Oppdrag:
					Fjorden Vår.
				</p>
				<p className="text-body text-copy">
					Du vil snart motta en e-post med informasjon om prosessen videre.
				</p>
				<button
					type="button"
					onClick={onClose}
					className="mt-group flex h-12 items-center justify-center rounded-full bg-accent px-8 text-button font-medium text-on-accent transition-colors hover:bg-accent-hover"
				>
					Lukk
				</button>
			</div>
		</Modal>
	);
}
