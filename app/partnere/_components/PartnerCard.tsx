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

function renderSkillPill(skill: string) {
	const color = getSkillColor(skill);
	return (
		<span
			key={skill}
			data-skill
			className={`rounded-full px-2 py-0.5 text-caption text-cream ${color.bg}`}
		>
			{skill}
		</span>
	);
}

export default function PartnerCard({ partner }: { partner: PartnerListItem }) {
	const [isContactModalOpen, setIsContactModalOpen] = useState(false);
	const [isNoContactModalOpen, setIsNoContactModalOpen] = useState(false);
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

	const kontaktAvatar = () => {
		if (!kontaktperson) return null;
		const photoUrl =
			kontaktperson.bilde &&
			(kontaktperson.bilde.thumbnails?.large.url ?? kontaktperson.bilde.url);

		if (photoUrl) {
			return (
				<img
					src={photoUrl}
					alt=""
					className="size-24 rounded-full object-cover"
				/>
			);
		}

		return (
			<div className="flex size-24 items-center justify-center rounded-full bg-green/15 text-xl font-semibold text-green">
				{getInitials(kontaktperson.navn)}
			</div>
		);
	};

	const hiddenSkillCount = kompetanseByLength.length - visibleSkillCount;

	const cardSkillPills = hasSkills && (
		<div
			ref={skillsContainerRef}
			className="flex h-6 shrink-0 flex-nowrap items-center gap-tight overflow-hidden"
		>
			{kompetanseByLength.slice(0, visibleSkillCount).map(renderSkillPill)}
			{hiddenSkillCount > 0 && (
				<span
					data-more-button
					className="relative shrink-0 whitespace-nowrap rounded-full border border-green/30 px-2 py-0.5 text-caption font-medium text-green"
				>
					+{hiddenSkillCount} flere
				</span>
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
			<span
				data-more-button
				className="relative shrink-0 whitespace-nowrap rounded-full border border-green/30 px-2 py-0.5 text-caption font-medium text-green"
			>
				+99 flere
			</span>
		</div>
	);

	return (
		<div className="relative flex h-88 flex-col overflow-hidden rounded-2xl border border-border bg-cream">
			{skillMeasurer}

			<div className="flex min-h-0 flex-1 items-center justify-center px-6 py-4">
				<img
					src={logoUrl}
					alt={navn}
					className="h-full w-full object-contain"
				/>
			</div>

			<div className="flex h-24 min-h-0 shrink-0 flex-col gap-tight overflow-hidden border-t border-border-subtle px-4 py-3">
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
					onClick={() =>
						kontaktperson
							? setIsContactModalOpen(true)
							: setIsNoContactModalOpen(true)
					}
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

			{isContactModalOpen && kontaktperson && (
				<Modal
					onClose={() => setIsContactModalOpen(false)}
					ariaLabelledBy={`partner-kontakt-${partner.id}`}
					className="m-auto w-[calc(100vw-2rem)] max-w-xl rounded-2xl bg-cream p-6 text-center backdrop:bg-deep-green/70"
				>
					<div className="flex flex-col items-center gap-group">
						{kontaktAvatar()}
						<h3
							id={`partner-kontakt-${partner.id}`}
							className="text-subheading font-semibold text-green"
						>
							{kontaktperson.navn}
						</h3>
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
					className="m-auto w-[calc(100vw-2rem)] max-w-xl rounded-2xl bg-cream p-8 text-center backdrop:bg-deep-green/70"
				>
					<div className="flex flex-col gap-group">
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
