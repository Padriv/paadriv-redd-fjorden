import Link from "next/link";
import Wave from "./Wave";

const cards = [
	{
		tag: "Privatperson",
		title: "Bli med som frivillig",
		description:
			"Bidra med din tid, kompetanse eller engasjement. Bli en del av nettverket som driver arbeidet for en frisk Oslofjord fremover.",
		href: "/privatperson",
		linkLabel: "Les mer og meld deg på",
	},
	{
		tag: "Organisasjon",
		title: "Bli med som partner",
		description:
			"Representerer du en kommune, en bedrift eller en frivillig organisasjon? Bli med i partnerskapet og bidra med ressurser og kompetanse.",
		href: "/organisasjon",
		linkLabel: "Les mer og meld deg på",
	},
];

export default function JoinSection() {
	return (
		<section
			id="bli-med"
			className="relative w-full bg-deep-green px-4 pb-24 pt-40 md:px-28"
		>
			<Wave fillClassName="fill-cream" />

			<div className="mx-auto flex w-full max-w-5xl flex-col gap-loose sm:flex-row">
				{cards.map((card) => (
					<div
						key={card.href}
						className="flex flex-1 flex-col gap-group rounded-2xl bg-cream p-6"
					>
						<span className="w-fit rounded-full bg-green/10 px-3 py-1 text-link font-medium text-green">
							{card.tag}
						</span>
						<h3 className="text-subheading font-semibold text-ink">
							{card.title}
						</h3>
						<p className="text-body text-copy">{card.description}</p>
						<Link
							href={card.href}
							className="self-end text-base font-semibold text-green transition-colors hover:text-ink md:text-lg"
						>
							{card.linkLabel} →
						</Link>
					</div>
				))}
			</div>
		</section>
	);
}
