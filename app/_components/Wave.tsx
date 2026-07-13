type WaveProps = {
	fillClassName: string;
	/** "top" hangs down from above (default). "bottom" sits at this section's own bottom edge. */
	position?: "top" | "bottom";
	heightClassName?: string;
};

export default function Wave({
	fillClassName,
	position = "top",
	heightClassName = "h-40",
}: WaveProps) {
	const isBottom = position === "bottom";
	const closeY = isBottom ? 220 : 0;

	return (
		<svg
			className={`absolute left-0 ${heightClassName} w-full ${isBottom ? "bottom-0" : "top-0"}`}
			viewBox="0 0 1440 220"
			preserveAspectRatio="none"
			aria-hidden="true"
		>
			<path
				d={`M0,110 C360,0 1080,220 1440,110 L1440,${closeY} L0,${closeY} Z`}
				className={fillClassName}
			/>
		</svg>
	);
}
