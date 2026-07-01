"use client";

import { useState } from "react";
import type { Padriver } from "@/lib/airtable";
import Button from "../../../components/Button";
import MultiSelect from "../../../components/MultiSelect";

const skillOptions = [
	"Sosialt entreprenørskap/samfunnsinnovasjon",
	"Forretningsutvikling",
	"Sirkulær økonomi",
	"Ombruk",
	"Arkitektur",
	"Byplanlegging",
	"Nærmiljøutvikling",
	"Naturvern og biologisk mangfold",
	"Offentlig forvaltning",
	"IT",
	"Økonomi",
	"Lovverk",
	"Prosjektutvikling",
	"Kommunikasjon",
	"Forskningsarbeid",
	"Energi",
	"Klimaløsninger",
	"Byggteknisk",
	"Utdanning og opplæring",
	"Sosialt arbeid og inkludering",
	"Eiendom",
	"Frivillig arbeid",
	"Demokrati",
	"Ingen relevant kompetanse eller erfaring, men vil gjerne bidra",
];

export default function IndividualSignupForm({
	onClose,
}: {
	onClose?: () => void;
}) {
	const [name, setName] = useState("");
	const [email, setEmail] = useState("");
	const [phoneNumber, setPhoneNumber] = useState("");
	const [motivation, setMotivation] = useState("");
	const [skills, setSkills] = useState<string[]>([]);
	const [errors, setErrors] = useState<Record<string, string>>({});
	const [submitAttempted, setSubmitAttempted] = useState(false);

	function validate() {
		const newErrors: Record<string, string> = {};
		if (!name.trim()) newErrors.name = "Navn er påkrevd";
		if (!email.trim()) newErrors.email = "E-post er påkrevd";
		else if (!/\S+@\S+\.\S+/.test(email))
			newErrors.email = "Ugyldig e-postadresse";
		if (!phoneNumber.trim()) newErrors.phoneNumber = "Telefonnummer er påkrevd";
		if (!motivation.trim()) newErrors.motivation = "Motivasjon er påkrevd";
		return newErrors;
	}

	function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
		e.preventDefault();
		setSubmitAttempted(true);
		const newErrors = validate();
		if (Object.keys(newErrors).length > 0) {
			setErrors(newErrors);
			return;
		}
		test();
	}

	const createPadriverData = {
		records: [
			{
				fields: {
					Navn: name,
					Telefon: phoneNumber,
					Epost: email,
					Prosjekt: skills,
					Samtykke: "Jeg samtykker",
					"Samtykke offentliggjøre kontaktinfo": true,
				},
			},
		],
	} satisfies Padriver;

	async function test() {
		await fetch("/api/padriver", {
			method: "POST",
			headers: { "Content-Type": "application/json" },
			body: JSON.stringify(createPadriverData),
		});
	}

	return (
		<form
			onSubmit={handleSubmit}
			noValidate
			className="relative p-8 rounded-2xl w-full flex flex-col gap-8"
		>
			<div className="flex items-center justify-between">
				<h2 className="text-xl font-bold">Bli med i Oppdrag: Fjorden Vår</h2>
				{onClose && (
					<button
						type="button"
						onClick={onClose}
						aria-label="Lukk skjema"
						className="text-zinc-400 hover:text-black transition-colors text-2xl leading-none"
					>
						✕
					</button>
				)}
			</div>

			<div className="flex flex-col gap-2">
				<label htmlFor="navn" className="text-sm font-medium">
					Navn <span className="text-red-500">*</span>
				</label>
				<input
					id="navn"
					type="text"
					value={name}
					onChange={(e) => setName(e.target.value)}
					placeholder="Ola Nordmann"
					className="w-full border border-zinc-300 rounded-lg px-3 py-2 text-sm outline-none focus:border-zinc-900"
				/>
				{submitAttempted && errors.name && (
					<p className="text-red-500 text-xs">{errors.name}</p>
				)}
			</div>

			<div className="flex flex-col gap-2">
				<label htmlFor="epost" className="text-sm font-medium">
					E-post <span className="text-red-500">*</span>
				</label>
				<input
					id="epost"
					type="email"
					value={email}
					onChange={(e) => setEmail(e.target.value)}
					placeholder="ola.nordmann@example.com"
					className="w-full border border-zinc-300 rounded-lg px-3 py-2 text-sm outline-none focus:border-zinc-900"
				/>
				{submitAttempted && errors.email && (
					<p className="text-red-500 text-xs">{errors.email}</p>
				)}
			</div>

			<div className="flex flex-col gap-2">
				<label htmlFor="telefon" className="text-sm font-medium">
					Telefon <span className="text-red-500">*</span>
				</label>
				<input
					id="telefon"
					type="tel"
					value={phoneNumber}
					onChange={(e) => setPhoneNumber(e.target.value)}
					placeholder="123 45 678"
					className="w-full border border-zinc-300 rounded-lg px-3 py-2 text-sm outline-none focus:border-zinc-900"
				/>
				{submitAttempted && errors.phoneNumber && (
					<p className="text-red-500 text-xs">{errors.phoneNumber}</p>
				)}
			</div>

			<div className="flex flex-col gap-2">
				<label htmlFor="motivasjon" className="text-sm font-medium">
					Motivasjon <span className="text-red-500">*</span>
				</label>
				<textarea
					id="motivasjon"
					value={motivation}
					onChange={(e) => setMotivation(e.target.value)}
					placeholder="Hvorfor ønsker du å bli pådriver for Oppdrag: Fjorden Vår?"
					rows={4}
					className="w-full border border-zinc-300 rounded-lg px-3 py-2 text-sm outline-none focus:border-zinc-900 resize-none"
				/>
				{submitAttempted && errors.motivation && (
					<p className="text-red-500 text-xs">{errors.motivation}</p>
				)}
			</div>

			<div className="flex flex-col gap-2">
				<p className="text-sm font-medium">
					Har du kompetanse eller erfaring innen noen av områdene under?
				</p>
				<MultiSelect
					options={skillOptions}
					selected={skills}
					setSelected={setSkills}
				/>
			</div>

			{submitAttempted && Object.keys(errors).length > 0 && (
				<p className="text-red-500 text-sm text-center">
					Fyll ut alle påkrevde felt før du sender inn.
				</p>
			)}

			<Button label="Send inn" type="submit" />
		</form>
	);
}
