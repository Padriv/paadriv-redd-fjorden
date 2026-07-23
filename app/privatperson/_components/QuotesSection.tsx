import Wave from "@/app/_components/Wave";
import { RevealGroup, RevealItem } from "@/components/RevealGroup";
import ScrollReveal from "@/components/ScrollReveal";
import type { QuoteListItem } from "@/lib/airtable";

export const MIN_QUOTES = 3;
const MAX_QUOTES = 3;

type QuotesSectionProps = {
	quotes: QuoteListItem[];
};

export default function QuotesSection({ quotes }: QuotesSectionProps) {
	const visibleQuotes = quotes.slice(0, MAX_QUOTES);

	return (
		<section className="relative flex w-full flex-col items-center bg-deep-green px-4 pb-40 pt-56 text-cream md:px-28">
			<Wave fillClassName="fill-cream" />

			<div className="flex w-full max-w-5xl flex-col gap-group">
				<ScrollReveal>
					<h2 className="text-section font-bold">Hva sier Pådriverne selv?</h2>
				</ScrollReveal>
				<RevealGroup className="flex flex-col gap-group sm:flex-row">
					{visibleQuotes.map((person, index) => (
						<RevealItem
							key={person.id}
							delayMs={index * 100}
							className="flex flex-1 flex-col gap-group rounded-2xl bg-cream p-6"
						>
							<p className="text-body italic text-copy">"{person.quote}"</p>
							<span className="mt-auto text-label font-semibold text-ink">
								{person.name}
							</span>
						</RevealItem>
					))}
				</RevealGroup>
			</div>
		</section>
	);
}
