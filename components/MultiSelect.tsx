"use client";

import { useLayoutEffect, useMemo, useRef, useState } from "react";
import { getFallbackSkillColor, SKILL_COLORS } from "@/lib/skillColors";

type MultiSelectProps = {
	options: string[];
	selected: string[];
	setSelected: (skills: string[]) => void;
};

const CHIP_CLASSNAME =
	"rounded-full border px-4 py-2 text-label shadow-sm transition-all duration-150";

function packRows(
	chipOptions: string[],
	widths: Map<string, number>,
	containerWidth: number,
	gap: number,
): string[] {
	const pool = [...chipOptions];
	const packed: string[] = [];

	while (pool.length > 0) {
		let rowWidth = 0;
		let placedInRow = false;

		while (true) {
			let bestIndex = -1;
			let bestWidth = -1;
			for (let i = 0; i < pool.length; i++) {
				const w = widths.get(pool[i]) ?? 0;
				const needed = placedInRow ? w + gap : w;
				if (rowWidth + needed <= containerWidth && w > bestWidth) {
					bestIndex = i;
					bestWidth = w;
				}
			}
			if (bestIndex === -1) break;
			const [chosen] = pool.splice(bestIndex, 1);
			packed.push(chosen);
			rowWidth += placedInRow ? bestWidth + gap : bestWidth;
			placedInRow = true;
		}

		if (!placedInRow) {
			const [chosen] = pool.splice(0, 1);
			packed.push(chosen);
		}
	}

	return packed;
}

export default function MultiSelect({
	options,
	selected,
	setSelected,
}: MultiSelectProps) {
	const noneOption = options[options.length - 1];
	const chipOptions = useMemo(() => options.slice(0, -1), [options]);
	const isNoneSelected =
		noneOption !== undefined && selected.includes(noneOption);

	const colorByOption = useMemo(
		() =>
			new Map(
				chipOptions.map((option, i) => [
					option,
					SKILL_COLORS[option as keyof typeof SKILL_COLORS] ??
						getFallbackSkillColor(i),
				]),
			),
		[chipOptions],
	);

	const containerRef = useRef<HTMLDivElement>(null);
	const [orderedOptions, setOrderedOptions] = useState(chipOptions);

	useLayoutEffect(() => {
		const container = containerRef.current;
		if (!container) return;

		function recalculate() {
			const containerEl = containerRef.current;
			if (!containerEl) return;

			const widths = new Map<string, number>();
			for (const button of containerEl.querySelectorAll<HTMLButtonElement>(
				"[data-chip]",
			)) {
				const key = button.dataset.chip;
				if (key) widths.set(key, button.offsetWidth);
			}
			if (widths.size === 0) return;

			const gap = parseFloat(getComputedStyle(containerEl).columnGap);
			setOrderedOptions(
				packRows(
					chipOptions,
					widths,
					containerEl.clientWidth,
					Number.isNaN(gap) ? 0 : gap,
				),
			);
		}

		recalculate();
		const observer = new ResizeObserver(recalculate);
		observer.observe(container);
		return () => observer.disconnect();
	}, [chipOptions]);

	function toggleSkill(option: string) {
		if (isNoneSelected) {
			setSelected([option]);
			return;
		}

		if (selected.includes(option)) {
			setSelected(selected.filter((skill) => skill !== option));
		} else {
			setSelected([...selected, option]);
		}
	}

	function toggleNone() {
		if (!noneOption) return;
		setSelected(isNoneSelected ? [] : [noneOption]);
	}

	return (
		<div
			className="flex flex-col gap-inline"
			role="group"
			aria-label="Kompetanseområder"
		>
			<div ref={containerRef} className="flex flex-wrap gap-inline">
				{orderedOptions.map((option) => {
					const isSelected = selected.includes(option);
					const color = colorByOption.get(option);

					return (
						<button
							key={option}
							type="button"
							data-chip={option}
							onClick={() => toggleSkill(option)}
							aria-pressed={isSelected}
							className={`${CHIP_CLASSNAME} ${
								isNoneSelected ? "opacity-40 hover:opacity-100" : ""
							} ${color?.border ?? "border-border"} ${
								isSelected && color
									? `${color.bg} text-cream shadow-md`
									: "bg-cream text-ink hover:shadow-md"
							}`}
						>
							{option}
						</button>
					);
				})}
			</div>

			{noneOption && (
				<label
					className={`flex basis-full cursor-pointer items-center gap-inline rounded-lg border px-4 py-3 text-label transition-colors ${
						isNoneSelected
							? "border-ink bg-zinc-100 text-ink"
							: "border-border bg-cream text-ink hover:border-ink"
					}`}
				>
					<input
						type="checkbox"
						checked={isNoneSelected}
						onChange={toggleNone}
						className="accent-deep-green"
					/>
					{noneOption}
				</label>
			)}
		</div>
	);
}
