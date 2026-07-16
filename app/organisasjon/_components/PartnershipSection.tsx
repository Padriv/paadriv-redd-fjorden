import Wave from "@/app/_components/Wave";

export default function PartnershipSection() {
	return (
		<section className="relative flex w-full flex-col items-center bg-deep-green px-16 pb-cluster pt-40 text-cream">
			<Wave fillClassName="fill-cream" />

			<div className="flex max-w-2xl flex-col gap-group">
				<h2 className="text-section font-semibold">
					Et spleiselag for fjorden
				</h2>
				<p className="text-body text-cream/90">
					Oppdrag: Fjorden Vår finansieres gjennom bidrag fra partnere, tilskudd
					og prosjektmidler. Partnerbidraget går direkte til å realisere tiltak
					og styrke arbeidet for en frisk Oslofjord. Vi selger ikke tjenester og
					tar ikke ut overskudd. Bidraget trenger ikke være penger. Dere kan
					også allokere personer eller stillingsbrøker til innsatsgruppen, eller
					bidra på andre måter som gir verdi.
				</p>
				<p className="text-body text-cream/90">
					Partnerskapet handler om mer enn et bidrag. Som partner stiller dere
					dere bak formålet til Oppdrag: Fjorden Vår, deltar på partnersamlinger
					og bidrar til å forankre arbeidet i egen virksomhet. Til gjengjeld
					blir dere en synlig del av et fellesskap som jobber sammen for en
					frisk Oslofjord.
				</p>
			</div>
		</section>
	);
}
