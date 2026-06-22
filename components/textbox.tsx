"use client";

import { useState } from "react";

export default function Textbox() {
  const [email, setEmail] = useState("");
  const [påmeldte, setPåmeldte] = useState<string[]>([]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setPåmeldte([...påmeldte, email]);
    setEmail("");
  };

  return (
    <div>
        <form onSubmit={handleSubmit} className="flex gap-2 mt-4">
            <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Din e-postadresse"
                required
                className="px-2 py-2 pl-5 text-black border border-gray-400 rounded-full focus:outline-none focus:border-[#FA6B10]"
            />
            <button
                type="submit"
                className="px-4 py-2 rounded-full bg-[#FA6B10] text-white hover:bg-[#d65a0e]"
            >
                Meld meg på
            </button>
        </form>
        {påmeldte.length > 0 && (
            <ul className="mt-4 text-sm text-black dark:text-zinc-400">
                {påmeldte.map((email, index) => (
                    <li key={index}>{email}</li>
                ))}
            </ul>
        )}
    </div>
  );
}