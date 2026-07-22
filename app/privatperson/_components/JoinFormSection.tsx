"use client";

import HeroSection from "@/app/_components/HeroSection";
import IndividualSignupForm from "@/app/privatperson/_components/IndividualSignupForm";
import { useJoinForm } from "@/lib/useJoinForm";

type JoinFormSectionProps = {
	overline: string;
	heading: string;
	subheading?: string;
	description: string;
	buttonLabel: string;
};

export default function JoinFormSection({
	overline,
	heading,
	subheading,
	description,
	buttonLabel,
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
				{showForm && <IndividualSignupForm onClose={onCloseForm} />}
			</div>
		</>
	);
}
