import BenefitsSection from "@/app/_components/BenefitsSection";
import Footer from "@/app/_components/Footer";
import Navigationbar from "@/app/_components/Navigationbar";
import JoinFormSection from "@/app/privatperson/_components/JoinFormSection";
import QuotesSection, {
	MIN_QUOTES,
} from "@/app/privatperson/_components/QuotesSection";
import { client } from "@/lib/client";

async function getHeroCopy() {
	const [overline, heading, subheading, description, buttonLabel] =
		await Promise.all([
			client.airtable.tekster.get(
				"privatperson.hero.overtittel",
				"For privatpersoner",
			),
			client.airtable.tekster.get(
				"privatperson.hero.overskrift",
				"Bli frivillig for Oslofjorden",
			),
			client.airtable.tekster.get(
				"privatperson.hero.undertittel",
				"Frivillige = Pådrivere",
			),
			client.airtable.tekster.get(
				"privatperson.hero.ingress",
				"Du trenger ikke være ekspert eller ha massevis av tid. Du trenger bare å ville noe for fjorden. Da blir du det vi kaller en Pådriver. Det er en frivillig som bidrar aktivt til å skape gode nærmiljøer og mer bærekraftige samfunn. Du bidrar med din kompetanse og dine erfaringer på samlinger og arrangementer, og blir del av et nettverk av mennesker som drar i samme retning. Enten du har mye eller lite tid, er det alltid en måte å bidra på.",
			),
			client.airtable.tekster.get("privatperson.hero.knapp", "Bli Pådriver"),
		]);
	return { overline, heading, subheading, description, buttonLabel };
}

const fordelerFallback = {
	heading: "Hvorfor bli Pådriver?",
	intro:
		"Som Pådriver blir du en del av et fellesskap som deler kunnskap, idéer og engasjement for Oslofjorden. Ingen kan gjøre fjorden frisk alene, derfor samler vi mennesker som vil bidra. Gjennom samlinger og prosjekter møter du mennesker med ulik bakgrunn, lærer av andre og bidrar til konkrete resultater for fjorden. Samtidig blir du en del av et nettverk som kobler mennesker, kompetanse og muligheter.",
	benefits: [
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
	],
};

export default async function Privatperson() {
	let quotes: Awaited<ReturnType<typeof client.airtable.quotes.list>> = [];
	try {
		quotes = await client.airtable.quotes.list();
	} catch {
		quotes = [];
	}
	const showQuotes = quotes.length >= MIN_QUOTES;

	const [heroCopy, fordelerCopy, quotesHeading, globalCopy, skjemaCopy] =
		await Promise.all([
			getHeroCopy(),
			client.airtable.tekster.getKortSeksjon(
				"privatperson.fordeler",
				fordelerFallback,
			),
			client.airtable.tekster.get(
				"privatperson.sitater.overskrift",
				"Hva sier Pådriverne selv?",
			),
			client.airtable.tekster.getGlobalCopy(),
			client.airtable.tekster.getPadriverSkjemaCopy(),
		]);

	return (
		<>
			<Navigationbar solid {...globalCopy.nav} />
			<main className="relative flex min-h-screen flex-col items-center bg-cream">
				<JoinFormSection {...heroCopy} skjemaCopy={skjemaCopy} />
				<BenefitsSection {...fordelerCopy} />
				{showQuotes && (
					<QuotesSection quotes={quotes} heading={quotesHeading} />
				)}
			</main>
			<Footer variant={showQuotes ? "cream" : "green"} {...globalCopy.footer} />
		</>
	);
}
