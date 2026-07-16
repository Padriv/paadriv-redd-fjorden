"use client";

import { useForm } from "@tanstack/react-form";
import { useEffect, useRef, useState } from "react";
import { toast } from "sonner";
import type { Partner } from "@/lib/airtable";
import MultiSelect from "../../../components/MultiSelect";

const kompetanseOptions = [
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

const steps = [
	{
		title: "Om organisasjonen",
		description: "Så vi vet hvem dere er og hvordan vi når dere.",
		required: true,
	},
	{
		title: "Kontaktperson",
		description: "Hvem skal vi kontakte hos dere?",
		required: true,
	},
	{
		title: "Deres motivasjon",
		description:
			"Hvorfor ønsker dere å bli partner?",
		required: true,
	},
	{
		title: "Kompetanse",
		description:
			"Hvilken kompetanse eller ressurser ønsker dere å bidra med? Velg gjerne flere.",
		required: true,
	},
	{
		title: "Økonomisk bidrag",
		description:
			"Valgfritt – innsatsgruppen er avhengig av langsiktig finansiering.",
		required: false,
	},
	{
		title: "Samtykke",
		description: "Nesten i mål – ett siste kryss.",
		required: true,
	},
];

const samtykkeError = (value: boolean) =>
	!value ? "Du må samtykke for å sende inn skjemaet" : undefined;

function isValidOrganisasjonsnummer(digits: string): boolean {
	const weights = [3, 2, 7, 6, 5, 4, 3, 2];
	const sum = weights.reduce((acc, weight, i) => acc + weight * Number(digits[i]), 0);
	const remainder = sum % 11;
	if (remainder === 1) return false;
	const controlDigit = remainder === 0 ? 0 : 11 - remainder;
	return controlDigit === Number(digits[8]);
}

function TextField({
	id,
	label,
	type = "text",
	required,
	value,
	onChange,
	onBlur,
	error,
	placeholder,
	maxLength,
}: {
	id: string;
	label: string;
	type?: string;
	required?: boolean;
	value: string;
	onChange: (value: string) => void;
	onBlur: () => void;
	error?: string;
	placeholder?: string;
	maxLength?: number;
}) {
	const errorId = `${id}-error`;
	return (
		<div className="flex flex-col gap-inline">
			<label htmlFor={id} className="text-label font-medium">
				{label} {required && <span className="text-error">*</span>}
			</label>
			<input
				id={id}
				type={type}
				value={value}
				onChange={(e) => onChange(e.target.value)}
				onBlur={onBlur}
				placeholder={placeholder}
				maxLength={maxLength}
				aria-invalid={!!error}
				aria-describedby={error ? errorId : undefined}
				className="w-full rounded-lg border border-border bg-cream px-3 py-2 text-body outline-none focus:border-ink"
			/>
			{error && (
				<p id={errorId} className="text-error text-caption">
					{error}
				</p>
			)}
		</div>
	);
}

export default function OrganizationSignupForm({
	onClose,
}: {
	onClose?: () => void;
}) {
	const [step, setStep] = useState(1);
	const [isValidating, setIsValidating] = useState(false);
	const cardRef = useRef<HTMLDivElement>(null);
	const isFirstRender = useRef(true);

	useEffect(() => {
		if (isFirstRender.current) {
			isFirstRender.current = false;
			return;
		}
		cardRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
	}, [step]);

	const form = useForm({
		defaultValues: {
			orgNavn: "",
			orgNummer: "",
			orgEpost: "",
			lokasjon: "",
			kontaktNavn: "",
			kontaktEpost: "",
			kontaktTlf: "",
			motivasjon: "",
			kompetanse: [] as string[],
			okonomiskBidrag: "",
			annetBidrag: "",
			samtykke: false,
		},
		onSubmit: async ({ value }) => {
			try {
				const response = await fetch("/api/partnere", {
					method: "POST",
					headers: { "Content-Type": "application/json" },
					body: JSON.stringify({
						records: [
							{
								fields: {
									"Navn på organisasjon": value.orgNavn,
									Organisasjonsnummer: Number(
										value.orgNummer.replace(/\s/g, ""),
									),
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
					} satisfies Partner),
				});

				if (response.status !== 201) {
					toast.error("Noe gikk galt", {
						description: "Vi klarte ikke å registrere partneren. Prøv igjen.",
					});
					return;
				}

				toast.success("Takk for at dere meldte dere som partner!");
				onClose?.();
			} catch {
				toast.error("Noe gikk galt", {
					description:
						"Vi klarte ikke å koble til serveren. Sjekk internettforbindelsen og prøv igjen.",
				});
			}
		},
	});

	const stepFields: Record<
		number,
		{
			name:
				| "orgNavn"
				| "orgNummer"
				| "orgEpost"
				| "lokasjon"
				| "kontaktNavn"
				| "kontaktEpost"
				| "kontaktTlf"
				| "motivasjon"
				| "kompetanse";
			cause: "submit" | "blur";
		}[]
	> = {
		1: [
			{ name: "orgNavn", cause: "blur" },
			{ name: "orgNummer", cause: "blur" },
			{ name: "orgEpost", cause: "blur" },
			{ name: "lokasjon", cause: "blur" },
		],
		2: [
			{ name: "kontaktNavn", cause: "blur" },
			{ name: "kontaktEpost", cause: "blur" },
			{ name: "kontaktTlf", cause: "blur" },
		],
		3: [{ name: "motivasjon", cause: "blur" }],
		4: [{ name: "kompetanse", cause: "submit" }],
		5: [],
		6: [],
	};

	const goNext = async () => {
		const fields = stepFields[step] ?? [];
		setIsValidating(true);
		try {
			await Promise.all(
				fields.map(({ name, cause }) => form.validateField(name, cause)),
			);
			const hasErrors = fields.some(
				({ name }) => (form.getFieldMeta(name)?.errors?.length ?? 0) > 0,
			);
			if (!hasErrors) setStep((s) => Math.min(s + 1, steps.length));
		} finally {
			setIsValidating(false);
		}
	};

	const goBack = () => setStep((s) => Math.max(s - 1, 1));

	const current = steps[step - 1];

	return (
		<form
			onSubmit={(e) => {
				e.preventDefault();
				form.handleSubmit();
			}}
			noValidate
			className="w-full bg-deep-green px-6 pb-16 pt-group md:px-16"
		>
			<div
				ref={cardRef}
				className="relative mx-auto flex w-full max-w-2xl scroll-mt-24 flex-col gap-cluster rounded-2xl bg-cream p-8"
			>
				{onClose && (
					<button
						type="button"
						onClick={onClose}
						aria-label="Lukk skjema"
						className="absolute right-6 top-6 flex h-8 w-8 items-center justify-center rounded-full text-copy transition-colors hover:bg-green/10 hover:text-ink"
					>
						✕
					</button>
				)}
				<div className="flex flex-col gap-inline">
					<span className="w-fit rounded-full bg-green/10 px-3 py-1 text-caption font-medium text-green">
						Steg {step} av {steps.length}
					</span>
					<div className="mt-group flex items-center justify-between gap-inline">
						<div className="flex items-center gap-inline">
							<span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-green/10 text-label font-semibold text-green">
								{step}
							</span>
							<h3 className="text-subheading font-semibold text-ink">
								{current.title}
								{current.required && <span className="text-error"> *</span>}
							</h3>
						</div>
						{step === 4 && (
							<form.Field name="kompetanse">
								{(field) =>
									field.state.value.length > 0 && (
										<button
											type="button"
											onClick={() => field.handleChange([])}
											className="text-caption font-medium text-muted hover:text-ink hover:underline"
										>
											Nullstill
										</button>
									)
								}
							</form.Field>
						)}
					</div>
					<p className="text-body text-copy">{current.description}</p>
					<div className="h-1.5 w-full rounded-full bg-green/10">
						<div
							className="h-full rounded-full bg-green transition-all"
							style={{ width: `${(step / steps.length) * 100}%` }}
						/>
					</div>
				</div>

				{step === 1 && (
					<div className="flex flex-col gap-cluster">
						<form.Field
							name="orgNavn"
							validators={{
								onBlur: ({ value }) =>
									!value.trim()
										? "Navn på organisasjonen er påkrevd"
										: undefined,
							}}
						>
							{(field) => (
								<TextField
									id="orgNavn"
									label="Navn på organisasjonen"
									required
									value={field.state.value}
									onChange={field.handleChange}
									onBlur={field.handleBlur}
									error={field.state.meta.errorMap.onBlur as string | undefined}
									placeholder="Fjorden Vår AS"
								/>
							)}
						</form.Field>

						<form.Field
							name="orgNummer"
							validators={{
								onBlur: ({ value }) => {
									if (!value.trim()) return "Organisasjonsnummer er påkrevd";
									const digits = value.trim().replace(/\s/g, "");
									if (!/^\d+$/.test(digits))
										return "Organisasjonsnummer kan bare inneholde tall";
									if (digits.length !== 9)
										return "Organisasjonsnummer må bestå av 9 siffer";
									if (!isValidOrganisasjonsnummer(digits))
										return "Ugyldig organisasjonsnummer";
									return undefined;
								},
							}}
						>
							{(field) => (
								<TextField
									id="orgNummer"
									label="Organisasjonsnummer"
									required
									value={field.state.value}
									onChange={field.handleChange}
									onBlur={field.handleBlur}
									error={field.state.meta.errorMap.onBlur as string | undefined}
									placeholder="123 456 789"
								/>
							)}
						</form.Field>

						<form.Field
							name="orgEpost"
							validators={{
								onBlur: ({ value }) => {
									if (!value.trim())
										return "Epost til organisasjonen er påkrevd";
									if (!/\S+@\S+\.\S+/.test(value))
										return "Ugyldig e-postadresse";
									return undefined;
								},
							}}
						>
							{(field) => (
								<TextField
									id="orgEpost"
									label="Epost til organisasjonen"
									type="email"
									required
									value={field.state.value}
									onChange={field.handleChange}
									onBlur={field.handleBlur}
									error={field.state.meta.errorMap.onBlur as string | undefined}
									placeholder="post@fjordenvår.no"
								/>
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
								<TextField
									id="lokasjon"
									label="Lokasjon"
									required
									value={field.state.value}
									onChange={field.handleChange}
									onBlur={field.handleBlur}
									error={field.state.meta.errorMap.onBlur as string | undefined}
									placeholder="Oslo, Norge"
								/>
							)}
						</form.Field>
					</div>
				)}

				{step === 2 && (
					<div className="flex flex-col gap-cluster">
						<form.Field
							name="kontaktNavn"
							validators={{
								onBlur: ({ value }) =>
									!value.trim() ? "Navn er påkrevd" : undefined,
							}}
						>
							{(field) => (
								<TextField
									id="kontaktNavn"
									label="Navn"
									required
									value={field.state.value}
									onChange={field.handleChange}
									onBlur={field.handleBlur}
									error={field.state.meta.errorMap.onBlur as string | undefined}
									placeholder="Ola Nordmann"
								/>
							)}
						</form.Field>

						<form.Field
							name="kontaktEpost"
							validators={{
								onBlur: ({ value }) => {
									if (!value.trim()) return "Epost er påkrevd";
									if (!/\S+@\S+\.\S+/.test(value))
										return "Ugyldig e-postadresse";
									return undefined;
								},
							}}
						>
							{(field) => (
								<TextField
									id="kontaktEpost"
									label="Epost"
									type="email"
									required
									value={field.state.value}
									onChange={field.handleChange}
									onBlur={field.handleBlur}
									error={field.state.meta.errorMap.onBlur as string | undefined}
									placeholder="ola.nordmann@example.com"
								/>
							)}
						</form.Field>

						<form.Field
							name="kontaktTlf"
							validators={{
								onBlur: ({ value }) => {
									if (!value.trim()) return "Tlf er påkrevd";
									if (!/^\+?\d[\d\s]*$/.test(value.trim()))
										return "Tlf kan bare inneholde tall (og eventuelt + foran landkode)";
									if (value.trim().replace(/\s/g, "").length < 8)
										return "Tlf må bestå av minst 8 tegn";
									return undefined;
								},
							}}
						>
							{(field) => (
								<TextField
									id="kontaktTlf"
									label="Tlf"
									type="tel"
									required
									value={field.state.value}
									onChange={field.handleChange}
									onBlur={field.handleBlur}
									error={field.state.meta.errorMap.onBlur as string | undefined}
									placeholder="+47 123 45 678"
								/>
							)}
						</form.Field>
					</div>
				)}

				{step === 3 && (
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
							<div className="flex flex-col gap-inline">
								<label htmlFor="motivasjon" className="sr-only">
									Deres motivasjon
								</label>
								<textarea
									id="motivasjon"
									value={field.state.value}
									onChange={(e) => field.handleChange(e.target.value)}
									onBlur={field.handleBlur}
									placeholder="Fortell litt om hvorfor dere ønsker å bli partner, og hva dere håper å oppnå med samarbeidet."
									rows={4}
									maxLength={400}
									aria-invalid={
										!!(
											field.state.meta.errorMap.onChange ||
											field.state.meta.errorMap.onBlur
										)
									}
									aria-describedby={
										field.state.meta.errorMap.onChange ||
										field.state.meta.errorMap.onBlur
											? "motivasjon-error"
											: undefined
									}
									className="w-full resize-none rounded-lg border border-border bg-cream px-3 py-2 text-body outline-none focus:border-ink"
								/>
								<span className="self-end text-caption text-muted">
									{field.state.value.length}/400
								</span>
								{(field.state.meta.errorMap.onChange ||
									field.state.meta.errorMap.onBlur) && (
									<p id="motivasjon-error" className="text-error text-caption">
										{field.state.meta.errorMap.onChange ??
											field.state.meta.errorMap.onBlur}
									</p>
								)}
							</div>
						)}
					</form.Field>
				)}

				{step === 4 && (
					<form.Field
						name="kompetanse"
						validators={{
							onSubmit: ({ value }) =>
								value.length === 0 ? "Velg minst ett alternativ" : undefined,
						}}
					>
						{(field) => (
							<div className="flex flex-col gap-inline">
								<MultiSelect
									options={kompetanseOptions}
									selected={field.state.value}
									setSelected={field.handleChange}
								/>
								{field.state.meta.errorMap.onSubmit && (
									<p className="text-error text-caption">
										{field.state.meta.errorMap.onSubmit}
									</p>
								)}
							</div>
						)}
					</form.Field>
				)}

				{step === 5 && (
					<div className="flex flex-col gap-cluster">
						<form.Field name="okonomiskBidrag">
							{(field) => (
								<div className="flex flex-col gap-inline">
									<label
										htmlFor="okonomiskBidrag"
										className="text-label font-medium"
									>
										Beløp
									</label>
									<p className="text-body italic text-copy">
										Kan dere bidra med et beløp, sponsormidler eller annen
										økonomisk støtte?
									</p>
									<textarea
										id="okonomiskBidrag"
										value={field.state.value}
										onChange={(e) => field.handleChange(e.target.value)}
										onBlur={field.handleBlur}
										placeholder="F.eks. et gitt beløp per år, eller sponsormidler"
										rows={3}
										className="w-full resize-none rounded-lg border border-border bg-cream px-3 py-2 text-body outline-none focus:border-ink"
									/>
								</div>
							)}
						</form.Field>

						<form.Field name="annetBidrag">
							{(field) => (
								<div className="flex flex-col gap-inline">
									<label
										htmlFor="annetBidrag"
										className="text-label font-medium"
									>
										Annet bidrag
									</label>
									<p className="text-body italic text-copy">
										Kan dere allokere personer/stillingsbrøker til
										innsatsgruppen, eller bidra på andre måter?
									</p>
									<textarea
										id="annetBidrag"
										value={field.state.value}
										onChange={(e) => field.handleChange(e.target.value)}
										onBlur={field.handleBlur}
										placeholder="F.eks. egeninnsats, utstyr, lokaler eller nettverk"
										rows={3}
										className="w-full resize-none rounded-lg border border-border bg-cream px-3 py-2 text-body outline-none focus:border-ink"
									/>
								</div>
							)}
						</form.Field>
					</div>
				)}

				{step === 6 && (
					<form.Field
						name="samtykke"
						validators={{
							onBlur: ({ value }) => samtykkeError(value),
							onSubmit: ({ value }) => samtykkeError(value),
						}}
					>
						{(field) => (
							<div className="flex flex-col gap-inline rounded-xl border border-border bg-cream p-4">
								<label className="flex cursor-pointer items-start gap-inline text-body">
									<input
										type="checkbox"
										checked={field.state.value}
										onChange={(e) => field.handleChange(e.target.checked)}
										onBlur={field.handleBlur}
										aria-invalid={
											!!(
												field.state.meta.errorMap.onBlur ||
												field.state.meta.errorMap.onSubmit
											)
										}
										aria-describedby={
											field.state.meta.errorMap.onBlur ||
											field.state.meta.errorMap.onSubmit
												? "samtykke-error"
												: undefined
										}
										className="mt-1 accent-deep-green"
									/>
									<span>
										Jeg samtykker til at kontaktinformasjonen om meg og bedriften kan deles med relevante aktører i «Oppdrag: Fjorden vår», slik at prosjektledelsen kan gjøre relevante koblinger.
										<span className="text-error">*</span>
									</span>
								</label>
								{(field.state.meta.errorMap.onBlur ||
									field.state.meta.errorMap.onSubmit) && (
									<p id="samtykke-error" className="text-error text-caption">
										{field.state.meta.errorMap.onBlur ??
											field.state.meta.errorMap.onSubmit}
									</p>
								)}
							</div>
						)}
					</form.Field>
				)}

				<div className="flex items-center justify-between border-t border-border-subtle pt-6">
					{step > 1 ? (
						<button
							type="button"
							onClick={goBack}
							className="text-button font-medium text-ink transition-colors hover:text-copy"
						>
							← Tilbake
						</button>
					) : (
						<span />
					)}

					{step < steps.length ? (
						<button
							type="button"
							onClick={goNext}
							disabled={isValidating}
							className="text-link font-medium text-green transition-colors hover:text-ink disabled:cursor-not-allowed disabled:opacity-60"
						>
							{isValidating ? "Sjekker..." : "Neste →"}
						</button>
					) : (
						<form.Subscribe selector={(state) => state.isSubmitting}>
							{(isSubmitting) => (
								<button
									type="submit"
									disabled={isSubmitting}
									className="flex h-12 items-center justify-center rounded-full bg-accent px-8 text-button font-medium text-on-accent transition-colors hover:bg-accent-hover disabled:cursor-not-allowed disabled:opacity-60"
								>
									{isSubmitting ? "Sender..." : "Send inn"}
								</button>
							)}
						</form.Subscribe>
					)}
				</div>
			</div>
		</form>
	);
}
