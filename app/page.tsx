import JoinSection from "./_components/JoinSection";
import PaadriverSection from "./_components/PaadriverSection";
import PartnereSection from "./_components/PartnereSection";

export default function Home() {
	return (
		<main className="flex min-h-screen flex-col items-center justify-center gap-16 bg-[#06402C] px-16 py-32 text-[#F2ECC9]">
			<div className="flex max-w-2xl flex-col gap-6">
				<h1 className="text-3xl font-semibold">
					Oslofjorden trenger flere på laget — bli med og bidra med det du kan
				</h1>
				<JoinSection />
				<PaadriverSection />
			</div>
			<PartnereSection />
		</main>
	);
}
