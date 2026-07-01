import JoinSection from "./_components/JoinSection";

export default function Home() {
	return (
		<main className="flex min-h-screen flex-col items-center justify-center bg-white px-16 py-32">
			<div className="flex max-w-2xl flex-col gap-6">
				<h1 className="text-3xl font-semibold text-black">
					Oslofjorden trenger flere på laget — bli med og bidra med det du kan
				</h1>
				<JoinSection />
			</div>
		</main>
	);
}
