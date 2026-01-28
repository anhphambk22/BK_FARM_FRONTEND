interface AssessmentItemProps {
  emoji: string;
  title: string;
  value: string;
  status: string;
  tip: string;
  gradient: string;
}

const AssessmentItem = ({ emoji, title, value, status, tip, gradient }: AssessmentItemProps) => (
  <div className="text-center group relative p-2 sm:p-4">
    <div className="text-3xl sm:text-5xl mb-2 sm:mb-3 transform group-hover:scale-110 transition-transform duration-300 animate-pulse">
      {emoji}
    </div>
    <h3 className={`font-bold text-base sm:text-lg mb-2 sm:mb-3 bg-gradient-to-r ${gradient} bg-clip-text text-transparent`}>
      {title}
    </h3>
    <div className={`text-2xl sm:text-3xl font-black mb-1 sm:mb-2 bg-gradient-to-r ${gradient} bg-clip-text text-transparent drop-shadow-lg`}>
      {value}
    </div>
    <div className="text-white/90 text-xs sm:text-sm mb-2 sm:mb-3 font-medium">
      {status}
    </div>
    <div className="text-white/70 text-[10px] sm:text-xs flex items-center justify-center">
      <span className="mr-1">💡</span>
      <span>{tip}</span>
    </div>
    <div className={`absolute inset-0 bg-gradient-to-r ${gradient} opacity-0 group-hover:opacity-10 rounded-xl transition-opacity duration-300`}></div>
  </div>
);

export default function AssessmentCard() {
  return (
    <div className="relative group">
      <div className="absolute -inset-1 bg-gradient-to-r from-purple-600 via-pink-600 via-red-500 via-orange-500 via-yellow-500 via-green-500 via-blue-500 to-indigo-600 rounded-3xl blur-lg opacity-60 group-hover:opacity-80 transition duration-1000 animate-pulse"></div>
      <div className="relative bg-gradient-to-br from-slate-900 via-purple-900 to-indigo-900 text-white rounded-2xl sm:rounded-3xl p-4 sm:p-8 shadow-2xl backdrop-blur-xl border border-white/10">
        <div className="text-center mb-4 sm:mb-8">
          <h2 className="text-2xl sm:text-3xl font-black bg-gradient-to-r from-yellow-400 via-pink-400 to-cyan-400 bg-clip-text text-transparent mb-1 sm:mb-2">
            Đánh giá chung hiện tại
          </h2>
          <div className="flex justify-center space-x-1 sm:space-x-2">
            <span className="text-yellow-400 animate-ping">⭐</span>
            <span className="text-pink-400 animate-pulse">⭐</span>
            <span className="text-cyan-400 animate-bounce">⭐</span>
          </div>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 sm:gap-8">
          <AssessmentItem
            emoji="🌡️"
            title="Nhiệt độ vườn"
            value="24°C"
            status="Hoàn hảo cho cây trồng"
            tip="Nhiệt độ lý tưởng 18-25°C"
            gradient="from-red-400 to-orange-500"
          />
          <AssessmentItem
            emoji="💧"
            title="Độ ẩm"
            value="70%"
            status="Cây đang phát triển tốt"
            tip="Duy trì 60-80% cho lá xanh"
            gradient="from-blue-400 to-cyan-500"
          />
          <AssessmentItem
            emoji="🌱"
            title="Đất trồng"
            value="pH 6.0"
            status="Cây thích đất chua nhẹ"
            tip="pH 5.5-6.5 cho cây ngon"
            gradient="from-green-400 to-emerald-500"
          />
        </div>
        <div className="mt-4 sm:mt-8 p-4 sm:p-8 bg-gradient-to-r from-amber-500/20 via-orange-500/20 to-red-500/20 rounded-2xl text-center backdrop-blur-sm border border-orange-400/30">
          <div className="text-lg sm:text-2xl mb-1 sm:mb-2">
            <span className="animate-bounce inline-block">📅</span>
            <span className="animate-pulse inline-block ml-1 sm:ml-2">🌾</span>
            <span className="animate-bounce inline-block ml-1 sm:ml-2">⏰</span>
          </div>
          <span className="text-lg sm:text-2xl md:text-3xl font-black bg-gradient-to-r from-yellow-300 to-orange-300 bg-clip-text text-transparent">
            Sắp đến mùa thu hoạch (tháng 10-12)
          </span>
        </div>
        <div className="absolute top-4 sm:top-8 left-4 sm:left-8 w-1 h-1 bg-yellow-400 rounded-full animate-ping opacity-60"></div>
        <div className="absolute top-8 sm:top-16 right-6 sm:right-12 w-2 h-2 bg-pink-400 rounded-full animate-pulse opacity-40"></div>
        <div className="absolute bottom-10 sm:bottom-20 left-8 sm:left-16 w-1 h-1 bg-cyan-400 rounded-full animate-bounce opacity-50"></div>
      </div>
    </div>
  );
}
