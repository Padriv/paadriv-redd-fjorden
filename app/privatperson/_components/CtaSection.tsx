type CtaSectionProps = {
	showForm: boolean;
	onJoinClick: () => void;
};

export default function CtaSection({ showForm, onJoinClick }: CtaSectionProps) {
	return (
		<section className="flex w-full flex-col items-center bg-deep-green px-16 py-cluster text-cream">
			<div className="flex max-w-2xl flex-col items-center gap-group text-center">
				<h2 className="text-section font-semibold">Klar til å bli med?</h2>
				<p className="text-body">
					Det tar bare to minutter. Fyll ut skjemaet, så tar vi kontakt for å
					finne ut hvor du kan gjøre størst forskjell.
				</p>
				{!showForm && (
					<button
						type="button"
						onClick={onJoinClick}
						className="flex h-12 items-center justify-center rounded-full bg-cream px-8 text-button font-medium text-deep-green transition-colors hover:bg-tan"
					>
						Meld deg på →
					</button>
				)}
			</div>
		</section>
	);
}
