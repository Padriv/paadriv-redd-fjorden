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
			className="relative w-full bg-deep-green px-16 pb-24 pt-40"
		>
			<svg
				className="absolute left-0 top-0 h-40 w-full"
				viewBox="0 0 1440 220"
				preserveAspectRatio="none"
				aria-hidden="true"
			>
				<path
					d="M0,110 C360,-80 1080,300 1440,110 L1440,0 L0,0 Z"
					className="fill-cream"
				/>
			</svg>

			<div className="mx-auto flex w-full max-w-2xl flex-col gap-6 sm:flex-row">
				{cards.map((card) => (
					<div
						key={card.href}
						className="flex flex-1 flex-col gap-4 rounded-2xl bg-cream p-6"
					>
						<span className="w-fit rounded-full bg-tan px-3 py-1 text-xs font-medium text-green">
							{card.tag}
						</span>
						<h3 className="text-lg font-semibold text-black">{card.title}</h3>
						<p className="text-sm text-zinc-600">{card.description}</p>
						<Link
							href={card.href}
							className="text-sm font-medium text-green transition-colors hover:text-black"
						>
							{card.linkLabel} →
						</Link>
					</div>
				))}
			</div>
		</section>
	);
}
