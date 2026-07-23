import AnimatedStat from "@/app/_components/AnimatedStat";
import ScrollReveal from "@/components/ScrollReveal";
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
		<section className="w-full bg-cream px-4 py-24 md:px-28">
			<div className="mx-auto flex max-w-5xl flex-col gap-loose">
				<ScrollReveal>
					<h2 className="text-section font-bold text-ink">
						Sammen for Oslofjorden
					</h2>
					<p className="mt-group text-body text-copy">
						Oslofjorden er Norges mest belastede fjord. Fiskebestandene har
						kollapset, ålegressengene forsvinner, og den økologiske tilstanden
						har vist få tegn til bedring på over ti år. Til tross for stor
						innsats fra forskere, myndigheter, næringsliv og frivillige, går
						arbeidet for sakte fordi kunnskap, ressurser og initiativer ofte er
						spredt. Prosjektet <em className="mr-1">Oppdrag: Fjorden Vår</em> er
						et fellesskap som samler mennesker, virksomheter og organisasjoner
						på tvers av sektorer. Sammen kobler vi gode ideer, erfaringer og
						handlekraft, slik at flere løsninger blir til konkret handling for
						en friskere Oslofjord.
					</p>
				</ScrollReveal>

				<div className="grid grid-cols-2 gap-group md:grid-cols-4">
					{stats.map((stat, index) => (
						<ScrollReveal key={stat.label} delayMs={index * 100}>
							<AnimatedStat
								target={stat.target}
								label={stat.label}
								decimals={stat.decimals}
								suffix={stat.suffix}
							/>
						</ScrollReveal>
					))}
				</div>
			</div>
		</section>
	);
}
