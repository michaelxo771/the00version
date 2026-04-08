"use client";

import { useState, useEffect } from "react";

function getNextFridayMidnight(): Date {
  const now = new Date();
  const day = now.getDay(); // 0=Sun, 5=Fri
  const daysUntilFriday = (5 - day + 7) % 7 || 7;
  const next = new Date(now);
  next.setDate(now.getDate() + daysUntilFriday);
  next.setHours(0, 0, 0, 0);
  return next;
}

type TimeLeft = { days: number; hours: number; minutes: number; seconds: number };

export default function CountdownTimer() {
  const [timeLeft, setTimeLeft] = useState<TimeLeft>({ days: 0, hours: 0, minutes: 0, seconds: 0 });
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);

    function calculate() {
      const target = getNextFridayMidnight();
      const diff = target.getTime() - Date.now();
      if (diff <= 0) {
        setTimeLeft({ days: 0, hours: 0, minutes: 0, seconds: 0 });
        return;
      }
      setTimeLeft({
        days: Math.floor(diff / (1000 * 60 * 60 * 24)),
        hours: Math.floor((diff / (1000 * 60 * 60)) % 24),
        minutes: Math.floor((diff / (1000 * 60)) % 60),
        seconds: Math.floor((diff / 1000) % 60),
      });
    }

    calculate();
    const id = setInterval(calculate, 1000);
    return () => clearInterval(id);
  }, []);

  const units = [
    { label: "Days", value: timeLeft.days },
    { label: "Hours", value: timeLeft.hours },
    { label: "Mins", value: timeLeft.minutes },
    { label: "Secs", value: timeLeft.seconds },
  ];

  return (
    <section className="relative py-20 overflow-hidden">
      {/* Background */}
      <div className="absolute inset-0 bg-[#0d0d0d]" />
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_rgba(201,168,76,0.07)_0%,_transparent_65%)]" />
      <div className="absolute top-0 left-0 right-0 h-[1px] bg-gradient-to-r from-transparent via-[#C9A84C]/40 to-transparent" />
      <div className="absolute bottom-0 left-0 right-0 h-[1px] bg-gradient-to-r from-transparent via-[#C9A84C]/40 to-transparent" />

      {/* Grid pattern */}
      <div
        className="absolute inset-0 opacity-30"
        style={{
          backgroundImage: `linear-gradient(rgba(201,168,76,0.05) 1px, transparent 1px), linear-gradient(90deg, rgba(201,168,76,0.05) 1px, transparent 1px)`,
          backgroundSize: "40px 40px",
        }}
      />

      <div className="relative max-w-4xl mx-auto px-4 text-center">
        {/* Eyebrow */}
        <div className="flex items-center justify-center gap-3 mb-4">
          <div className="h-[1px] w-10 bg-[#C9A84C]/50" />
          <span className="text-[10px] font-bold uppercase tracking-[0.4em] text-[#C9A84C]">
            Limited Drop
          </span>
          <div className="h-[1px] w-10 bg-[#C9A84C]/50" />
        </div>

        <h2 className="text-3xl sm:text-5xl font-black uppercase tracking-tight mb-2">
          Next Drop
        </h2>
        <p className="text-neutral-500 text-sm mb-10 uppercase tracking-widest">
          Every Friday at midnight
        </p>

        {/* Timer */}
        <div className="flex items-center justify-center gap-3 sm:gap-6">
          {units.map((unit, i) => (
            <div key={unit.label} className="flex items-center gap-3 sm:gap-6">
              <div className="flex flex-col items-center">
                <div className="relative">
                  {/* Card */}
                  <div className="bg-[#111111] border border-[#C9A84C]/30 rounded-sm w-16 h-16 sm:w-24 sm:h-24 flex items-center justify-center">
                    <span
                      className="gold-text text-3xl sm:text-5xl font-black tabular-nums leading-none"
                      style={{ fontVariantNumeric: "tabular-nums" }}
                    >
                      {mounted ? String(unit.value).padStart(2, "0") : "00"}
                    </span>
                  </div>
                  {/* Shine line */}
                  <div className="absolute top-0 left-0 right-0 h-[1px] bg-gradient-to-r from-transparent via-[#C9A84C]/60 to-transparent" />
                </div>
                <span className="text-[10px] uppercase tracking-[0.2em] text-neutral-600 mt-2">
                  {unit.label}
                </span>
              </div>
              {/* Separator */}
              {i < units.length - 1 && (
                <span className="text-[#C9A84C]/40 text-2xl sm:text-4xl font-black mb-5 select-none">:</span>
              )}
            </div>
          ))}
        </div>

        <p className="text-neutral-600 text-xs mt-10 uppercase tracking-[0.2em]">
          New pieces drop every Friday — sign up to get notified first
        </p>
      </div>
    </section>
  );
}
