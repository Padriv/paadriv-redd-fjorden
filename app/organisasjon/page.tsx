import BenefitsSection from "@/app/_components/BenefitsSection";
import Footer from "@/app/_components/Footer";
import Navigationbar from "@/app/_components/Navigationbar";
import OrganisasjonHeroSection from "@/app/organisasjon/_components/OrganisasjonHeroSection";
import PartnershipSection from "@/app/organisasjon/_components/PartnershipSection";
import { client } from "@/lib/client";

async function getHeroCopy() {
	const [overline, heading, description, buttonLabel] = await Promise.all([
		client.airtable.tekster.get(
			"organisasjon.hero.overtittel",
			"For organisasjoner",
		),
		client.airtable.tekster.get(
			"organisasjon.hero.overskrift",
			"Bli partner for Oslofjorden",
		),
		client.airtable.tekster.get(
			"organisasjon.hero.ingress",
			"Representerer dere en bedrift, kommune eller frivillig organisasjon? Som partner bidrar dere med ressurser, kompetanse og nettverk inn i arbeidet for en frisk Oslofjord, og blir en synlig del av løsningen.",
		),
		client.airtable.tekster.get(
			"organisasjon.hero.knapp",
			"Meld interesse for å bli partner",
		),
	]);
	return { overline, heading, description, buttonLabel };
}

const fordelerFallback = {
	heading: "Hvorfor bli partner?",
	intro:
		"Som partner blir dere del av et fellesskap av bedrifter, kommuner og organisasjoner som går sammen om å gjøre Oslofjorden frisk. Partnerskapet gir verdi for både virksomheten, de ansatte og fjorden dere er en del av.",
	benefits: [
		{
			title: "Konkret samfunnsansvar",
			description:
				"Vis samfunnsansvar i praksis gjennom deltakelse i et prosjekt som gjør en reell forskjell for Oslofjorden",
		},
		{
			title: "Attraktiv arbeidsplass",
			description:
				"Gi ansatte en meningsfull arena for engasjement og utvikling gjennom arbeidet for fjorden",
		},
		{
			title: "Sterkere lokal forankring",
			description:
				"Styrk deres posisjon i nærmiljøet gjennom synlig deltakelse i arbeidet for en frisk Oslofjord",
		},
		{
			title: "Nettverk som gir verdi",
			description:
				"Bli del av et tverrfaglig nettverk av kommuner, bedrifter og frivillige som samarbeider om fjorden",
		},
	],
};

async function getSpleiselagCopy() {
	const [heading, paragraph1, paragraph2] = await Promise.all([
		client.airtable.tekster.get(
			"organisasjon.spleiselag.overskrift",
			"Et spleiselag for fjorden",
		),
		client.airtable.tekster.get(
			"organisasjon.spleiselag.avsnitt-1",
			"Prosjektet Oppdrag: Fjorden Vår finansieres gjennom bidrag fra partnere, tilskudd og prosjektmidler. Partnerbidraget går direkte til å realisere tiltak og styrke arbeidet for en frisk Oslofjord. Vi selger ikke tjenester og tar ikke ut overskudd. Bidraget trenger ikke være penger. Dere kan også allokere personer eller stillingsbrøker til innsatsgruppen, eller bidra på andre måter som gir verdi.",
		),
		client.airtable.tekster.get(
			"organisasjon.spleiselag.avsnitt-2",
			"Partnerskapet handler om mer enn et bidrag. Som partner stiller dere dere bak formålet til Oppdrag: Fjorden Vår, deltar på partnersamlinger og bidrar til å forankre arbeidet i egen virksomhet. Til gjengjeld blir dere en synlig del av et fellesskap som jobber sammen for en frisk Oslofjord.",
		),
	]);
	return { heading, paragraph1, paragraph2 };
}

export default async function Organisasjon() {
	const [heroCopy, fordelerCopy, spleiselagCopy, globalCopy] =
		await Promise.all([
			getHeroCopy(),
			client.airtable.tekster.getKortSeksjon(
				"organisasjon.fordeler",
				fordelerFallback,
			),
			getSpleiselagCopy(),
			client.airtable.tekster.getGlobalCopy(),
		]);

	return (
		<>
			<Navigationbar solid {...globalCopy.nav} />
			<main className="relative flex min-h-screen flex-col items-center">
				<OrganisasjonHeroSection {...heroCopy} />
				<BenefitsSection {...fordelerCopy} />
				<PartnershipSection {...spleiselagCopy} />
			</main>
			<Footer variant="cream" {...globalCopy.footer} />
		</>
	);
}
