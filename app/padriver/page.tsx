import Footer from "@/app/_components/Footer";
import Navigationbar from "@/app/_components/Navigationbar";
import { RevealGroup, RevealItem } from "@/components/RevealGroup";
import { client } from "@/lib/client";
import PadriverCard from "./_components/PadriverCard";
import PadriverHero from "./_components/PadriverHero";

async function getPadriverHeroCopy() {
	const [overline, heading, ingressSlutt, buttonLabel] = await Promise.all([
		client.airtable.tekster.get(
			"padriver.hero.overtittel",
			"Frivillig = Pådriver",
		),
		client.airtable.tekster.get(
			"padriver.hero.overskrift",
			"Pådrivere som drar i samme retning",
		),
		client.airtable.tekster.get(
			"padriver.hero.ingress",
			"De er ildsjeler, fagfolk og naboer som sammen jobber for en friskere fjord. De bidrar med sin kompetanse og sine erfaringer på samlinger, og er del av et nettverk av mennesker som drar i samme retning. Vi trenger flere på laget. Kanskje er det deg?",
		),
		client.airtable.tekster.get("padriver.hero.knapp", "Bli Pådriver"),
	]);
	return { overline, heading, ingressSlutt, buttonLabel };
}

export default async function Padrivere() {
	let records: Awaited<
		ReturnType<typeof client.airtable.padriver.list>
	>["records"] = [];
	let loadFailed = false;

	try {
		({ records } = await client.airtable.padriver.list());
	} catch {
		loadFailed = true;
	}

	const [
		heroCopy,
		feilmelding,
		tomListe,
		lesMerTekst,
		globalCopy,
		skjemaCopy,
		kontaktlenkerCopy,
	] = await Promise.all([
		getPadriverHeroCopy(),
		client.airtable.tekster.get(
			"padriver.liste.feilmelding",
			"Beklager, vi klarer dessverre ikke å laste Pådrivere akkurat nå. Prøv igjen om litt.",
		),
		client.airtable.tekster.get(
			"padriver.liste.tom",
			"Ingen Pådrivere å vise ennå.",
		),
		client.airtable.tekster.get("padriver.kort.knapp", "Les mer"),
		client.airtable.tekster.getGlobalCopy(),
		client.airtable.tekster.getPadriverSkjemaCopy(),
		client.airtable.tekster.getKontaktlenkerCopy(),
	]);

	return (
		<>
			<Navigationbar {...globalCopy.nav} />
			<main className="relative flex min-h-screen w-full flex-col items-center bg-deep-green">
				<PadriverHero
					padriverCount={records.length}
					loadFailed={loadFailed}
					{...heroCopy}
					skjemaCopy={skjemaCopy}
				/>
				<div className="flex w-full flex-col items-center px-4 pb-32 md:px-28">
					<div className="flex w-full max-w-5xl flex-col gap-loose">
						{loadFailed && (
							<p className="text-body text-muted-inverse">{feilmelding}</p>
						)}
						{!loadFailed && records.length === 0 && (
							<p className="text-body text-muted-inverse">{tomListe}</p>
						)}
						<RevealGroup className="grid grid-cols-1 gap-group sm:grid-cols-2 lg:grid-cols-3">
							{records.map((record, index) => (
								<RevealItem key={record.id} delayMs={Math.min(index * 60, 600)}>
									<PadriverCard
										record={record}
										lesMerTekst={lesMerTekst}
										kontaktlenkerCopy={kontaktlenkerCopy}
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
