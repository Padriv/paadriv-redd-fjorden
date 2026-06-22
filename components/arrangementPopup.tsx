interface Props {
  arrangement: any;
  onLukk: () => void;
}

export default function ArrangementPopup({ arrangement, onLukk }: Props) {
  return (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
      <div className="bg-white rounded-2xl p-8 max-w-sm w-full">
        <h2 className="text-xl font-semibold mb-2">{arrangement.title}</h2>
        <p className="text-zinc-600">{arrangement.extendedProps.tid}</p>
        <p className="text-zinc-600">{arrangement.extendedProps.sted}</p>
        <p className="text-zinc-600 mt-2">{arrangement.extendedProps.beskrivelse}</p>
        <button
          onClick={onLukk}
          className="mt-6 px-4 py-2 rounded-full bg-[#FA6B10] text-white hover:bg-[#d65a0e]"
        >
          Lukk
        </button>
      </div>
    </div>
  );
}