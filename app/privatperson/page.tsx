import BenefitsSection from "@/app/_components/BenefitsSection";
import Footer from "@/app/_components/Footer";
import Navigationbar from "@/app/_components/Navigationbar";
import JoinFormSection from "@/app/privatperson/_components/JoinFormSection";
import QuotesSection, {
	MIN_QUOTES,
} from "@/app/privatperson/_components/QuotesSection";
import { client } from "@/lib/client";

const buttonLabel = "Bli Pådriver";

const benefits = [
	{
		title: "Handling som merkes",
		description:
			"Vi kobler mennesker, idéer og ressurser til konkrete tiltak som gjør en forskjell for fjorden",
	},
	{
		title: "Fellesskap og nettverk",
		description:
			"Vi bygger nettverk der privatpersoner, fagfolk og organisasjoner finner hverandre",
	},
	{
		title: "Kunnskap i praksis",
		description:
			"Hos oss deles kunnskap gjennom samarbeid og handling, slik at gode idéer blir til løsninger",
	},
	{
		title: "Stort engasjement",
		description:
			"Du trenger ikke ha alle svarene. Bidra med akkurat det du har tid og lyst til",
	},
];

export default async function Privatperson() {
	let quotes: Awaited<ReturnType<typeof client.airtable.quotes.list>> = [];
	try {
		quotes = await client.airtable.quotes.list();
	} catch {
		quotes = [];
	}
	const showQuotes = quotes.length >= MIN_QUOTES;

	return (
		<>
			<Navigationbar solid />
			<main className="relative flex min-h-screen flex-col items-center bg-cream">
				<JoinFormSection
					overline="For privatpersoner"
					heading="Bli frivillig for Oslofjorden"
					subheading="Frivillige = Pådrivere"
					description="Du trenger ikke være ekspert eller ha massevis av tid. Du trenger bare å ville noe for fjorden. Da blir du det vi kaller en Pådriver: en frivillig som bidrar aktivt til å skape gode nærmiljøer og mer bærekraftige samfunn. Du bidrar med din kompetanse og dine erfaringer på samlinger og arrangementer, og blir del av et nettverk av mennesker som drar i samme retning. Enten du har mye eller lite tid, er det alltid en måte å bidra på"
					buttonLabel={buttonLabel}
				/>
				<BenefitsSection
					heading="Hvorfor bli Pådriver?"
					intro="Som Pådriver blir du en del av et fellesskap som deler kunnskap, idéer og engasjement for Oslofjorden. Ingen kan gjøre fjorden frisk alene, derfor samler vi mennesker som vil bidra. Gjennom samlinger og prosjekter møter du mennesker med ulik bakgrunn, lærer av andre og bidrar til konkrete resultater for fjorden. Samtidig blir du en del av et nettverk som kobler mennesker, kompetanse og muligheter. Vi tror det er enklere å skape mer sammen. Du bidrar med det du har tid og lyst til – stort eller smått."
					benefits={benefits}
				/>
				{showQuotes && <QuotesSection quotes={quotes} />}
			</main>
			<Footer variant={showQuotes ? "cream" : "green"} />
		</>
	);
}
