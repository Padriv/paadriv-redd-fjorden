import Link from "next/link";
import ScrollReveal from "@/components/ScrollReveal";
import { client } from "@/lib/client";
import Wave from "./Wave";

type CardCopy = {
	tag: string;
	title: string;
	description: string;
	linkLabel: string;
};

async function getCard(nokkelPrefix: string, href: string, fallback: CardCopy) {
	const [tag, title, description, linkLabel] = await Promise.all([
		client.airtable.tekster.get(`${nokkelPrefix}.kategori`, fallback.tag),
		client.airtable.tekster.get(`${nokkelPrefix}.tittel`, fallback.title),
		client.airtable.tekster.get(
			`${nokkelPrefix}.beskrivelse`,
			fallback.description,
		),
		client.airtable.tekster.get(`${nokkelPrefix}.lenke`, fallback.linkLabel),
	]);
	return { tag, title, description, href, linkLabel };
}

export default async function JoinSection() {
	const cards = await Promise.all([
		getCard("forside.bli-med.kort-privatperson", "/privatperson", {
			tag: "Privatperson",
			title: "Bli med som frivillig",
			description:
				"Bidra med din tid, kompetanse eller engasjement. Bli en del av nettverket som driver arbeidet for en frisk Oslofjord fremover.",
			linkLabel: "Les mer og meld deg på",
		}),
		getCard("forside.bli-med.kort-organisasjon", "/organisasjon", {
			tag: "Organisasjon",
			title: "Bli med som partner",
			description:
				"Representerer du en kommune, en bedrift eller en frivillig organisasjon? Bli med i partnerskapet og bidra med ressurser og kompetanse.",
			linkLabel: "Les mer og meld deg på",
		}),
	]);

	return (
		<section
			id="bli-med"
			className="relative w-full bg-deep-green px-4 pb-24 pt-40 md:px-28"
		>
			<Wave fillClassName="fill-cream" />

			<div className="mx-auto flex w-full max-w-5xl flex-col gap-loose sm:flex-row">
				{cards.map((card, index) => (
					<ScrollReveal
						key={card.href}
						delayMs={index * 150}
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
					</ScrollReveal>
				))}
			</div>
		</section>
	);
}
