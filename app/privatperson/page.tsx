"use client";

import BenefitsSection from "@/app/_components/BenefitsSection";
import CtaSection from "@/app/_components/CtaSection";
import Footer from "@/app/_components/Footer";
import HeroSection from "@/app/_components/HeroSection";
import Navigationbar from "@/app/_components/Navigationbar";
import IndividualSignupForm from "@/app/privatperson/_components/IndividualSignupForm";
import QuotesSection from "@/app/privatperson/_components/QuotesSection";
import { useJoinForm } from "@/lib/useJoinForm";

const buttonLabel = "Bli pådriver";

const benefits = [
	{
		title: "Handling som merkes",
		description:
			"Vi kobler mennesker, idéer og ressurser til konkrete tiltak som gjør en forskjell for fjorden",
	},
	{
		title: "Fellesskap og nettverk",
		description:
			"Vi bygger nettverk der privatpersoner, fagfolk og organisasjoner finner hverandre.",
	},
	{
		title: "Kunnskap i praksis",
		description:
			"Hos oss deles kunnskap gjennom samarbeid og handling, slik at gode idéer blir til løsninger.",
	},
	{
		title: "Stort engasjement",
		description:
			"Du trenger ikke ha alle svarene. Bidra med akkurat det du har tid og lyst til",
	},
];

export default function Privatperson() {
	const { anchorId, showForm, onJoinClick, onCloseForm } =
		useJoinForm("meld-deg-pa");

	return (
		<>
			<Navigationbar solid />
			<main className="relative flex min-h-screen flex-col items-center">
				<HeroSection
					overline="For privatpersoner"
					heading="Bli frivillig for Oslofjorden"
					subheading="Frivillige = pådrivere"
					description="Du trenger ikke være ekspert eller ha massevis av tid. Du trenger bare å ville noe for fjorden. Da blir du det vi kaller en pådriver: en frivillig som bidrar aktivt til å skape gode nærmiljøer og mer bærekraftige samfunn. Du bidrar med din kompetanse og dine erfaringer på samlinger og arrangementer, og blir del av et nettverk av mennesker som drar i samme retning. Enten du har mye eller lite tid, er det alltid en måte å bidra på"
					buttonLabel={buttonLabel}
					onJoinClick={onJoinClick}
				/>
				<div id={anchorId} className="w-full scroll-mt-24">
					{showForm && <IndividualSignupForm onClose={onCloseForm} />}
				</div>
				<BenefitsSection
					heading="Hvorfor bli pådriver?"
					intro="Som pådriver blir du en del av et fellesskap som deler kunnskap, idéer og engasjement for Oslofjorden. Ingen kan gjøre fjorden frisk alene, derfor samler vi mennesker som vil bidra. Gjennom samlinger og prosjekter møter du mennesker med ulik bakgrunn, lærer av andre og bidrar til konkrete resultater for fjorden. Samtidig blir du en del av et nettverk som kobler mennesker, kompetanse og muligheter. Vi tror det er enklere å skape mer sammen. Du bidrar med det du har tid og lyst til – stort eller smått."
					benefits={benefits}
				/>
				<QuotesSection />
				<CtaSection
					heading="Klar til å bli med?"
					description="Det tar bare to minutter. Fyll ut skjemaet, så tar vi kontakt for å finne ut hvor du kan gjøre størst forskjell."
					buttonLabel={buttonLabel}
					onJoinClick={onJoinClick}
				/>
			</main>
			<Footer variant="green" />
		</>
	);
}
