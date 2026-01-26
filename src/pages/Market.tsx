import { Globe2, TrendingUp, PhoneCall, Store, Users } from 'lucide-react';

const weatherMarketNews = [
  {
    title: 'Thời tiết Tây Nguyên: mưa lớn kéo dài',
    tag: 'Thời tiết',
    summary: 'Dự báo 7 ngày tới lượng mưa cao, độ ẩm không khí lên 85–90%.',
    time: 'Cập nhật 2 giờ trước',
    href: undefined as string | undefined,
  },
  {
    title: 'Giá cà phê nội địa tăng nhẹ',
    tag: 'Thị trường',
    summary: 'Giá thu mua tại Đắk Lắk tăng khoảng 1.200đ/kg.',
    time: 'Cập nhật 5 giờ trước',
    href: 'https://giacaphe.com/',
  },
  {
    title: 'Chính sách mới về hỗ trợ nông hộ',
    tag: 'Chính sách',
    summary: 'Tăng hỗ trợ lãi suất cho hộ canh tác cà phê.',
    time: 'Cập nhật 1 ngày trước',
    href: undefined as string | undefined,
  },
];

const coffeePrices = [
  { market: 'Việt Nam (Robusta)', price: '124.500', unit: 'VNĐ/kg', trend: '+1.2%' },
  { market: 'London (Robusta)', price: '3,180', unit: 'USD/tấn', trend: '+0.6%' },
  { market: 'New York (Arabica)', price: '215.4', unit: 'US cent/lb', trend: '-0.4%' },
];

const exporters = [
  {
    name: 'Công ty Xuất khẩu Tây Nguyên',
    contact: '0909 888 666',
    price: '123.800 VNĐ/kg',
    address: 'Đắk Lắk',
  },
  {
    name: 'Green Coffee VN',
    contact: '028 3899 7788',
    price: '124.200 VNĐ/kg',
    address: 'Gia Lai',
  },
  {
    name: 'Highland Export',
    contact: '0912 345 678',
    price: '123.500 VNĐ/kg',
    address: 'Lâm Đồng',
  },
];

const supplies = [
  {
    name: 'Phân hữu cơ vi sinh',
    price: '6.500.000 VNĐ/tấn',
    supplier: 'Nông nghiệp Xanh',
  },
  {
    name: 'NPK 16-16-8',
    price: '12.800.000 VNĐ/tấn',
    supplier: 'AgriPlus',
  },
  {
    name: 'Hệ thống tưới nhỏ giọt',
    price: '22.000.000 VNĐ/bộ',
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

export default function Market() {
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
            <h2 className="text-2xl font-bold text-slate-800">Bảng tin mới</h2>
          </div>
          <div className="space-y-4">
            {weatherMarketNews.map((news) => (
              <a
                key={news.title}
                href={news.href}
                target={news.href ? '_blank' : undefined}
                rel={news.href ? 'noopener noreferrer' : undefined}
                className={`rounded-2xl border border-slate-200 p-4 hover:shadow-md transition block ${
                  news.href ? 'cursor-pointer hover:border-blue-300' : 'cursor-default'
                }`}
                aria-disabled={!news.href}
              >
                <div className="flex justify-between items-center mb-2">
                  <span className="text-xs font-semibold uppercase text-blue-600">{news.tag}</span>
                  <span className="text-xs text-slate-400">{news.time}</span>
                </div>
                <h3 className="text-lg font-bold text-slate-800 mb-1">{news.title}</h3>
                <p className="text-sm text-slate-600">{news.summary}</p>
              </a>
            ))}
          </div>
        </div>

        <div className="bg-white rounded-3xl shadow-xl p-6 border border-gray-100">
          <div className="flex items-center mb-4">
            <TrendingUp className="w-6 h-6 text-emerald-600 mr-3" />
            <h2 className="text-2xl font-bold text-slate-800">Bảng giá cà phê</h2>
          </div>
          <div className="space-y-4">
            {coffeePrices.map((item) => (
              <div key={item.market} className="flex items-center justify-between rounded-2xl border border-slate-200 p-4">
                <div>
                  <p className="font-semibold text-slate-800">{item.market}</p>
                  <p className="text-sm text-slate-500">{item.unit}</p>
                </div>
                <div className="text-right">
                  <p className="text-lg font-bold text-emerald-700">{item.price}</p>
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
            <h2 className="text-2xl font-bold text-slate-800">Liên hệ nhà xuất khẩu</h2>
          </div>
          <div className="space-y-4">
            {exporters.map((exporter) => (
              <div key={exporter.name} className="rounded-2xl border border-slate-200 p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="text-lg font-bold text-slate-800">{exporter.name}</h3>
                    <p className="text-sm text-slate-500">{exporter.address}</p>
                  </div>
                  <span className="text-sm font-semibold text-emerald-600">{exporter.price}</span>
                </div>
                <p className="mt-2 text-sm text-slate-600">Liên hệ: {exporter.contact}</p>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-white rounded-3xl shadow-xl p-6 border border-gray-100">
          <div className="flex items-center mb-4">
            <Store className="w-6 h-6 text-purple-600 mr-3" />
            <h2 className="text-2xl font-bold text-slate-800">Mua bán vật tư nông nghiệp</h2>
          </div>
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
