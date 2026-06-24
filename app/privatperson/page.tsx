import Link from "next/link";

export default function Privatperson() {
  return (
    <main className="relative flex min-h-screen flex-col items-center justify-center bg-white px-16 py-32">
      <Link
        href="/"
        className="absolute left-16 top-10 flex w-fit items-center gap-2 text-sm text-zinc-500 transition-colors hover:text-black"
      >
        ← Tilbake
      </Link>
      <div className="flex max-w-2xl flex-col gap-6">
        <h1 className="text-3xl font-semibold text-black">
          Bli med som privatperson
        </h1>
        <p className="text-lg leading-8 text-zinc-600">
          Informasjon om hva det innebærer å bidra som enkeltperson
        </p>
      </div>
    </main>
  );
}