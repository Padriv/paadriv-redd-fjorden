import { client } from "@/lib/client";
import Wave from "./Wave";

async function getPartnerCount() {
	try {
		const partnere = await client.airtable.partnere.list();
		return partnere.length;
	} catch {
		return null;
	}
}

async function getPadriverCount() {
	try {
		const { records } = await client.airtable.padriver.list();
		return records.length;
	} catch {
		return null;
	}
}

export default async function AboutSection() {
	const [partnerCount, padriverCount] = await Promise.all([
		getPartnerCount(),
		getPadriverCount(),
	]);

	const stats = [
		{
			value: partnerCount === null ? "–" : String(partnerCount),
			label: "partnerorganisasjoner",
		},
		{ value: "118", label: "kommuner i nedbørsfeltet" },
		{ value: "2,8 mill", label: "mennesker berørt" },
		{
			value: padriverCount === null ? "–" : String(padriverCount),
			label: "aktive pådrivere",
		},
	];

	return (
		<section className="relative w-full bg-cream px-16 pb-24 pt-40">
			<Wave fillClassName="fill-deep-green" />

			<div className="mx-auto flex max-w-2xl flex-col gap-loose">
				<h2 className="text-section font-semibold text-ink">
					Sammen for Oslofjorden
				</h2>
				<p className="text-body text-copy">
					Oslofjorden er Norges mest belastede fjord. Fiskebestandene har
					kollapset, ålegressengene forsvinner, og den økologiske tilstanden har
					vist få tegn til bedring på over ti år. Til tross for stor innsats fra
					forskere, myndigheter, næringsliv og frivillige, går arbeidet for
					sakte fordi kunnskap, ressurser og initiativer ofte er spredt.
					Oppdrag: Fjorden Vår er et fellesskap som samler mennesker,
					virksomheter og organisasjoner på tvers av sektorer. Sammen kobler vi
					gode ideer, erfaringer og handlekraft, slik at flere løsninger blir
					til konkret handling for en friskere Oslofjord.
				</p>

				<div className="flex flex-wrap gap-cluster">
					{stats.map((stat) => (
						<div key={stat.label} className="flex flex-col gap-tight">
							<span className="text-section font-semibold text-ink">
								{stat.value}
							</span>
							<span className="text-body text-copy">{stat.label}</span>
						</div>
					))}
				</div>
			</div>
		</section>
	);
}
