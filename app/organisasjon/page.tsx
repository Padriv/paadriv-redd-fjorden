"use client";

import { useState } from "react";
import Navigationbar from "@/app/_components/Navigationbar";
import OrganizationSignupForm from "@/app/organisasjon/_components/OrganizationSignupForm";
import Button from "@/components/Button";

export default function Organisasjon() {
	const [showForm, setShowForm] = useState(false);

	return (
		<>
			<Navigationbar solid />
			<main className="relative flex min-h-screen flex-col items-center justify-center bg-background px-16 py-32">
				<div className="flex max-w-2xl flex-col gap-loose">
					<h1 className="text-3xl font-semibold text-ink">Organisasjon</h1>
					<p className="text-lg leading-8 text-copy">
						Informasjon om hva det innebærer å bidra som organisasjon
					</p>
					{!showForm && (
						<Button
							label="Bli med som partner"
							onClick={() => setShowForm(true)}
						/>
					)}
					{showForm && (
						<OrganizationSignupForm onClose={() => setShowForm(false)} />
					)}
				</div>
			</main>
		</>
	);
}
