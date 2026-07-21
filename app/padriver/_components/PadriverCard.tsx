"use client";

import { useMemo, useRef, useState } from "react";
import CloseButton from "@/components/CloseButton";
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

function getSkillColor(label: string) {
	const key = label as keyof typeof SKILL_COLORS;
	return SKILL_COLORS[key] ?? getFallbackSkillColor(0);
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
	const [nameFontSize, setNameFontSize] = useState<number | null>(null);

	const textRef = useRef<HTMLParagraphElement>(null);
	const textContainerRef = useRef<HTMLDivElement>(null);
	const readMoreButtonRef = useRef<HTMLButtonElement>(null);
	const dialogRef = useRef<HTMLDialogElement>(null);
	const skillsContainerRef = useRef<HTMLDivElement>(null);
	const skillMeasureRef = useRef<HTMLDivElement>(null);
	const nameRef = useRef<HTMLHeadingElement>(null);
	const baseNameFontSizeRef = useRef<number | null>(null);

	const { fields } = record;
	const photo = fields.Profilbilde?.[0];
	const motivasjon = fields.Motivasjon;

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
	const hasContact = Boolean(fields.Epost || fields.Telefon);

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

	useResizeObserver(nameRef, () => {
		const el = nameRef.current;
		if (!el) return;

		if (baseNameFontSizeRef.current === null) {
			baseNameFontSizeRef.current = parseFloat(getComputedStyle(el).fontSize);
		}
		const baseFontSize = baseNameFontSizeRef.current;

		setNameFontSize((prev) => {
			const currentFontSize = prev ?? baseFontSize;
			const naturalWidth = el.scrollWidth * (baseFontSize / currentFontSize);
			const scale = Math.min(1, (el.clientWidth / naturalWidth) * 0.98);
			if (scale >= 0.999) return null;

			const next = baseFontSize * scale;
			if (prev !== null && Math.abs(prev - next) < 0.5) return prev;
			return next;
		});
	});

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
				className={`rounded-full px-3 py-1 text-label text-cream ${color.bg}`}
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
					onClick={() => dialogRef.current?.showModal()}
					className="relative rounded-full border border-green/30 px-3 py-1 text-label font-medium text-green transition-colors hover:bg-green/10"
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
				<span key={skill} data-skill className="px-3 py-1 text-label">
					{skill}
				</span>
			))}
			<span
				data-more-button
				className="border px-3 py-1 text-label font-medium"
			>
				+99 flere
			</span>
		</div>
	);

	const fullSkillPills = hasSkills && (
		<div className="flex flex-wrap justify-center gap-inline">
			{skills.map(renderSkillPill)}
		</div>
	);

	const contactLinks = hasContact && (
		<div className="flex w-full divide-x divide-border-subtle border-t border-border-subtle pt-group">
			{fields.Epost && (
				<a
					href={`mailto:${fields.Epost}`}
					className="relative flex flex-1 items-center justify-center gap-inline py-1 text-button font-medium text-green transition-colors hover:text-ink"
				>
					<img src="/svg/mail_green_icon.svg" alt="" className="size-4" />
					E-post
				</a>
			)}
			{fields.Telefon && (
				<a
					href={`tel:${fields.Telefon.replace(/\s+/g, "")}`}
					className="relative flex flex-1 items-center justify-center gap-inline py-1 text-button font-medium text-green transition-colors hover:text-ink"
				>
					<img src="/svg/phone_green_icon.svg" alt="" className="size-4" />
					Ring
				</a>
			)}
		</div>
	);

	return (
		<div className="relative flex h-[29rem] flex-col items-center gap-group overflow-hidden rounded-2xl bg-cream p-6 text-center">
			<button
				type="button"
				onClick={() => dialogRef.current?.showModal()}
				aria-label={`Se mer om ${fields.Navn}`}
				className="absolute inset-0 cursor-pointer"
			/>
			{skillMeasurer}
			{avatar}
			<div className="flex h-7 w-full shrink-0 items-center justify-center overflow-hidden md:h-8">
				<h3
					ref={nameRef}
					style={nameFontSize ? { fontSize: `${nameFontSize}px` } : undefined}
					className="truncate text-subheading font-semibold text-green"
				>
					{fields.Navn}
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
						onClick={() => dialogRef.current?.showModal()}
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
				{contactLinks}
			</div>

		
			<dialog
				ref={dialogRef}
				aria-labelledby={`padriver-navn-${record.id}`}
				onClick={(event) => {
					if (event.target === dialogRef.current) dialogRef.current?.close();
				}}
				className="m-auto w-[calc(100vw-2rem)] max-w-2xl rounded-2xl bg-cream p-6 text-center backdrop:bg-deep-green/70"
			>
				<div className="relative flex flex-col items-center gap-group">
					<CloseButton
						onClick={() => dialogRef.current?.close()}
						className="absolute -right-2 -top-2 flex h-8 w-8 items-center justify-center rounded-full text-copy transition-colors hover:bg-green/10 hover:text-ink"
					/>
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
					{contactLinks}
				</div>
			</dialog>
		</div>
	);
}
