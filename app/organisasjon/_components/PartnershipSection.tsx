import Wave from "@/app/_components/Wave";
import ScrollReveal from "@/components/ScrollReveal";

type PartnershipSectionProps = {
	heading: string;
	paragraph1: string;
	paragraph2: string;
};

export default function PartnershipSection({
	heading,
	paragraph1,
	paragraph2,
}: PartnershipSectionProps) {
	return (
		<section className="relative flex w-full flex-col items-center bg-deep-green px-4 pb-40 pt-56 text-cream md:px-28">
			<Wave fillClassName="fill-cream" />

			<ScrollReveal className="flex max-w-5xl flex-col gap-group">
				<h2 className="text-section font-bold">{heading}</h2>
				<p className="text-body text-cream/90">{paragraph1}</p>
				<p className="text-body text-cream/90">{paragraph2}</p>
			</ScrollReveal>
		</section>
	);
}
