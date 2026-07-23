import Wave from "@/app/_components/Wave";
import { RevealGroup, RevealItem } from "@/components/RevealGroup";
import ScrollReveal from "@/components/ScrollReveal";

type Benefit = {
	title: string;
	description: string;
};

type BenefitsSectionProps = {
	heading: string;
	intro: string;
	benefits: Benefit[];
};

export default function BenefitsSection({
	heading,
	intro,
	benefits,
}: BenefitsSectionProps) {
	return (
		<section className="relative flex w-full flex-col items-center bg-cream px-4 pb-40 pt-56 text-ink md:px-28">
			<Wave fillClassName="fill-deep-green" />

			<div className="grid w-full max-w-5xl grid-cols-1 gap-cluster lg:grid-cols-[2fr_3fr]">
				<ScrollReveal className="flex flex-col justify-center gap-group">
					<h2 className="text-section font-bold">{heading}</h2>
					<p className="text-body text-copy">{intro}</p>
				</ScrollReveal>

				<RevealGroup className="grid auto-rows-fr grid-cols-1 gap-group sm:grid-cols-2">
					{benefits.map((benefit, index) => (
						<RevealItem
							key={benefit.title}
							delayMs={index * 100}
							className="flex h-full flex-col gap-inline rounded-2xl bg-deep-green p-6 text-cream"
						>
							<h3 className="text-balance text-card-heading font-semibold">
								{benefit.title}
							</h3>
							<p className="text-card-body text-cream/80">
								{benefit.description}
							</p>
						</RevealItem>
					))}
				</RevealGroup>
			</div>
		</section>
	);
}
