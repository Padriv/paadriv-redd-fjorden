import Image from "next/image";

type FooterProps = {
	variant?: "cream" | "green";
};

export default function Footer({ variant = "cream" }: FooterProps) {
	const isGreen = variant === "green";

	const logoSrc = isGreen
		? "/images/paadriv-logo-hvit.png"
		: "/images/paadriv-logo-sort.png";
	const socialIconColor = isGreen ? "green" : "cream";
	const socialIconBg = isGreen ? "bg-cream" : "bg-deep-green";
	const contactIconColor = isGreen ? "cream" : "green";
	const headingColor = isGreen ? "text-cream" : "text-deep-green";
	const contactTextColor = isGreen ? "text-cream" : "text-deep-green";

	return (
		<footer
			className={`flex w-full flex-col gap-group px-4 py-cluster sm:px-6 md:px-16 ${
				isGreen ? "bg-deep-green text-cream" : "bg-cream text-ink"
			}`}
		>
			<div className="grid w-full grid-cols-1 items-start gap-loose md:grid-cols-2 md:grid-rows-[auto_auto] md:gap-x-loose md:gap-y-cluster">
				<a
					href="https://paadriv.no"
					target="_blank"
					rel="noopener noreferrer"
					className="md:col-start-1 md:row-start-1"
				>
					<Image src={logoSrc} alt="Pådriv" width={150} height={47} />
				</a>
				<div className="flex flex-col gap-loose md:col-start-1 md:row-start-2">
					<p
						className={`text-body max-w-xs ${
							isGreen ? "text-muted-inverse" : "text-muted"
						}`}
					>
						For alle som vil finne gode løsninger og en mer bærekraftig retning
						– sammen!
					</p>
					<div className="flex items-center gap-inline">
						<a
							href="https://www.instagram.com/paadriv/"
							target="_blank"
							rel="noopener noreferrer"
							className={`flex size-10 items-center justify-center rounded-md ${socialIconBg}`}
							aria-label="Instagram"
						>
							<img
								src={`/svg/instagram_${socialIconColor}_icon.svg`}
								alt="Instagram icon"
								className="size-6"
							/>
						</a>
						<a
							href="https://www.facebook.com/paadriv/?locale=nb_NO"
							target="_blank"
							rel="noopener noreferrer"
							className={`flex size-10 items-center justify-center rounded-md ${socialIconBg}`}
							aria-label="Facebook"
						>
							<img
								src={`/svg/facebook_${socialIconColor}_icon.svg`}
								alt="Facebook icon"
								className="size-6"
							/>
						</a>
						<a
							href="https://no.linkedin.com/company/padriv"
							target="_blank"
							rel="noopener noreferrer"
							className={`flex size-10 items-center justify-center rounded-md ${socialIconBg}`}
							aria-label="LinkedIn"
						>
							<img
								src={`/svg/linkedin_${socialIconColor}_icon.svg`}
								alt="LinkedIn icon"
								className="size-6"
							/>
						</a>
						<a
							href="https://www.youtube.com/channel/UCEMshnOPR6yhexEF38ywkOA/videos"
							target="_blank"
							rel="noopener noreferrer"
							className={`flex size-10 items-center justify-center rounded-md ${socialIconBg}`}
							aria-label="YouTube"
						>
							<img
								src={`/svg/youtube_${socialIconColor}_icon.svg`}
								alt="YouTube icon"
								className="size-6"
							/>
						</a>
					</div>
				</div>
				<div className="flex flex-col gap-inline md:col-start-2 md:row-start-2">
					<h3 className={`text-subheading font-semibold ${headingColor}`}>
						Kontakt
					</h3>
					<a
						href="https://landing.mailerlite.com/webforms/landing/x9d2r2"
						target="_blank"
						rel="noopener noreferrer"
						className={`flex items-center gap-inline font-medium ${contactTextColor}`}
					>
						<img
							src={`/svg/family_${contactIconColor}_icon.svg`}
							alt="Nyhetsbrev icon"
							className="size-5"
						/>
						Motta nyhetsbrev
					</a>
					<a
						href="mailto:post@paadriv.no"
						className={`flex items-center gap-inline font-medium ${contactTextColor}`}
					>
						<img
							src={`/svg/mail_${contactIconColor}_icon.svg`}
							alt="Email icon"
							className="size-5"
						/>
						post@paadriv.no
					</a>
					<div className="flex flex-col">
						<a
							href="tel:+4790787982"
							className={`flex items-center gap-inline font-medium ${contactTextColor}`}
						>
							<img
								src={`/svg/phone_${contactIconColor}_icon.svg`}
								alt="Phone icon"
								className="size-5"
							/>
							+47 907 87 982
						</a>
						<span
							className={`pl-7 font-normal ${
								isGreen ? "text-muted-inverse" : "text-muted"
							}`}
						>
							Thomas Berman
						</span>
					</div>
				</div>
			</div>
		</footer>
	);
}
