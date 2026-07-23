export function countFitting(
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
