"use client";

import { useState } from "react";
import Navigationbar from "@/app/_components/Navigationbar";
import BenefitsSection from "@/app/privatperson/_components/BenefitsSection";
import CtaSection from "@/app/privatperson/_components/CtaSection";
import HeroSection from "@/app/privatperson/_components/HeroSection";
import QuotesSection from "@/app/privatperson/_components/QuotesSection";

export default function Privatperson() {
	const [showForm, setShowForm] = useState(false);

	function handleJoinClick() {
		setShowForm(true);
		document.getElementById("meld-deg-pa")?.scrollIntoView({
			behavior: "smooth",
		});
	}

	return (
		<>
			<Navigationbar solid />
			<main className="relative flex min-h-screen flex-col items-center">
				<HeroSection
					showForm={showForm}
					onJoinClick={handleJoinClick}
					onCloseForm={() => setShowForm(false)}
				/>
				<BenefitsSection />
				<QuotesSection />
				<CtaSection showForm={showForm} onJoinClick={handleJoinClick} />
			</main>
		</>
	);
}
