import AboutSection from "./_components/AboutSection";
import HomeHeroSection from "./_components/HomeHeroSection";
import JoinSection from "./_components/JoinSection";
import Navigationbar from "./_components/Navigationbar";
import PaadriverSection from "./_components/PaadriverSection";
import PartnereSection from "./_components/PartnereSection";

export default function Home() {
	return (
		<main className="flex min-h-screen flex-col items-center bg-deep-green text-cream">
			<Navigationbar />
			<HomeHeroSection />
			<AboutSection />
			<JoinSection />
			<PaadriverSection />
			<div className="flex w-full flex-col items-center gap-section px-16 py-32">
				<PartnereSection />
			</div>
		</main>
	);
}
