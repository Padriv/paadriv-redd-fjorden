import Wave from "@/app/_components/Wave";

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
		<section className="relative flex w-full flex-col items-center bg-deep-green px-16 pb-cluster pt-40 text-cream">
			<Wave fillClassName="fill-cream" />

			<div className="grid w-full max-w-5xl grid-cols-1 gap-cluster lg:grid-cols-2">
				<div className="flex flex-col justify-center gap-group">
					<h2 className="text-section font-semibold">{heading}</h2>
					<p className="text-body">{intro}</p>
				</div>

				<div className="grid auto-rows-fr grid-cols-1 gap-group sm:grid-cols-2">
					{benefits.map((benefit) => (
						<div
							key={benefit.title}
							className="flex h-full flex-col gap-inline rounded-2xl bg-cream p-6 text-ink"
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
