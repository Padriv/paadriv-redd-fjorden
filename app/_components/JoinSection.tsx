import Button from "@/components/Button";

export default function JoinSection() {
	return (
		<section
			id="meld-interesse-organisasjon"
			className="flex flex-col items-center gap-6 rounded-2xl border border-gray-200 bg-gray-50 px-12 py-10"
		>
			<h2 className="text-2xl font-semibold text-black">Bli med</h2>
			<div className="flex flex-wrap justify-center gap-4">
				<Button href="/privatperson" label="Privatperson" />
				<Button href="/organisasjon" label="Organisasjon" />
			</div>
		</section>
	);
}
