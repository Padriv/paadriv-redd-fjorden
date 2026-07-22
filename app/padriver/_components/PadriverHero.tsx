"use client";

import HeroSection from "@/app/_components/HeroSection";
import IndividualSignupForm from "@/app/privatperson/_components/IndividualSignupForm";
import { useJoinForm } from "@/lib/useJoinForm";

export default function PadriverHero({
	padriverCount,
	loadFailed,
}: {
	padriverCount: number;
	loadFailed: boolean;
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
				overline="Frivillig = Pådriver"
				heading="Pådrivere som drar i samme retning"
				description={`${intro} De er ildsjeler, fagfolk og naboer som sammen jobber for en friskere fjord. De bidrar med sin kompetanse og sine erfaringer på samlinger, og er del av et nettverk av mennesker som drar i samme retning. Vi trenger flere på laget. Kanskje er det deg?`}
				buttonLabel="Bli Pådriver"
				onJoinClick={onJoinClick}
			/>
			<div id={anchorId} className="w-full scroll-mt-24">
				{showForm && <IndividualSignupForm onClose={onCloseForm} />}
			</div>
		</>
	);
}
