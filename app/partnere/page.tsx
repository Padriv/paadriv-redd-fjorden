import Navigationbar from "@/app/_components/Navigationbar";

export default function Partnere() {
	return (
		<>
			<Navigationbar solid />
			<main className="relative flex min-h-screen flex-col items-center justify-center bg-white px-16 py-32">
				<div className="flex max-w-2xl flex-col gap-6">
					<h1 className="text-3xl font-semibold text-black">Våre partnere</h1>
					<p className="text-lg leading-8 text-zinc-600">
						Oversikt over alle partnere
					</p>
				</div>
			</main>
		</>
	);
}
