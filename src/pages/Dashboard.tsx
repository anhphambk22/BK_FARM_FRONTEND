import { useAppStore } from '../store/appStore';
import GaugeCard from '../components/GaugeCard';
import AssessmentCard from '../components/AssessmentCard';
import CultivationCalendar from '../components/CultivationCalendar';
import Clock from '../components/Clock';

export default function Dashboard() {
  const { activeTab, setActiveTab, sensorData } = useAppStore();

  const getStatus = (value: number, min: number, max: number): 'good' | 'warning' | 'danger' => {
    if (value < min || value > max) return 'danger';
    if (value < min * 1.1 || value > max * 0.9) return 'warning';
    return 'good';
  };

  const getPercentage = (value: number, min: number, max: number): number => {
    return Math.min(100, Math.max(0, ((value - min) / (max - min)) * 100));
  };

  return (
    <div className="space-y-8">
      {/* Lịch canh tác dạng calendar */}
      <CultivationCalendar />
      <div className="mb-8">
        <div className="flex flex-col items-center gap-2 mb-2">
          <h1 className="text-4xl font-bold text-slate-800 text-center">
            Thông số cây trồng
          </h1>
        </div>
        <p className="text-slate-600 text-center">Giám sát thông minh cho nông nghiệp hiện đại</p>
        <div className="mt-2 flex justify-center">
          <Clock />
        </div>

        <div className="flex justify-center">
          <div className="bg-white rounded-full p-1 shadow-md">
            <button
              onClick={() => setActiveTab('air')}
              className={`px-8 py-3 rounded-full font-medium transition-all
                ${activeTab === 'air'
                  ? 'bg-green-800 text-white shadow-lg'
                  : 'text-slate-600 hover:bg-slate-100'
                }`}
            >
              Không khí
            </button>
            <button
              onClick={() => setActiveTab('soil')}
              className={`px-8 py-3 rounded-full font-medium transition-all
                ${activeTab === 'soil'
                  ? 'bg-green-800 text-white shadow-lg'
                  : 'text-slate-600 hover:bg-slate-100'
                }`}
            >
              Đất
            </button>
          </div>
        </div>
      </div>

      {activeTab === 'air' && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 justify-items-center">
          <GaugeCard
            title="Nhiệt độ"
            value={Number(sensorData.airTemperature.toFixed(1))}
            unit="°C"
            status={getStatus(sensorData.airTemperature, 18, 25)}
            percentage={getPercentage(sensorData.airTemperature, 10, 40)}
          />
          <GaugeCard
            title="Độ ẩm"
            value={Number(sensorData.airHumidity.toFixed(1))}
            unit="%"
            status={getStatus(sensorData.airHumidity, 60, 80)}
            percentage={getPercentage(sensorData.airHumidity, 30, 95)}
          />
          <GaugeCard
            title="Ánh sáng"
            value={Number(sensorData.light.toFixed(1))}
            unit="lux"
            status={getStatus(sensorData.light, 500, 1000)}
            percentage={getPercentage(sensorData.light, 200, 2000)}
          />
        </div>
      )}

      {activeTab === 'soil' && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 justify-items-center xl:justify-items-center">
          <GaugeCard
            title="Nhiệt độ đất"
            value={Number(sensorData.soilTemperature.toFixed(1))}
            unit="°C"
            status={getStatus(sensorData.soilTemperature, 20, 28)}
            percentage={getPercentage(sensorData.soilTemperature, 15, 35)}
          />
          <GaugeCard
            title="Độ ẩm đất"
            value={Number(sensorData.soilMoisture.toFixed(1))}
            unit="%"
            status={getStatus(sensorData.soilMoisture, 60, 80)}
            percentage={getPercentage(sensorData.soilMoisture, 20, 90)}
          />
          <GaugeCard
            title="pH đất"
            value={Number(sensorData.soilPH.toFixed(1))}
            unit="pH"
            status={getStatus(sensorData.soilPH, 5.5, 6.5)}
            percentage={getPercentage(sensorData.soilPH, 4.0, 8.0)}
          />
          <GaugeCard
            title="Độ dẫn điện (EC)"
            value={Number(sensorData.soilEC.toFixed(2))}
            unit="mS/cm"
            status={getStatus(sensorData.soilEC, 1.0, 2.0)}
            percentage={getPercentage(sensorData.soilEC, 0.2, 4.0)}
          />
          <GaugeCard
            title="Nitơ (N)"
            value={Number(sensorData.nitrogen.toFixed(1))}
            unit="ppm"
            status={getStatus(sensorData.nitrogen, 30, 60)}
            percentage={getPercentage(sensorData.nitrogen, 10, 100)}
          />
          <GaugeCard
            title="Phốt pho (P)"
            value={Number(sensorData.phosphorus.toFixed(1))}
            unit="ppm"
            status={getStatus(sensorData.phosphorus, 15, 35)}
            percentage={getPercentage(sensorData.phosphorus, 5, 50)}
          />
          <GaugeCard
            title="Kali (K)"
            value={Number(sensorData.potassium.toFixed(1))}
            unit="ppm"
            status={getStatus(sensorData.potassium, 20, 40)}
            percentage={getPercentage(sensorData.potassium, 10, 60)}
          />
        </div>
      )}

      <AssessmentCard />

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="relative overflow-hidden rounded-3xl border border-orange-200 bg-gradient-to-br from-orange-50 via-amber-50 to-yellow-50 p-6 shadow-xl">
          <div className="absolute -top-8 -right-8 h-28 w-28 rounded-full bg-orange-200/40 blur-2xl" />
          <h3 className="text-2xl font-black text-orange-800 mb-3">
            Cảnh báo sớm
          </h3>
          <p className="text-slate-700 leading-relaxed">
            Trong 10 ngày tới, khu vực Tây Nguyên dự báo nắng nóng kéo dài,
            độ ẩm đất giảm dưới 60%. Nguy cơ ảnh hưởng đến quá trình phân hóa
            mầm hoa cà phê Robusta.
          </p>
          <div className="mt-4 inline-flex items-center rounded-full bg-orange-100 px-4 py-2 text-sm font-semibold text-orange-700">
            Ưu tiên theo dõi độ ẩm và nhiệt độ đất
          </div>
        </div>

        <div className="relative overflow-hidden rounded-3xl border border-emerald-200 bg-gradient-to-br from-emerald-50 via-teal-50 to-cyan-50 p-6 shadow-xl">
          <div className="absolute -bottom-8 -left-8 h-28 w-28 rounded-full bg-emerald-200/40 blur-2xl" />
          <h3 className="text-2xl font-black text-emerald-800 mb-3">
            Khuyến nghị hành động
          </h3>
          <ul className="space-y-3 text-slate-700">
            <li className="flex gap-3">
              <span className="text-emerald-600">✅</span>
              Chủ động tưới nước theo chu kỳ ngắn để giữ ẩm ổn định.
            </li>
            <li className="flex gap-3">
              <span className="text-emerald-600">✅</span>
              Phủ gốc bằng rơm hoặc vỏ cà phê để hạn chế bốc hơi.
            </li>
            <li className="flex gap-3">
              <span className="text-emerald-600">✅</span>
              Kiểm tra EC đất sau mỗi đợt tưới để cân đối dinh dưỡng.
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
}
