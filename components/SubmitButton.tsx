export default function SubmitButton({ label, onClick, type = "button" }: { label: string; onClick?: () => void; type?: "submit" | "button" | "reset" }) {
    return (
        <button
            type={type}
            onClick={onClick}
            className="flex h-12 items-center justify-center rounded-full bg-black px-8 text-base font-medium text-white transition-colors hover:bg-gray-800"
        >
            {label}
        </button>
    );
}