import { getTekst } from "./airtable";

export type SkjemaSteg = { title: string; description: string };

const getNummererteSteg = async (
	nokkelPrefix: string,
	fallbackSteg: SkjemaSteg[],
): Promise<SkjemaSteg[]> =>
	Promise.all(
		fallbackSteg.map((steg, index) =>
			Promise.all([
				getTekst(`${nokkelPrefix}.steg-${index + 1}.tittel`, steg.title),
				getTekst(
					`${nokkelPrefix}.steg-${index + 1}.beskrivelse`,
					steg.description,
				),
			]).then(([title, description]) => ({ title, description })),
		),
	);

export type PartnerSkjemaCopy = {
	steg: SkjemaSteg[];
	lukkSkjema: string;
	stegLabelMal: string;
	introTittel: string;
	nullstill: string;
	tilbake: string;
	neste: string;
	nesteLaster: string;
	sendInn: string;
	sendInnLaster: string;
	intro: {
		avsnitt1: string;
		avsnitt2: string;
		avsnitt2Uthevet: string;
		avsnitt3: string;
	};
	orgNavn: { label: string; placeholder: string; feilPakrevd: string };
	orgNummer: {
		label: string;
		placeholder: string;
		feilPakrevd: string;
		feilTall: string;
		feilLengde: string;
		feilUgyldig: string;
	};
	lokasjon: { label: string; placeholder: string; feilPakrevd: string };
	kontaktNavn: { label: string; placeholder: string; feilPakrevd: string };
	kontaktEpost: {
		label: string;
		placeholder: string;
		feilPakrevd: string;
		feilUgyldig: string;
	};
	kontaktTlf: {
		label: string;
		placeholder: string;
		feilPakrevd: string;
		feilTall: string;
		feilLengde: string;
	};
	motivasjon: {
		srLabel: string;
		placeholder: string;
		feilMaksLengde: string;
		feilPakrevd: string;
	};
	kompetanse: { feilMinstEtt: string };
	okonomiskBidrag: {
		label: string;
		hjelp: string;
		placeholder: string;
		feilPakrevd: string;
	};
	annetBidrag: {
		label: string;
		hjelp: string;
		placeholder: string;
		feilPakrevd: string;
	};
	samtykke: { tekst: string; feil: string };
	toastFeilTittel: string;
	toastFeilRegistrering: string;
	toastFeilServer: string;
	suksess: { tittel: string; avsnitt1: string; avsnitt2: string; lukk: string };
};

const getPartnerSkjemaCopy = async (): Promise<PartnerSkjemaCopy> => {
	const p = "skjema.partner";
	const [
		steg,
		lukkSkjema,
		stegLabelMal,
		introTittel,
		nullstill,
		tilbake,
		neste,
		nesteLaster,
		sendInn,
		sendInnLaster,
		introAvsnitt1,
		introAvsnitt2,
		introAvsnitt2Uthevet,
		introAvsnitt3,
		orgNavnLabel,
		orgNavnPlaceholder,
		orgNavnFeilPakrevd,
		orgNummerLabel,
		orgNummerPlaceholder,
		orgNummerFeilPakrevd,
		orgNummerFeilTall,
		orgNummerFeilLengde,
		orgNummerFeilUgyldig,
		lokasjonLabel,
		lokasjonPlaceholder,
		lokasjonFeilPakrevd,
		kontaktNavnLabel,
		kontaktNavnPlaceholder,
		kontaktNavnFeilPakrevd,
		kontaktEpostLabel,
		kontaktEpostPlaceholder,
		kontaktEpostFeilPakrevd,
		kontaktEpostFeilUgyldig,
		kontaktTlfLabel,
		kontaktTlfPlaceholder,
		kontaktTlfFeilPakrevd,
		kontaktTlfFeilTall,
		kontaktTlfFeilLengde,
		motivasjonSrLabel,
		motivasjonPlaceholder,
		motivasjonFeilMaksLengde,
		motivasjonFeilPakrevd,
		kompetanseFeilMinstEtt,
		okonomiskBidragLabel,
		okonomiskBidragHjelp,
		okonomiskBidragPlaceholder,
		okonomiskBidragFeilPakrevd,
		annetBidragLabel,
		annetBidragHjelp,
		annetBidragPlaceholder,
		annetBidragFeilPakrevd,
		samtykkeTekst,
		samtykkeFeil,
		toastFeilTittel,
		toastFeilRegistrering,
		toastFeilServer,
		suksessTittel,
		suksessAvsnitt1,
		suksessAvsnitt2,
		suksessLukk,
	] = await Promise.all([
		getNummererteSteg(p, [
			{
				title: "Om organisasjonen",
				description:
					"Informasjonen brukes for å sette dere i kontakt med andre Pådrivere og partnere.",
			},
			{
				title: "Kontaktperson",
				description: "Hvem skal vi kontakte hos dere?",
			},
			{
				title: "Deres motivasjon",
				description:
					"Hvorfor ønsker dere å bli partner som bidrar til en friskere Oslofjord?",
			},
			{
				title: "Kompetanse",
				description:
					"Hvilken kompetanse eller ressurser ønsker dere å bidra med? Velg gjerne flere.",
			},
			{
				title: "Økonomisk bidrag",
				description: "Innsatsgruppen er avhengig av langsiktig finansiering.",
			},
			{
				title: "Samtykke",
				description: "Bekreft samtykket og bli partner.",
			},
		]),
		getTekst(`${p}.lukk-skjema`, "Lukk skjema"),
		getTekst(`${p}.steg-label`, "Steg {steg} av {totalt}"),
		getTekst(`${p}.intro-tittel`, "Meld interesse som partner"),
		getTekst(`${p}.nullstill`, "Nullstill"),
		getTekst(`${p}.tilbake`, "← Tilbake"),
		getTekst(`${p}.neste`, "Neste →"),
		getTekst(`${p}.neste-laster`, "Sjekker..."),
		getTekst(`${p}.send-inn`, "Send inn"),
		getTekst(`${p}.send-inn-laster`, "Sender..."),
		getTekst(
			`${p}.intro.avsnitt-1`,
			"Dette skjemaet er en interesseregistrering.",
		),
		getTekst(
			`${p}.intro.avsnitt-2`,
			"Informasjonen du oppgir brukes til å følge opp partnerskapet og koble organisasjonen med relevante pådrivere og partnere.",
		),
		getTekst(
			`${p}.intro.avsnitt-2-uthevet`,
			"Ingenting av det du sender inn her publiseres på nettsiden.",
		),
		getTekst(
			`${p}.intro.avsnitt-3`,
			"Etter registrering mottar du en e-post med informasjon om hvordan dere kan bli synlige på fjordenvår.no.",
		),
		getTekst(`${p}.org-navn.label`, "Navn på organisasjonen"),
		getTekst(`${p}.org-navn.placeholder`, "Fjorden Vår AS"),
		getTekst(`${p}.org-navn.feil-pakrevd`, "Navn på organisasjonen er påkrevd"),
		getTekst(`${p}.org-nummer.label`, "Organisasjonsnummer"),
		getTekst(`${p}.org-nummer.placeholder`, "123 456 789"),
		getTekst(`${p}.org-nummer.feil-pakrevd`, "Organisasjonsnummer er påkrevd"),
		getTekst(
			`${p}.org-nummer.feil-tall`,
			"Organisasjonsnummer kan bare inneholde tall",
		),
		getTekst(
			`${p}.org-nummer.feil-lengde`,
			"Organisasjonsnummer må bestå av 9 siffer",
		),
		getTekst(`${p}.org-nummer.feil-ugyldig`, "Ugyldig organisasjonsnummer"),
		getTekst(`${p}.lokasjon.label`, "Lokasjon"),
		getTekst(`${p}.lokasjon.placeholder`, "Oslo, Norge"),
		getTekst(`${p}.lokasjon.feil-pakrevd`, "Lokasjon er påkrevd"),
		getTekst(`${p}.kontakt-navn.label`, "Fullt navn"),
		getTekst(`${p}.kontakt-navn.placeholder`, "Ola Nordmann"),
		getTekst(`${p}.kontakt-navn.feil-pakrevd`, "Navn er påkrevd"),
		getTekst(`${p}.kontakt-epost.label`, "Epost"),
		getTekst(`${p}.kontakt-epost.placeholder`, "ola.nordmann@example.com"),
		getTekst(`${p}.kontakt-epost.feil-pakrevd`, "Epost er påkrevd"),
		getTekst(`${p}.kontakt-epost.feil-ugyldig`, "Ugyldig e-postadresse"),
		getTekst(`${p}.kontakt-tlf.label`, "Tlf"),
		getTekst(`${p}.kontakt-tlf.placeholder`, "+47 123 45 678"),
		getTekst(`${p}.kontakt-tlf.feil-pakrevd`, "Tlf er påkrevd"),
		getTekst(
			`${p}.kontakt-tlf.feil-tall`,
			"Tlf kan bare inneholde tall (og eventuelt + foran landkode)",
		),
		getTekst(`${p}.kontakt-tlf.feil-lengde`, "Tlf må bestå av minst 8 tegn"),
		getTekst(`${p}.motivasjon.sr-label`, "Deres motivasjon"),
		getTekst(
			`${p}.motivasjon.placeholder`,
			"Fortell litt om hvorfor dere ønsker å bli partner, og hva dere håper å oppnå med samarbeidet.",
		),
		getTekst(`${p}.motivasjon.feil-maks-lengde`, "Maks 400 tegn"),
		getTekst(`${p}.motivasjon.feil-pakrevd`, "Dette feltet er påkrevd"),
		getTekst(`${p}.kompetanse.feil-minst-ett`, "Velg minst ett alternativ"),
		getTekst(`${p}.okonomisk-bidrag.label`, "Beløp"),
		getTekst(
			`${p}.okonomisk-bidrag.hjelp`,
			"Beskriv beløp, sponsormidler eller annen økonomisk støtte dere kan bidra med.",
		),
		getTekst(
			`${p}.okonomisk-bidrag.placeholder`,
			"Et gitt beløp per år, eller sponsormidler",
		),
		getTekst(`${p}.okonomisk-bidrag.feil-pakrevd`, "Dette feltet er påkrevd"),
		getTekst(`${p}.annet-bidrag.label`, "Annet bidrag"),
		getTekst(
			`${p}.annet-bidrag.hjelp`,
			"Beskriv personer, stillingsbrøker eller annet dere kan bidra med til innsatsgruppen.",
		),
		getTekst(
			`${p}.annet-bidrag.placeholder`,
			"Egeninnsats, utstyr, lokaler eller nettverk",
		),
		getTekst(`${p}.annet-bidrag.feil-pakrevd`, "Dette feltet er påkrevd"),
		getTekst(
			`${p}.samtykke.tekst`,
			"Jeg samtykker til at oppgitt informasjon brukes til å sette oss i kontakt med andre i nettverket.",
		),
		getTekst(`${p}.samtykke.feil`, "Du må samtykke for å sende inn skjemaet"),
		getTekst(`${p}.toast.feil-tittel`, "Noe gikk galt"),
		getTekst(
			`${p}.toast.feil-registrering`,
			"Vi klarte ikke å registrere partneren. Prøv igjen.",
		),
		getTekst(
			`${p}.toast.feil-server`,
			"Vi klarte ikke å koble til serveren. Sjekk internettforbindelsen og prøv igjen.",
		),
		getTekst(`${p}.suksess.tittel`, "Tusen takk for interessen!"),
		getTekst(
			`${p}.suksess.avsnitt-1`,
			"Vi har mottatt registreringen din om å bli partner for Oppdrag: Fjorden Vår.",
		),
		getTekst(
			`${p}.suksess.avsnitt-2`,
			"Du vil snart motta en e-post med informasjon om prosessen videre.",
		),
		getTekst(`${p}.suksess.lukk`, "Lukk"),
	]);

	return {
		steg,
		lukkSkjema,
		stegLabelMal,
		introTittel,
		nullstill,
		tilbake,
		neste,
		nesteLaster,
		sendInn,
		sendInnLaster,
		intro: {
			avsnitt1: introAvsnitt1,
			avsnitt2: introAvsnitt2,
			avsnitt2Uthevet: introAvsnitt2Uthevet,
			avsnitt3: introAvsnitt3,
		},
		orgNavn: {
			label: orgNavnLabel,
			placeholder: orgNavnPlaceholder,
			feilPakrevd: orgNavnFeilPakrevd,
		},
		orgNummer: {
			label: orgNummerLabel,
			placeholder: orgNummerPlaceholder,
			feilPakrevd: orgNummerFeilPakrevd,
			feilTall: orgNummerFeilTall,
			feilLengde: orgNummerFeilLengde,
			feilUgyldig: orgNummerFeilUgyldig,
		},
		lokasjon: {
			label: lokasjonLabel,
			placeholder: lokasjonPlaceholder,
			feilPakrevd: lokasjonFeilPakrevd,
		},
		kontaktNavn: {
			label: kontaktNavnLabel,
			placeholder: kontaktNavnPlaceholder,
			feilPakrevd: kontaktNavnFeilPakrevd,
		},
		kontaktEpost: {
			label: kontaktEpostLabel,
			placeholder: kontaktEpostPlaceholder,
			feilPakrevd: kontaktEpostFeilPakrevd,
			feilUgyldig: kontaktEpostFeilUgyldig,
		},
		kontaktTlf: {
			label: kontaktTlfLabel,
			placeholder: kontaktTlfPlaceholder,
			feilPakrevd: kontaktTlfFeilPakrevd,
			feilTall: kontaktTlfFeilTall,
			feilLengde: kontaktTlfFeilLengde,
		},
		motivasjon: {
			srLabel: motivasjonSrLabel,
			placeholder: motivasjonPlaceholder,
			feilMaksLengde: motivasjonFeilMaksLengde,
			feilPakrevd: motivasjonFeilPakrevd,
		},
		kompetanse: { feilMinstEtt: kompetanseFeilMinstEtt },
		okonomiskBidrag: {
			label: okonomiskBidragLabel,
			hjelp: okonomiskBidragHjelp,
			placeholder: okonomiskBidragPlaceholder,
			feilPakrevd: okonomiskBidragFeilPakrevd,
		},
		annetBidrag: {
			label: annetBidragLabel,
			hjelp: annetBidragHjelp,
			placeholder: annetBidragPlaceholder,
			feilPakrevd: annetBidragFeilPakrevd,
		},
		samtykke: { tekst: samtykkeTekst, feil: samtykkeFeil },
		toastFeilTittel,
		toastFeilRegistrering,
		toastFeilServer,
		suksess: {
			tittel: suksessTittel,
			avsnitt1: suksessAvsnitt1,
			avsnitt2: suksessAvsnitt2,
			lukk: suksessLukk,
		},
	};
};

export type PadriverSkjemaCopy = {
	steg: SkjemaSteg[];
	lukkSkjema: string;
	stegLabelMal: string;
	introTittel: string;
	nullstill: string;
	tilbake: string;
	neste: string;
	nesteLaster: string;
	sendInn: string;
	sendInnLaster: string;
	intro: {
		avsnitt1: string;
		avsnitt2: string;
		avsnitt2Uthevet: string;
		avsnitt3: string;
	};
	navn: { label: string; placeholder: string; feilPakrevd: string };
	epost: {
		label: string;
		placeholder: string;
		feilPakrevd: string;
		feilUgyldig: string;
	};
	telefon: {
		label: string;
		placeholder: string;
		feilPakrevd: string;
		feilTall: string;
		feilLengde: string;
	};
	motivasjon: { srLabel: string; placeholder: string; feilPakrevd: string };
	kompetanse: { feilMinstEtt: string };
	samtykke: { tekst: string; feil: string };
	toastFeilTittel: string;
	toastFeilRegistrering: string;
	toastFeilServer: string;
	suksess: { tittel: string; avsnitt1: string; avsnitt2: string; lukk: string };
};

const getPadriverSkjemaCopy = async (): Promise<PadriverSkjemaCopy> => {
	const p = "skjema.padriver";
	const [
		steg,
		lukkSkjema,
		stegLabelMal,
		introTittel,
		nullstill,
		tilbake,
		neste,
		nesteLaster,
		sendInn,
		sendInnLaster,
		introAvsnitt1,
		introAvsnitt2,
		introAvsnitt2Uthevet,
		introAvsnitt3,
		navnLabel,
		navnPlaceholder,
		navnFeilPakrevd,
		epostLabel,
		epostPlaceholder,
		epostFeilPakrevd,
		epostFeilUgyldig,
		telefonLabel,
		telefonPlaceholder,
		telefonFeilPakrevd,
		telefonFeilTall,
		telefonFeilLengde,
		motivasjonSrLabel,
		motivasjonPlaceholder,
		motivasjonFeilPakrevd,
		kompetanseFeilMinstEtt,
		samtykkeTekst,
		samtykkeFeil,
		toastFeilTittel,
		toastFeilRegistrering,
		toastFeilServer,
		suksessTittel,
		suksessAvsnitt1,
		suksessAvsnitt2,
		suksessLukk,
	] = await Promise.all([
		getNummererteSteg(p, [
			{
				title: "Om deg",
				description:
					"Informasjonen brukes for å sette deg i kontakt med andre Pådrivere og partnere.",
			},
			{
				title: "Din motivasjon",
				description:
					"Hvorfor vil du bli en Pådriver som bidrar til en friskere Oslofjord?",
			},
			{
				title: "Kompetanse",
				description: "Har du erfaring innen noe av dette? Velg gjerne flere.",
			},
			{
				title: "Samtykke",
				description: "Bekreft samtykket ditt og bli en Pådriver.",
			},
		]),
		getTekst(`${p}.lukk-skjema`, "Lukk skjema"),
		getTekst(`${p}.steg-label`, "Steg {steg} av {totalt}"),
		getTekst(`${p}.intro-tittel`, "Meld interesse som pådriver"),
		getTekst(`${p}.nullstill`, "Nullstill"),
		getTekst(`${p}.tilbake`, "← Tilbake"),
		getTekst(`${p}.neste`, "Neste →"),
		getTekst(`${p}.neste-laster`, "Sjekker..."),
		getTekst(`${p}.send-inn`, "Send inn"),
		getTekst(`${p}.send-inn-laster`, "Sender..."),
		getTekst(
			`${p}.intro.avsnitt-1`,
			"Dette skjemaet er en interesseregistrering.",
		),
		getTekst(
			`${p}.intro.avsnitt-2`,
			"Informasjonen du oppgir brukes til å følge deg opp og koble deg med relevante pådrivere og partnere.",
		),
		getTekst(
			`${p}.intro.avsnitt-2-uthevet`,
			"Ingenting av det du sender inn her publiseres på nettsiden.",
		),
		getTekst(
			`${p}.intro.avsnitt-3`,
			"Etter registrering får du en e-post der du selv kan velge om du ønsker å bli synlig som pådriver på fjordenvår.no.",
		),
		getTekst(`${p}.navn.label`, "Fullt navn"),
		getTekst(`${p}.navn.placeholder`, "Ola Nordmann"),
		getTekst(`${p}.navn.feil-pakrevd`, "Navn er påkrevd"),
		getTekst(`${p}.epost.label`, "E-post"),
		getTekst(`${p}.epost.placeholder`, "ola.nordmann@example.com"),
		getTekst(`${p}.epost.feil-pakrevd`, "E-post er påkrevd"),
		getTekst(`${p}.epost.feil-ugyldig`, "Ugyldig e-postadresse"),
		getTekst(`${p}.telefon.label`, "Telefon"),
		getTekst(`${p}.telefon.placeholder`, "+47 123 45 678"),
		getTekst(`${p}.telefon.feil-pakrevd`, "Telefonnummer er påkrevd"),
		getTekst(
			`${p}.telefon.feil-tall`,
			"Telefonnummer kan bare inneholde tall (og eventuelt + foran landkode)",
		),
		getTekst(`${p}.telefon.feil-lengde`, "Telefonnummer må ha minst 8 sifre"),
		getTekst(`${p}.motivasjon.sr-label`, "Din motivasjon"),
		getTekst(
			`${p}.motivasjon.placeholder`,
			"Fortell litt om hvorfor du ønsker å bli Pådriver, og hva du håper å oppnå.",
		),
		getTekst(`${p}.motivasjon.feil-pakrevd`, "Motivasjon er påkrevd"),
		getTekst(
			`${p}.kompetanse.feil-minst-ett`,
			"Velg minst ett kompetanseområde",
		),
		getTekst(
			`${p}.samtykke.tekst`,
			"Jeg samtykker til at oppgitt informasjon brukes til å sette meg i kontakt med andre i nettverket.",
		),
		getTekst(
			`${p}.samtykke.feil`,
			"Du må krysse av for samtykke før du kan melde deg inn.",
		),
		getTekst(`${p}.toast.feil-tittel`, "Noe gikk galt"),
		getTekst(
			`${p}.toast.feil-registrering`,
			"Vi klarte ikke å registrere påmeldingen din. Prøv igjen.",
		),
		getTekst(
			`${p}.toast.feil-server`,
			"Vi klarte ikke å koble til serveren. Sjekk internettforbindelsen og prøv igjen.",
		),
		getTekst(`${p}.suksess.tittel`, "Tusen takk for interessen!"),
		getTekst(
			`${p}.suksess.avsnitt-1`,
			"Vi har mottatt registreringen din om å bli pådriver for Oppdrag: Fjorden Vår.",
		),
		getTekst(
			`${p}.suksess.avsnitt-2`,
			"Du vil snart motta en e-post med informasjon om prosessen videre.",
		),
		getTekst(`${p}.suksess.lukk`, "Lukk"),
	]);

	return {
		steg,
		lukkSkjema,
		stegLabelMal,
		introTittel,
		nullstill,
		tilbake,
		neste,
		nesteLaster,
		sendInn,
		sendInnLaster,
		intro: {
			avsnitt1: introAvsnitt1,
			avsnitt2: introAvsnitt2,
			avsnitt2Uthevet: introAvsnitt2Uthevet,
			avsnitt3: introAvsnitt3,
		},
		navn: {
			label: navnLabel,
			placeholder: navnPlaceholder,
			feilPakrevd: navnFeilPakrevd,
		},
		epost: {
			label: epostLabel,
			placeholder: epostPlaceholder,
			feilPakrevd: epostFeilPakrevd,
			feilUgyldig: epostFeilUgyldig,
		},
		telefon: {
			label: telefonLabel,
			placeholder: telefonPlaceholder,
			feilPakrevd: telefonFeilPakrevd,
			feilTall: telefonFeilTall,
			feilLengde: telefonFeilLengde,
		},
		motivasjon: {
			srLabel: motivasjonSrLabel,
			placeholder: motivasjonPlaceholder,
			feilPakrevd: motivasjonFeilPakrevd,
		},
		kompetanse: { feilMinstEtt: kompetanseFeilMinstEtt },
		samtykke: { tekst: samtykkeTekst, feil: samtykkeFeil },
		toastFeilTittel,
		toastFeilRegistrering,
		toastFeilServer,
		suksess: {
			tittel: suksessTittel,
			avsnitt1: suksessAvsnitt1,
			avsnitt2: suksessAvsnitt2,
			lukk: suksessLukk,
		},
	};
};

export { getPadriverSkjemaCopy, getPartnerSkjemaCopy };
