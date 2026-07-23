"use client";

import { useMemo, useState } from "react";
import ContactLinks from "@/components/ContactLinks";
import LocationPinIcon from "@/components/LocationPinIcon";
import Modal from "@/components/Modal";
import type { PartnerListItem } from "@/lib/airtable";
import { getInitials } from "@/lib/initials";
import { getSkillColor } from "@/lib/skillColors";
import { useSkillFitting } from "@/lib/useSkillFitting";

const MAX_SKILL_ROWS = 1;

function renderSkillPill(skill: string, options?: { truncate?: boolean }) {
	const color = getSkillColor(skill);
	return (
		<span
			key={skill}
			data-skill
			className={`rounded-full px-2 py-0.5 text-caption text-cream ${color.bg} ${
				options?.truncate
					? "min-w-0 flex-1 truncate"
					: "shrink-0 whitespace-nowrap"
			}`}
		>
			{skill}
		</span>
	);
}

export default function PartnerCard({ partner }: { partner: PartnerListItem }) {
	const [isCardModalOpen, setIsCardModalOpen] = useState(false);
	const [isContactModalOpen, setIsContactModalOpen] = useState(false);
	const [isNoContactModalOpen, setIsNoContactModalOpen] = useState(false);
	const [modalHasBack, setModalHasBack] = useState(false);
	const { navn, logoUrl, lokasjon, kompetanse, kontaktperson } = partner;
	const hasSkills = kompetanse.length > 0;

	const kompetanseByLength = useMemo(
		() => [...kompetanse].sort((a, b) => a.length - b.length),
		[kompetanse],
	);

	const {
		containerRef: skillsContainerRef,
		measureRef: skillMeasureRef,
		visibleCount: visibleSkillCount,
	} = useSkillFitting(kompetanseByLength, MAX_SKILL_ROWS);

	const kontaktAvatar = (size: "sm" | "lg") => {
		if (!kontaktperson) return null;
		const photoUrl =
			kontaktperson.bilde &&
			(kontaktperson.bilde.thumbnails?.large.url ?? kontaktperson.bilde.url);

		if (photoUrl) {
			return (
				<img
					src={photoUrl}
					alt=""
					className={
						size === "sm"
							? "size-9 shrink-0 rounded-full object-cover"
							: "size-24 rounded-full object-cover"
					}
				/>
			);
		}

		return (
			<div
				className={
					size === "sm"
						? "flex size-9 shrink-0 items-center justify-center rounded-full bg-green/15 text-caption font-semibold text-green"
						: "flex size-24 items-center justify-center rounded-full bg-green/15 text-xl font-semibold text-green"
				}
			>
				{getInitials(kontaktperson.navn)}
			</div>
		);
	};

	const renderKontaktRad = (fromCardModal: boolean) =>
		kontaktperson && (
			<button
				type="button"
				onClick={() => {
					if (fromCardModal) setIsCardModalOpen(false);
					setModalHasBack(fromCardModal);
					setIsContactModalOpen(true);
				}}
				aria-haspopup="dialog"
				className="group relative flex w-full items-center gap-inline text-left"
			>
				{kontaktAvatar("sm")}
				<span className="flex-1 truncate text-button font-medium text-green transition-colors group-hover:text-ink">
					{kontaktperson.navn}
				</span>
				<span
					aria-hidden="true"
					className="text-muted transition-colors group-hover:text-ink"
				>
					›
				</span>
			</button>
		);

	const showTruncatedFallback = hasSkills && visibleSkillCount === 0;
	const visibleSkills = showTruncatedFallback
		? kompetanseByLength.slice(0, 1)
		: kompetanseByLength.slice(0, visibleSkillCount);
	const hiddenSkillCount = kompetanseByLength.length - visibleSkills.length;

	const cardSkillPills = hasSkills && (
		<div
			ref={skillsContainerRef}
			className="flex h-6 shrink-0 flex-nowrap items-center gap-tight overflow-hidden"
		>
			{visibleSkills.map((skill) =>
				renderSkillPill(skill, { truncate: showTruncatedFallback }),
			)}
			{hiddenSkillCount > 0 && (
				<button
					type="button"
					onClick={() => setIsCardModalOpen(true)}
					data-more-button
					className="relative shrink-0 whitespace-nowrap rounded-full border border-green/30 px-2 py-0.5 text-caption font-medium text-green transition-colors hover:bg-green/10"
				>
					+{hiddenSkillCount} flere
				</button>
			)}
		</div>
	);

	const skillMeasurer = hasSkills && (
		<div
			ref={skillMeasureRef}
			aria-hidden
			className="pointer-events-none absolute left-0 top-0 flex -translate-y-full flex-nowrap gap-tight opacity-0"
		>
			{kompetanseByLength.map((skill) => (
				<span
					key={skill}
					data-skill
					className="whitespace-nowrap rounded-full px-2 py-0.5 text-caption"
				>
					{skill}
				</span>
			))}
			<button
				type="button"
				data-more-button
				className="relative shrink-0 whitespace-nowrap rounded-full border border-green/30 px-2 py-0.5 text-caption font-medium text-green"
			>
				+99 flere
			</button>
		</div>
	);

	const fullSkillPills = hasSkills && (
		<div className="flex flex-wrap gap-inline">
			{kompetanse.map((skill) => renderSkillPill(skill))}
		</div>
	);

	return (
		<div className="relative flex h-88 flex-col overflow-hidden rounded-2xl border border-border bg-cream transition-transform duration-200 hover:scale-[1.03]">
			<button
				type="button"
				onClick={() => setIsCardModalOpen(true)}
				aria-label={`Se mer om ${navn}`}
				className="absolute inset-0 cursor-pointer"
			/>
			{skillMeasurer}

			<div className="flex min-h-0 flex-1 items-center justify-center px-6 py-4">
				<img
					src={logoUrl}
					alt={navn}
					className="h-full w-full object-contain"
				/>
			</div>

			<div className="flex h-26 min-h-0 shrink-0 flex-col gap-tight overflow-hidden border-t border-border-subtle px-4 py-3">
				<h3 className="truncate text-card-body font-bold text-green">{navn}</h3>
				{lokasjon && (
					<div className="flex items-center gap-tight text-caption text-muted">
						<LocationPinIcon className="size-3.5" />
						{lokasjon}
					</div>
				)}
				{cardSkillPills}
			</div>

			<div className="flex h-14 min-h-0 shrink-0 items-center overflow-hidden border-t border-border-subtle px-4">
				<button
					type="button"
					onClick={() => {
						setModalHasBack(false);
						if (kontaktperson) {
							setIsContactModalOpen(true);
						} else {
							setIsNoContactModalOpen(true);
						}
					}}
					aria-haspopup="dialog"
					className="relative flex w-full items-center gap-inline text-left transition-transform duration-200 hover:scale-[1.02]"
				>
					<img
						src="/svg/mail_green_icon.svg"
						alt=""
						className="size-5 shrink-0"
					/>
					<span className="flex-1 truncate text-button font-medium text-green">
						Ta kontakt
					</span>
					<span aria-hidden="true" className="text-muted">
						›
					</span>
				</button>
			</div>

			{isCardModalOpen && (
				<Modal
					onClose={() => setIsCardModalOpen(false)}
					ariaLabelledBy={`partner-navn-${partner.id}`}
					className="m-auto w-[calc(100vw-2rem)] max-w-xl rounded-2xl bg-cream p-6 text-center backdrop:bg-deep-green/70"
				>
					<div className="flex min-h-72 flex-col items-center justify-between">
						<div className="flex w-full flex-col items-center">
							<img
								src={logoUrl}
								alt={navn}
								className="h-32 w-auto max-w-[70%] object-contain md:h-40"
							/>
							<div className="mt-group flex w-full flex-col items-start gap-tight text-left">
								<h3
									id={`partner-navn-${partner.id}`}
									className="text-card-body font-semibold text-green"
								>
									{navn}
								</h3>
								{lokasjon && (
									<div className="flex items-center gap-tight text-caption text-muted">
										<LocationPinIcon className="size-3.5" />
										{lokasjon}
									</div>
								)}
								{fullSkillPills && (
									<div className="pt-tight">{fullSkillPills}</div>
								)}
							</div>
						</div>
						<div className="mt-group w-full border-t border-border-subtle pt-group">
						<button
							type="button"
							onClick={() => {
								setIsCardModalOpen(false);
								setModalHasBack(true);

								if (kontaktperson) {
									setIsContactModalOpen(true);
								} else {
									setIsNoContactModalOpen(true);
								}
							}}
							aria-haspopup="dialog"
							className="group relative flex w-full items-center gap-inline text-left"
						>
							<img
								src="/svg/mail_green_icon.svg"
								alt=""
								className="size-5 shrink-0"
							/>
							<span className="flex-1 truncate text-button font-medium text-green transition-colors group-hover:text-ink">
								Ta kontakt
							</span>
							<span
								aria-hidden="true"
								className="text-muted transition-colors group-hover:text-ink"
							>
								›
							</span>
						</button>
					</div>

					</div>
				</Modal>
			)}

			{isContactModalOpen && kontaktperson && (
				<Modal
					onClose={() => setIsContactModalOpen(false)}
					ariaLabelledBy={`partner-kontakt-${partner.id}`}
					className="m-auto w-[calc(100vw-2rem)] max-w-xl rounded-2xl bg-cream p-6 text-center backdrop:bg-deep-green/70"
				>
					{modalHasBack && (
						<button
							type="button"
							onClick={() => {
								setIsContactModalOpen(false);
								setIsCardModalOpen(true);
							}}
							className="absolute left-0 top-0 text-button font-semibold text-ink transition-colors hover:text-copy"
						>
							← Tilbake
						</button>
					)}
					<div className="flex min-h-72 flex-col items-center justify-between pt-13">
						<div className="flex flex-col items-center gap-group">
							{kontaktAvatar("lg")}
							<h3
								id={`partner-kontakt-${partner.id}`}
								className="text-subheading font-semibold text-green"
							>
								{kontaktperson.navn}
							</h3>
						</div>
						<ContactLinks
							epost={kontaktperson.epost}
							telefon={kontaktperson.telefon}
						/>
					</div>
				</Modal>
			)}

			{isNoContactModalOpen && (
				<Modal
					onClose={() => setIsNoContactModalOpen(false)}
					className="m-auto w-[calc(100vw-2rem)] max-w-xl rounded-2xl bg-cream p-6 text-center backdrop:bg-deep-green/70"
				>
					{modalHasBack && (
						<button
							type="button"
							onClick={() => {
								setIsNoContactModalOpen(false);
								setIsCardModalOpen(true);
							}}
							className="absolute left-0 top-0 text-button font-semibold text-ink transition-colors hover:text-copy"
						>
							← Tilbake
						</button>
					)}
					<div className="flex min-h-72 flex-col justify-center gap-group">
						<p className="text-body text-ink">
							Organisasjonen har ingen synlig kontaktperson.
						</p>
						<p className="text-body text-ink">
							Ta kontakt på{" "}
							<a
								href="mailto:fjorden@paadriv.no"
								className="font-semibold text-green transition-colors hover:text-ink"
							>
								fjorden@paadriv.no
							</a>{" "}
							dersom du ønsker å komme i kontakt med dem.
						</p>
					</div>
				</Modal>
			)}
		</div>
	);
}
