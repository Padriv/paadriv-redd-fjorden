import Image from "next/image";

export default function Footer() {
	return (
		<footer className="flex w-full flex-col gap-group bg-cream px-4 py-cluster text-ink sm:px-6 md:px-16">
			<div className="grid w-full grid-cols-1 gap-loose md:grid-cols-2">
				<div className="flex flex-col gap-group">
					<a href="https://paadriv.no" target="_blank" rel="noopener noreferrer">
						<Image
							src="/images/paadriv-logo-sort.png"
							alt="Påadriv"
							width={150}
							height={47}
						/>
					</a>
					<p className="text-body max-w-xs text-muted">
						For alle som vil finne gode løsninger og en mer bærekraftig retning
						– sammen!
					</p>
					<div className="flex items-center gap-inline">
						<a
							href="https://www.instagram.com/paadriv/"
							target="_blank"
							rel="noopener noreferrer"
							className="flex size-10 items-center justify-center rounded-md bg-deep-green"
							aria-label="Instagram"
						>
							<img
								src="/svg/instagram.svg"
								alt=""
								className="size-6"
							/>
						</a>
						<a
							href="https://www.facebook.com/paadriv/?locale=nb_NO"
							target="_blank"
							rel="noopener noreferrer"
							className="flex size-10 items-center justify-center rounded-md bg-deep-green"
							aria-label="Facebook"
						>
							<img
								src="/svg/facebook.svg"
								alt=""
								className="size-6"
							/>
						</a>
						<a
							href="https://no.linkedin.com/company/padriv"
							target="_blank"
							rel="noopener noreferrer"
							className="flex size-10 items-center justify-center rounded-md bg-deep-green"
							aria-label="LinkedIn"
						>
							<img
								src="/svg/linkedin.svg"
								alt=""
								className="size-6"
							/>
						</a>
						<a
							href="https://www.youtube.com/channel/UCEMshnOPR6yhexEF38ywkOA/videos"
							target="_blank"
							rel="noopener noreferrer"
							className="flex size-10 items-center justify-center rounded-md bg-deep-green"
							aria-label="YouTube"
						>
							<img
								src="/svg/youtube.svg"
								alt=""
								className="size-6"
							/>
						</a>
					</div>
				</div>
				<div className="flex flex-col gap-group">
					<h3 className="text-subheading font-semibold text-deep-green">
						Kontakt
					</h3>
					<div className="flex flex-col gap-inline">
						<a
							href="mailto:post@paadriv.no"
							className="flex items-center gap-inline font-medium text-deep-green"
						>
							<img src="/svg/mail.svg" alt="" className="size-5" />
							post@paadriv.no
						</a>
						<a
							href="tel:+4793295492"
							className="flex items-center gap-inline font-medium text-deep-green"
						>
							<img src="/svg/phone.svg" alt="" className="size-5" />
							+47 932 95 492
						</a>
					</div>
				</div>
			</div>
		</footer>
	);
}
