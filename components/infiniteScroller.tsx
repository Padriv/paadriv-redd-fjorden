export default function InfiniteScroller() {
  const logos = [
    { name: "Asker kommune", src: "/partners/asker-kommune.webp", href: "https://www.asker.kommune.no" },
    { name: "Chemring nobel", src: "/partners/chemring-nobel.svg", href: "https://www.chemringnobel.no" },
    { name: "Hafslund", src: "/partners/Hafslund.avif", href: "https://www.hafslund.no" },
  ];

  return (
    <div style={{ overflow: "hidden", width: "100%", padding: "24px 0" }}>
      <style>{`
        @keyframes infinitescroller {
          from { transform: translateX(0); }
          to { transform: translateX(-50%); }
        }
        .scroller-track {
          display: flex;
          gap: 3rem;
          width: max-content;
          animation: infinitescroller 16s linear infinite;
        }
      `}</style>

      <div className="scroller-track">
        {[...logos, ...logos].map((logo, i) => (
          <a key={i} href={logo.href} target="_blank" rel="noopener noreferrer">
            <img src={logo.src} alt={logo.name} className="h-20 md:h-32 object-contain" />
          </a>
        ))}
      </div>
    </div>
  );
}
