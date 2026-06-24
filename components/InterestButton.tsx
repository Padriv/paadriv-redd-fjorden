import Link from "next/link";

export default function InterestButton() {
  return (
    <section
      id="meld-interesse-organisasjon"
      className="flex flex-col items-center gap-6 rounded-2xl border border-gray-200 bg-gray-50 px-12 py-10"
    >
      <h2 className="text-2xl font-semibold text-black">Bli med</h2>
      <div className="flex flex-wrap justify-center gap-4">
        <Link
          href="/privatperson"
          className="flex h-12 items-center justify-center rounded-full bg-black px-8 text-base font-medium text-white transition-colors hover:bg-gray-800"
        >
          Privatperson
        </Link>
        <Link
          href="/organisasjon"
          className="flex h-12 items-center justify-center rounded-full bg-black px-8 text-base font-medium text-white transition-colors hover:bg-gray-800"
        >
          Organisasjon
        </Link>
      </div>
    </section>
  );
}
