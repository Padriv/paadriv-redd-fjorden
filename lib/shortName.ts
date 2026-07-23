export function getShortName(name: string): string {
	const words = name.trim().split(/\s+/).filter(Boolean);
	if (words.length <= 2) return name;
	return `${words[0]} ${words[words.length - 1]}`;
}
