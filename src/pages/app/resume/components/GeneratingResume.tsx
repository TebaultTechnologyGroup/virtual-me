import { useEffect, useState } from "react";
import { Cpu, Sparkles } from "lucide-react";

const PHASES = [
  "Scanning central user configuration records...",
  "Running comparative vector tracking matrices...",
  "Aligning metrics and skill tags to targets...",
  "Formatting structure engine canvas maps...",
  "Writing standard profile layout vectors...",
];

export default function GeneratingResume() {
  const [index, setIndex] = useState(0);

  useEffect(() => {
    const id = setInterval(() => {
      setIndex((prev) => (prev + 1) % PHASES.length);
    }, 2500);
    return () => clearInterval(id);
  }, []);

  return (
    <div className="flex flex-col items-center justify-center h-[calc(100vh-120px)] text-center px-6 animate-in fade-in duration-300">
      <div className="relative w-24 h-24 mb-6">
        <div className="absolute inset-0 rounded-full border-4 border-slate-100" />
        <div className="absolute inset-0 rounded-full border-4 border-blue-600 border-t-transparent animate-spin" />
        <div className="absolute inset-0 flex items-center justify-center">
          <Cpu className="w-8 h-8 text-blue-600 animate-pulse" />
        </div>
      </div>

      <div className="space-y-2 max-w-sm">
        <h2 className="text-lg font-bold text-slate-800 flex items-center justify-center gap-1.5">
          <Sparkles className="w-4 h-4 text-blue-500 animate-bounce" />{" "}
          Processing Vector Assets
        </h2>
        <p
          key={index}
          className="text-xs text-muted-foreground animate-in fade-in duration-500 font-medium tracking-wide"
        >
          {PHASES[index]}
        </p>
      </div>

      {/* {config?.mode === "job_tailored" && config.companyName && (
        <div className="mt-8 px-3 py-1 rounded-full bg-slate-100 border border-slate-200 text-[10px] uppercase font-bold tracking-wider text-slate-600">
          Target System: {config.companyName}
        </div>
      )} */}
    </div>
  );
}
