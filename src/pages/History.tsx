import { useState, useMemo, useEffect, FormEvent } from 'react';
import {
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer,
} from 'recharts';

// =======================
// Kiểu dữ liệu & helper
// =======================
type TimeRange = '1d' | '7d' | '30d' | '365d';
type YieldHistoryRange = 3 | 5 | 7 | 10;

interface RawData {
  ts: number; // timestamp for X-axis
  airTemp: number;
  airHumidity: number;
  light: number;
  soilTemp: number;
  soilMoisture: number;
  soilPH: number;
}

interface DisplayData {
  ts: number; // timestamp for X-axis
  airTemp: number;
  airHumidity: number;
  light: number;
  soilTemp: number;
  soilMoisture: number;
  soilPH: number;
}

interface Metric {
  key: keyof DisplayData;
  label: string;
  color: string;
  unit: string;
}

interface YieldRecord {
  id: string;
  year: number;
  season: string;
  treeAge: number;
  dryYield: number;
  freshYield: number;
  currentPrice: number;
  profit: number;
  note?: string;
  createdAt: number;
}

const YIELD_STORAGE_KEY = 'bkf_yield_records_v1';

// Không còn chuẩn hoá/ làm tròn: hiển thị giá trị gốc

// Helpers định dạng thời gian theo khoảng chọn
const fmtHHmm = (d: Date) => d.toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' });
const fmtDDMM = (d: Date) => d.toLocaleDateString('vi-VN', { day: '2-digit', month: '2-digit' });
const fmtMMYYYY = (d: Date) => d.toLocaleDateString('vi-VN', { month: '2-digit', year: 'numeric' });

// Tạo dữ liệu mô phỏng theo khoảng thời gian
const generateHistoricalData = (range: TimeRange): RawData[] => {
  const result: RawData[] = [];
  const now = Date.now();
  const HOUR = 60 * 60 * 1000;
  const DAY = 24 * HOUR;

  if (range === '1d') {
    // 24 mốc theo giờ
    const start = now - 23 * HOUR;
    for (let i = 0; i < 24; i++) {
      const ts = start + i * HOUR;
      result.push({
        ts,
        airTemp: 20 + Math.random() * 8,
        airHumidity: 60 + Math.random() * 20,
        light: 600 + Math.random() * 400,
        soilTemp: 18 + Math.random() * 10,
        soilMoisture: 55 + Math.random() * 25,
        soilPH: 5.5 + Math.random() * 1.5,
      });
    }
    return result;
  }

  if (range === '7d' || range === '30d') {
    const days = range === '7d' ? 7 : 30;
    for (let i = days - 1; i >= 0; i--) {
      const ts = now - i * DAY;
      result.push({
        ts,
        airTemp: 20 + Math.random() * 8,
        airHumidity: 60 + Math.random() * 20,
        light: 600 + Math.random() * 400,
        soilTemp: 18 + Math.random() * 10,
        soilMoisture: 55 + Math.random() * 25,
        soilPH: 5.5 + Math.random() * 1.5,
      });
    }
    return result;
  }

  // 365d: dùng 12 mốc theo tháng để dễ đọc
  const date = new Date();
  date.setHours(12, 0, 0, 0);
  date.setDate(1);
  // lùi 11 tháng để có 12 mốc (từ 11 tháng trước đến tháng hiện tại)
  date.setMonth(date.getMonth() - 11);
  for (let i = 0; i < 12; i++) {
    const ts = date.getTime();
    result.push({
      ts,
      airTemp: 20 + Math.random() * 8,
      airHumidity: 60 + Math.random() * 20,
      light: 600 + Math.random() * 400,
      soilTemp: 18 + Math.random() * 10,
      soilMoisture: 55 + Math.random() * 25,
      soilPH: 5.5 + Math.random() * 1.5,
    });
    date.setMonth(date.getMonth() + 1);
  }
  return result;
};

// =======================
// Component chính
// =======================
export default function History() {
  const [timeRange, setTimeRange] = useState<TimeRange>('7d');
  const [selectedMetrics, setSelectedMetrics] = useState<(keyof DisplayData)[]>([
    'airTemp',
    'airHumidity',
  ]);

  const [yieldRange, setYieldRange] = useState<YieldHistoryRange>(5);
  const [yieldRecords, setYieldRecords] = useState<YieldRecord[]>([]);
  const [form, setForm] = useState<Omit<YieldRecord, 'id' | 'createdAt'>>({
    year: new Date().getFullYear(),
    season: 'Mùa vụ chính',
    treeAge: 5,
    dryYield: 2.5,
    freshYield: 7.5,
    currentPrice: 40000,
    profit: 120000000,
    note: '',
  });

  useEffect(() => {
    const raw = localStorage.getItem(YIELD_STORAGE_KEY);
    if (!raw) return;
    try {
      const parsed = JSON.parse(raw) as YieldRecord[];
      if (Array.isArray(parsed)) {
        setYieldRecords(parsed);
      }
    } catch {
      // ignore corrupted data
    }
  }, []);

  useEffect(() => {
    localStorage.setItem(YIELD_STORAGE_KEY, JSON.stringify(yieldRecords));
  }, [yieldRecords]);

  // Dữ liệu gốc theo khoảng thời gian
  const rawData = useMemo(() => generateHistoricalData(timeRange), [timeRange]);

  // ✅ Dữ liệu hiển thị (giá trị gốc, không chuẩn hoá)
  const displayData: DisplayData[] = useMemo(
    () =>
      rawData.map((d) => ({
        ts: d.ts,
        airTemp: d.airTemp,
        airHumidity: d.airHumidity,
        light: d.light,
        soilTemp: d.soilTemp,
        soilMoisture: d.soilMoisture,
        soilPH: d.soilPH,
      })),
    [rawData]
  );

  // Danh sách chỉ số
  const metrics: Metric[] = [
    { key: 'airTemp', label: 'Nhiệt độ KK', color: '#F87171', unit: '°C' },
    { key: 'airHumidity', label: 'Độ ẩm KK', color: '#3B82F6', unit: '%' },
    { key: 'light', label: 'Ánh sáng', color: '#FBBF24', unit: 'lux' },
    { key: 'soilTemp', label: 'Nhiệt độ đất', color: '#F97316', unit: '°C' },
    { key: 'soilMoisture', label: 'Độ ẩm đất', color: '#06B6D4', unit: '%' },
    { key: 'soilPH', label: 'pH đất', color: '#10B981', unit: 'pH' },
  ];

  const toggleMetric = (key: keyof DisplayData) =>
    setSelectedMetrics((prev) =>
      prev.includes(key) ? prev.filter((m) => m !== key) : [...prev, key]
    );

  const filteredYieldRecords = useMemo(() => {
    const currentYear = new Date().getFullYear();
    const minYear = currentYear - yieldRange + 1;
    return yieldRecords
      .filter((r) => r.year >= minYear && r.year <= currentYear)
      .sort((a, b) => b.year - a.year || b.createdAt - a.createdAt);
  }, [yieldRecords, yieldRange]);

  const handleYieldSubmit = (e: FormEvent) => {
    e.preventDefault();
    if (!form.year || !form.season.trim()) return;
    const newRecord: YieldRecord = {
      ...form,
      id: `${Date.now()}-${Math.random().toString(16).slice(2)}`,
      createdAt: Date.now(),
    };
    setYieldRecords((prev) => [newRecord, ...prev]);
  };

  const handleYieldDelete = (id: string) =>
    setYieldRecords((prev) => prev.filter((r) => r.id !== id));

  // =======================
  // Render
  // =======================
  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="text-center mb-8">
        <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-cyan-600 bg-clip-text text-transparent mb-2">
          Lịch sử cây trồng
        </h1>
  <p className="text-slate-600">Dữ liệu hiển thị theo giá trị gốc.</p>
      </div>

      {/* Bộ chọn thời gian */}
      <div className="bg-white rounded-3xl shadow-xl p-6 border border-gray-100">
        <div className="flex flex-wrap gap-4 mb-6">
          <div>
            <label className="text-sm font-semibold text-slate-700 mb-2 block">
              Khoảng thời gian:
            </label>
            <div className="flex gap-2">
              {(['1d', '7d', '30d', '365d'] as TimeRange[]).map((r) => (
                <button
                  key={r}
                  onClick={() => setTimeRange(r)}
                  className={`px-4 py-2 rounded-lg font-medium transition-all ${
                    timeRange === r
                      ? 'bg-gradient-to-r from-blue-500 to-cyan-500 text-white shadow-lg'
                      : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                  }`}
                >
                  {r === '1d' && '1 ngày'}
                  {r === '7d' && '1 tuần'}
                  {r === '30d' && '1 tháng'}
                  {r === '365d' && '1 năm'}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Bộ chọn chỉ số */}
        <div className="mb-6">
          <label className="text-sm font-semibold text-slate-700 mb-2 block">Chọn chỉ số:</label>
          <div className="flex flex-wrap gap-2">
            {metrics.map((m) => (
              <button
                key={m.key}
                onClick={() => toggleMetric(m.key)}
                className={`px-4 py-2 rounded-lg font-medium transition-all transform hover:scale-105 ${
                  selectedMetrics.includes(m.key)
                    ? 'text-white shadow-lg'
                    : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                }`}
                style={selectedMetrics.includes(m.key) ? { backgroundColor: m.color } : {}}
              >
                {m.label}
              </button>
            ))}
          </div>
        </div>

        {/* Biểu đồ */}
        <div className="bg-gradient-to-br from-slate-50 to-gray-50 rounded-2xl p-6 border border-gray-200">
          <ResponsiveContainer width="100%" height={400}>
            {/* key to remount chart on range change, ensuring full re-computation */}
            <LineChart data={displayData} key={timeRange}>
              <defs>
                {metrics.map((m) => (
                  <linearGradient key={m.key} id={`grad-${m.key}`} x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor={m.color} stopOpacity={0.8} />
                    <stop offset="95%" stopColor={m.color} stopOpacity={0.1} />
                  </linearGradient>
                ))}
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" />
              <XAxis
                dataKey="ts"
                type="number"
                scale="time"
                domain={[ 'auto', 'auto' ]}
                stroke="#6B7280"
                style={{ fontSize: '12px' }}
                tickCount={timeRange === '1d' ? 8 : timeRange === '7d' ? 7 : timeRange === '30d' ? 6 : 12}
                tickFormatter={(ts: number) => {
                  const d = new Date(ts);
                  if (timeRange === '1d') return fmtHHmm(d);
                  if (timeRange === '365d') return fmtMMYYYY(d);
                  return fmtDDMM(d);
                }}
              />
              <YAxis stroke="#6B7280" style={{ fontSize: '12px' }} />
              <Tooltip
                formatter={(value: number, name: string) => [Number(value.toFixed(1)), name]}
                labelFormatter={(label: number | string) => {
                  const d = new Date(Number(label));
                  if (timeRange === '1d') return `${fmtHHmm(d)} — ${fmtDDMM(d)}`;
                  if (timeRange === '365d') return fmtMMYYYY(d);
                  return fmtDDMM(d);
                }}
                contentStyle={{
                  backgroundColor: 'rgba(255, 255, 255, 0.95)',
                  border: '1px solid #E5E7EB',
                  borderRadius: '12px',
                  boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
                }}
              />
              <Legend wrapperStyle={{ paddingTop: '20px' }} iconType="line" />
              {selectedMetrics.map((k) => {
                const m = metrics.find((x) => x.key === k);
                if (!m) return null;
                return (
                  <Line
                    key={k}
                    type="monotone"
                    dataKey={k}
                    name={`${m.label} (${m.unit})`}
                    stroke={m.color}
                    strokeWidth={3}
                    dot={{ fill: m.color, r: 3 }}
                    activeDot={{ r: 5 }}
                    fill={`url(#grad-${k})`}
                  />
                );
              })}
            </LineChart>
          </ResponsiveContainer>
        </div>

        {/* Thống kê nhanh */}
        <div className="mt-6 grid grid-cols-1 md:grid-cols-3 gap-4">
          {selectedMetrics.slice(0, 3).map((k) => {
            const m = metrics.find((x) => x.key === k);
            if (!m) return null;
              const values: number[] = displayData.map((d) => d[k] as number);
              const avg = Number(((values.reduce((a, b) => a + b, 0) / values.length)).toFixed(1));
              const min = Number(Math.min(...values).toFixed(1));
              const max = Number(Math.max(...values).toFixed(1));


            return (
              <div
                key={k}
                className="p-4 rounded-xl border-2 transition-all hover:shadow-lg"
                style={{
                  borderColor: m.color + '40',
                  backgroundColor: m.color + '08',
                }}
              >
                <h3 className="font-bold text-slate-800 mb-2">{m.label}</h3>
                <div className="space-y-1 text-sm">
                  <div className="flex justify-between">
                    <span className="text-slate-600">Trung bình:</span>
                    <span className="font-semibold" style={{ color: m.color }}>
                      {avg} {m.unit}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-600">Thấp nhất:</span>
                    <span className="font-semibold text-blue-600">
                      {min} {m.unit}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-600">Cao nhất:</span>
                    <span className="font-semibold text-red-600">
                      {max} {m.unit}
                    </span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Lịch sử cây trồng nhiều năm */}
      <div className="bg-white rounded-3xl shadow-xl p-6 border border-gray-100 space-y-6">
        <div className="text-center">
          <h2 className="text-3xl font-bold text-emerald-700 mb-2">Lịch sử cây trồng</h2>
          <p className="text-slate-600">
            Lưu dữ liệu 3, 5, 7 và 10 năm về năng suất & lợi nhuận (giá hiện tại).
          </p>
        </div>

        <div className="flex flex-wrap gap-2 justify-center">
          {([3, 5, 7, 10] as YieldHistoryRange[]).map((range) => (
            <button
              key={range}
              onClick={() => setYieldRange(range)}
              className={`px-4 py-2 rounded-full font-semibold transition-all ${
                yieldRange === range
                  ? 'bg-gradient-to-r from-emerald-500 to-teal-500 text-white shadow-lg'
                  : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
              }`}
            >
              {range} năm
            </button>
          ))}
        </div>

        <form onSubmit={handleYieldSubmit} className="grid grid-cols-1 lg:grid-cols-3 gap-4">
          <div className="space-y-3">
            <label className="block text-sm font-semibold text-slate-700">Năm</label>
            <input
              type="number"
              value={form.year}
              onChange={(e) => setForm((prev) => ({ ...prev, year: Number(e.target.value) }))}
              className="w-full rounded-xl border border-slate-200 px-4 py-2 focus:border-emerald-500 focus:outline-none"
              min={2000}
              max={2100}
              required
            />
          </div>

          <div className="space-y-3">
            <label className="block text-sm font-semibold text-slate-700">Mùa vụ</label>
            <input
              type="text"
              value={form.season}
              onChange={(e) => setForm((prev) => ({ ...prev, season: e.target.value }))}
              className="w-full rounded-xl border border-slate-200 px-4 py-2 focus:border-emerald-500 focus:outline-none"
              placeholder="Ví dụ: Mùa vụ chính"
              required
            />
          </div>

          <div className="space-y-3">
            <label className="block text-sm font-semibold text-slate-700">Tuổi cây (năm)</label>
            <input
              type="number"
              value={form.treeAge}
              onChange={(e) => setForm((prev) => ({ ...prev, treeAge: Number(e.target.value) }))}
              className="w-full rounded-xl border border-slate-200 px-4 py-2 focus:border-emerald-500 focus:outline-none"
              min={0}
              step={0.5}
              required
            />
          </div>

          <div className="space-y-3">
            <label className="block text-sm font-semibold text-slate-700">Năng suất khô (tấn/ha)</label>
            <input
              type="number"
              value={form.dryYield}
              onChange={(e) => setForm((prev) => ({ ...prev, dryYield: Number(e.target.value) }))}
              className="w-full rounded-xl border border-slate-200 px-4 py-2 focus:border-emerald-500 focus:outline-none"
              min={0}
              step={0.1}
              required
            />
          </div>

          <div className="space-y-3">
            <label className="block text-sm font-semibold text-slate-700">Năng suất tươi (tấn/ha)</label>
            <input
              type="number"
              value={form.freshYield}
              onChange={(e) => setForm((prev) => ({ ...prev, freshYield: Number(e.target.value) }))}
              className="w-full rounded-xl border border-slate-200 px-4 py-2 focus:border-emerald-500 focus:outline-none"
              min={0}
              step={0.1}
              required
            />
          </div>

          <div className="space-y-3">
            <label className="block text-sm font-semibold text-slate-700">Giá hiện tại (VNĐ/kg)</label>
            <input
              type="number"
              value={form.currentPrice}
              onChange={(e) => setForm((prev) => ({ ...prev, currentPrice: Number(e.target.value) }))}
              className="w-full rounded-xl border border-slate-200 px-4 py-2 focus:border-emerald-500 focus:outline-none"
              min={0}
              step={100}
              required
            />
          </div>

          <div className="space-y-3">
            <label className="block text-sm font-semibold text-slate-700">Lợi nhuận (VNĐ)</label>
            <input
              type="number"
              value={form.profit}
              onChange={(e) => setForm((prev) => ({ ...prev, profit: Number(e.target.value) }))}
              className="w-full rounded-xl border border-slate-200 px-4 py-2 focus:border-emerald-500 focus:outline-none"
              min={0}
              step={1000}
              required
            />
          </div>

          <div className="space-y-3 lg:col-span-2">
            <label className="block text-sm font-semibold text-slate-700">Ghi chú</label>
            <input
              type="text"
              value={form.note}
              onChange={(e) => setForm((prev) => ({ ...prev, note: e.target.value }))}
              className="w-full rounded-xl border border-slate-200 px-4 py-2 focus:border-emerald-500 focus:outline-none"
              placeholder="Ví dụ: tăng năng suất nhờ tưới nhỏ giọt"
            />
          </div>

          <div className="flex items-end">
            <button
              type="submit"
              className="w-full rounded-xl bg-gradient-to-r from-emerald-500 to-teal-500 px-6 py-3 font-semibold text-white shadow-lg hover:from-emerald-600 hover:to-teal-600 transition-all"
            >
              Lưu mùa vụ
            </button>
          </div>
        </form>

        <div className="grid grid-cols-1 gap-4">
          {filteredYieldRecords.length === 0 ? (
            <div className="rounded-2xl border border-dashed border-slate-200 p-6 text-center text-slate-500">
              Chưa có dữ liệu lịch sử trong {yieldRange} năm gần nhất.
            </div>
          ) : (
            filteredYieldRecords.map((record) => (
              <div
                key={record.id}
                className="rounded-2xl border border-slate-200 bg-slate-50 p-4 shadow-sm"
              >
                <div className="flex flex-wrap items-center justify-between gap-3">
                  <div>
                    <h3 className="text-lg font-bold text-slate-800">
                      {record.season} • {record.year}
                    </h3>
                    <p className="text-sm text-slate-600">Tuổi cây: {record.treeAge} năm</p>
                  </div>
                  <button
                    type="button"
                    onClick={() => handleYieldDelete(record.id)}
                    className="rounded-full bg-white px-4 py-2 text-sm font-semibold text-rose-600 shadow hover:bg-rose-50"
                  >
                    Xóa
                  </button>
                </div>

                <div className="mt-4 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3 text-sm">
                  <div className="rounded-xl bg-white p-3 border border-slate-200">
                    <p className="text-slate-500">Năng suất khô</p>
                    <p className="text-lg font-semibold text-slate-800">{record.dryYield} tấn/ha</p>
                  </div>
                  <div className="rounded-xl bg-white p-3 border border-slate-200">
                    <p className="text-slate-500">Năng suất tươi</p>
                    <p className="text-lg font-semibold text-slate-800">{record.freshYield} tấn/ha</p>
                  </div>
                  <div className="rounded-xl bg-white p-3 border border-slate-200">
                    <p className="text-slate-500">Giá hiện tại</p>
                    <p className="text-lg font-semibold text-slate-800">{record.currentPrice.toLocaleString('vi-VN')} VNĐ/kg</p>
                  </div>
                  <div className="rounded-xl bg-white p-3 border border-slate-200">
                    <p className="text-slate-500">Lợi nhuận</p>
                    <p className="text-lg font-semibold text-emerald-700">{record.profit.toLocaleString('vi-VN')} VNĐ</p>
                  </div>
                </div>

                {record.note && (
                  <p className="mt-3 text-sm text-slate-600 italic">Ghi chú: {record.note}</p>
                )}
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}
