"use client";

import HeroSection from "@/app/_components/HeroSection";
import OrganizationSignupForm from "@/app/organisasjon/_components/OrganizationSignupForm";
import { useJoinForm } from "@/lib/useJoinForm";

export default function PartnereHero({
	partnerCount,
	loadFailed,
}: {
	partnerCount: number;
	loadFailed: boolean;
}) {
	const { anchorId, showForm, onJoinClick, onCloseForm } = useJoinForm(
		"meld-interesse-partner",
	);

	const intro =
		loadFailed || partnerCount === 0
			? "Møt våre partnere."
			: `Møt våre ${partnerCount} partnere.`;

	return (
		<>
			<HeroSection
				heading="Partnere som drar i samme retning"
				description={`${intro} De representerer bedrifter, kommuner og organisasjoner som bidrar med ressurser, kompetanse og nettverk i arbeidet for en frisk Oslofjord. Som partner er de en synlig del av løsningen. Samtidig gir de sine ansatte noe å engasjere seg i, og blir del av et nettverk som gir verdi tilbake. Vi trenger flere på laget. Kanskje er det dere?`}
				buttonLabel="Meld interesse for å bli partner"
				onJoinClick={onJoinClick}
			/>
			<div id={anchorId} className="w-full scroll-mt-24">
				{showForm && <OrganizationSignupForm onClose={onCloseForm} />}
			</div>
		</>
	);
}
