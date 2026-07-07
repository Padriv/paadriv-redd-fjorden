"use client";

import { useForm } from "@tanstack/react-form";
import { toast } from "sonner";
import type { CreatePartnerRequest } from "@/lib/airtable";
import { resolveBilde } from "@/lib/picture";
import Button from "../../../components/Button";
import { ImageUploadDemo } from "../../../components/ImageUpload";
import MultiSelect from "../../../components/MultiSelect";

const bidragOptions = [
	"Naturrestaurering",
	"Marin økologi og biologisk mangfold",
	"Vannkvalitet og vannmiljø",
	"Maritim næring og havner",
	"Fiskeri",
	"Avløp og vanninfrastruktur",
	"Landbruk og avrenning",
	"Klimaløsninger",
	"Arealplanlegging",
	"Prosjektutvikling",
	"Forskningssamarbeid",
	"Offentlig forvaltning",
	"Forretningsutvikling",
	"Sirkulær økonomi",
	"Ingen av disse gjelder for meg",
];

export default function OrganizationSignupForm({
	onClose,
}: {
	onClose?: () => void;
}) {
	const form = useForm({
		defaultValues: {
			orgNavn: "",
			orgNummer: "",
			orgEpost: "",
			lokasjon: "",
			logo: null as File | null,
			kontaktNavn: "",
			kontaktEpost: "",
			kontaktTlf: "",
			bilde: null as File | null,
			motivasjon: "",
			kompetanse: [] as string[],
			okonomiskBidrag: "",
			annetBidrag: "",
			samtykke: false,
		},
		onSubmit: async ({ value }) => {
			const logo = await resolveBilde(value.logo);
			if (logo === undefined) return;

			const bilde = await resolveBilde(value.bilde);
			if (bilde === undefined) return;

			const response = await fetch("/api/partnere", {
				method: "POST",
				headers: { "Content-Type": "application/json" },
				body: JSON.stringify({
					records: [
						{
							fields: {
								"Navn på organisasjon": value.orgNavn,
								Organisasjonsnummer: Number(value.orgNummer.replace(/\s/g, "")),
								"Epost Organisasjon": value.orgEpost,
								Lokasjon: value.lokasjon,
								"Navn kontaktperson": value.kontaktNavn,
								"Epost kontaktperson": value.kontaktEpost,
								"Tlf kontaktperson": value.kontaktTlf.replace(/\s/g, ""),
								Motivasjon: value.motivasjon,
								Kompetanse: value.kompetanse,
								"Økonomisk bidrag": value.okonomiskBidrag,
								"Annet bidrag": value.annetBidrag,
								Samtykke: value.samtykke,
							},
						},
					],
					logo,
					bilde,
				} satisfies CreatePartnerRequest),
			});

			if (response.status !== 201) {
				toast.error("Noe gikk galt", {
					description:
						"Vi klarte ikke å registrere partneren. Prøv igjen.",
				});
				return;
			}

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
				<h2 className="text-xl font-bold">
					Bli partner for Oppdrag: Fjorden vår
				</h2>
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

			<div className="flex flex-col gap-4">
				<h3 className="text-lg font-semibold">Organisasjonen</h3>

				<form.Field
					name="orgNavn"
					validators={{
						onBlur: ({ value }) =>
							!value.trim() ? "Navn på organisasjonen er påkrevd" : undefined,
					}}
				>
					{(field) => (
						<div className="flex flex-col gap-2">
							<label htmlFor="orgNavn" className="text-sm font-medium">
								Navn på organisasjonen <span className="text-red-500">*</span>
							</label>
							<input
								id="orgNavn"
								type="text"
								value={field.state.value}
								onChange={(e) => field.handleChange(e.target.value)}
								onBlur={field.handleBlur}
								placeholder="Fjorden Vår AS"
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
					name="orgNummer"
					validators={{
						onBlur: ({ value }) => {
							if (!value.trim()) return "Organisasjonsnummer er påkrevd";
							if (!/^\d[\d\s]*$/.test(value.trim()))
								return "Organisasjonsnummer kan bare inneholde tall";
							return undefined;
						},
					}}
				>
					{(field) => (
						<div className="flex flex-col gap-2">
							<label htmlFor="orgNummer" className="text-sm font-medium">
								Organisasjonsnummer <span className="text-red-500">*</span>
							</label>
							<input
								id="orgNummer"
								type="text"
								value={field.state.value}
								onChange={(e) => field.handleChange(e.target.value)}
								onBlur={field.handleBlur}
								placeholder="123 456 789"
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
					name="orgEpost"
					validators={{
						onBlur: ({ value }) => {
							if (!value.trim()) return "Epost til organisasjonen er påkrevd";
							if (!/\S+@\S+\.\S+/.test(value)) return "Ugyldig e-postadresse";
							return undefined;
						},
					}}
				>
					{(field) => (
						<div className="flex flex-col gap-2">
							<label htmlFor="orgEpost" className="text-sm font-medium">
								Epost til organisasjonen <span className="text-red-500">*</span>
							</label>
							<input
								id="orgEpost"
								type="email"
								value={field.state.value}
								onChange={(e) => field.handleChange(e.target.value)}
								onBlur={field.handleBlur}
								placeholder="post@fjordenvår.no"
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
					name="lokasjon"
					validators={{
						onBlur: ({ value }) =>
							!value.trim() ? "Lokasjon er påkrevd" : undefined,
					}}
				>
					{(field) => (
						<div className="flex flex-col gap-2">
							<label htmlFor="lokasjon" className="text-sm font-medium">
								Lokasjon <span className="text-red-500">*</span>
							</label>
							<input
								id="lokasjon"
								type="text"
								value={field.state.value}
								onChange={(e) => field.handleChange(e.target.value)}
								onBlur={field.handleBlur}
								placeholder="Oslo, Norge"
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

				<form.Field name="logo">
					{(field) => (
						<div className="flex flex-col gap-2">
							<p className="text-sm font-medium">Logo</p>
							<ImageUploadDemo
								value={field.state.value}
								onChange={field.handleChange}
							/>
						</div>
					)}
				</form.Field>
			</div>

			<div className="flex flex-col gap-4">
				<h3 className="text-lg font-semibold">
					Kontaktperson i organisasjonen
				</h3>

				<form.Field
					name="kontaktNavn"
					validators={{
						onBlur: ({ value }) =>
							!value.trim() ? "Navn er påkrevd" : undefined,
					}}
				>
					{(field) => (
						<div className="flex flex-col gap-2">
							<label htmlFor="kontaktNavn" className="text-sm font-medium">
								Navn <span className="text-red-500">*</span>
							</label>
							<input
								id="kontaktNavn"
								type="text"
								value={field.state.value}
								onChange={(e) => field.handleChange(e.target.value)}
								onBlur={field.handleBlur}
								placeholder="Ola Nordmann"
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
					name="kontaktEpost"
					validators={{
						onBlur: ({ value }) => {
							if (!value.trim()) return "Epost er påkrevd";
							if (!/\S+@\S+\.\S+/.test(value)) return "Ugyldig e-postadresse";
							return undefined;
						},
					}}
				>
					{(field) => (
						<div className="flex flex-col gap-2">
							<label htmlFor="kontaktEpost" className="text-sm font-medium">
								Epost <span className="text-red-500">*</span>
							</label>
							<input
								id="kontaktEpost"
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
					name="kontaktTlf"
					validators={{
						onBlur: ({ value }) => {
							if (!value.trim()) return "Tlf er påkrevd";
							if (!/^\+?\d[\d\s]*$/.test(value.trim()))
								return "Tlf kan bare inneholde tall (og eventuelt + foran landkode)";
							return undefined;
						},
					}}
				>
					{(field) => (
						<div className="flex flex-col gap-2">
							<label htmlFor="kontaktTlf" className="text-sm font-medium">
								Tlf <span className="text-red-500">*</span>
							</label>
							<input
								id="kontaktTlf"
								type="tel"
								value={field.state.value}
								onChange={(e) => field.handleChange(e.target.value)}
								onBlur={field.handleBlur}
								placeholder="+47 123 45 678"
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
			</div>

			<form.Field name="bilde">
				{(field) => (
					<div className="flex flex-col gap-2">
						<p className="text-sm font-medium">Profilbilde</p>
						<ImageUploadDemo
							value={field.state.value}
							onChange={field.handleChange}
						/>
					</div>
				)}
			</form.Field>

			<div className="flex flex-col gap-4">
				<h3 className="text-lg font-semibold">Partnerskap</h3>

				<form.Field
					name="motivasjon"
					validators={{
						onChange: ({ value }) =>
							value.length > 400 ? "Maks 400 tegn" : undefined,
						onBlur: ({ value }) =>
							!value.trim() ? "Dette feltet er påkrevd" : undefined,
					}}
				>
					{(field) => (
						<div className="flex flex-col gap-2">
							<label htmlFor="motivasjon" className="text-sm font-medium">
								Hvorfor ønsker dere å bli partner for Oppdrag: Fjorden vår?{" "}
								<span className="text-red-500">*</span>
							</label>
							<textarea
								id="motivasjon"
								value={field.state.value}
								onChange={(e) => field.handleChange(e.target.value)}
								onBlur={field.handleBlur}
								placeholder="Fortell litt om hvorfor dere ønsker å bli partner, og hva dere håper å oppnå med samarbeidet."
								rows={4}
								maxLength={400}
								className="w-full border border-zinc-300 rounded-lg px-3 py-2 text-sm outline-none focus:border-zinc-900 resize-none"
							/>
							<p className="text-xs text-zinc-400 text-right">
								{field.state.value.length}/400 tegn
							</p>
							{field.state.meta.errorMap.onChange && (
								<p className="text-red-500 text-xs">
									{field.state.meta.errorMap.onChange}
								</p>
							)}
							{field.state.meta.errorMap.onBlur && (
								<p className="text-red-500 text-xs">
									{field.state.meta.errorMap.onBlur}
								</p>
							)}
						</div>
					)}
				</form.Field>
			</div>

			<form.Field
				name="kompetanse"
				validators={{
					onSubmit: ({ value }) =>
						value.length === 0 ? "Velg minst ett alternativ" : undefined,
				}}
			>
				{(field) => (
					<div className="flex flex-col gap-2">
						<p className="text-sm font-medium">
							Hvilken kompetanse eller ressurser ønsker dere å bidra med?{" "}
							<span className="text-red-500">*</span>
						</p>
						<MultiSelect
							options={bidragOptions}
							selected={field.state.value}
							setSelected={field.handleChange}
						/>
						{field.state.meta.errorMap.onSubmit && (
							<p className="text-red-500 text-xs">
								{field.state.meta.errorMap.onSubmit}
							</p>
						)}
					</div>
				)}
			</form.Field>

			<div className="flex flex-col gap-4">
				<div>
					<h3 className="text-lg font-semibold">Økonomisk bidrag</h3>
					<p className="text-sm italic text-zinc-600">
						Innsatsgruppen er avhengig av langsiktig finansiering for å fylle
						koordineringsrollen ingen andre tar. Bidrag fra stiftelser,
						næringsliv og offentlige aktører gjør det mulig å bygge opp og drive
						denne funksjonen på vegne av fellesskapet.
					</p>
				</div>

				<form.Field name="okonomiskBidrag">
					{(field) => (
						<div className="flex flex-col gap-2">
							<label htmlFor="okonomiskBidrag" className="text-sm font-medium">
								Beløp
							</label>
							<p className="text-sm italic text-zinc-600">
								Kan dere bidra med et beløp, sponsormidler eller annen økonomisk
								støtte?
							</p>
							<textarea
								id="okonomiskBidrag"
								value={field.state.value}
								onChange={(e) => field.handleChange(e.target.value)}
								onBlur={field.handleBlur}
								placeholder="F.eks. et gitt beløp per år, eller sponsormidler"
								rows={3}
								className="w-full border border-zinc-300 rounded-lg px-3 py-2 text-sm outline-none focus:border-zinc-900 resize-none"
							/>
						</div>
					)}
				</form.Field>

				<form.Field name="annetBidrag">
					{(field) => (
						<div className="flex flex-col gap-2">
							<label htmlFor="annetBidrag" className="text-sm font-medium">
								Annet bidrag
							</label>
							<p className="text-sm italic text-zinc-600">
								Kan dere allokere personer/stillingsbrøker til innsatsgruppen,
								eller bidra på andre måter?
							</p>
							<textarea
								id="annetBidrag"
								value={field.state.value}
								onChange={(e) => field.handleChange(e.target.value)}
								onBlur={field.handleBlur}
								placeholder="F.eks. egeninnsats, utstyr, lokaler eller nettverk"
								rows={3}
								className="w-full border border-zinc-300 rounded-lg px-3 py-2 text-sm outline-none focus:border-zinc-900 resize-none"
							/>
						</div>
					)}
				</form.Field>
			</div>

			<div className="flex flex-col gap-2">
				<h3 className="text-lg font-semibold">
					Samtykke <span className="text-red-500">*</span>
				</h3>

				<form.Field
					name="samtykke"
					validators={{
						onSubmit: ({ value }) =>
							!value ? "Du må samtykke for å sende inn skjemaet" : undefined,
					}}
				>
					{(field) => (
						<div className="flex flex-col gap-2 rounded-xl border border-zinc-200 p-4">
							<label className="flex items-start gap-2 text-sm cursor-pointer">
								<input
									type="checkbox"
									checked={field.state.value}
									onChange={(e) => field.handleChange(e.target.checked)}
									className="mt-1"
								/>
								<span>
									Jeg samtykker til at opplysningene kan publiseres på
									fjordenvår.no i forbindelse med presentasjon av organisasjonen
									og vårt partnerskap.
								</span>
							</label>
							{field.state.meta.errorMap.onSubmit && (
								<p className="text-red-500 text-xs">
									{field.state.meta.errorMap.onSubmit}
								</p>
							)}
						</div>
					)}
				</form.Field>
			</div>

			<form.Subscribe
				selector={(state) =>
					[state.isValid, state.submissionAttempts] as const
				}
			>
				{([isValid, submissionAttempts]) => (
					<div className="flex flex-col gap-2">
						<Button label="Send inn" type="submit" />
						{!isValid && submissionAttempts > 0 && (
							<p className="text-red-500 text-sm text-center">
								Fyll ut alle obligatoriske felter
							</p>
						)}
					</div>
				)}
			</form.Subscribe>
		</form>
	);
}
