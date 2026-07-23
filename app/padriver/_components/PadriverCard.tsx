"use client";

import { useMemo, useRef, useState } from "react";
import ContactLinks from "@/components/ContactLinks";
import Modal from "@/components/Modal";
import type { PadriverListResponse } from "@/lib/airtable";
import { getInitials } from "@/lib/initials";
import { getShortName } from "@/lib/shortName";
import { getSkillColor } from "@/lib/skillColors";
import { NONE_APPLY_SKILL } from "@/lib/skills";
import { useResizeObserver } from "@/lib/useResizeObserver";
import { useSkillFitting } from "@/lib/useSkillFitting";

type PadriverRecord = PadriverListResponse["records"][number];

const MAX_SKILL_ROWS = 2;

function renderSkillPill(skill: string) {
	const color = getSkillColor(skill);
	return (
		<span
			key={skill}
			data-skill
			className={`rounded-full px-2.5 py-1 text-[13px] text-cream ${color.bg}`}
		>
			{skill}
		</span>
	);
}

export default function PadriverCard({ record }: { record: PadriverRecord }) {
	const [isTruncated, setIsTruncated] = useState(false);
	const [lineClamp, setLineClamp] = useState(3);
	const [maxTextHeight, setMaxTextHeight] = useState<number | null>(null);
	const [showShortName, setShowShortName] = useState(false);
	const [isModalOpen, setIsModalOpen] = useState(false);

	const textRef = useRef<HTMLParagraphElement>(null);
	const textContainerRef = useRef<HTMLDivElement>(null);
	const readMoreButtonRef = useRef<HTMLButtonElement>(null);
	const nameContainerRef = useRef<HTMLDivElement>(null);
	const nameMeasureRef = useRef<HTMLHeadingElement>(null);

	const { fields } = record;
	const photo = fields.Profilbilde?.[0];
	const motivasjon = fields.Motivasjon;
	const shortName = useMemo(() => getShortName(fields.Navn), [fields.Navn]);

	const skills = useMemo(
		() =>
			fields.Kompetanse?.filter((skill) => skill !== NONE_APPLY_SKILL) ?? [],
		[fields.Kompetanse],
	);

	const skillsByLength = useMemo(
		() => [...skills].sort((a, b) => a.length - b.length),
		[skills],
	);

	const hasSkills = skills.length > 0;

	const {
		containerRef: skillsContainerRef,
		measureRef: skillMeasureRef,
		visibleCount: visibleSkillCount,
	} = useSkillFitting(skillsByLength, MAX_SKILL_ROWS);

	useResizeObserver(textContainerRef, () => {
		const container = textContainerRef.current;
		const el = textRef.current;
		if (!container || !el) return;

		const lineHeight = parseFloat(getComputedStyle(el).lineHeight);
		const gap = parseFloat(getComputedStyle(container).rowGap) || 0;
		const buttonHeight = readMoreButtonRef.current?.offsetHeight ?? 0;
		const reserved = buttonHeight + gap;

		const availableHeight = container.clientHeight - reserved;
		const lines = Math.max(1, Math.floor(availableHeight / lineHeight));
		setLineClamp(lines);

		setMaxTextHeight(lines * lineHeight);
		setIsTruncated(el.scrollHeight > availableHeight + 1);
	});

	useResizeObserver(nameContainerRef, () => {
		const container = nameContainerRef.current;
		const measure = nameMeasureRef.current;
		if (!container || !measure) return;

		setShowShortName(measure.scrollWidth > container.clientWidth);
	}, [fields.Navn]);

	const avatar = photo ? (
		<img
			src={photo.thumbnails?.large.url ?? photo.url}
			alt={fields.Navn}
			className="size-24 rounded-full object-cover"
		/>
	) : (
		<div className="flex size-24 items-center justify-center rounded-full bg-green/15 text-xl font-semibold text-green">
			{getInitials(fields.Navn)}
		</div>
	);

	const hiddenSkillCount = skillsByLength.length - visibleSkillCount;

	const cardSkillPills = (
		<div
			ref={skillsContainerRef}
			className="flex h-18 flex-wrap content-start items-start justify-center gap-inline overflow-hidden"
		>
			{skillsByLength.slice(0, visibleSkillCount).map(renderSkillPill)}
			{hiddenSkillCount > 0 && (
				<button
					type="button"
					onClick={() => setIsModalOpen(true)}
					className="relative rounded-full border border-green/30 px-2.5 py-1 text-[13px] font-medium text-green transition-colors hover:bg-green/10"
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
			className="pointer-events-none absolute left-0 top-0 flex -translate-y-full flex-nowrap gap-inline opacity-0"
		>
			{skillsByLength.map((skill) => (
				<span
					key={skill}
					data-skill
					className="whitespace-nowrap px-2.5 py-1 text-[13px]"
				>
					{skill}
				</span>
			))}
			<button
				type="button"
				data-more-button
				className="relative whitespace-nowrap rounded-full border border-green/30 px-2.5 py-1 text-[13px] font-medium text-green transition-colors hover:bg-green/10"
			>
				+99 flere
			</button>
		</div>
	);

	const fullSkillPills = hasSkills && (
		<div className="flex flex-wrap justify-center gap-inline">
			{skills.map(renderSkillPill)}
		</div>
	);

	return (
		<div className="relative flex h-116 flex-col items-center gap-group overflow-hidden rounded-2xl bg-cream p-6 text-center transition-transform duration-200 hover:scale-[1.03]">
			<button
				type="button"
				onClick={() => setIsModalOpen(true)}
				aria-label={`Se mer om ${fields.Navn}`}
				className="absolute inset-0 cursor-pointer"
			/>
			{skillMeasurer}
			<h3
				ref={nameMeasureRef}
				aria-hidden
				className="pointer-events-none absolute left-0 top-0 -translate-y-full whitespace-nowrap text-subheading font-semibold opacity-0"
			>
				{fields.Navn}
			</h3>
			{avatar}
			<div
				ref={nameContainerRef}
				className="flex h-7 w-full shrink-0 items-center justify-center overflow-hidden md:h-8"
			>
				<h3 className="truncate text-subheading font-semibold text-green">
					{showShortName ? shortName : fields.Navn}
				</h3>
			</div>
			{motivasjon && (
				<div
					ref={textContainerRef}
					className="flex min-h-0 flex-1 flex-col items-center gap-tight"
				>
					<p
						ref={textRef}
						className="line-clamp-3 min-h-0 flex-1 text-card-body text-copy"
						style={{
							WebkitLineClamp: lineClamp,
							maxHeight: maxTextHeight ?? undefined,
						}}
					>
						“{motivasjon}”
					</p>

					<button
						ref={readMoreButtonRef}
						type="button"
						tabIndex={isTruncated ? 0 : -1}
						aria-hidden={!isTruncated}
						onClick={() => setIsModalOpen(true)}
						className={`relative text-link font-medium text-green transition-colors hover:text-ink ${
							isTruncated ? "" : "invisible"
						}`}
					>
						Les mer
					</button>
				</div>
			)}
			<div className="mt-auto flex w-full flex-col items-center gap-inline">
				{cardSkillPills}
				<ContactLinks epost={fields.Epost} telefon={fields.Telefon} />
			</div>

			{isModalOpen && (
				<Modal
					onClose={() => setIsModalOpen(false)}
					ariaLabelledBy={`padriver-navn-${record.id}`}
					className="m-auto w-[calc(100vw-2rem)] max-w-xl rounded-2xl bg-cream p-6 text-center backdrop:bg-deep-green/70"
				>
					<div className="flex flex-col items-center gap-group">
						{avatar}
						<h3
							id={`padriver-navn-${record.id}`}
							className="text-subheading font-semibold text-green"
						>
							{fields.Navn}
						</h3>
						{motivasjon && (
							<p className="text-card-body text-copy">“{motivasjon}”</p>
						)}
						{fullSkillPills}
						<ContactLinks epost={fields.Epost} telefon={fields.Telefon} />
					</div>
				</Modal>
			)}
		</div>
	);
}
