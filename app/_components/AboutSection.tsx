const stats = [
	{ value: "27", label: "partnerorganisasjoner" },
	{ value: "118", label: "kommuner i nedbørsfeltet" },
	{ value: "2,8 mill", label: "mennesker berørt" },
	{ value: "38", label: "aktive pådrivere" },
];

export default function AboutSection() {
	return (
		<section className="relative w-full bg-cream px-16 pb-24 pt-40">
			<svg
				className="absolute left-0 top-0 h-40 w-full"
				viewBox="0 0 1440 220"
				preserveAspectRatio="none"
				aria-hidden="true"
			>
				<path
					d="M0,110 C360,-80 1080,300 1440,110 L1440,0 L0,0 Z"
					className="fill-deep-green"
				/>
			</svg>

			<div className="mx-auto flex max-w-2xl flex-col gap-6">
				<h2 className="text-2xl font-semibold text-black">
					Sammen for Oslofjorden
				</h2>
				<p className="text-zinc-600">
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

				<div className="flex flex-wrap gap-8">
					{stats.map((stat) => (
						<div key={stat.label} className="flex flex-col gap-1">
							<span className="text-2xl font-semibold text-black">
								{stat.value}
							</span>
							<span className="text-sm text-zinc-600">{stat.label}</span>
						</div>
					))}
				</div>
			</div>
		</section>
	);
}
