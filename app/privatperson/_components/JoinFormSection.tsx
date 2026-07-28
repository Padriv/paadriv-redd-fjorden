"use client";

import HeroSection from "@/app/_components/HeroSection";
import IndividualSignupForm from "@/app/privatperson/_components/IndividualSignupForm";
import type { PadriverSkjemaCopy } from "@/lib/airtable";
import { useJoinForm } from "@/lib/useJoinForm";

type JoinFormSectionProps = {
	overline: string;
	heading: string;
	subheading?: string;
	description: string;
	buttonLabel: string;
	skjemaCopy: PadriverSkjemaCopy;
};

export default function JoinFormSection({
	overline,
	heading,
	subheading,
	description,
	buttonLabel,
	skjemaCopy,
}: JoinFormSectionProps) {
	const { anchorId, showForm, onJoinClick, onCloseForm } =
		useJoinForm("meld-deg-pa");

	return (
		<>
			<HeroSection
				overline={overline}
				heading={heading}
				subheading={subheading}
				description={description}
				buttonLabel={buttonLabel}
				onJoinClick={onJoinClick}
			/>
			<div id={anchorId} className="w-full scroll-mt-24">
				{showForm && (
					<IndividualSignupForm onClose={onCloseForm} copy={skjemaCopy} />
				)}
			</div>
		</>
	);
}
