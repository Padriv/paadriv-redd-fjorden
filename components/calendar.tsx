"use client";

import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import { useState } from "react";
import ArrangementPopup from "./arrangementPopup";

const arrangementer = [
  { title: "Ryddeaksjon Bunnefjorden", date: "2026-07-12", extendedProps: { tid: "10:00 - 14:00", sted: "Bunnefjorden", beskrivelse: "Bli med på en ryddeaksjon for å holde Bunnefjorden ren og fri for søppel!" } },
  { title: "Foredrag: Oslofjordens fremtid", date: "2026-07-20", extendedProps: { tid: "14:00 - 16:00", sted: "Oslofjorden", beskrivelse: "Hør om fremtiden til Oslofjorden og hvordan vi kan beskytte den." } },
];

export default function Calendar() {
    const [choosenArrangement, setChosenArrangement] = useState<any>(null);
  return (
    <div className="w-full mt-8">
      <FullCalendar
        plugins={[dayGridPlugin]}
        initialView="dayGridMonth"
        locale="nb"
        events={arrangementer}
        eventClick={(info) => {setChosenArrangement(info.event)}}
      />
      {choosenArrangement && <ArrangementPopup arrangement={choosenArrangement} onLukk={() => setChosenArrangement(null)} />}
    </div>
  );
}