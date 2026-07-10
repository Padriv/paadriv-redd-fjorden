type WaveProps = {
	fillClassName: string;
};

export default function Wave({ fillClassName }: WaveProps) {
	return (
		<svg
			className="absolute left-0 top-0 h-40 w-full"
			viewBox="0 0 1440 220"
			preserveAspectRatio="none"
			aria-hidden="true"
		>
			<path
				d="M0,110 C360,-80 1080,300 1440,110 L1440,0 L0,0 Z"
				className={fillClassName}
			/>
		</svg>
	);
}
