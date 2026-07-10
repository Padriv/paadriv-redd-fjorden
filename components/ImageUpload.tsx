"use client";

import { useEffect, useRef, useState } from "react";

type ImageUploadProps = {
	value: File | null;
	onChange: (file: File | null) => void;
};

export function ImageUploadDemo({ value, onChange }: ImageUploadProps) {
	const [previewUrl, setPreviewUrl] = useState<string | null>(null);
	const [isDragging, setIsDragging] = useState(false);
	const fileInputRef = useRef<HTMLInputElement>(null);

	useEffect(() => {
		if (!value) {
			setPreviewUrl(null);
			return;
		}
		const url = URL.createObjectURL(value);
		setPreviewUrl(url);
		return () => URL.revokeObjectURL(url);
	}, [value]);

	function handleThumbnailClick() {
		fileInputRef.current?.click();
	}

	function handleFileChange(e: React.ChangeEvent<HTMLInputElement>) {
		const file = e.target.files?.[0];
		if (file) {
			onChange(file);
		}
	}

	function handleRemove() {
		onChange(null);
		if (fileInputRef.current) {
			fileInputRef.current.value = "";
		}
	}

	function handleDragOver(e: React.DragEvent<HTMLButtonElement>) {
		e.preventDefault();
		e.stopPropagation();
	}

	function handleDragEnter(e: React.DragEvent<HTMLButtonElement>) {
		e.preventDefault();
		e.stopPropagation();
		setIsDragging(true);
	}

	function handleDragLeave(e: React.DragEvent<HTMLButtonElement>) {
		e.preventDefault();
		e.stopPropagation();
		setIsDragging(false);
	}

	function handleDrop(e: React.DragEvent<HTMLButtonElement>) {
		e.preventDefault();
		e.stopPropagation();
		setIsDragging(false);

		const file = e.dataTransfer.files?.[0];
		if (file?.type.startsWith("image/")) {
			onChange(file);
		}
	}

	return (
		<div className="w-full space-y-2">
			<input
				type="file"
				accept="image/*"
				className="hidden"
				ref={fileInputRef}
				onChange={handleFileChange}
			/>

			{!previewUrl ? (
				<button
					type="button"
					onClick={handleThumbnailClick}
					onDragOver={handleDragOver}
					onDragEnter={handleDragEnter}
					onDragLeave={handleDragLeave}
					onDrop={handleDrop}
					className={`flex aspect-square w-full max-w-[250px] cursor-pointer flex-col items-center justify-center gap-inline rounded-lg border-2 border-dashed transition-colors ${
						isDragging
							? "border-ink bg-surface-strong"
							: "border-border bg-surface hover:bg-surface-strong"
					}`}
				>
					<div className="text-center">
						<p className="text-body font-medium text-ink">
							Klikk for å velge fil
						</p>
						<p className="text-caption text-muted">
							eller dra og slipp fil her
						</p>
					</div>
				</button>
			) : (
				<div className="relative max-w-[250px]">
					<div className="group relative aspect-square w-full overflow-hidden rounded-lg border border-border-subtle">
						<img
							src={previewUrl}
							alt="Forhåndsvisning"
							className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
						/>
						<div className="absolute inset-0 flex items-center justify-center gap-inline bg-black/40 opacity-0 transition-opacity group-hover:opacity-100">
							<button
								type="button"
								onClick={handleThumbnailClick}
								className="rounded-full bg-white px-3 py-1.5 text-button font-medium hover:bg-surface-strong"
							>
								Bytt
							</button>
							<button
								type="button"
								onClick={handleRemove}
								className="rounded-full bg-danger px-3 py-1.5 text-button font-medium text-white hover:bg-danger-hover"
							>
								Fjern
							</button>
						</div>
					</div>
					{value && (
						<div className="mt-2 flex items-center gap-inline text-body text-muted">
							<span className="truncate">{value.name}</span>
							<button
								type="button"
								onClick={handleRemove}
								className="ml-auto rounded-full p-1 hover:bg-surface-strong"
							>
								✕
							</button>
						</div>
					)}
				</div>
			)}
		</div>
	);
}
