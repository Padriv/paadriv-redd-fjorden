"use client";

import HeroSection from "@/app/_components/HeroSection";
import IndividualSignupForm from "@/app/privatperson/_components/IndividualSignupForm";
import { useJoinForm } from "@/lib/useJoinForm";

export default function PadriverHero({
	padriverCount,
	loadFailed,
	overline,
	heading,
	ingressSlutt,
	buttonLabel,
}: {
	padriverCount: number;
	loadFailed: boolean;
	overline: string;
	heading: string;
	ingressSlutt: string;
	buttonLabel: string;
}) {
	const { anchorId, showForm, onJoinClick, onCloseForm } =
		useJoinForm("bli-padriver");

	const intro =
		loadFailed || padriverCount === 0
			? "Møt våre Pådrivere."
			: `Møt våre ${padriverCount} Pådrivere.`;

	return (
		<>
			<HeroSection
				overline={overline}
				heading={heading}
				description={`${intro} ${ingressSlutt}`}
				buttonLabel={buttonLabel}
				onJoinClick={onJoinClick}
			/>
			<div id={anchorId} className="w-full scroll-mt-24">
				{showForm && <IndividualSignupForm onClose={onCloseForm} />}
			</div>
		</>
	);
}
