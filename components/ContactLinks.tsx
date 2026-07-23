"use client";

import { useEffect, useState } from "react";

export default function ContactLinks({
	epost,
	telefon,
}: {
	epost?: string;
	telefon?: string;
}) {
	const [isPhoneRevealed, setIsPhoneRevealed] = useState(false);
	const [isTouchDevice, setIsTouchDevice] = useState(false);

	useEffect(() => {
		setIsTouchDevice(window.matchMedia("(pointer: coarse)").matches);
	}, []);

	if (!epost && !telefon) return null;

	return (
		<div className="flex w-full divide-x divide-border-subtle border-t border-border-subtle pt-group">
			{epost && (
				<a
					href={`mailto:${epost}`}
					className="relative flex flex-1 items-center justify-center gap-inline py-1 text-button font-medium text-green transition-colors hover:text-ink"
				>
					<img src="/svg/mail_green_icon.svg" alt="" className="size-4" />
					E-post
				</a>
			)}
			{telefon &&
				(isPhoneRevealed ? (
					isTouchDevice ? (
						<a
							href={`tel:${telefon.replace(/\s+/g, "")}`}
							className="relative flex flex-1 items-center justify-center gap-inline py-1 text-button font-medium text-green transition-colors hover:text-ink"
						>
							<img src="/svg/phone_green_icon.svg" alt="" className="size-4" />
							{telefon}
						</a>
					) : (
						<button
							type="button"
							onClick={() => setIsPhoneRevealed(false)}
							className="relative flex flex-1 items-center justify-center gap-inline py-1 text-button font-medium text-green transition-colors hover:text-ink"
						>
							<img src="/svg/phone_green_icon.svg" alt="" className="size-4" />
							{telefon}
						</button>
					)
				) : (
					<button
						type="button"
						onClick={() => setIsPhoneRevealed(true)}
						className="relative flex flex-1 items-center justify-center gap-inline py-1 text-button font-medium text-green transition-colors hover:text-ink"
					>
						<img src="/svg/phone_green_icon.svg" alt="" className="size-4" />
						Telefon
					</button>
				))}
		</div>
	);
}
