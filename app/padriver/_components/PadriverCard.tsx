"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import Modal from "@/components/Modal";
import type { PadriverListResponse } from "@/lib/airtable";
import { getFallbackSkillColor, SKILL_COLORS } from "@/lib/skillColors";
import { NONE_APPLY_SKILL } from "@/lib/skills";
import { useResizeObserver } from "@/lib/useResizeObserver";

type PadriverRecord = PadriverListResponse["records"][number];

const MAX_SKILL_ROWS = 2;

function getInitials(name: string): string {
	const words = name.trim().split(/\s+/).filter(Boolean);
	const first = words[0]?.[0] ?? "";
	const last = words.length > 1 ? words[words.length - 1][0] : "";
	return `${first}${last}`.toUpperCase();
}

function getShortName(name: string): string {
	const words = name.trim().split(/\s+/).filter(Boolean);
	if (words.length <= 2) return name;
	return `${words[0]} ${words[words.length - 1]}`;
}

function getSkillColor(label: string) {
	const key = label as keyof typeof SKILL_COLORS;
	return SKILL_COLORS[key] ?? getFallbackSkillColor(0);
}

function ContactLinks({
	epost,
	telefon,
}: {
	epost?: string;
	telefon?: string;
}) {
	const [isPhoneRevealed, setIsPhoneRevealed] = useState(false);
	const [isTouchDevice, setIsTouchDevice] = useState(false);

	useEffect(() => {
		setIsTouchDevice(window.matchMedia("(pointer: coarse)").matches);
	}, []);

	if (!epost && !telefon) return null;

	return (
		<div className="flex w-full divide-x divide-border-subtle border-t border-border-subtle pt-group">
			{epost && (
				<a
					href={`mailto:${epost}`}
					className="relative flex flex-1 items-center justify-center gap-inline py-1 text-button font-medium text-green transition-colors hover:text-ink"
				>
					<img src="/svg/mail_green_icon.svg" alt="" className="size-4" />
					E-post
				</a>
			)}
			{telefon &&
				(isPhoneRevealed ? (
					isTouchDevice ? (
						<a
							href={`tel:${telefon.replace(/\s+/g, "")}`}
							className="relative flex flex-1 items-center justify-center gap-inline py-1 text-button font-medium text-green transition-colors hover:text-ink"
						>
							<img
								src="/svg/phone_green_icon.svg"
								alt=""
								className="size-4"
							/>
							{telefon}
						</a>
					) : (
						<button
							type="button"
							onClick={() => setIsPhoneRevealed(false)}
							className="relative flex flex-1 items-center justify-center gap-inline py-1 text-button font-medium text-green transition-colors hover:text-ink"
						>
							<img
								src="/svg/phone_green_icon.svg"
								alt=""
								className="size-4"
							/>
							{telefon}
						</button>
					)
				) : (
					<button
						type="button"
						onClick={() => setIsPhoneRevealed(true)}
						className="relative flex flex-1 items-center justify-center gap-inline py-1 text-button font-medium text-green transition-colors hover:text-ink"
					>
						<img
							src="/svg/phone_green_icon.svg"
							alt=""
							className="size-4"
						/>
						Telefon
					</button>
				))}
		</div>
	);
}

function countFitting(
	widths: number[],
	containerWidth: number,
	gap: number,
	maxRows: number,
): number {
	let rows = 1;
	let rowWidth = 0;
	let count = 0;

	for (const width of widths) {
		const needed = rowWidth === 0 ? width : rowWidth + gap + width;
		if (rowWidth === 0 || needed <= containerWidth) {
			rowWidth = needed;
			count++;
			continue;
		}
		if (rows === maxRows) break;
		rows++;
		rowWidth = width;
		count++;
	}

	return count;
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
	const skillsContainerRef = useRef<HTMLDivElement>(null);
	const skillMeasureRef = useRef<HTMLDivElement>(null);
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

	const [visibleSkillCount, setVisibleSkillCount] = useState(
		skillsByLength.length,
	);

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

	useResizeObserver(skillsContainerRef, () => {
		const container = skillsContainerRef.current;
		const measureContainer = skillMeasureRef.current;
		if (!container || !measureContainer) return;

		const containerWidth = container.clientWidth;
		const gap = parseFloat(getComputedStyle(container).columnGap) || 0;

		const widths = Array.from(
			measureContainer.querySelectorAll<HTMLElement>("[data-skill]"),
		).map((el) => el.offsetWidth);
		const buttonWidth =
			measureContainer.querySelector<HTMLElement>("[data-more-button]")
				?.offsetWidth ?? 0;

		let fitCount = countFitting(widths, containerWidth, gap, MAX_SKILL_ROWS);

		while (fitCount > 0 && fitCount < widths.length) {
			const withButton = countFitting(
				[...widths.slice(0, fitCount), buttonWidth],
				containerWidth,
				gap,
				MAX_SKILL_ROWS,
			);
			if (withButton === fitCount + 1) break;
			fitCount--;
		}

		setVisibleSkillCount(fitCount);
	}, [skillsByLength]);

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

	const hiddenSkillCount = skillsByLength.length - visibleSkillCount;

	const cardSkillPills = (
		<div
			ref={skillsContainerRef}
			className="flex h-[4.5rem] flex-wrap content-start items-start justify-center gap-inline overflow-hidden"
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
		<div className="relative flex h-[29rem] flex-col items-center gap-group overflow-hidden rounded-2xl bg-cream p-6 text-center">
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
