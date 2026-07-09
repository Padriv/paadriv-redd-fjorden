"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useRef, useState } from "react";

const links = [
	{ href: "/padriver", label: "Pådrivere" },
	{ href: "/partnere", label: "Partnere" },
];

type NavigationbarProps = {
	solid?: boolean;
};

export default function Navigationbar({ solid = false }: NavigationbarProps) {
	const pathname = usePathname();
	const [visible, setVisible] = useState(true);
	const [scrolled, setScrolled] = useState(false);
	const lastScrollY = useRef(0);

	function handleLogoClick() {
		if (pathname === "/") {
			window.scrollTo({ top: 0, behavior: "smooth" });
		}
	}

	function handleJoinClick(event: React.MouseEvent<HTMLAnchorElement>) {
		if (pathname === "/") {
			event.preventDefault();
			document
				.getElementById("bli-med")
				?.scrollIntoView({ behavior: "smooth" });
		}
	}

	useEffect(() => {
		function handleScroll() {
			const currentScrollY = window.scrollY;

			setScrolled(currentScrollY > 10);

			if (currentScrollY > lastScrollY.current && currentScrollY > 80) {
				setVisible(false);
			} else {
				setVisible(true);
			}

			lastScrollY.current = currentScrollY;
		}

		window.addEventListener("scroll", handleScroll, { passive: true });
		return () => window.removeEventListener("scroll", handleScroll);
	}, []);

	return (
		<header
			className={`fixed inset-x-0 top-0 z-50 flex items-center justify-between px-4 py-4 transition-all duration-300 sm:px-6 md:px-16 md:py-5 ${
				visible ? "translate-y-0" : "-translate-y-full"
			} ${
				solid || scrolled
					? "bg-deep-green/90 backdrop-blur-sm"
					: "bg-transparent"
			}`}
		>
			<Link
				href="/"
				onClick={handleLogoClick}
				className="text-label font-bold leading-tight text-cream"
			>
				Oppdrag
				<br />
				fjorden
				<br />
				vår
			</Link>

			<div className="flex items-center gap-3 sm:gap-6 md:gap-8">
				{links.map((link) => (
					<Link
						key={link.href}
						href={link.href}
						className="text-link whitespace-nowrap font-medium text-cream transition-opacity hover:opacity-80"
					>
						{link.label}
					</Link>
				))}

				<Link
					href="/#bli-med"
					onClick={handleJoinClick}
					className="text-button whitespace-nowrap rounded-full bg-cream px-3 py-1.5 font-semibold text-deep-green transition-transform hover:scale-105 md:px-5 md:py-2"
				>
					Bli med
				</Link>
			</div>
		</header>
	);
}