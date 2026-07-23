import Wave from "@/app/_components/Wave";
import ScrollReveal from "@/components/ScrollReveal";

export default function PartnershipSection() {
	return (
		<section className="relative flex w-full flex-col items-center bg-deep-green px-4 pb-40 pt-56 text-cream md:px-28">
			<Wave fillClassName="fill-cream" />

			<ScrollReveal className="flex max-w-5xl flex-col gap-group">
				<h2 className="text-section font-bold">Et spleiselag for fjorden</h2>
				<p className="text-body text-cream/90">
					Prosjektet <em className="mr-1">Oppdrag: Fjorden Vår</em> finansieres
					gjennom bidrag fra partnere, tilskudd og prosjektmidler.
					Partnerbidraget går direkte til å realisere tiltak og styrke arbeidet
					for en frisk Oslofjord. Vi selger ikke tjenester og tar ikke ut
					overskudd. Bidraget trenger ikke være penger. Dere kan også allokere
					personer eller stillingsbrøker til innsatsgruppen, eller bidra på
					andre måter som gir verdi.
				</p>
				<p className="text-body text-cream/90">
					Partnerskapet handler om mer enn et bidrag. Som partner stiller dere
					dere bak formålet til Oppdrag: Fjorden Vår, deltar på partnersamlinger
					og bidrar til å forankre arbeidet i egen virksomhet. Til gjengjeld
					blir dere en synlig del av et fellesskap som jobber sammen for en
					frisk Oslofjord.
				</p>
			</ScrollReveal>
		</section>
	);
}
