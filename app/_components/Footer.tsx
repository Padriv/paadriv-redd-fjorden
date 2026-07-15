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
			<div className="grid w-full grid-cols-1 items-start gap-loose md:grid-cols-2 md:grid-rows-3 md:gap-x-loose md:gap-y-group">
				<a
					href="https://paadriv.no"
					target="_blank"
					rel="noopener noreferrer"
					className="md:col-start-1 md:row-start-1"
				>
					<Image src={logoSrc} alt="Påadriv" width={150} height={47} />
				</a>
				<p
					className={`text-body max-w-xs md:col-start-1 md:row-start-2 ${
						isGreen ? "text-muted-inverse" : "text-muted"
					}`}
				>
					For alle som vil finne gode løsninger og en mer bærekraftig retning –
					sammen!
				</p>
				<div className="flex items-center gap-inline md:col-start-1 md:row-start-3">
					<a
						href="https://www.instagram.com/paadriv/"
						target="_blank"
						rel="noopener noreferrer"
						className={`flex size-10 items-center justify-center rounded-md ${socialIconBg}`}
						aria-label="Instagram"
					>
						<img
							src={`/svg/instagram_${socialIconColor}_icon.svg`}
							alt=""
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
							alt=""
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
							alt=""
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
							alt=""
							className="size-6"
						/>
					</a>
				</div>
				<h3
					className={`text-section font-semibold md:col-start-2 md:row-start-1 ${headingColor}`}
				>
					Kontakt
				</h3>
				<div className="flex flex-col gap-inline md:col-start-2 md:row-start-2">
					<a
						href="mailto:post@paadriv.no"
						className={`flex items-center gap-inline font-medium ${contactTextColor}`}
					>
						<img
							src={`/svg/mail_${contactIconColor}_icon.svg`}
							alt=""
							className="size-5"
						/>
						post@paadriv.no
					</a>
					<a
						href="tel:+4793295492"
						className={`flex items-center gap-inline font-medium ${contactTextColor}`}
					>
						<img
							src={`/svg/phone_${contactIconColor}_icon.svg`}
							alt=""
							className="size-5"
						/>
						+47 932 95 492
					</a>
				</div>
			</div>
		</footer>
	);
}
