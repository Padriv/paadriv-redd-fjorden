import Link from "next/link";
import Image from "next/image";

export default function NavigationBar() {
  return (
    <nav className="w-full bg-white border-b border-zinc-100 px-4 py-4 flex justify-between items-center">
        <Link href="https://paadriv.no/" target="_blank" rel="noopener noreferrer">
          <Image
            className="dark:invert"
            src="/padriv.jpg"
            alt="Padriv logomark"
            width={150}
            height={100}
            priority
          />
        </Link>
      <div className="flex gap-10 text-base font-medium text-zinc-800">
        <Link href="/om-oss" className="hover:text-[#FA6B10] transition-colors">Om oss</Link>
        <Link href="/arrangementer" className="hover:text-[#FA6B10] transition-colors">Arrangementer</Link>
        <Link href="/nyheter" className="hover:text-[#FA6B10] transition-colors">Nyheter</Link>
        <Link href="/prosjekter" className="hover:text-[#FA6B10] transition-colors">Prosjekter</Link>
      </div>
    </nav>
  );
}