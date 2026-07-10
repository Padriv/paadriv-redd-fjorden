"use client";

import { useForm } from "@tanstack/react-form";
import { toast } from "sonner";
import type { CreatePadriverRequest } from "@/lib/airtable";
import { resolveImage } from "@/lib/Image";
import Button from "../../../components/Button";
import { ImageUploadDemo } from "../../../components/ImageUpload";
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
			bilde: null as File | null,
			motivasjon: "",
			kompetanse: [] as string[],
			samtykke: false,
		},
		onSubmit: async ({ value }) => {
			const bilde = await resolveImage(value.bilde);
			if (bilde === undefined) return;

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
								Samtykke: "Jeg samtykker",
								"Samtykke offentliggjøre kontaktinfo": true,
							},
						},
					],
					bilde,
				} satisfies CreatePadriverRequest),
			});

			if (response.status !== 201) {
				toast.error("Noe gikk galt", {
					description:
						"Vi klarte ikke å registrere påmeldingen din. Prøv igjen.",
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
				<h2 className="text-section font-semibold text-ink">
					Bli med i Oppdrag: Fjorden Vår
				</h2>
				{onClose && (
					<button
						type="button"
						onClick={onClose}
						aria-label="Lukk skjema"
						className="text-muted hover:text-ink transition-colors text-2xl leading-none"
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
						<label htmlFor="navn" className="text-label font-medium">
							Navn <span className="text-error">*</span>
						</label>
						<input
							id="navn"
							type="text"
							value={field.state.value}
							onChange={(e) => field.handleChange(e.target.value)}
							onBlur={field.handleBlur}
							placeholder="Ola Nordmann"
							className="w-full border border-border rounded-lg px-3 py-2 text-body outline-none focus:border-ink"
						/>
						{field.state.meta.errorMap.onSubmit && (
							<p className="text-error text-caption">
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
						<label htmlFor="epost" className="text-label font-medium">
							E-post <span className="text-error">*</span>
						</label>
						<input
							id="epost"
							type="email"
							value={field.state.value}
							onChange={(e) => field.handleChange(e.target.value)}
							onBlur={field.handleBlur}
							placeholder="ola.nordmann@example.com"
							className="w-full border border-border rounded-lg px-3 py-2 text-body outline-none focus:border-ink"
						/>
						{field.state.meta.errorMap.onBlur && (
							<p className="text-error text-caption">
								{field.state.meta.errorMap.onBlur}
							</p>
						)}
					</div>
				)}
			</form.Field>

			<form.Field
				name="telefon"
				validators={{
					onBlur: ({ value }) => {
						if (!value.trim()) return "Telefonnummer er påkrevd";
						if (!/^\+?\d[\d\s]*$/.test(value.trim()))
							return "Telefonnummer kan bare inneholde tall (og eventuelt + foran landkode)";
						return undefined;
					},
				}}
			>
				{(field) => (
					<div className="flex flex-col gap-2">
						<label htmlFor="telefon" className="text-label font-medium">
							Telefon <span className="text-error">*</span>
						</label>
						<input
							id="telefon"
							type="tel"
							value={field.state.value}
							onChange={(e) => field.handleChange(e.target.value)}
							onBlur={field.handleBlur}
							placeholder="+47 123 45 678"
							maxLength={18}
							className="w-full border border-border rounded-lg px-3 py-2 text-body outline-none focus:border-ink"
						/>
						{field.state.meta.errorMap.onBlur && (
							<p className="text-error text-caption">
								{field.state.meta.errorMap.onBlur}
							</p>
						)}
					</div>
				)}
			</form.Field>

			<form.Field name="bilde">
				{(field) => (
					<div className="flex flex-col gap-2">
						<p className="text-label font-medium">Profilbilde</p>
						<ImageUploadDemo
							value={field.state.value}
							onChange={field.handleChange}
						/>
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
						<label htmlFor="motivasjon" className="text-label font-medium">
							Hvorfor ønsker du å bli pådriver for "Oppdrag: Fjorden Vår"?{" "}
							<span className="text-error">*</span>
							<div className="flex flex-col gap-1 mt-2 text-caption font-normal text-copy">
								<span>Merk: svaret ditt vil bli publisert på nettsiden.</span>
								<span>
									Ta kontakt med pådriv om du ønsker endringer senere.
								</span>
							</div>
						</label>
						<textarea
							id="motivasjon"
							value={field.state.value}
							onChange={(e) => field.handleChange(e.target.value)}
							onBlur={field.handleBlur}
							placeholder="Jeg ønsker å bli pådriver fordi... "
							rows={4}
							maxLength={250}
							className="w-full border border-border rounded-lg px-3 py-2 text-body outline-none focus:border-ink resize-none"
						/>
						<span className="text-caption text-muted self-end">
							{field.state.value.length}/250
						</span>
						{field.state.meta.errorMap.onSubmit && (
							<p className="text-error text-caption">
								{field.state.meta.errorMap.onSubmit}
							</p>
						)}
					</div>
				)}
			</form.Field>

			<form.Field
				name="kompetanse"
				validators={{
					onSubmit: ({ value }) =>
						value.length === 0 ? "Velg minst ett kompetanseområde" : undefined,
				}}
			>
				{(field) => (
					<div className="flex flex-col gap-2">
						<p className="text-label font-medium">
							Har du kompetanse eller erfaring innen noen av områdene under?{" "}
							<span className="text-error">*</span>
						</p>
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

			<div className="flex flex-col gap-2">
				<h3 className="text-subheading font-semibold text-ink">
					Samtykke <span className="text-error">*</span>
				</h3>

				<form.Field
					name="samtykke"
					validators={{
						onSubmit: ({ value }) =>
							!value ? "Du må samtykke for å sende inn skjemaet" : undefined,
					}}
				>
					{(field) => (
						<div className="flex flex-col gap-2 rounded-xl border border-border-subtle p-4">
							<label className="flex items-start gap-2 text-body cursor-pointer">
								<input
									type="checkbox"
									checked={field.state.value}
									onChange={(e) => field.handleChange(e.target.checked)}
									className="mt-1"
								/>
								<span>
									Jeg samtykker til at opplysningene kan publiseres på
									fjordenvår.no i forbindelse med presentasjon av meg som
									pådriver.
								</span>
							</label>
							{field.state.meta.errorMap.onSubmit && (
								<p className="text-error text-caption">
									{field.state.meta.errorMap.onSubmit}
								</p>
							)}
						</div>
					)}
				</form.Field>
			</div>

			<form.Subscribe
				selector={(state) => [state.submissionAttempts, state.isValid] as const}
			>
				{([submissionAttempts, isValid]) =>
					submissionAttempts > 0 && !isValid ? (
						<p className="text-error text-body" role="alert">
							Fyll ut alle påkrevde felt før du sender inn.
						</p>
					) : null
				}
			</form.Subscribe>

			<Button label="Send inn" type="submit" />
		</form>
	);
}
