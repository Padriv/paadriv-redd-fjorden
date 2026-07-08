import Button from "@/components/Button";

export default function PaadriverSection() {
	return (
		<section className="flex flex-col items-center gap-6 rounded-2xl border border-gray-200 bg-gray-50 px-12 py-10">
			<h2 className="text-2xl font-semibold text-black">Pådrivere</h2>
			<div className="flex flex-wrap justify-center gap-4">
				<Button href="/padriver" label="Pådrivere" />
			</div>
		</section>
	);
}
