import Link from "next/link";

type ButtonProps = {
    label: string;
    onClick?: () => void;
    type?: "submit" | "button" | "reset";
    href?: string;
};

export default function Button({ label, onClick, type = "button", href }: ButtonProps) {
    const className =
        "flex h-12 items-center justify-center rounded-full bg-black px-8 text-base font-medium text-white transition-colors hover:bg-gray-800";

    if (href) {
        return (
            <Link href={href} className={className}>
                {label}
            </Link>
        );
    }

    return (
        <button type={type} onClick={onClick} className={className}>
            {label}
        </button>
    );
}