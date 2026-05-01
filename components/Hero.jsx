import { Compass } from "lucide-react";

export default function Hero() {
  return (
    <header className="relative pt-24 pb-16 px-6 md:px-12 lg:px-24 max-w-7xl mx-auto">
      <div className="flex flex-col items-start gap-8 animate-fade-in-up">
        <div className="flex items-center gap-3 eyebrow">
          <Compass size={14} strokeWidth={1.5} className="text-champagne-400" />
          <span>1-Group · Internal Strategic Tool</span>
        </div>

        <h1 className="display text-5xl md:text-6xl lg:text-7xl text-platinum-100 max-w-4xl">
          1-Altitude Reboot
          <span className="block text-2xl md:text-3xl lg:text-4xl text-platinum-400 mt-4 font-sans font-light tracking-wide italic">
            Multi-Agent Strategic Ideation
          </span>
        </h1>

        <p className="text-lg md:text-xl text-platinum-300 max-w-2xl leading-relaxed font-light">
          Twelve agents. Three waves. One returned icon. A thinking tool, not a deck —
          the agents reason in the open and the output is generated live.
        </p>

        <div className="flex flex-wrap items-center gap-x-8 gap-y-3 text-sm text-platinum-400 font-mono mt-2">
          <div className="flex items-center gap-2">
            <span className="w-1 h-1 rounded-full bg-champagne-400" />
            <span>Levels 61–63, One Raffles Place</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="w-1 h-1 rounded-full bg-champagne-400" />
            <span>Singapore</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="w-1 h-1 rounded-full bg-champagne-400" />
            <span>282m</span>
          </div>
        </div>
      </div>

      <div className="wave-divider mt-16" />
    </header>
  );
}
