"use client";

import { useState } from "react";
import MultiSelect from "../../../components/MultiSelect";
import Button from "../../../components/Button";

export default function IndividualSignupForm({ onClose }: { onClose?: () => void }) {
    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [phoneNumber, setPhoneNumber] = useState("");
    const [skills, setSkills] = useState<string[]>([]);
    const [passion, setPassion] = useState("");


    function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
        e.preventDefault();
    }

    return (
        <form onSubmit={handleSubmit} className="relative p-8 rounded-2xl w-full flex flex-col gap-8">
            <div className="flex items-center justify-between">
                <h2 className="text-xl font-bold">Bli med i Oppdrag: fjorden vår</h2>
                {onClose && (
                    <button onClick={onClose} aria-label="Lukk skjema" className="text-zinc-400 hover:text-black transition-colors text-2xl leading-none">✕</button>
                )}
            </div>

            <div className = "flex flex-col gap-2">
                <label className="block text-sm font-medium mb-1">Navn:</label>
                <input
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="Ola Nordmann"
                    className="w-full border border-zinc-300 rounded-lg px-3 py-2 text-sm outline-none focus:border-zinc-900"
                />
            </div>

            <div className = "flex flex-col gap-2">
                <label className="block text-sm font-medium mb-1 mt-3">E-post:</label>
                <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="ola.nordmann@example.com"
                    className="w-full border border-zinc-300 rounded-lg px-3 py-2 text-sm outline-none focus:border-zinc-900"
                />
            </div>

            <div className = "flex flex-col gap-2">
                <label className="block text-sm font-medium mb-1 mt-3">Tlf:</label>
                <input
                    type="tel"
                    value={phoneNumber}
                    onChange={(e) => setPhoneNumber(e.target.value)}
                    placeholder="123 45 678"
                    className="w-full border border-zinc-300 rounded-lg px-3 py-2 text-sm outline-none focus:border-zinc-900"
                />
            </div>

            <div className = "flex flex-col gap-2">
                <label className="block text-sm font-medium mb-1 mt-3">Har du kompetanse eller erfaring innen noen av områdene under?</label>
                <MultiSelect
                    options={["Vannkvalitet", "Kystmiljø", "Bærekraft", "Frivillighet og organisasjonsarbeid"]}
                    selected={skills}
                    setSelected={setSkills}
                />
            </div>

            <div className = "flex flex-col gap-2">
                <label className="block text-sm font-medium mb-1 mt-3">Er det noe spesielt du brenner for å bidra med?</label>
                <input
                    type="text"
                    value={passion}
                    onChange={(e) => setPassion(e.target.value)}
                    placeholder="F.eks. rydde strender, undervise barn om miljø, etc."
                    className="w-full border border-zinc-300 rounded-lg px-3 py-2 text-sm outline-none focus:border-zinc-900"
                />
            </div>

            <Button label="Send inn" type="submit" />

        </form>
    ); }