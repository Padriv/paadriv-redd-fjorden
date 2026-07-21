"use client";

import { useEffect, useState } from "react";
import DiverIcon from "./DiverIcon";

const MAX_DEPTH_M = 200;
const DEPTH_MARKS = [0, 50, 100, 150, 200];

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
