import { client } from "@/lib/client";
import AboutSection from "./_components/AboutSection";
import DepthScale from "./_components/DepthScale";
import Footer from "./_components/Footer";
import HomeHeroSection from "./_components/HomeHeroSection";
import JoinSection from "./_components/JoinSection";
import Navigationbar from "./_components/Navigationbar";
import PaadriverSection from "./_components/PaadriverSection";
import PartnereSection from "./_components/PartnereSection";

export default async function Home() {
	const globalCopy = await client.airtable.tekster.getGlobalCopy();

	return (
		<>
			<DepthScale />
			<main className="flex min-h-screen flex-col items-center bg-deep-green text-cream">
				<Navigationbar {...globalCopy.nav} />
				<HomeHeroSection />
				<AboutSection />
				<JoinSection />
				<PaadriverSection />
				<PartnereSection />
			</main>
			<Footer variant="green" {...globalCopy.footer} />
		</>
	);
}
