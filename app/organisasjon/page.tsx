"use client";

import BenefitsSection from "@/app/_components/BenefitsSection";
import CtaSection from "@/app/_components/CtaSection";
import HeroSection from "@/app/_components/HeroSection";
import Navigationbar from "@/app/_components/Navigationbar";
import OrganizationSignupForm from "@/app/organisasjon/_components/OrganizationSignupForm";
import PartnershipSection from "@/app/organisasjon/_components/PartnershipSection";
import { useJoinForm } from "@/lib/useJoinForm";

const buttonLabel = "Meld inn organisasjonen";

const benefits = [
	{
		title: "Konkret samfunnsansvar",
		description:
			"Vis samfunnsansvar i praksis gjennom deltakelse i et prosjekt som gjør en reell forskjell for Oslofjorden.",
	},
	{
		title: "Attraktiv arbeidsplass",
		description:
			"Gi ansatte en meningsfull arena for engasjement og utvikling gjennom arbeidet for fjorden.",
	},
	{
		title: "Sterkere lokal forankring",
		description:
			"Styrk deres posisjon i nærmiljøet gjennom synlig deltakelse i arbeidet for en frisk Oslofjord.",
	},
	{
		title: "Nettverk som gir verdi",
		description:
			"Bli del av et tverrfaglig nettverk av kommuner, bedrifter og frivillige som samarbeider om fjorden.",
	},
];

export default function Organisasjon() {
	const { anchorId, showForm, onJoinClick, onCloseForm } = useJoinForm(
		"meld-inn-organisasjon",
	);

	return (
		<>
			<Navigationbar solid />
			<main className="relative flex min-h-screen flex-col items-center">
				<HeroSection
					overline="For organisasjoner"
					heading="Bli partner for Oslofjorden"
					description="Representerer dere en bedrift, kommune eller frivillig organisasjon? Som partner bidrar dere med ressurser, kompetanse og nettverk inn i arbeidet for en frisk Oslofjord, og blir en synlig del av løsningen."
					buttonLabel={buttonLabel}
					onJoinClick={onJoinClick}
				/>
				<BenefitsSection
					heading="Hvorfor bli partner for Oppdrag: Fjorden Vår?"
					intro="Som partner blir dere del av et fellesskap av bedrifter, kommuner og organisasjoner som går sammen om å gjøre Oslofjorden frisk. Partnerskapet gir verdi for både virksomheten, de ansatte og fjorden dere er en del av."
					benefits={benefits}
				/>
				<PartnershipSection />
				<CtaSection
					heading="Klar til å bli med?"
					description="Det tar bare noen minutter. Fyll ut skjemaet, så tar vi kontakt for å avtale hvordan dere kan bidra."
					buttonLabel={buttonLabel}
					onJoinClick={onJoinClick}
				/>
				<div id={anchorId} className="w-full scroll-mt-24">
					{showForm && <OrganizationSignupForm onClose={onCloseForm} />}
				</div>
			</main>
		</>
	);
}
