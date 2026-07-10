import Link from "next/link";
import Wave from "./Wave";

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
			className="relative w-full bg-deep-green px-16 pb-24 pt-40"
		>
			<Wave fillClassName="fill-cream" />

			<div className="mx-auto flex w-full max-w-2xl flex-col gap-stack sm:flex-row">
				{cards.map((card) => (
					<div
						key={card.href}
						className="flex flex-1 flex-col gap-group rounded-2xl bg-cream p-6"
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
