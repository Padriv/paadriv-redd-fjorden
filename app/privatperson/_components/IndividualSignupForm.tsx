"use client";

import { useForm } from "@tanstack/react-form";
import { useEffect, useRef, useState } from "react";
import { toast } from "sonner";
import type { Padriver, PadriverSkjemaCopy } from "@/lib/airtable";
import { fyllMal } from "@/lib/fyllMal";
import { NONE_APPLY_SKILL, SKILL_OPTIONS } from "@/lib/skills";
import CloseButton from "../../../components/CloseButton";
import MultiSelect from "../../../components/MultiSelect";
import SignupSuccessModal from "../../../components/SignupSuccessModal";

const skillOptions = [...SKILL_OPTIONS, NONE_APPLY_SKILL];

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
	copy,
}: {
	onClose?: () => void;
	copy: PadriverSkjemaCopy;
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
						{step === 3 && (
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
							name="navn"
							validators={{
								onBlur: ({ value }) =>
									!value.trim() ? copy.navn.feilPakrevd : undefined,
							}}
						>
							{(field) => (
								<TextField
									id="navn"
									label={copy.navn.label}
									required
									value={field.state.value}
									onChange={field.handleChange}
									onBlur={field.handleBlur}
									error={field.state.meta.errorMap.onBlur as string | undefined}
									placeholder={copy.navn.placeholder}
								/>
							)}
						</form.Field>

						<form.Field
							name="epost"
							validators={{
								onBlur: ({ value }) => {
									if (!value.trim()) return copy.epost.feilPakrevd;
									if (!/\S+@\S+\.\S+/.test(value))
										return copy.epost.feilUgyldig;
									return undefined;
								},
							}}
						>
							{(field) => (
								<TextField
									id="epost"
									label={copy.epost.label}
									type="email"
									required
									value={field.state.value}
									onChange={field.handleChange}
									onBlur={field.handleBlur}
									error={field.state.meta.errorMap.onBlur as string | undefined}
									placeholder={copy.epost.placeholder}
								/>
							)}
						</form.Field>

						<form.Field
							name="telefon"
							validators={{
								onBlur: ({ value }) => {
									const trimmed = value.trim();
									if (!trimmed) return copy.telefon.feilPakrevd;
									if (!/^\+?\d[\d\s]*$/.test(trimmed))
										return copy.telefon.feilTall;
									const digits = trimmed.replace(/\D/g, "");
									if (digits.length < 8) return copy.telefon.feilLengde;
									return undefined;
								},
							}}
						>
							{(field) => (
								<TextField
									id="telefon"
									label={copy.telefon.label}
									type="tel"
									required
									value={field.state.value}
									onChange={field.handleChange}
									onBlur={field.handleBlur}
									error={field.state.meta.errorMap.onBlur as string | undefined}
									placeholder={copy.telefon.placeholder}
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
								value.length === 0 ? copy.kompetanse.feilMinstEtt : undefined,
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
