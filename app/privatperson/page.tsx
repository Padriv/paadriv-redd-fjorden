"use client";

import { useState } from "react";
import Navigationbar from "@/app/_components/Navigationbar";
import IndividualSignupForm from "@/app/privatperson/_components/IndividualSignupForm";
import Button from "@/components/Button";

export default function Privatperson() {
	const [showForm, setShowForm] = useState(false);

	return (
		<>
			<Navigationbar solid />
			<main className="relative flex min-h-screen flex-col items-center justify-center bg-background px-16 py-32">
				<div className="flex max-w-2xl flex-col gap-loose">
					<h1 className="text-heading font-semibold text-ink">Privatperson</h1>
					<p className="text-lead leading-8 text-copy">
						Informasjon om hva det innebærer å bidra som enkeltperson
					</p>
					{!showForm && (
						<Button
							label="Bli med som pådriver"
							onClick={() => setShowForm(true)}
						/>
					)}
					{showForm && (
						<IndividualSignupForm onClose={() => setShowForm(false)} />
					)}
				</div>
			</main>
		</>
		);	
	}
