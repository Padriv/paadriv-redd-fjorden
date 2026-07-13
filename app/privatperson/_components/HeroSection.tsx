type HeroSectionProps = {
	onJoinClick: () => void;
};

export default function HeroSection({ onJoinClick }: HeroSectionProps) {
	return (
		<section className="flex w-full flex-col items-center bg-background px-16 py-32">
			<div className="flex max-w-2xl flex-col gap-group">
				<span className="text-caption font-semibold uppercase tracking-wide text-muted">
					For privatpersoner
				</span>
				<h1 className="text-hero font-bold text-ink">
					Bli pådriver for Oslofjorden
				</h1>
				<p className="text-lead text-copy">
					Du trenger ikke være ekspert eller ha massevis av tid. Du trenger bare
					å ville noe for fjorden. Vi kobler deg med mennesker, kunnskap og
					tiltak der engasjementet ditt kan gjøre en forskjell.
				</p>
				<button
					type="button"
					onClick={onJoinClick}
					className="flex h-10 w-fit items-center justify-center self-start rounded-full bg-deep-green px-6 text-label font-medium text-white transition-colors hover:bg-green"
				>
					Meld deg på →
				</button>
			</div>
		</section>
	);
}
