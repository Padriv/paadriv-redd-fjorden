"use client";

import { useForm } from "@tanstack/react-form";
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
	const form = useForm({
		defaultValues: {
			navn: "",
			epost: "",
			telefon: "",
			motivasjon: "",
			kompetanse: [] as string[],
		},
		onSubmit: async ({ value }) => {
			await fetch("/api/padriver", {
				method: "POST",
				headers: { "Content-Type": "application/json" },
				body: JSON.stringify({
					records: [
						{
							fields: {
								Navn: value.navn,
								Telefon: value.telefon,
								Epost: value.epost,
								Motivasjon: value.motivasjon,
								Kompetanse: value.kompetanse,
								Samtykke: "Jeg samtykker",
								"Samtykke offentliggjøre kontaktinfo": true,
							},
						},
					],
				} satisfies Padriver),
			});
			onClose?.();
		},
	});

	return (
		<form
			onSubmit={(e) => {
				e.preventDefault();
				form.handleSubmit();
			}}
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

			<form.Field
				name="navn"
				validators={{
					onSubmit: ({ value }) =>
						!value.trim() ? "Navn er påkrevd" : undefined,
				}}
			>
				{(field) => (
					<div className="flex flex-col gap-2">
						<label htmlFor="navn" className="text-sm font-medium">
							Navn <span className="text-red-500">*</span>
						</label>
						<input
							id="navn"
							type="text"
							value={field.state.value}
							onChange={(e) => field.handleChange(e.target.value)}
							onBlur={field.handleBlur}
							placeholder="Ola Nordmann"
							className="w-full border border-zinc-300 rounded-lg px-3 py-2 text-sm outline-none focus:border-zinc-900"
						/>
						{field.state.meta.errorMap.onSubmit && (
							<p className="text-red-500 text-xs">
								{field.state.meta.errorMap.onSubmit}
							</p>
						)}
					</div>
				)}
			</form.Field>

			<form.Field
				name="epost"
				validators={{
					onBlur: ({ value }) => {
						if (!value.trim()) return "E-post er påkrevd";
						if (!/\S+@\S+\.\S+/.test(value)) return "Ugyldig e-postadresse";
						return undefined;
					},
				}}
			>
				{(field) => (
					<div className="flex flex-col gap-2">
						<label htmlFor="epost" className="text-sm font-medium">
							E-post <span className="text-red-500">*</span>
						</label>
						<input
							id="epost"
							type="email"
							value={field.state.value}
							onChange={(e) => field.handleChange(e.target.value)}
							onBlur={field.handleBlur}
							placeholder="ola.nordmann@example.com"
							className="w-full border border-zinc-300 rounded-lg px-3 py-2 text-sm outline-none focus:border-zinc-900"
						/>
						{field.state.meta.errorMap.onBlur && (
							<p className="text-red-500 text-xs">
								{field.state.meta.errorMap.onBlur}
							</p>
						)}
					</div>
				)}
			</form.Field>

			<form.Field
				name="telefon"
				validators={{
					onBlur: ({ value }) =>
						!value.trim() ? "Telefonnummer er påkrevd" : undefined,
				}}
			>
				{(field) => (
					<div className="flex flex-col gap-2">
						<label htmlFor="telefon" className="text-sm font-medium">
							Telefon <span className="text-red-500">*</span>
						</label>
						<input
							id="telefon"
							type="tel"
							value={field.state.value}
							onChange={(e) => field.handleChange(e.target.value)}
							onBlur={field.handleBlur}
							placeholder="123 45 678"
							className="w-full border border-zinc-300 rounded-lg px-3 py-2 text-sm outline-none focus:border-zinc-900"
						/>
						{field.state.meta.errorMap.onBlur && (
							<p className="text-red-500 text-xs">
								{field.state.meta.errorMap.onBlur}
							</p>
						)}
					</div>
				)}
			</form.Field>

			<form.Field
				name="motivasjon"
				validators={{
					onSubmit: ({ value }) =>
						!value.trim() ? "Motivasjon er påkrevd" : undefined,
				}}
			>
				{(field) => (
					<div className="flex flex-col gap-2">
						<label htmlFor="motivasjon" className="text-sm font-medium">
							Motivasjon <span className="text-red-500">*</span>
						</label>
						<textarea
							id="motivasjon"
							value={field.state.value}
							onChange={(e) => field.handleChange(e.target.value)}
							onBlur={field.handleBlur}
							placeholder="Hvorfor ønsker du å bli pådriver for Oppdrag: Fjorden Vår?"
							rows={4}
							className="w-full border border-zinc-300 rounded-lg px-3 py-2 text-sm outline-none focus:border-zinc-900 resize-none"
						/>
						{field.state.meta.errorMap.onSubmit && (
							<p className="text-red-500 text-xs">
								{field.state.meta.errorMap.onSubmit}
							</p>
						)}
					</div>
				)}
			</form.Field>

			<form.Field name="kompetanse">
				{(field) => (
					<div className="flex flex-col gap-2">
						<p className="text-sm font-medium">
							Har du kompetanse eller erfaring innen noen av områdene under?
						</p>
						<MultiSelect
							options={skillOptions}
							selected={field.state.value}
							setSelected={field.handleChange}
						/>
					</div>
				)}
			</form.Field>

			<Button label="Send inn" type="submit" />
		</form>
	);
}
