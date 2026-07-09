import AboutSection from "./_components/AboutSection";
import Hero from "./_components/Hero";
import JoinSection from "./_components/JoinSection";
import PaadriverSection from "./_components/PaadriverSection";
import PartnereSection from "./_components/PartnereSection";

export default function Home() {
	return (
		<main className="flex min-h-screen flex-col items-center bg-white">
			<Hero />
			<AboutSection />
			<JoinSection />
			<div className="flex w-full flex-col items-center gap-16 px-16 py-32">
				<div className="flex max-w-2xl flex-col gap-6">
					<PaadriverSection />
				</div>
				<PartnereSection />
			</div>
		</main>
	);
}
