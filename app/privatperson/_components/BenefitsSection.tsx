import Wave from "@/app/_components/Wave";

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

export default function BenefitsSection() {
	return (
		<section className="relative flex w-full flex-col items-center bg-deep-green px-16 pb-cluster pt-40 text-cream">
			<Wave fillClassName="fill-cream" />

			<div className="grid w-full max-w-5xl grid-cols-1 gap-cluster lg:grid-cols-2">
				<div className="flex flex-col justify-center gap-group">
					<h2 className="text-section font-semibold">Hvorfor bli pådriver?</h2>
					<p className="text-body">
						Som pådriver blir du en del av et fellesskap som deler kunnskap,
						idéer og engasjement for Oslofjorden. Ingen kan gjøre fjorden frisk
						alene, derfor samler vi mennesker som vil bidra. Gjennom samlinger
						og prosjekter møter du mennesker med ulik bakgrunn, lærer av andre
						og bidrar til konkrete resultater for fjorden. Samtidig blir du en
						del av et nettverk som kobler mennesker, kompetanse og muligheter.
						Vi tror det er enklere å skape mer sammen. Du bidrar med det du har
						tid og lyst til – stort eller smått.
					</p>
				</div>

				<div className="grid grid-cols-1 gap-group sm:grid-cols-2">
					{benefits.map((benefit) => (
						<div
							key={benefit.title}
							className="flex flex-col gap-inline rounded-2xl bg-cream p-6 text-ink"
						>
							<h3 className="text-subheading font-semibold">{benefit.title}</h3>
							<p className="text-body text-copy">{benefit.description}</p>
						</div>
					))}
				</div>
			</div>
		</section>
	);
}
