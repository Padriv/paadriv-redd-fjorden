import Image from "next/image";
import Button from "@/components/button";
import InfiniteScroller from "@/components/infiniteScroller";
import Link from "next/link";
import Textbox from "@/components/textbox";
import Map from "@/components/map";
import Calendar from "@/components/calendar";
import Watertemperature from "@/components/watertemperature";
import NavigationBar from "@/components/navigationbar";

export default function Home() {
  return (
    <div className="flex flex-col flex-1 items-center justify-start bg-zinc-50 font-sans dark:bg-black">
      <NavigationBar/>
      <main className="flex flex-1 w-full max-w-7xl flex-col items-center justify-start py-64 px-16 bg-gray-100 dark:bg-black sm:items-start">
        <div className="flex flex-col items-center gap-6 text-center sm:items-start sm:text-left">
          <h1 className="text-3xl font-semibold leading-10 tracking-tight text-black dark:text-zinc-50">
            Oppdrag: Fjorden vår
          </h1>
          <p className="text-xl font-bold leading-8 text-zinc-600 dark:text-zinc-400">
            Vi har gjort Oslofjorden syk. Vi har tilført og tatt for mye.
          </p>      
          <p className="text-lg font-medium leading-8 text-zinc-600 dark:text-zinc-400">
            I mange år har avrenning fra landbruk, kloakk, nedbygging av strandsonen og overbeskatning av fiskebestander tappet fjorden for liv. Oksygenet forsvinner fra dypet, ålegressengene krymper, torsken er så godt som borte.
            I de siste årene har det blitt lagt ned en stor innsats av mange, og enda flere ønsker å bidra. Mange av tiltakene virker, men tempoet og omfanget må opp hvis vi skal gi fjorden en mulighet til å bli frisk.
          </p>
        </div>
        <div className="flex flex-col justify-start py-10 gap-10 text-base font-medium sm:flex-row">
          <Button href="https://paadriv.no/partner/">
            Bli partner
          </Button>
          <Button href="https://paadriv.no/padriver/">
            Bli pådriver
          </Button>
        </div>
        <InfiniteScroller />
        <Textbox/>
        <Watertemperature />
        <Map/>
        <Calendar/>
      </main>
      <footer className="w-full mx-auto px-10 bg-gray-500 py-10">
        <div className="flex gap-16">
          <div className="flex flex-col max-w-50">
            <Link href="https://paadriv.no/" target="_blank" rel="noopener noreferrer">
              <Image
                className="dark:invert"
                src="/padriv.jpg"
                alt="Padriv logomark"
                width={100}
                height={100}
                priority
              />
            </Link>
            <p className="text-sm text-white mt-2"> For alle som vil finne gode løsninger og en mer bærekraftig retning - sammen</p>
          </div>
          <div>
            <h2 className="text-lg font-semibold text-white">Følg oss</h2>
          </div>

        </div>
  
      </footer>

    </div>
  );
}
