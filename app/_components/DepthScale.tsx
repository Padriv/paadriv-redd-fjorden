"use client";

import { useEffect, useState } from "react";

const MAX_DEPTH_M = 200;
const DEPTH_MARKS = [0, 50, 100, 150, 200];

function DiverIcon({
	className,
	style,
}: {
	className: string;
	style?: React.CSSProperties;
}) {
	return (
		<svg
			viewBox="0 0 512 512"
			fill="currentColor"
			aria-hidden="true"
			className={className}
			style={style}
		>
			<path d="M39.588,405.243c-14.315,14.762-17.943,35.878-11.157,53.916l-13.79,18.515L60.751,512l14.558-19.565l-0.094-0.062c13.837,0.337,27.776-4.819,38.182-15.537c19.761-20.388,19.26-52.928-1.129-72.704C91.889,384.37,59.349,384.864,39.588,405.243z" />
			<path d="M232.032,227.946c7.162-6.355,7.836-17.418,1.481-24.58l-33.527-37.79c-6.354-7.161-17.418-7.828-24.58-1.473L151.249,185.4l56.634,63.835L232.032,227.946z" />
			<path d="M123.45,323.27l75.313-65.942l-56.626-63.843l-75.321,65.942c-17.63,15.639-19.236,42.601-3.604,60.238C78.851,337.296,105.812,338.909,123.45,323.27z" />
			<polygon points="337.018,203.154 344.931,149.67 322.827,104.938 356.213,32.282 304.642,0 274.147,120.382 309.069,210.661" />
			<path d="M459.053,22.253l-98.154,85.655l-14.542,103.56l-60.896,15.184c-13.791,2.116-38.166,13.783-52.324,24.282c-25.222,18.233-82.004,66.742-94.918,78.424c-51.133,46.338,3.863,100.966,40.415,97.675l95.371-9.661l74.083-5.532c11.032,0.352,20.278-8.306,20.63-19.353c0.345-11.032-8.313-20.278-19.361-20.63l-73.793-3.558l-33.606-1.074c0,0,56.704-51.314,59.086-53.405c1.316-1.159,0.705-0.909,2.758-2.272l74.004-42.428c9.692-4.395,26.342-12.662,30.01-36.474l2.656-95.528l0.494-2.994l86.392-46.181L459.053,22.253z" />
		</svg>
	);
}

export default function DepthScale() {
	const [progress, setProgress] = useState(0);
	const [visible, setVisible] = useState(false);

	useEffect(() => {
		let frame = 0;

		function updateProgress() {
			const heroRect = document
				.getElementById("home-hero")
				?.getBoundingClientRect();
			const heroBottomAbsolute = (heroRect?.bottom ?? 0) + window.scrollY;
			const activationPoint = heroBottomAbsolute - window.innerHeight * 0.85;

			setVisible(window.scrollY >= activationPoint);

			const scrollable =
				document.documentElement.scrollHeight -
				window.innerHeight -
				activationPoint;
			const ratio =
				scrollable > 0 ? (window.scrollY - activationPoint) / scrollable : 0;
			setProgress(Math.min(Math.max(ratio, 0), 1));
		}

		function onScroll() {
			cancelAnimationFrame(frame);
			frame = requestAnimationFrame(updateProgress);
		}

		updateProgress();
		window.addEventListener("scroll", onScroll, { passive: true });
		window.addEventListener("resize", onScroll);
		return () => {
			cancelAnimationFrame(frame);
			window.removeEventListener("scroll", onScroll);
			window.removeEventListener("resize", onScroll);
		};
	}, []);

	return (
		<div
			className={`pointer-events-none fixed right-10 top-[15%] bottom-[15%] z-40 hidden text-green-moss transition-opacity duration-300 sm:block md:right-20 ${
				visible ? "opacity-100" : "opacity-0"
			}`}
			aria-hidden="true"
		>
			<DiverIcon
				className="absolute right-3 w-9 -translate-y-1/2"
				style={{ top: `${progress * 100}%` }}
			/>
			<div className="absolute right-0 top-0 bottom-0 w-px bg-green-moss" />
			{DEPTH_MARKS.map((depth) => {
				const percent = (depth / MAX_DEPTH_M) * 100;
				return (
					<div
						key={depth}
						className="absolute left-0 flex -translate-y-1/2 items-center gap-2"
						style={{ top: `${percent}%` }}
					>
						<span className="h-px w-2.5 bg-green-moss" />
						<span className="text-caption whitespace-nowrap font-semibold text-green-moss">
							{depth} m
						</span>
					</div>
				);
			})}
		</div>
	);
}
