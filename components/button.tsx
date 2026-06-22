import Link from "next/link";

interface ButtonProps {
  href: string;
  children: React.ReactNode;
  className?: string;
}

export default function Button({ href, children, className = "" }: ButtonProps) {
  return (
    <Link
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      className={`flex h-12 w-full items-center justify-center rounded-full bg-[#FA6B10] px-5 text-white transition-colors hover:bg-[#d65a0e] md:w-[158px] ${className}`}
    >
      {children}
    </Link>
  );
}