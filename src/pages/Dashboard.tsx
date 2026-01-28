import { useAppStore } from '../store/appStore';
import { useSensorData } from '../hooks/useSensorData';
import SensorRealtimeDemo from '../components/SensorRealtimeDemo';
// import useSyncSensorData from '../hooks/useSyncSensorData';
import GaugeCard from '../components/GaugeCard';
import AssessmentCard from '../components/AssessmentCard';
import CultivationCalendar from '../components/CultivationCalendar';
import Clock from '../components/Clock';

export default function Dashboard() {
  // useSyncSensorData(); // Không cần nữa nếu dùng Firebase real-time
  const { activeTab, setActiveTab } = useAppStore();
  const { data: sensorData, loading, error } = useSensorData();

  const getStatus = (value: number, min: number, max: number): 'good' | 'warning' | 'danger' => {
    if (value < min || value > max) return 'danger';
    if (value < min * 1.1 || value > max * 0.9) return 'warning';
    return 'good';
  };

  const getPercentage = (value: number, min: number, max: number): number => {
    return Math.min(100, Math.max(0, ((value - min) / (max - min)) * 100));
  };


  if (loading) return <div>Đang tải dữ liệu cảm biến...</div>;
  if (error) return <div className="text-red-600">Lỗi: {error}</div>;
  if (!sensorData) return <div>Không có dữ liệu cảm biến.</div>;

  // Lấy bản ghi mới nhất dựa trên timestamp (gateway_timestamp hoặc node_timestamp)
  let latestData = {};
  if (sensorData && typeof sensorData === 'object') {
    const records = Object.values(sensorData);
    latestData = records.reduce((latest, curr) => {
      const latestTime = new Date(latest?.gateway_timestamp || latest?.node_timestamp || 0).getTime();
      const currTime = new Date(curr?.gateway_timestamp || curr?.node_timestamp || 0).getTime();
      return currTime > latestTime ? curr : latest;
    }, records[0] || {});
  }

  return (
    <div className="space-y-8">
      {/* <SensorRealtimeDemo /> */}
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

      {activeTab === 'air' && latestData && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-6 justify-items-center">
          <GaugeCard
            title="Nhiệt độ"
            value={latestData.SW_T !== undefined && latestData.SW_T !== null ? Number(latestData.SW_T.toFixed(1)) : 0}
            unit="°C"
            status={getStatus(Number(latestData.SW_T ?? 0), 18, 25)}
            percentage={getPercentage(Number(latestData.SW_T ?? 0), 10, 40)}
          />
          <GaugeCard
            title="Độ ẩm"
            value={latestData.SW_RH !== undefined && latestData.SW_RH !== null ? Number(latestData.SW_RH.toFixed(1)) : 0}
            unit="%"
            status={getStatus(Number(latestData.SW_RH ?? 0), 60, 80)}
            percentage={getPercentage(Number(latestData.SW_RH ?? 0), 30, 95)}
          />
        </div>
      )}

      {activeTab === 'soil' && latestData && (
        <>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 justify-items-center xl:justify-items-center mb-4">
            <GaugeCard
              title="Nhiệt độ đất"
              value={latestData.T !== undefined && latestData.T !== null ? Number(latestData.T.toFixed(1)) : 0}
              unit="°C"
              status={getStatus(Number(latestData.T ?? 0), 20, 28)}
              percentage={getPercentage(Number(latestData.T ?? 0), 15, 35)}
            />
            <GaugeCard
              title="Độ ẩm đất"
              value={latestData.RH !== undefined && latestData.RH !== null ? Number(latestData.RH.toFixed(1)) : 0}
              unit="%"
              status={getStatus(Number(latestData.RH ?? 0), 60, 80)}
              percentage={getPercentage(Number(latestData.RH ?? 0), 20, 90)}
            />
            <GaugeCard
              title="pH đất"
              value={latestData.pH !== undefined && latestData.pH !== null ? Number(latestData.pH.toFixed(1)) : 0}
              unit="pH"
              status={getStatus(Number(latestData.pH ?? 0), 5.5, 6.5)}
              percentage={getPercentage(Number(latestData.pH ?? 0), 4.0, 8.0)}
            />
            <GaugeCard
              title="Độ dẫn điện (EC)"
              value={latestData.EC !== undefined && latestData.EC !== null ? Number(latestData.EC.toFixed(2)) : 0}
              unit="mS/cm"
              status={getStatus(Number(latestData.EC ?? 0), 1.0, 2.0)}
              percentage={getPercentage(Number(latestData.EC ?? 0), 0.2, 4.0)}
            />
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-3 gap-6 justify-items-center xl:justify-items-center">
            <GaugeCard
              title="Nitơ (N)"
              value={latestData.N !== undefined && latestData.N !== null ? Number(latestData.N.toFixed(1)) : 0}
              unit="ppm"
              status={getStatus(Number(latestData.N ?? 0), 30, 60)}
              percentage={getPercentage(Number(latestData.N ?? 0), 10, 100)}
            />
            <GaugeCard
              title="Phốt pho (P)"
              value={latestData.P !== undefined && latestData.P !== null ? Number(latestData.P.toFixed(1)) : 0}
              unit="ppm"
              status={getStatus(Number(latestData.P ?? 0), 15, 35)}
              percentage={getPercentage(Number(latestData.P ?? 0), 5, 50)}
            />
            <GaugeCard
              title="Kali (K)"
              value={latestData.K !== undefined && latestData.K !== null ? Number(latestData.K.toFixed(1)) : 0}
              unit="ppm"
              status={getStatus(Number(latestData.K ?? 0), 20, 40)}
              percentage={getPercentage(Number(latestData.K ?? 0), 10, 60)}
            />
          </div>
        </>
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

