"use client";

import { useRef, useState } from "react";
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
	//const [name, setName] = useState("");
	// const [email, setEmail] = useState("");
	// const [phoneNumber, setPhoneNumber] = useState("");
	// const [motivation, setMotivation] = useState("");
	// const [skills, setSkills] = useState<string[]>([]);
	// const [errors, setErrors] = useState<Record<string, string>>({});
	// const [submitAttempted, setSubmitAttempted] = useState(false);

	// function validate() {
	// 	const newErrors: Record<string, string> = {};
	// 	if (!name.trim()) newErrors.name = "Navn er påkrevd";
	// 	if (!email.trim()) newErrors.email = "E-post er påkrevd";
	// 	else if (!/\S+@\S+\.\S+/.test(email))
	// 		newErrors.email = "Ugyldig e-postadresse";
	// 	if (!phoneNumber.trim()) newErrors.phoneNumber = "Telefonnummer er påkrevd";
	// 	if (!motivation.trim()) newErrors.motivation = "Motivasjon er påkrevd";
	// 	return newErrors;
	// }

	const formRef = useRef<HTMLFormElement | null>(null);

	const [submitAttempted, setSubmitAttempted] = useState(false);

	type PadriverForm = HTMLFormElement & {
		navn: HTMLInputElement;
		phoneNumber: HTMLInputElement;
		email: HTMLInputElement;
		motivation: HTMLTextAreaElement;
	};

	function handleSubmit(e: React.SubmitEvent<PadriverForm>) {
		e.preventDefault();
		setSubmitAttempted(true);
		console.log("Form submitted:");

		// 	setSubmitAttempted(true);
		// 	const newErrors = validate();
		// 	if (Object.keys(newErrors).length > 0) {
		// 		setErrors(newErrors);
		// 		return;
		// 	}
		// 	submitPadriver();
	}

	// const createPadriverData = {
	// 	records: [
	// 		{
	// 			fields: {
	// 				Navn: name,
	// 				Telefon: phoneNumber,
	// 				Epost: email,
	// 				Kompetanse: skills,
	// 				Prosjekt: ["recNvM7EFsQDHRd57"],
	// 				Samtykke: "Jeg samtykker",
	// 				"Samtykke offentliggjøre kontaktinfo": true,
	// 			},
	// 		},
	// 	],
	// } satisfies Padriver;

	// async function submitPadriver() {
	// 	await fetch("/api/padriver", {
	// 		method: "POST",
	// 		headers: { "Content-Type": "application/json" },
	// 		body: JSON.stringify(createPadriverData),
	// 	});
	// }

	console.log(formRef.current?.checkValidity());
	console.log(submitAttempted);
	return (
		<form
			onSubmit={handleSubmit}
			noValidate
			className="relative p-8 rounded-2xl w-full flex flex-col gap-8"
			ref={formRef}
		>
			<input name="navn" type="text" required />
			{submitAttempted && !formRef.current?.checkValidity() && (
				<p>Fyll ut alle felt</p>
			)}
			<input name="email" type="email" required />
			<input name="phoneNumber" type="text" required />
			<textarea name="motivation" required />
			<Button label="Send inn" type="submit" />
		</form>
	);
}
