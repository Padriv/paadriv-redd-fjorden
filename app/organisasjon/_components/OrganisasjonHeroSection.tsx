"use client";

import HeroSection from "@/app/_components/HeroSection";
import OrganizationSignupForm from "@/app/organisasjon/_components/OrganizationSignupForm";
import { useJoinForm } from "@/lib/useJoinForm";

type OrganisasjonHeroSectionProps = {
	overline: string;
	heading: string;
	description: string;
	buttonLabel: string;
};

export default function OrganisasjonHeroSection({
	overline,
	heading,
	description,
	buttonLabel,
}: OrganisasjonHeroSectionProps) {
	const { anchorId, showForm, onJoinClick, onCloseForm } = useJoinForm(
		"meld-inn-organisasjon",
	);

	return (
		<>
			<HeroSection
				overline={overline}
				heading={heading}
				description={description}
				buttonLabel={buttonLabel}
				onJoinClick={onJoinClick}
			/>
			<div id={anchorId} className="w-full scroll-mt-24">
				{showForm && <OrganizationSignupForm onClose={onCloseForm} />}
			</div>
		</>
	);
}
