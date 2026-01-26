import { useMemo, useState } from 'react';
import { CheckCircle, AlertTriangle } from 'lucide-react';

interface StandardItemProps {
  label: string;
  current: number;
  standard: string;
  unit: string;
  percentage: number;
  status: 'good' | 'warning';
}

interface StageInfo {
  id: string;
  name: string;
  startMonth: number;
  endMonth: number;
  season: 'Mùa mưa' | 'Mùa khô';
  focus: string;
  forecast: string;
  aiActions: string[];
}

const StandardItem = ({ label, current, standard, unit, percentage, status }: StandardItemProps) => {
  const statusConfig = {
    good: {
      icon: CheckCircle,
      iconColor: 'text-emerald-500',
      barColor: 'from-emerald-400 to-teal-500',
      bgColor: 'from-emerald-50 to-teal-50'
    },
    warning: {
      icon: AlertTriangle,
      iconColor: 'text-orange-500',
      barColor: 'from-orange-400 to-yellow-500',
      bgColor: 'from-orange-50 to-yellow-50'
    } 
  };

  const config = statusConfig[status];
  const Icon = config.icon;

  return (
    <div className={`p-7 rounded-2xl bg-gradient-to-br ${config.bgColor} border border-white/50 shadow-lg transition-all hover:shadow-xl`}>
      <div className="flex justify-between items-start mb-4">
        <div>
          <h3 className="font-bold text-slate-800 text-xl mb-1">{label}</h3>
          <div className="flex items-baseline gap-2">
            <span className="text-3xl font-black text-blue-700">{current}</span>
            <span className="text-base text-slate-600">{unit}</span>
          </div>
        </div>
        <Icon className={`w-10 h-10 ${config.iconColor}`} />
      </div>

      <div className="mb-3">
        <div className="flex justify-between text-sm mb-2">
          <span className="text-slate-600">Chuẩn khuyến nghị:</span>
          <span className="font-semibold text-slate-800">{standard}</span>
        </div>
        <div className="h-3.5 bg-white/60 rounded-full overflow-hidden shadow-inner">
          <div
            className={`h-full bg-gradient-to-r ${config.barColor} rounded-full transition-all duration-1000 shadow-lg`}
            style={{ width: `${percentage}%` }}
          />
        </div>
      </div>

      <div className="flex justify-end">
        <span className={`text-base font-bold ${status === 'good' ? 'text-emerald-700' : 'text-orange-700'}`}>
          {percentage}% đạt chuẩn
        </span>
      </div>
    </div>
  );
};

export default function Standards() {
  const overallScore = 88;
  const [showHidden, setShowHidden] = useState(false);
  const currentMonth = new Date().getMonth() + 1;
  // Balanced circle gauge geometry
  const size = 128; // svg viewbox (matches w/h utility)
  const stroke = 10; // ring thickness
  const center = size / 2;
  const r = center - stroke / 2; // radius adjusted so stroke fits inside viewbox
  const circumference = 2 * Math.PI * r;

  const standards = [
    { label: 'Nhiệt độ không khí', current: 24, standard: '18-25°C', unit: '°C', percentage: 85, status: 'good' as const },
    { label: 'Độ ẩm không khí', current: 70, standard: '60-80%', unit: '%', percentage: 92, status: 'good' as const },
    { label: 'Ánh sáng', current: 800, standard: '500-1000 lux', unit: 'lux', percentage: 78, status: 'warning' as const },
    { label: 'Nhiệt độ đất', current: 22, standard: '20-28°C', unit: '°C', percentage: 90, status: 'good' as const },
    { label: 'Độ ẩm đất', current: 65, standard: '60-80%', unit: '%', percentage: 88, status: 'good' as const },
    { label: 'pH đất', current: 6.0, standard: '5.5-6.5', unit: 'pH', percentage: 95, status: 'good' as const },
    { label: 'Nitơ (N)', current: 45, standard: '30-60 ppm', unit: 'ppm', percentage: 82, status: 'good' as const },
    { label: 'Phốt pho (P)', current: 25, standard: '15-35 ppm', unit: 'ppm', percentage: 86, status: 'good' as const },
    { label: 'Kali (K)', current: 35, standard: '20-40 ppm', unit: 'ppm', percentage: 89, status: 'good' as const }
  ];

  const stages: StageInfo[] = [
    {
      id: 's1',
      name: 'Giai đoạn 1: Phục hồi sau thu hoạch',
      startMonth: 1,
      endMonth: 2,
      season: 'Mùa khô',
      focus: 'Hồi phục dinh dưỡng, cân bằng ẩm đất',
      forecast: 'Tăng cường che phủ, phục hồi dinh dưỡng nền, hạn chế sốc nhiệt.',
      aiActions: [
        'Tưới nhẹ định kỳ để giữ ẩm tầng rễ.',
        'Bổ sung hữu cơ hoai mục để cải tạo đất.',
        'Theo dõi pH và EC đất trước khi bón phân.'
      ]
    },
    {
      id: 's2',
      name: 'Giai đoạn 2: Sinh trưởng cành lá',
      startMonth: 3,
      endMonth: 4,
      season: 'Mùa khô',
      focus: 'Tăng sinh khối, ổn định độ ẩm',
      forecast: 'Nên ưu tiên tưới giữ ẩm, duy trì ánh sáng hợp lý để quang hợp tốt.',
      aiActions: [
        'Tăng cường tưới nhỏ giọt vào sáng sớm.',
        'Tỉa cành thông thoáng để tăng ánh sáng.',
        'Bổ sung đạm vừa phải giúp lá xanh bền.'
      ]
    },
    {
      id: 's3',
      name: 'Giai đoạn 3: Phân hóa mầm hoa',
      startMonth: 5,
      endMonth: 7,
      season: 'Mùa mưa',
      focus: 'Cân bằng dinh dưỡng, hạn chế sốc ẩm',
      forecast: 'Giai đoạn nhạy cảm, cần giữ ẩm ổn định và tránh dư ẩm kéo dài.',
      aiActions: [
        'Theo dõi độ ẩm đất, tránh úng cục bộ.',
        'Bổ sung lân và kali để hỗ trợ mầm hoa.',
        'Kiểm soát nấm bệnh sau mưa.'
      ]
    },
    {
      id: 's4',
      name: 'Giai đoạn 4: Ra hoa & đậu quả',
      startMonth: 8,
      endMonth: 11,
      season: 'Mùa mưa',
      focus: 'Dinh dưỡng N-P-K cân đối, giảm sâu bệnh',
      forecast: 'Cần ổn định dinh dưỡng và theo dõi ánh sáng để tăng tỷ lệ đậu quả.',
      aiActions: [
        'Phun vi lượng vào thời điểm trời ráo.',
        'Duy trì tán cây thông thoáng hạn chế sâu bệnh.',
        'Giữ EC đất ổn định để tránh rụng quả non.'
      ]
    },
    {
      id: 's5',
      name: 'Giai đoạn 5: Nuôi quả & thu hoạch',
      startMonth: 12,
      endMonth: 2,
      season: 'Mùa khô',
      focus: 'Tăng chất lượng quả, chuẩn bị thu hoạch',
      forecast: 'Giảm tưới dần, theo dõi độ chín và chuẩn bị nhân lực thu hoạch.',
      aiActions: [
        'Giảm tưới khi quả chín đồng loạt.',
        'Phân loại quả chín để thu hái chọn lọc.',
        'Ghi nhận năng suất và chi phí cho mùa vụ.'
      ]
    }
  ];

  const isInRange = (month: number, start: number, end: number) =>
    start <= end ? month >= start && month <= end : month >= start || month <= end;

  const currentStage = useMemo(
    () => stages.find((stage) => isInRange(currentMonth, stage.startMonth, stage.endMonth)) || stages[0],
    [currentMonth, stages]
  );

  const warningItems = standards.filter((s) => s.status === 'warning');
  const forecastComment = warningItems.length
    ? `Cần ưu tiên cải thiện: ${warningItems.map((s) => s.label).join(', ')}.`
    : 'Các chỉ số đang ổn định, duy trì chế độ chăm sóc hiện tại.';

  return (
    <div className="space-y-8">
      <div className="text-center mb-8">
        <h1 className="text-5xl font-black bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent mb-2">
          Xem tình trạng chuẩn
        </h1>
        <p className="text-slate-600">
          So sánh các chỉ số hiện tại với chuẩn khuyến nghị
        </p>
      </div>

      <div className="bg-gradient-to-br from-purple-900 via-pink-900 to-indigo-900 text-white rounded-3xl p-8 shadow-2xl border border-white/10 relative overflow-hidden">
        <div className="absolute -inset-1 bg-gradient-to-r from-purple-600 via-pink-600 to-indigo-600 rounded-3xl blur-xl opacity-50 animate-pulse"></div>

        <div className="relative z-10">
          <div className="text-center mb-6">
            <h2 className="text-2xl font-bold mb-4">Điểm đánh giá tổng thể</h2>
            <div className="flex justify-center items-center mb-4">
              <div className="relative">
                <svg className="w-32 h-32 transform -rotate-90" viewBox={`0 0 ${size} ${size}`}> 
                  <circle
                    cx={center}
                    cy={center}
                    r={r}
                    stroke="rgba(255, 255, 255, 0.25)"
                    strokeWidth={stroke}
                    fill="none"
                  />
                  <circle
                    cx={center}
                    cy={center}
                    r={r}
                    stroke="url(#scoreGradient)"
                    strokeWidth={stroke}
                    fill="none"
                    strokeDasharray={circumference}
                    strokeDashoffset={circumference * (1 - overallScore / 100)}
                    strokeLinecap="round"
                    className="transition-all duration-700"
                  />
                  <defs>
                    <linearGradient id="scoreGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                      <stop offset="0%" stopColor="#FBBF24" />
                      <stop offset="50%" stopColor="#F59E0B" />
                      <stop offset="100%" stopColor="#EF4444" />
                    </linearGradient>
                  </defs>
                </svg>
                <div className="absolute inset-0 flex flex-col items-center justify-center">
                  <span className="text-4xl font-black">{overallScore}</span>
                  <span className="text-sm opacity-80">điểm</span>
                </div>
              </div>
            </div>
            <div className="flex justify-center items-center space-x-2 mb-2">
              <span className="text-3xl">⭐⭐⭐⭐</span>
            </div>
            <p className="text-xl font-semibold text-yellow-200">
              Cây trồng phát triển tốt
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-center">
            <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4">
              <div className="text-3xl mb-2">🌡️</div>
              <div className="text-2xl font-bold text-green-300">6/6</div>
              <div className="text-sm opacity-80">Chỉ số nhiệt độ</div>
            </div>
            <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4">
              <div className="text-3xl mb-2">💧</div>
              <div className="text-2xl font-bold text-blue-300">2/2</div>
              <div className="text-sm opacity-80">Chỉ số độ ẩm</div>
            </div>
            <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4">
              <div className="text-3xl mb-2">🌾</div>
              <div className="text-2xl font-bold text-yellow-300">3/3</div>
              <div className="text-sm opacity-80">Chỉ số dinh dưỡng</div>
            </div>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-3xl shadow-xl p-8 border border-gray-100 space-y-6">
        <div className="text-center">
          <h2 className="text-3xl font-extrabold text-emerald-700">Giai đoạn phát triển hiện tại</h2>
          <p className="text-slate-600">Tháng {currentMonth} • {currentStage.season}</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-5 gap-4">
          {stages.map((stage) => {
            const isActive = stage.id === currentStage.id;
            return (
              <div
                key={stage.id}
                className={`rounded-2xl border p-4 transition-all ${
                  isActive
                    ? 'border-emerald-400 bg-emerald-50 shadow-lg'
                    : 'border-slate-200 bg-slate-50'
                }`}
              >
                <p className={`text-sm font-semibold ${isActive ? 'text-emerald-700' : 'text-slate-500'}`}>
                  {stage.season}
                </p>
                <h3 className={`text-base font-bold ${isActive ? 'text-emerald-900' : 'text-slate-800'}`}>
                  {stage.name}
                </h3>
                <p className="text-sm text-slate-600">Tháng {stage.startMonth} - {stage.endMonth}</p>
                <p className="text-xs text-slate-500 mt-2">{stage.focus}</p>
              </div>
            );
          })}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="rounded-2xl border border-slate-200 bg-slate-50 p-5 space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-xl font-bold text-slate-800">Thông số ẩn</h3>
              <button
                type="button"
                onClick={() => setShowHidden((prev) => !prev)}
                className="rounded-full bg-white px-4 py-2 text-sm font-semibold text-slate-700 shadow hover:bg-slate-100"
              >
                {showHidden ? 'Ẩn thông số' : 'Hiện thông số'}
              </button>
            </div>
            <p className="text-sm text-slate-600">Bấm để xem đầy đủ toàn bộ chỉ số chuẩn.</p>

            {showHidden && (
              <div className="space-y-3">
                {standards.map((standard) => (
                  <div
                    key={standard.label}
                    className="flex items-center justify-between rounded-xl bg-white px-4 py-3 border border-slate-200"
                  >
                    <div>
                      <p className="font-semibold text-slate-800">{standard.label}</p>
                      <p className="text-xs text-slate-500">Chuẩn: {standard.standard}</p>
                    </div>
                    <div className="text-right">
                      <p className="font-bold text-slate-800">
                        {standard.current} {standard.unit}
                      </p>
                      <p className={`text-xs font-semibold ${standard.status === 'good' ? 'text-emerald-600' : 'text-orange-600'}`}>
                        {standard.status === 'good' ? 'Đạt chuẩn' : 'Cần cải thiện'}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          <div className="rounded-2xl border border-blue-200 bg-gradient-to-br from-blue-50 via-cyan-50 to-sky-50 p-5 space-y-4">
            <h3 className="text-xl font-bold text-blue-800">Dự báo theo chuẩn</h3>
            <p className="text-sm text-slate-700">
              {currentStage.name} (tháng {currentStage.startMonth}-{currentStage.endMonth})
            </p>
            <p className="text-slate-700">{currentStage.forecast}</p>
            <div className="rounded-xl bg-white p-4 border border-blue-100 text-sm text-blue-700 font-semibold">
              {forecastComment}
            </div>
          </div>

          <div className="rounded-2xl border border-emerald-200 bg-gradient-to-br from-emerald-50 via-teal-50 to-cyan-50 p-5 space-y-4">
            <h3 className="text-xl font-bold text-emerald-800">Gợi ý hành động AI</h3>
            <p className="text-sm text-slate-700">Đề xuất hành động cụ thể cho nông dân.</p>
            <ul className="space-y-3 text-slate-700">
              {currentStage.aiActions.map((action) => (
                <li key={action} className="flex gap-2">
                  <span className="text-emerald-600">✅</span>
                  <span>{action}</span>
                </li>
              ))}
              {warningItems.length > 0 && (
                <li className="flex gap-2">
                  <span className="text-orange-500">⚠️</span>
                  <span>Ưu tiên xử lý: {warningItems.map((item) => item.label).join(', ')}.</span>
                </li>
              )}
            </ul>
          </div>
        </div>
      </div>

    </div>
  );
}
