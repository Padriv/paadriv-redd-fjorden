import Image from "next/image";

async function getWaterTemperature() {
  const res = await fetch(
    "https://api.met.no/weatherapi/oceanforecast/2.0/complete?lat=59.85&lon=10.62",
    {
      headers: {
        "User-Agent": "oppdrag-fjorden-var/1.0 auroranorfred@gmail.com"
      },
      next: { revalidate: 3600 }
    }
  );
  const data = await res.json();
  const temp = data.properties.timeseries[0].data.instant.details.sea_water_temperature;
  return Math.round(temp);
}



export default async  function Home() {
  const temp = await getWaterTemperature();
  return (
    <div className="flex flex-col flex-1 items-center justify-center bg-zinc-50 font-sans dark:bg-black">
      <main className="flex flex-1 w-full max-w-3xl flex-col items-center justify-between py-32 px-16 bg-white dark:bg-black">
        <Image
          className="dark:invert"
          src="/padriv.jpeg"
          alt="Padriv logo"
          width={100}
          height={20}
          priority
        />
        <div className="flex flex-col items-center gap-6 text-center mt-16">
          <h1 className="text-3xl font-semibold leading-10 tracking-tight text-black dark:text-zinc-50 whitespace-nowrap">
            Bli med å redd fjorden vår
          </h1>
          <Image
            src="/oslofjorden.jpeg"
            alt="Oslofjorden"
            width={1600}
            height={900}
            className="w-screen rounded-lg object-cover"
          />
          <p className="max-w-md text-lg leading-8 text-zinc-600 dark:text-zinc-400">
            Oslofjorden trenger alle. Vi er et partnerskap av 27 organisasjoner som jobber for å koordinere innsatsen for en frisk fjord — og vi trenger flere med på laget.
          </p>
          <div className="flex flex-col items-center gap-4 w-full">
            <p className="text-sm text-zinc-500">Bli med på laget: </p>
            <div className="flex flex-col gap-4 text-base font-medium sm:flex-row">
              <a
                className="flex h-16 w-full items-center justify-center text-center rounded-full bg-green-500 text-white px-5 transition-colors hover:bg-orange-600 md:w-[158px]"
              >
                Bli partner
              </a>
              <a
                className="flex h-16 w-full items-center justify-center text-center rounded-full bg-green-500 text-white px-5 transition-colors hover:bg-orange-600 md:w-[158px]"
              >
                Bidra som ressurs
              </a>
              <a
                className="flex h-16 w-full items-center justify-center text-center rounded-full bg-green-500 text-white px-5 transition-colors hover:bg-orange-600 md:w-[158px]"
                href="#"
              >
                Økonomisk støtte
              </a>
            </div>
          </div>
          <p className="text-zinc-500">Vanntemperatur nå: <strong>{temp}°C</strong></p>

          <div className="mt-4 flex flex-col gap-2">
            <p className="text-sm text-zinc-500">Badekvalitet denne uken:</p>
            <div className="flex flex-col gap-1 text-sm">
              <div className="flex justify-between gap-8">
                <span>Huk</span>
                <span className="text-green-600 font-medium">✓ Godkjent</span>
              </div>
              <div className="flex justify-between gap-8">
                <span>Ingierstrand</span>
                <span className="text-green-600 font-medium">✓ Godkjent</span>
              </div>
              <div className="flex justify-between gap-8">
                <span>Paradisbukta</span>
                <span className="text-green-600 font-medium">✓ Godkjent</span>
              </div>
              <div className="flex justify-between gap-8">
                <span>Bunnefjorden</span>
                <span className="text-orange-500 font-medium">✗ Frarådes</span>
              </div>
            </div>
            <p className="text-xs text-zinc-400">Kilde: Oslo kommune.</p>
          </div>

        </div>
      </main>
    </div>
  );
}
