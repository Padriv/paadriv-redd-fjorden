import Image from "next/image";

export default function Hero() {
	return (
		<section className="relative flex h-dvh min-h-[600px] w-full flex-col justify-end overflow-hidden bg-deep-green pb-32 pl-10 pr-6 pt-10 md:pb-40 md:pl-28 md:pr-16">
			<Image
				src="/images/Forsidebilde.jpg"
				alt="Dykker som undersøker dekk og skrot på fjordbunnen"
				fill
				priority
				className="object-cover object-[center_40%]"
			/>

			<div className="absolute inset-0 bg-gradient-to-b from-deep-green/40 via-deep-green/50 to-deep-green/85" />

			<div className="relative z-10 flex max-w-2xl flex-col gap-compact text-cream sm:gap-group">
				<h1 className="text-hero text-balance font-extrabold leading-tight">
					Bli med og gjør Oslofjorden frisk
				</h1>
				<p className="text-body text-balance max-w-lg font-medium leading-relaxed">
					Oppdrag: Fjorden Vår kobler mennesker, kunnskap og ressurser på tvers
					av offentlig, privat og frivillig sektor. Vi tror de beste løsningene
					skapes når vi jobber sammen — derfor trenger vi deg med på laget
				</p>
			</div>
		</section>
	);
}
