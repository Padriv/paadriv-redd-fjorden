"use client";

import { useForm } from "@tanstack/react-form";
import { useEffect, useRef, useState } from "react";
import { toast } from "sonner";
import type { Padriver } from "@/lib/airtable";
import MultiSelect from "../../../components/MultiSelect";

const skillOptions = [
	"Sosialt entreprenørskap/samfunnsinnovasjon",
	"Forretningsutvikling",
	"Sirkulær økonomi",
	"Ombruk",
	"Arkitektur ",
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
	"Ingen av disse gjelder for meg, men jeg er likefullt en Pådriver!",
];

const steps = [
	{
		title: "Om deg",
		description:
			"Informasjonen brukes for å sette deg i kontakt med andre Pådrivere og partnere.",
		required: true,
	},
	{
		title: "Din motivasjon",
		description:
			"Hvorfor vil du bli en Pådriver som bidrar til en friskere Oslofjord?",
		required: true,
	},
	{
		title: "Kompetanse",
		description: "Har du erfaring innen noe av dette? Velg gjerne flere.",
		required: true,
	},
	{
		title: "Samtykke",
		description: "Bekreft samtykket ditt og bli en Pådriver.",
		required: true,
	},
];

const samtykkeError = (value: boolean) =>
	!value ? "Du må krysse av for samtykke før du kan melde deg inn." : undefined;

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

export default function IndividualSignupForm({
	onClose,
}: {
	onClose?: () => void;
}) {
	const [step, setStep] = useState(1);
	const [isValidating, setIsValidating] = useState(false);
	const cardRef = useRef<HTMLDivElement>(null);
	const prevStepRef = useRef(step);

	useEffect(() => {
		// Skip the scroll on the initial render, only trigger on real step changes.
		if (prevStepRef.current !== step) {
			cardRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
			prevStepRef.current = step;
		}
	}, [step]);

	const form = useForm({
		defaultValues: {
			navn: "",
			epost: "",
			telefon: "",
			motivasjon: "",
			kompetanse: [] as string[],
			samtykke: false,
		},
		onSubmit: async ({ value }) => {
			try {
				const response = await fetch("/api/padriver", {
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
									Samtykke: value.samtykke ? "Jeg samtykker" : "",
								},
							},
						],
					} satisfies Padriver),
				});

				if (response.status !== 201) {
					toast.error("Noe gikk galt", {
						description:
							"Vi klarte ikke å registrere påmeldingen din. Prøv igjen.",
					});
					return;
				}

				toast.success("Takk for at du meldte deg som Pådriver!");
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
			name: "navn" | "epost" | "telefon" | "motivasjon" | "kompetanse";
			cause: "submit" | "blur";
		}[]
	> = {
		1: [
			{ name: "navn", cause: "blur" },
			{ name: "epost", cause: "blur" },
			{ name: "telefon", cause: "blur" },
		],
		2: [{ name: "motivasjon", cause: "submit" }],
		3: [{ name: "kompetanse", cause: "submit" }],
		4: [],
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
			className="w-full bg-deep-green px-4 pb-16 pt-group md:px-16"
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
							<h3 className="text-subheading font-semibold text-green">
								{current.title}
								{current.required && <span className="text-error"> *</span>}
							</h3>
						</div>
						{step === 3 && (
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
							name="navn"
							validators={{
								onBlur: ({ value }) =>
									!value.trim() ? "Navn er påkrevd" : undefined,
							}}
						>
							{(field) => (
								<TextField
									id="navn"
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
							name="epost"
							validators={{
								onBlur: ({ value }) => {
									if (!value.trim()) return "E-post er påkrevd";
									if (!/\S+@\S+\.\S+/.test(value))
										return "Ugyldig e-postadresse";
									return undefined;
								},
							}}
						>
							{(field) => (
								<TextField
									id="epost"
									label="E-post"
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
							name="telefon"
							validators={{
								onBlur: ({ value }) => {
									const trimmed = value.trim();
									if (!trimmed) return "Telefonnummer er påkrevd";
									if (!/^\+?\d[\d\s]*$/.test(trimmed))
										return "Telefonnummer kan bare inneholde tall (og eventuelt + foran landkode)";
									const digits = trimmed.replace(/\D/g, "");
									if (digits.length < 8)
										return "Telefonnummer må ha minst 8 sifre";
									return undefined;
								},
							}}
						>
							{(field) => (
								<TextField
									id="telefon"
									label="Telefon"
									type="tel"
									required
									value={field.state.value}
									onChange={field.handleChange}
									onBlur={field.handleBlur}
									error={field.state.meta.errorMap.onBlur as string | undefined}
									placeholder="+47 123 45 678"
									maxLength={18}
								/>
							)}
						</form.Field>
					</div>
				)}

				{step === 2 && (
					<form.Field
						name="motivasjon"
						validators={{
							onSubmit: ({ value }) =>
								!value.trim() ? "Motivasjon er påkrevd" : undefined,
						}}
					>
						{(field) => (
							<div className="flex flex-col gap-inline">
								<label htmlFor="motivasjon" className="sr-only">
									Din motivasjon
								</label>
								<textarea
									id="motivasjon"
									value={field.state.value}
									onChange={(e) => field.handleChange(e.target.value)}
									onBlur={field.handleBlur}
									placeholder="Jeg ønsker å bli Pådriver fordi... "
									rows={4}
									maxLength={400}
									aria-invalid={!!field.state.meta.errorMap.onSubmit}
									aria-describedby={
										field.state.meta.errorMap.onSubmit
											? "motivasjon-error"
											: undefined
									}
									className="w-full resize-none rounded-lg border border-border bg-cream px-3 py-2 text-body outline-none focus:border-ink"
								/>
								<span className="self-end text-caption text-muted">
									{field.state.value.length}/400
								</span>
								{field.state.meta.errorMap.onSubmit && (
									<p id="motivasjon-error" className="text-error text-caption">
										{field.state.meta.errorMap.onSubmit}
									</p>
								)}
							</div>
						)}
					</form.Field>
				)}

				{step === 3 && (
					<form.Field
						name="kompetanse"
						validators={{
							onSubmit: ({ value }) =>
								value.length === 0
									? "Velg minst ett kompetanseområde"
									: undefined,
						}}
					>
						{(field) => (
							<div className="flex flex-col gap-inline">
								<MultiSelect
									options={skillOptions}
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

				{step === 4 && (
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
										Jeg samtykker til at oppgitt informasjon brukes til å sette
										meg i kontakt med andre i nettverket.{" "}
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
