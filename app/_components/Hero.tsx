import Image from "next/image";
import Link from "next/link";

export default function Hero() {
	return (
		<section className="relative flex h-[90vh] min-h-[600px] w-full flex-col justify-between overflow-hidden bg-gradient-to-b from-emerald-900 to-emerald-950 px-16 py-10 text-[#FEFFC8]">
			<Image
				src="/bilder/BILDE.jpg"
				alt="Dykker som undersøker dekk og skrot på fjordbunnen"
				fill
				priority
				className="object-cover"
			/>
			<div className="absolute inset-0 bg-emerald-800/10" />
			<div className="absolute inset-0 bg-gradient-to-b from-emerald-950/70 via-emerald-950/40 to-emerald-950/80" />

			<nav className="relative z-10 flex items-start justify-between">
				<span className="font-[family-name:var(--font-syne)] text-lg font-bold leading-tight text-[#FEFFC8]">
					Oppdrag
					<br />
					fjorden
					<br />
					vår
				</span>

				<div className="flex items-center gap-10 text-base font-medium">
					<Link
						href="/padriver"
						className="transition-opacity hover:opacity-70"
					>
						Pådrivere
					</Link>
					<Link
						href="/partnere"
						className="transition-opacity hover:opacity-70"
					>
						Partnere
					</Link>
					<Link
						href="#meld-interesse-organisasjon"
						className="transition-opacity hover:opacity-70"
					>
						Bli med
					</Link>
				</div>
			</nav>

			<h1 className="relative z-10 max-w-2xl font-[family-name:var(--font-geist-sans)] text-5xl font-extrabold leading-tight md:text-6xl">
				Bli med og gjør
				<br />
				Oslofjorden frisk
			</h1>
		</section>
	);
}
