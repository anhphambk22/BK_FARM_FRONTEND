import { useEffect, useState } from 'react';

/**
 * Live clock that updates every second.
 * - Locale: vi-VN
 * - Shows: HH:mm:ss • dd/MM/yyyy (Thứ ...)
 */
export default function Clock({ className = '' }: { className?: string }) {
  const [now, setNow] = useState(() => new Date());

  useEffect(() => {
    const t = setInterval(() => setNow(new Date()), 1000);
    return () => clearInterval(t);
  }, []);

  const time = now.toLocaleTimeString('vi-VN', {
    hour: '2-digit', minute: '2-digit', second: '2-digit',
  });
  const dayName = now.toLocaleDateString('vi-VN', { weekday: 'long' });
  const date = now.toLocaleDateString('vi-VN', { day: '2-digit', month: '2-digit', year: 'numeric' });

  return (
    <div className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/60 border border-gray-200 shadow-sm text-slate-700 ${className}`}>
      <span className="font-bold tracking-wide tabular-nums">{time}</span>
      <span className="text-slate-400">•</span>
      <span className="capitalize text-sm">{dayName}, {date}</span>
    </div>
  );
}
