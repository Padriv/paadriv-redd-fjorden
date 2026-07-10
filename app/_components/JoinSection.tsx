import Link from "next/link";

const cards = [
	{
		tag: "Privatperson",
		title: "Bli pådriver",
		description:
			"Bidra med din tid, kompetanse eller engasjement. Bli en del av nettverket som driver arbeidet for en frisk Oslofjord fremover.",
		href: "/privatperson",
		linkLabel: "Meld deg som pådriver",
	},
	{
		tag: "Organisasjon",
		title: "Bli partner",
		description:
			"Representerer du en kommune, en bedrift eller en frivillig organisasjon? Bli med i partnerskapet og bidra med ressurser og kompetanse.",
		href: "/organisasjon",
		linkLabel: "Meld inn din organisasjon",
	},
];

export default function JoinSection() {
	return (
		<section
			id="meld-interesse-organisasjon"
			className="flex flex-col items-center gap-10 py-8"
		>
			<div className="flex w-full flex-col gap-6 sm:flex-row">
				{cards.map((card) => (
					<div
						key={card.href}
						className="flex flex-1 flex-col gap-4 rounded-2xl bg-cream p-6"
					>
						<span className="w-fit rounded-full bg-green/10 px-3 py-1 text-caption font-medium text-green">
							{card.tag}
						</span>
						<h3 className="text-subheading font-semibold text-ink">
							{card.title}
						</h3>
						<p className="text-body text-copy">{card.description}</p>
						<Link
							href={card.href}
							className="text-link font-medium text-green transition-colors hover:text-ink"
						>
							{card.linkLabel} →
						</Link>
					</div>
				))}
			</div>
		</section>
	);
}
