import Wave from "@/app/_components/Wave";

const quotes = [
	{
		quote: "Jeg trodde jeg måtte være ekspert. Det holdt å møte opp.",
		name: "Mette Hansen",
		role: "Pådriver, Nesodden",
	},
	{
		quote:
			"Plutselig var vi femten stykker på stranda en lørdag. Det er sånt som forandrer et nabolag.",
		name: "Lars Odden",
		role: "Pådriver, Drøbak",
	},
	{
		quote:
			"Som marinbiolog får jeg endelig brukt fagkunnskapen til noe helt konkret.",
		name: "Jonas Berg",
		role: "Pådriver, Oslo",
	},
];

export default function QuotesSection() {
	return (
		<section className="relative flex w-full flex-col items-center bg-background px-16 pb-cluster pt-40">
			<Wave fillClassName="fill-deep-green" />

			<div className="flex max-w-2xl flex-col gap-group">
				<h2 className="text-section font-semibold text-ink">
					Hva sier pådriverne selv?
				</h2>
				<div className="flex flex-col gap-group sm:flex-row">
					{quotes.map((person) => (
						<div
							key={person.name}
							className="flex flex-1 flex-col gap-group rounded-2xl bg-cream p-6"
						>
							<p className="text-body italic text-copy">"{person.quote}"</p>
							<div className="flex items-center gap-inline">
								<span className="h-8 w-8 shrink-0 rounded-full bg-tan" />
								<div className="flex flex-col">
									<span className="text-label font-semibold text-ink">
										{person.name}
									</span>
									<span className="text-caption text-muted">{person.role}</span>
								</div>
							</div>
						</div>
					))}
				</div>
			</div>
		</section>
	);
}
