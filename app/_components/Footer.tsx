import Image from "next/image";

export default function Footer() {
	return (
		<footer className="flex w-full flex-col gap-group bg-cream px-4 py-cluster text-ink sm:px-6 md:px-16">
			<div className="grid w-full grid-cols-1 gap-loose md:grid-cols-2">
				<div className="flex flex-col gap-group">
					<Image
						src="/images/paadriv-logo-sort.png"
						alt="Påadriv"
						width={150}
						height={47}
					/>
				</div>
				<div className="flex flex-col gap-group" />
			</div>
		</footer>
	);
}
