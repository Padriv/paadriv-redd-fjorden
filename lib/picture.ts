import { toast } from "sonner";
import type { Bilde } from "./airtable";

export function fileToBase64(file: File): Promise<string> {
	return new Promise((resolve, reject) => {
		const reader = new FileReader();
		reader.onload = () => {
			const result = reader.result;
			if (typeof result !== "string") {
				reject(new Error("Uventet resultat fra FileReader"));
				return;
			}
			resolve(result.slice(result.indexOf(",") + 1));
		};
		reader.onerror = () => reject(reader.error);
		reader.readAsDataURL(file);
	});
}

export async function resolveBilde(
	file: File | null,
): Promise<Bilde | null | undefined> {
	if (!file) return null;
	try {
		return {
			filename: file.name,
			contentType: file.type,
			base64: await fileToBase64(file),
		};
	} catch (e) {
		toast.error("Noe gikk galt med bildet", {
			description:
				"Vi klarte ikke å lese bildet. Sjekk at filen er i et gyldig bildeformat og prøv igjen.",
		});
	}
}
