import AnimatedStat from "@/app/_components/AnimatedStat";
import { client } from "@/lib/client";

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
		{ target: padriverCount, label: "aktive\nfrivillige" },
		{ target: partnerCount, label: "engasjerte\npartnere" },
		{
			target: 2.8,
			decimals: 1,
			suffix: " mill",
			label: "mennesker\nberørt",
		},
		{ target: 118, label: "kommuner i\nnedbørsfeltet" },
	];

	return (
		<section className="w-full bg-cream px-10 py-24 md:px-28">
			<div className="mx-auto flex max-w-5xl flex-col gap-loose">
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

				<div className="grid grid-cols-2 gap-group md:grid-cols-4">
					{stats.map((stat) => (
						<AnimatedStat
							key={stat.label}
							target={stat.target}
							label={stat.label}
							decimals={stat.decimals}
							suffix={stat.suffix}
						/>
					))}
				</div>
			</div>
		</section>
	);
}
