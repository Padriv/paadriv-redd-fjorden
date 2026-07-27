import Footer from "@/app/_components/Footer";
import Navigationbar from "@/app/_components/Navigationbar";
import PartnereHero from "@/app/partnere/_components/PartnereHero";
import { RevealGroup, RevealItem } from "@/components/RevealGroup";
import { client } from "@/lib/client";
import PartnerCard from "./_components/PartnerCard";

async function getPartnereHeroCopy() {
	const [heading, ingressSlutt, buttonLabel] = await Promise.all([
		client.airtable.tekster.get(
			"partnere.hero.overskrift",
			"Partnere som drar i samme retning",
		),
		client.airtable.tekster.get(
			"partnere.hero.ingress",
			"De representerer bedrifter, kommuner og organisasjoner som bidrar med ressurser, kompetanse og nettverk i arbeidet for en frisk Oslofjord. Som partner er de en synlig del av løsningen. Samtidig gir de sine ansatte noe å engasjere seg i, og blir del av et nettverk som gir verdi tilbake. Vi trenger flere på laget. Kanskje er det dere?",
		),
		client.airtable.tekster.get(
			"partnere.hero.knapp",
			"Meld interesse for å bli partner",
		),
	]);
	return { heading, ingressSlutt, buttonLabel };
}

export default async function Partnere() {
	let partnere: Awaited<ReturnType<typeof client.airtable.partnere.list>> = [];
	let loadFailed = false;

	try {
		partnere = await client.airtable.partnere.list();
	} catch {
		loadFailed = true;
	}

	const [heroCopy, feilmelding, tomListe, taKontaktTekst, globalCopy] =
		await Promise.all([
			getPartnereHeroCopy(),
			client.airtable.tekster.get(
				"partnere.liste.feilmelding",
				"Beklager, vi klarer dessverre ikke å laste partnere akkurat nå. Prøv igjen om litt.",
			),
			client.airtable.tekster.get(
				"partnere.liste.tom",
				"Ingen partnere å vise ennå.",
			),
			client.airtable.tekster.get("partnere.kort.knapp", "Ta kontakt"),
			client.airtable.tekster.getGlobalCopy(),
		]);

	return (
		<>
			<Navigationbar {...globalCopy.nav} />
			<main className="relative flex min-h-screen w-full flex-col items-center bg-deep-green">
				<PartnereHero
					partnerCount={partnere.length}
					loadFailed={loadFailed}
					{...heroCopy}
				/>
				<div className="flex w-full flex-col items-center px-4 pb-32 md:px-28">
					<div className="flex w-full max-w-5xl flex-col gap-loose">
						{loadFailed && (
							<p className="text-body text-muted-inverse">{feilmelding}</p>
						)}
						{!loadFailed && partnere.length === 0 && (
							<p className="text-body text-muted-inverse">{tomListe}</p>
						)}
						<RevealGroup className="grid grid-cols-1 gap-group sm:grid-cols-2 lg:grid-cols-4">
							{partnere.map((partner, index) => (
								<RevealItem
									key={partner.id}
									delayMs={Math.min(index * 60, 600)}
								>
									<PartnerCard
										partner={partner}
										taKontaktTekst={taKontaktTekst}
									/>
								</RevealItem>
							))}
						</RevealGroup>
					</div>
				</div>
			</main>
			<Footer variant="cream" {...globalCopy.footer} />
		</>
	);
}
