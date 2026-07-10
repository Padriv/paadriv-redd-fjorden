"use client";

import Link from "next/link";
import { useState } from "react";
import OrganizationSignupForm from "@/app/organisasjon/_components/OrganizationSignupForm";
import Button from "@/components/Button";

export default function Organisasjon() {
	const [showForm, setShowForm] = useState(false);

	return (
		<main className="relative flex min-h-screen flex-col items-center justify-center bg-background px-16 py-32">
			<Link
				href="/"
				className="absolute left-16 top-10 flex w-fit items-center gap-inline text-link text-muted transition-colors hover:text-ink"
			>
				← Tilbake
			</Link>
			<div className="flex max-w-2xl flex-col gap-stack">
				<h1 className="text-heading font-semibold text-ink">Organisasjon</h1>
				<p className="text-lead leading-8 text-copy">
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
	);
}
