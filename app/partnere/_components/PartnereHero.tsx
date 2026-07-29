"use client";

import HeroSection from "@/app/_components/HeroSection";
import OrganizationSignupForm from "@/app/organisasjon/_components/OrganizationSignupForm";
import type { PartnerSkjemaCopy } from "@/lib/airtable";
import { useJoinForm } from "@/lib/useJoinForm";

export default function PartnereHero({
	partnerCount,
	loadFailed,
	heading,
	ingressSlutt,
	buttonLabel,
	skjemaCopy,
}: {
	partnerCount: number;
	loadFailed: boolean;
	heading: string;
	ingressSlutt: string;
	buttonLabel: string;
	skjemaCopy: PartnerSkjemaCopy;
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
				heading={heading}
				description={`${intro} ${ingressSlutt}`}
				buttonLabel={buttonLabel}
				onJoinClick={onJoinClick}
			/>
			<div id={anchorId} className="w-full scroll-mt-24">
				{showForm && (
					<OrganizationSignupForm onClose={onCloseForm} copy={skjemaCopy} />
				)}
			</div>
		</>
	);
}
