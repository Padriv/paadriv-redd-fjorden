"use client";

import { useForm } from "@tanstack/react-form";
import { useEffect, useRef, useState } from "react";
import { toast } from "sonner";
import type { Partner, PartnerSkjemaCopy } from "@/lib/airtable";
import { fyllMal } from "@/lib/fyllMal";
import CloseButton from "../../../components/CloseButton";
import MultiSelect from "../../../components/MultiSelect";
import SignupSuccessModal from "../../../components/SignupSuccessModal";

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

function isValidOrganisasjonsnummer(digits: string): boolean {
	const weights = [3, 2, 7, 6, 5, 4, 3, 2];
	const sum = weights.reduce(
		(acc, weight, i) => acc + weight * Number(digits[i]),
		0,
	);
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
	copy,
}: {
	onClose?: () => void;
	copy: PartnerSkjemaCopy;
}) {
	const [step, setStep] = useState(0);
	const [isValidating, setIsValidating] = useState(false);
	const [showSuccess, setShowSuccess] = useState(false);
	const cardRef = useRef<HTMLDivElement>(null);

	useEffect(() => {
		cardRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
	}, []);

	const samtykkeError = (value: boolean) =>
		!value ? copy.samtykke.feil : undefined;

	const form = useForm({
		defaultValues: {
			orgNavn: "",
			orgNummer: "",
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
					toast.error(copy.toastFeilTittel, {
						description: copy.toastFeilRegistrering,
					});
					return;
				}

				setShowSuccess(true);
			} catch {
				toast.error(copy.toastFeilTittel, {
					description: copy.toastFeilServer,
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
				| "lokasjon"
				| "kontaktNavn"
				| "kontaktEpost"
				| "kontaktTlf"
				| "motivasjon"
				| "kompetanse"
				| "okonomiskBidrag"
				| "annetBidrag";
			cause: "submit" | "blur";
		}[]
	> = {
		1: [
			{ name: "orgNavn", cause: "blur" },
			{ name: "orgNummer", cause: "blur" },
			{ name: "lokasjon", cause: "blur" },
		],
		2: [
			{ name: "kontaktNavn", cause: "blur" },
			{ name: "kontaktEpost", cause: "blur" },
			{ name: "kontaktTlf", cause: "blur" },
		],
		3: [{ name: "motivasjon", cause: "blur" }],
		4: [{ name: "kompetanse", cause: "submit" }],
		5: [
			{ name: "okonomiskBidrag", cause: "blur" },
			{ name: "annetBidrag", cause: "blur" },
		],
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
			if (!hasErrors) setStep((s) => Math.min(s + 1, copy.steg.length));
		} finally {
			setIsValidating(false);
		}
	};

	const goBack = () => setStep((s) => Math.max(s - 1, 0));

	const current = copy.steg[step - 1];
	const stegLabel = fyllMal(copy.stegLabelMal, {
		steg: String(step),
		totalt: String(copy.steg.length),
	});

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
				{onClose && <CloseButton onClick={onClose} label={copy.lukkSkjema} />}
				<div className="flex flex-col gap-inline">
					<span className="w-fit rounded-full bg-green/10 px-3 py-1 text-caption font-medium text-green">
						{stegLabel}
					</span>
					<div className="mt-group flex items-center justify-between gap-inline">
						<div className="flex items-center gap-inline">
							<span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-green/10 text-label font-semibold text-green">
								{step}
							</span>
							<h3 className="text-subheading font-semibold text-green">
								{step === 0 ? copy.introTittel : current.title}
								{step > 0 && <span className="text-error"> *</span>}
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
											{copy.nullstill}
										</button>
									)
								}
							</form.Field>
						)}
					</div>
					{step > 0 && (
						<p className="text-body text-copy">{current.description}</p>
					)}
					<div className="h-1.5 w-full rounded-full bg-green/10">
						<div
							className="h-full rounded-full bg-green transition-all"
							style={{ width: `${(step / copy.steg.length) * 100}%` }}
						/>
					</div>
				</div>

				{step === 0 && (
					<div className="flex flex-col gap-group text-body text-copy">
						<p>{copy.intro.avsnitt1}</p>
						<p>
							{copy.intro.avsnitt2}{" "}
							<strong className="font-semibold">
								{copy.intro.avsnitt2Uthevet}
							</strong>
						</p>
						<p>{copy.intro.avsnitt3}</p>
					</div>
				)}

				{step === 1 && (
					<div className="flex flex-col gap-cluster">
						<form.Field
							name="orgNavn"
							validators={{
								onBlur: ({ value }) =>
									!value.trim() ? copy.orgNavn.feilPakrevd : undefined,
							}}
						>
							{(field) => (
								<TextField
									id="orgNavn"
									label={copy.orgNavn.label}
									required
									value={field.state.value}
									onChange={field.handleChange}
									onBlur={field.handleBlur}
									error={field.state.meta.errorMap.onBlur as string | undefined}
									placeholder={copy.orgNavn.placeholder}
								/>
							)}
						</form.Field>

						<form.Field
							name="orgNummer"
							validators={{
								onBlur: ({ value }) => {
									if (!value.trim()) return copy.orgNummer.feilPakrevd;
									const digits = value.trim().replace(/\s/g, "");
									if (!/^\d+$/.test(digits)) return copy.orgNummer.feilTall;
									if (digits.length !== 9) return copy.orgNummer.feilLengde;
									if (!isValidOrganisasjonsnummer(digits))
										return copy.orgNummer.feilUgyldig;
									return undefined;
								},
							}}
						>
							{(field) => (
								<TextField
									id="orgNummer"
									label={copy.orgNummer.label}
									required
									value={field.state.value}
									onChange={field.handleChange}
									onBlur={field.handleBlur}
									error={field.state.meta.errorMap.onBlur as string | undefined}
									placeholder={copy.orgNummer.placeholder}
								/>
							)}
						</form.Field>

						<form.Field
							name="lokasjon"
							validators={{
								onBlur: ({ value }) =>
									!value.trim() ? copy.lokasjon.feilPakrevd : undefined,
							}}
						>
							{(field) => (
								<TextField
									id="lokasjon"
									label={copy.lokasjon.label}
									required
									value={field.state.value}
									onChange={field.handleChange}
									onBlur={field.handleBlur}
									error={field.state.meta.errorMap.onBlur as string | undefined}
									placeholder={copy.lokasjon.placeholder}
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
									!value.trim() ? copy.kontaktNavn.feilPakrevd : undefined,
							}}
						>
							{(field) => (
								<TextField
									id="kontaktNavn"
									label={copy.kontaktNavn.label}
									required
									value={field.state.value}
									onChange={field.handleChange}
									onBlur={field.handleBlur}
									error={field.state.meta.errorMap.onBlur as string | undefined}
									placeholder={copy.kontaktNavn.placeholder}
								/>
							)}
						</form.Field>

						<form.Field
							name="kontaktEpost"
							validators={{
								onBlur: ({ value }) => {
									if (!value.trim()) return copy.kontaktEpost.feilPakrevd;
									if (!/\S+@\S+\.\S+/.test(value))
										return copy.kontaktEpost.feilUgyldig;
									return undefined;
								},
							}}
						>
							{(field) => (
								<TextField
									id="kontaktEpost"
									label={copy.kontaktEpost.label}
									type="email"
									required
									value={field.state.value}
									onChange={field.handleChange}
									onBlur={field.handleBlur}
									error={field.state.meta.errorMap.onBlur as string | undefined}
									placeholder={copy.kontaktEpost.placeholder}
								/>
							)}
						</form.Field>

						<form.Field
							name="kontaktTlf"
							validators={{
								onBlur: ({ value }) => {
									if (!value.trim()) return copy.kontaktTlf.feilPakrevd;
									if (!/^\+?\d[\d\s]*$/.test(value.trim()))
										return copy.kontaktTlf.feilTall;
									if (value.trim().replace(/\s/g, "").length < 8)
										return copy.kontaktTlf.feilLengde;
									return undefined;
								},
							}}
						>
							{(field) => (
								<TextField
									id="kontaktTlf"
									label={copy.kontaktTlf.label}
									type="tel"
									required
									value={field.state.value}
									onChange={field.handleChange}
									onBlur={field.handleBlur}
									error={field.state.meta.errorMap.onBlur as string | undefined}
									placeholder={copy.kontaktTlf.placeholder}
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
								value.length > 400 ? copy.motivasjon.feilMaksLengde : undefined,
							onBlur: ({ value }) =>
								!value.trim() ? copy.motivasjon.feilPakrevd : undefined,
						}}
					>
						{(field) => (
							<div className="flex flex-col gap-inline">
								<label htmlFor="motivasjon" className="sr-only">
									{copy.motivasjon.srLabel}
								</label>
								<textarea
									id="motivasjon"
									value={field.state.value}
									onChange={(e) => field.handleChange(e.target.value)}
									onBlur={field.handleBlur}
									placeholder={copy.motivasjon.placeholder}
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
								value.length === 0 ? copy.kompetanse.feilMinstEtt : undefined,
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
						<form.Field
							name="okonomiskBidrag"
							validators={{
								onBlur: ({ value }) =>
									!value.trim() ? copy.okonomiskBidrag.feilPakrevd : undefined,
							}}
						>
							{(field) => (
								<div className="flex flex-col gap-inline">
									<label
										htmlFor="okonomiskBidrag"
										className="text-label font-medium"
									>
										{copy.okonomiskBidrag.label}{" "}
										<span className="text-error">*</span>
									</label>
									<p className="text-body italic text-copy">
										{copy.okonomiskBidrag.hjelp}
									</p>
									<textarea
										id="okonomiskBidrag"
										value={field.state.value}
										onChange={(e) => field.handleChange(e.target.value)}
										onBlur={field.handleBlur}
										placeholder={copy.okonomiskBidrag.placeholder}
										rows={3}
										aria-invalid={!!field.state.meta.errorMap.onBlur}
										aria-describedby={
											field.state.meta.errorMap.onBlur
												? "okonomiskBidrag-error"
												: undefined
										}
										className="w-full resize-none rounded-lg border border-border bg-cream px-3 py-2 text-body outline-none focus:border-ink"
									/>
									{field.state.meta.errorMap.onBlur && (
										<p
											id="okonomiskBidrag-error"
											className="text-error text-caption"
										>
											{field.state.meta.errorMap.onBlur}
										</p>
									)}
								</div>
							)}
						</form.Field>

						<form.Field
							name="annetBidrag"
							validators={{
								onBlur: ({ value }) =>
									!value.trim() ? copy.annetBidrag.feilPakrevd : undefined,
							}}
						>
							{(field) => (
								<div className="flex flex-col gap-inline">
									<label
										htmlFor="annetBidrag"
										className="text-label font-medium"
									>
										{copy.annetBidrag.label}{" "}
										<span className="text-error">*</span>
									</label>
									<p className="text-body italic text-copy">
										{copy.annetBidrag.hjelp}
									</p>
									<textarea
										id="annetBidrag"
										value={field.state.value}
										onChange={(e) => field.handleChange(e.target.value)}
										onBlur={field.handleBlur}
										placeholder={copy.annetBidrag.placeholder}
										rows={3}
										aria-invalid={!!field.state.meta.errorMap.onBlur}
										aria-describedby={
											field.state.meta.errorMap.onBlur
												? "annetBidrag-error"
												: undefined
										}
										className="w-full resize-none rounded-lg border border-border bg-cream px-3 py-2 text-body outline-none focus:border-ink"
									/>
									{field.state.meta.errorMap.onBlur && (
										<p
											id="annetBidrag-error"
											className="text-error text-caption"
										>
											{field.state.meta.errorMap.onBlur}
										</p>
									)}
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
										{copy.samtykke.tekst} <span className="text-error">*</span>
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
					{step > 0 ? (
						<button
							type="button"
							onClick={goBack}
							className="text-button font-semibold text-ink transition-colors hover:text-copy"
						>
							{copy.tilbake}
						</button>
					) : (
						<span />
					)}

					{step < copy.steg.length ? (
						<button
							type="button"
							onClick={goNext}
							disabled={isValidating}
							className="text-link font-semibold text-green transition-colors hover:text-ink disabled:cursor-not-allowed disabled:opacity-60"
						>
							{isValidating ? copy.nesteLaster : copy.neste}
						</button>
					) : (
						<form.Subscribe selector={(state) => state.isSubmitting}>
							{(isSubmitting) => (
								<button
									type="submit"
									disabled={isSubmitting}
									className="flex h-12 items-center justify-center rounded-full bg-accent px-8 text-button font-semibold text-on-accent transition-colors hover:bg-accent-hover disabled:cursor-not-allowed disabled:opacity-60"
								>
									{isSubmitting ? copy.sendInnLaster : copy.sendInn}
								</button>
							)}
						</form.Subscribe>
					)}
				</div>
			</div>
			{showSuccess && (
				<SignupSuccessModal
					tittel={copy.suksess.tittel}
					avsnitt1={copy.suksess.avsnitt1}
					avsnitt2={copy.suksess.avsnitt2}
					lukk={copy.suksess.lukk}
					onClose={() => {
						setShowSuccess(false);
						onClose?.();
					}}
				/>
			)}
		</form>
	);
}
