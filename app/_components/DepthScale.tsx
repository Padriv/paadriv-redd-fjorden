"use client";

import { useEffect, useRef, useState } from "react";
import DiverIcon from "./DiverIcon";

const MAX_DEPTH_M = 460;
const DEPTH_MARKS = [0, 100, 200, 300, 400, MAX_DEPTH_M];

function getScrollBounds() {
	const heroRect = document
		.getElementById("home-hero")
		?.getBoundingClientRect();
	const heroBottomAbsolute = (heroRect?.bottom ?? 0) + window.scrollY;
	const activationPoint = heroBottomAbsolute - window.innerHeight * 0.85;
	const scrollable =
		document.documentElement.scrollHeight -
		window.innerHeight -
		activationPoint;

	return { activationPoint, scrollable };
}

export default function DepthScale() {
	const [progress, setProgress] = useState(0);
	const [visible, setVisible] = useState(false);
	const [dragging, setDragging] = useState(false);
	const trackRef = useRef<HTMLDivElement>(null);

	useEffect(() => {
		let frame = 0;

		function updateProgress() {
			const { activationPoint, scrollable } = getScrollBounds();

			setVisible(window.scrollY >= activationPoint);

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

	useEffect(() => {
		if (!dragging) return;

		function scrollToClientY(clientY: number) {
			const track = trackRef.current;
			if (!track) return;

			const rect = track.getBoundingClientRect();
			const ratio = Math.min(
				Math.max((clientY - rect.top) / rect.height, 0),
				1,
			);

			const { activationPoint, scrollable } = getScrollBounds();
			if (scrollable <= 0) return;

			window.scrollTo(0, activationPoint + ratio * scrollable);
		}

		function onPointerMove(event: PointerEvent) {
			scrollToClientY(event.clientY);
		}

		function onPointerUp() {
			setDragging(false);
		}

		document.body.style.userSelect = "none";
		window.addEventListener("pointermove", onPointerMove);
		window.addEventListener("pointerup", onPointerUp);
		return () => {
			document.body.style.userSelect = "";
			window.removeEventListener("pointermove", onPointerMove);
			window.removeEventListener("pointerup", onPointerUp);
		};
	}, [dragging]);

	return (
		<div
			ref={trackRef}
			className={`pointer-events-none fixed right-10 top-[15%] bottom-[15%] z-40 hidden text-green-moss transition-opacity duration-300 sm:block md:right-20 ${
				visible ? "opacity-100" : "opacity-0"
			}`}
			aria-hidden="true"
		>
			<DiverIcon
				className={`pointer-events-auto absolute right-3 w-9 -translate-y-1/2 touch-none transition-transform hover:scale-(--hover-dykker) ${
					dragging ? "cursor-grabbing" : "cursor-grab"
				}`}
				style={{ top: `${progress * 100}%` }}
				onPointerDown={(event) => {
					event.preventDefault();
					setDragging(true);
				}}
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
