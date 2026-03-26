import { Globe2, TrendingUp, PhoneCall, Store, Users } from 'lucide-react';
import { useEffect, useMemo, useState } from 'react';
import {
  getCoffeePrices,
  getHcmCoffeeExporters,
  getWestHighlandsWeather,
  type CoffeePriceItem,
  type ExporterItem,
  type HighlandsWeatherItem,
} from '../services/api';

const PRICE_REFRESH_INTERVAL_MS = 15_000;
const WEATHER_REFRESH_INTERVAL_MS = 15_000;
const EXPORTER_REFRESH_INTERVAL_MS = 15 * 60 * 1000;

const fallbackWestHighlandsWeather: HighlandsWeatherItem[] = [
  {
    province: 'Lâm Đồng',
    slug: 'lam-dong',
    url: 'https://thoitiet.vn/lam-dong',
    currentTemp: '--',
    condition: 'Đang cập nhật...',
    feelsLike: '',
    lowHigh: '--/--',
    humidity: '--',
    wind: '--',
  },
  {
    province: 'Đắk Lắk',
    slug: 'dak-lak',
    url: 'https://thoitiet.vn/dak-lak',
    currentTemp: '--',
    condition: 'Đang cập nhật...',
    feelsLike: '',
    lowHigh: '--/--',
    humidity: '--',
    wind: '--',
  },
  {
    province: 'Gia Lai',
    slug: 'gia-lai',
    url: 'https://thoitiet.vn/gia-lai',
    currentTemp: '--',
    condition: 'Đang cập nhật...',
    feelsLike: '',
    lowHigh: '--/--',
    humidity: '--',
    wind: '--',
  },
];

const fallbackCoffeePrices: CoffeePriceItem[] = [
  { market: 'Việt Nam (Robusta)', price: '124.500', unit: 'VNĐ/kg', trend: '+1.2%' },
  { market: 'London (Robusta)', price: '3,180', unit: 'USD/tấn', trend: '+0.6%' },
  { market: 'New York (Arabica)', price: '215.4', unit: 'US cent/lb', trend: '-0.4%' },
];

const fallbackExporters: ExporterItem[] = [];

const supplies = [
  {
    name: 'Phân hữu cơ vi sinh',
    price: 'Liên hệ báo giá',
    supplier: 'Nông nghiệp Xanh',
  },
  {
    name: 'NPK 16-16-8',
    price: 'Liên hệ báo giá',
    supplier: 'AgriPlus',
  },
  {
    name: 'Hệ thống tưới nhỏ giọt',
    price: 'Liên hệ báo giá',
    supplier: 'Irritech',
  },
];

const experts = [
  {
    name: 'TS. Nguyễn Văn Minh',
    field: 'Sinh lý cây cà phê',
    contact: 'minh.agri@bkfarmers.vn',
  },
  {
    name: 'KS. Lê Thu Trang',
    field: 'Dinh dưỡng & đất',
    contact: 'trang.soil@bkfarmers.vn',
  },
  {
    name: 'Chuyên gia Phạm Quang Huy',
    field: 'Thị trường xuất khẩu',
    contact: 'huy.export@bkfarmers.vn',
  },
];

function normalizeNumber(value: string) {
  const cleaned = value.replace(/,/g, '').trim();
  const n = Number(cleaned);
  return Number.isFinite(n) ? n : null;
}

function formatDisplayPrice(item: CoffeePriceItem) {
  const n = normalizeNumber(item.price);
  if (n === null) return item.price;

  if (item.unit === 'VNĐ/kg') {
    return n.toLocaleString('vi-VN');
  }

  if (item.unit === 'USD/tấn') {
    return n.toLocaleString('en-US');
  }

  if (item.unit === 'US cent/lb') {
    return n.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
  }

  return item.price;
}

export default function Market() {
  const [weatherByProvince, setWeatherByProvince] = useState<HighlandsWeatherItem[]>(fallbackWestHighlandsWeather);
  const [weatherFetchedAt, setWeatherFetchedAt] = useState<string>('');
  const [weatherError, setWeatherError] = useState<string>('');
  const [isRefreshingWeather, setIsRefreshingWeather] = useState(false);
  const [nextWeatherRefreshInSec, setNextWeatherRefreshInSec] = useState(
    Math.floor(WEATHER_REFRESH_INTERVAL_MS / 1000)
  );

  const [coffeePrices, setCoffeePrices] = useState<CoffeePriceItem[]>(fallbackCoffeePrices);
  const [priceError, setPriceError] = useState<string>('');
  const [priceUpdatedAt, setPriceUpdatedAt] = useState<string>('');
  const [priceSource, setPriceSource] = useState<string>('');
  const [isRefreshingPrice, setIsRefreshingPrice] = useState(false);
  const [nextRefreshInSec, setNextRefreshInSec] = useState(Math.floor(PRICE_REFRESH_INTERVAL_MS / 1000));

  const [exporters, setExporters] = useState<ExporterItem[]>(fallbackExporters);
  const [exporterFetchedAt, setExporterFetchedAt] = useState<string>('');
  const [exporterError, setExporterError] = useState<string>('');
  const [isRefreshingExporter, setIsRefreshingExporter] = useState(false);
  const [nextExporterRefreshInSec, setNextExporterRefreshInSec] = useState(
    Math.floor(EXPORTER_REFRESH_INTERVAL_MS / 1000)
  );

  useEffect(() => {
    let mounted = true;
    const refreshIntervalSec = Math.floor(PRICE_REFRESH_INTERVAL_MS / 1000);
    let isFetching = false;

    const loadPrices = async (showRefreshingState: boolean) => {
      if (isFetching) return;
      isFetching = true;

      if (showRefreshingState && mounted) {
        setIsRefreshingPrice(true);
      }

      try {
        const data = await getCoffeePrices();
        if (!mounted) return;

        if (Array.isArray(data.prices) && data.prices.length > 0) {
          setCoffeePrices(data.prices);
          setPriceError('');
          setPriceUpdatedAt(data.updatedAt || '');
          setPriceSource(data.source || '');
          setNextRefreshInSec(refreshIntervalSec);
        }
      } catch (err) {
        if (!mounted) return;
        const msg = err instanceof Error ? err.message : 'Không thể cập nhật giá mới, đang hiển thị dữ liệu dự phòng.';
        setPriceError(msg);
      } finally {
        isFetching = false;
        if (mounted) {
          setIsRefreshingPrice(false);
        }
      }
    };

    void loadPrices(false);

    const poller = window.setInterval(() => {
      void loadPrices(true);
    }, PRICE_REFRESH_INTERVAL_MS);

    const countdown = window.setInterval(() => {
      setNextRefreshInSec((prev) => (prev <= 1 ? refreshIntervalSec : prev - 1));
    }, 1000);

    const refreshOnFocus = () => {
      if (document.visibilityState === 'visible') {
        void loadPrices(true);
      }
    };

    document.addEventListener('visibilitychange', refreshOnFocus);
    window.addEventListener('focus', refreshOnFocus);

    return () => {
      mounted = false;
      window.clearInterval(poller);
      window.clearInterval(countdown);
      document.removeEventListener('visibilitychange', refreshOnFocus);
      window.removeEventListener('focus', refreshOnFocus);
    };
  }, []);

  useEffect(() => {
    let mounted = true;
    let isFetching = false;
    const refreshIntervalSec = Math.floor(EXPORTER_REFRESH_INTERVAL_MS / 1000);

    const loadExporters = async (showRefreshingState: boolean) => {
      if (isFetching) return;
      isFetching = true;

      if (showRefreshingState && mounted) {
        setIsRefreshingExporter(true);
      }

      try {
        const data = await getHcmCoffeeExporters();
        if (!mounted) return;

        if (Array.isArray(data.exporters) && data.exporters.length > 0) {
          setExporters(data.exporters);
          setExporterFetchedAt(data.fetchedAt || '');
          setExporterError('');
          setNextExporterRefreshInSec(refreshIntervalSec);
        }
      } catch (err) {
        if (!mounted) return;
        const msg =
          err instanceof Error
            ? err.message
            : 'Không thể cập nhật danh sách nhà xuất khẩu từ Trang Vàng.';
        setExporterError(msg);
      } finally {
        isFetching = false;
        if (mounted) {
          setIsRefreshingExporter(false);
        }
      }
    };

    void loadExporters(false);

    const poller = window.setInterval(() => {
      void loadExporters(true);
    }, EXPORTER_REFRESH_INTERVAL_MS);

    const countdown = window.setInterval(() => {
      setNextExporterRefreshInSec((prev) => (prev <= 1 ? refreshIntervalSec : prev - 1));
    }, 1000);

    const refreshOnFocus = () => {
      if (document.visibilityState === 'visible') {
        void loadExporters(true);
      }
    };

    document.addEventListener('visibilitychange', refreshOnFocus);
    window.addEventListener('focus', refreshOnFocus);

    return () => {
      mounted = false;
      window.clearInterval(poller);
      window.clearInterval(countdown);
      document.removeEventListener('visibilitychange', refreshOnFocus);
      window.removeEventListener('focus', refreshOnFocus);
    };
  }, []);

  useEffect(() => {
    let mounted = true;
    let isFetching = false;
    const refreshIntervalSec = Math.floor(WEATHER_REFRESH_INTERVAL_MS / 1000);

    const loadWestHighlandsWeather = async (showRefreshingState: boolean) => {
      if (isFetching) return;
      isFetching = true;

      if (showRefreshingState && mounted) {
        setIsRefreshingWeather(true);
      }

      try {
        const data = await getWestHighlandsWeather();
        if (!mounted) return;

        if (Array.isArray(data.provinces) && data.provinces.length > 0) {
          setWeatherByProvince(data.provinces);
          setWeatherFetchedAt(data.fetchedAt || '');
          setWeatherError('');
          setNextWeatherRefreshInSec(refreshIntervalSec);
        }
      } catch (err) {
        if (!mounted) return;
        const msg =
          err instanceof Error
            ? err.message
            : 'Không thể cập nhật thời tiết Tây Nguyên, đang hiển thị dữ liệu dự phòng.';
        setWeatherError(msg);
      } finally {
        isFetching = false;
        if (mounted) {
          setIsRefreshingWeather(false);
        }
      }
    };

    void loadWestHighlandsWeather(false);

    const poller = window.setInterval(() => {
      void loadWestHighlandsWeather(true);
    }, WEATHER_REFRESH_INTERVAL_MS);

    const countdown = window.setInterval(() => {
      setNextWeatherRefreshInSec((prev) => (prev <= 1 ? refreshIntervalSec : prev - 1));
    }, 1000);

    const refreshOnFocus = () => {
      if (document.visibilityState === 'visible') {
        void loadWestHighlandsWeather(true);
      }
    };

    document.addEventListener('visibilitychange', refreshOnFocus);
    window.addEventListener('focus', refreshOnFocus);

    return () => {
      mounted = false;
      window.clearInterval(poller);
      window.clearInterval(countdown);
      document.removeEventListener('visibilitychange', refreshOnFocus);
      window.removeEventListener('focus', refreshOnFocus);
    };
  }, []);

  const updatedText = useMemo(() => {
    if (!priceUpdatedAt) return '';
    const date = new Date(priceUpdatedAt);
    if (Number.isNaN(date.getTime())) return '';
    return date.toLocaleString('vi-VN');
  }, [priceUpdatedAt]);

  const weatherUpdatedText = useMemo(() => {
    if (!weatherFetchedAt) return '';
    const date = new Date(weatherFetchedAt);
    if (Number.isNaN(date.getTime())) return '';
    return date.toLocaleString('vi-VN');
  }, [weatherFetchedAt]);

  const exporterUpdatedText = useMemo(() => {
    if (!exporterFetchedAt) return '';
    const date = new Date(exporterFetchedAt);
    if (Number.isNaN(date.getTime())) return '';
    return date.toLocaleString('vi-VN');
  }, [exporterFetchedAt]);

  return (
    <div className="space-y-8">
      <div className="text-center mb-6">
        <h1 className="text-5xl font-black bg-gradient-to-r from-emerald-600 to-teal-600 bg-clip-text text-transparent mb-2">
          Thị trường
        </h1>
        <p className="text-slate-600">
          Tin tức, giá cà phê, đối tác xuất khẩu và kết nối chuyên gia tại khu vực canh tác.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white rounded-3xl shadow-xl p-6 border border-gray-100">
          <div className="flex items-center mb-4">
            <Globe2 className="w-6 h-6 text-blue-600 mr-3" />
            <h2 className="text-2xl font-bold text-slate-800">Thời tiết Tây Nguyên</h2>
          </div>
          <div className="mb-3 space-y-1">
            <p className="text-xs text-slate-500">
              Dữ liệu thật từ thoitiet.vn - tự cập nhật mỗi {Math.floor(WEATHER_REFRESH_INTERVAL_MS / 1000)} giây
              {isRefreshingWeather ? ' - đang làm mới...' : ` - còn ${nextWeatherRefreshInSec}s`}
            </p>
            {weatherUpdatedText && <p className="text-xs text-slate-500">Cập nhật: {weatherUpdatedText}</p>}
            {weatherError && <p className="text-xs text-amber-600">{weatherError}</p>}
          </div>
          <div className="space-y-4">
            {weatherByProvince.map((item) => (
              <a
                key={item.slug}
                href={item.url}
                target="_blank"
                rel="noopener noreferrer"
                className="rounded-2xl border border-slate-200 p-4 hover:shadow-md transition block cursor-pointer hover:border-blue-300"
              >
                <div className="flex justify-between items-start mb-3">
                  <span className="text-sm font-semibold uppercase text-blue-700 tracking-wide">{item.province}</span>
                  <div className="text-right">
                    <p className="text-xs text-slate-400">Nhiệt độ hiện tại</p>
                    <p className="text-xl font-bold text-slate-800">{item.currentTemp}</p>
                  </div>
                </div>
                <p className="text-sm font-medium text-slate-700 mb-3">{item.condition}</p>
                <div className="grid grid-cols-3 gap-2 text-sm">
                  <div className="rounded-lg bg-slate-50 px-3 py-2 border border-slate-100">
                    <p className="text-[11px] uppercase tracking-wide text-slate-500">Thấp/Cao</p>
                    <p className="font-semibold text-slate-800">{item.lowHigh || '--'}</p>
                  </div>
                  <div className="rounded-lg bg-slate-50 px-3 py-2 border border-slate-100">
                    <p className="text-[11px] uppercase tracking-wide text-slate-500">Độ ẩm</p>
                    <p className="font-semibold text-slate-800">{item.humidity || '--'}</p>
                  </div>
                  <div className="rounded-lg bg-slate-50 px-3 py-2 border border-slate-100">
                    <p className="text-[11px] uppercase tracking-wide text-slate-500">Gió</p>
                    <p className="font-semibold text-slate-800">{item.wind || '--'}</p>
                  </div>
                </div>
              </a>
            ))}
          </div>
        </div>

        <div className="bg-white rounded-3xl shadow-xl p-6 border border-gray-100">
          <div className="flex items-center mb-4">
            <TrendingUp className="w-6 h-6 text-emerald-600 mr-3" />
            <h2 className="text-2xl font-bold text-slate-800">Bảng giá cà phê</h2>
          </div>
          <div className="mb-3 space-y-1">
              <p className="text-xs text-slate-500">
                Tự cập nhật mỗi {Math.floor(PRICE_REFRESH_INTERVAL_MS / 1000)} giây
                {isRefreshingPrice ? ' - đang làm mới...' : ` - còn ${nextRefreshInSec}s`}
              </p>
              {updatedText && (
                <p className="text-xs text-slate-500">Cập nhật: {updatedText}</p>
              )}
              {priceSource && (
                <p className="text-xs text-slate-500">Nguồn: {priceSource}</p>
              )}
              {priceError && (
                <p className="text-xs text-amber-600">{priceError}</p>
              )}
          </div>
          <div className="space-y-4">
            {coffeePrices.map((item) => (
              <div key={item.market} className="flex items-center justify-between rounded-2xl border border-slate-200 p-4">
                <div>
                  <p className="font-semibold text-slate-800">{item.market}</p>
                  <p className="text-sm text-slate-500">{item.unit}</p>
                </div>
                <div className="text-right">
                  <p className="text-lg font-bold text-emerald-700">{formatDisplayPrice(item)}</p>
                  <p className={`text-sm font-semibold ${item.trend.startsWith('-') ? 'text-rose-500' : 'text-emerald-600'}`}>
                    {item.trend}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white rounded-3xl shadow-xl p-6 border border-gray-100">
          <div className="flex items-center mb-4">
            <PhoneCall className="w-6 h-6 text-orange-600 mr-3" />
            <h2 className="text-2xl font-bold text-slate-800">Nhà xuất khẩu (Trang Vàng)</h2>
          </div>
          <div className="mb-3 space-y-1">
            <p className="text-xs text-slate-500">
              Nguồn: Trang Vàng Việt Nam - làm mới mỗi {Math.floor(EXPORTER_REFRESH_INTERVAL_MS / 1000)} giây
              {isRefreshingExporter ? ' - đang làm mới...' : ` - còn ${nextExporterRefreshInSec}s`}
            </p>
            {exporterUpdatedText && <p className="text-xs text-slate-500">Cập nhật: {exporterUpdatedText}</p>}
            {exporterError && <p className="text-xs text-amber-600">{exporterError}</p>}
          </div>
          <div className="space-y-4">
            {exporters.map((exporter) => (
              <a
                key={exporter.detailUrl}
                href={exporter.detailUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="rounded-2xl border border-slate-200 p-4 block hover:shadow-md transition hover:border-orange-300"
              >
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="text-lg font-bold text-slate-800">{exporter.name}</h3>
                    <p className="text-sm text-slate-500">{exporter.address}</p>
                  </div>
                  <span className="text-xs text-orange-600 font-semibold">Xem chi tiết</span>
                </div>
                <p className="mt-2 text-sm text-slate-600">Liên hệ: {exporter.phone || 'Đang cập nhật'}</p>
              </a>
            ))}
            {!exporters.length && !exporterError && (
              <p className="text-sm text-slate-500">Đang tải danh sách nhà xuất khẩu từ Trang Vàng...</p>
            )}
          </div>
        </div>

        <div className="bg-white rounded-3xl shadow-xl p-6 border border-gray-100">
          <div className="flex items-center mb-4">
            <Store className="w-6 h-6 text-purple-600 mr-3" />
            <h2 className="text-2xl font-bold text-slate-800">Mua bán vật tư nông nghiệp</h2>
          </div>
          <p className="text-xs text-slate-500 mb-3">Giá vật tư thay đổi theo khu vực và nhà cung cấp, vui lòng liên hệ để nhận báo giá thực tế.</p>
          <div className="space-y-4">
            {supplies.map((item) => (
              <div key={item.name} className="rounded-2xl border border-slate-200 p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="text-lg font-bold text-slate-800">{item.name}</h3>
                    <p className="text-sm text-slate-500">Nhà cung cấp: {item.supplier}</p>
                  </div>
                  <span className="text-sm font-semibold text-slate-700">{item.price}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="bg-gradient-to-br from-emerald-50 via-teal-50 to-cyan-50 rounded-3xl p-6 border border-emerald-200 shadow-lg">
        <div className="flex items-center mb-4">
          <Users className="w-6 h-6 text-emerald-700 mr-3" />
          <h2 className="text-2xl font-bold text-slate-800">Kết nối chuyên gia</h2>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {experts.map((expert) => (
            <div key={expert.name} className="rounded-2xl bg-white p-4 border border-slate-200">
              <h3 className="text-lg font-bold text-slate-800">{expert.name}</h3>
              <p className="text-sm text-slate-500">{expert.field}</p>
              <p className="text-sm text-emerald-600 mt-2">{expert.contact}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
