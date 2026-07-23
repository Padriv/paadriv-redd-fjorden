type HeroSectionProps = {
	overline?: string;
	heading: string;
	subheading?: string;
	description: string;
	buttonLabel: string;
	onJoinClick: () => void;
};

export default function HeroSection({
	overline,
	heading,
	subheading,
	description,
	buttonLabel,
	onJoinClick,
}: HeroSectionProps) {
	return (
		<section className="flex w-full flex-col items-center bg-deep-green px-4 py-32 md:px-28">
			<div className="flex max-w-5xl flex-col gap-group">
				{overline && (
					<span className="text-sm font-semibold uppercase tracking-wide text-muted-inverse">
						{overline}
					</span>
				)}
				<h1 className="text-hero font-bold text-cream">{heading}</h1>
				{subheading && (
					<p className="mt-group text-subheading font-semibold text-cream">
						{subheading}
					</p>
				)}
				<p className="text-body text-cream/90">{description}</p>
				<button
					type="button"
					onClick={onJoinClick}
					className="flex h-12 w-fit items-center justify-center self-start rounded-full bg-cream px-8 text-button font-semibold text-deep-green transition-transform hover:scale-(--hover-navigasjonsbar)"
				>
					{buttonLabel}
				</button>
			</div>
		</section>
	);
}
