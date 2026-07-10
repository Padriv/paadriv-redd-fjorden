import Button from "@/components/Button";

export default function PaadriverSection() {
	return (
		<section className="flex flex-col items-center gap-6 rounded-2xl bg-cream px-12 py-10">
			<h2 className="text-section font-semibold text-ink">Pådrivere</h2>
			<div className="flex flex-wrap justify-center gap-4">
				<Button href="/padriver" label="Pådrivere" />
			</div>
		</section>
	);
}
