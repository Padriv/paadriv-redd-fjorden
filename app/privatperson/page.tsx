"use client";

import { useState } from "react";
import Navigationbar from "@/app/_components/Navigationbar";
import BenefitsSection from "@/app/privatperson/_components/BenefitsSection";
import CtaSection from "@/app/privatperson/_components/CtaSection";
import HeroSection from "@/app/privatperson/_components/HeroSection";
import IndividualSignupForm from "@/app/privatperson/_components/IndividualSignupForm";
import QuotesSection from "@/app/privatperson/_components/QuotesSection";

export default function Privatperson() {
	const [showForm, setShowForm] = useState(false);

	function handleJoinClick() {
		setShowForm(true);
		document.getElementById("meld-deg-pa")?.scrollIntoView({
			behavior: "smooth",
			block: "start",
		});
	}

	return (
		<>
			<Navigationbar solid />
			<main className="relative flex min-h-screen flex-col items-center">
				<HeroSection onJoinClick={handleJoinClick} />
				<BenefitsSection />
				<QuotesSection />
				<CtaSection onJoinClick={handleJoinClick} />
				<div id="meld-deg-pa" className="w-full scroll-mt-24">
					{showForm && (
						<IndividualSignupForm onClose={() => setShowForm(false)} />
					)}
				</div>
			</main>
		</>
	);
}
