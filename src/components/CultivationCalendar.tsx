import { useState } from 'react';

interface Task {
  id: string;
  date: string; // yyyy-mm-dd
  time: 'Sáng' | 'Chiều' | 'Cả ngày';
  title: string;
  priority: number; // 1 thấp, 3 cao
  status: 'done' | 'pending';
  progress: number; // 0-100
  detail: {
    description: string;
    fertilizer?: string;
    amount?: string;
    method?: string;
  };
}

// Demo data
const demoTasks: Task[] = [
  {
    id: '1',
    date: new Date().toISOString().slice(0, 10),
    time: 'Sáng',
    title: 'Bón phân NPK',
    priority: 2,
    status: 'pending',
    progress: 40,
    detail: {
      description: 'Bón phân NPK 16-16-8 cho vườn cà phê, chú ý lượng vừa đủ.',
      fertilizer: 'NPK 16-16-8',
      amount: '200kg/ha',
      method: 'Rải đều quanh gốc, tưới nhẹ sau bón.'
    }
  },
  {
    id: '2',
    date: new Date().toISOString().slice(0, 10),
    time: 'Chiều',
    title: 'Kiểm tra độ ẩm đất',
    priority: 1,
    status: 'done',
    progress: 100,
    detail: {
      description: 'Kiểm tra độ ẩm đất bằng cảm biến, ghi nhận kết quả.'
    }
  }
];

function getMonthDays(year: number, month: number) {
  return new Date(year, month, 0).getDate();
}

export default function CultivationCalendar() {
  const [selectedTask, setSelectedTask] = useState<Task | null>(null);
  const today = new Date();
  const year = today.getFullYear();
  const month = today.getMonth() + 1;
  const days = getMonthDays(year, month);

  // Filter tasks for current month
  const tasks = demoTasks.filter(t => {
    const d = new Date(t.date);
    return d.getMonth() + 1 === month && d.getFullYear() === year;
  });

  return (
    <div className="bg-white rounded-3xl shadow-xl p-6 border border-emerald-200">
      <h2 className="text-2xl font-bold text-emerald-800 mb-4 flex items-center">
        <span className="mr-2">📅</span>
        Lịch canh tác tháng {month}/{year}
      </h2>
      <div className="grid grid-cols-7 gap-2 mb-6">
        {[...Array(days)].map((_, i) => {
          const dateStr = `${year}-${String(month).padStart(2, '0')}-${String(i+1).padStart(2, '0')}`;
          const dayTasks = tasks.filter(t => t.date === dateStr);
          return (
            <div key={dateStr} className="bg-gradient-to-br from-emerald-50 to-yellow-50 border border-emerald-100 rounded-xl p-2 min-h-[80px] flex flex-col">
              <div className="font-bold text-emerald-700 text-sm mb-1">{i+1}</div>
              {dayTasks.length === 0 ? (
                <span className="text-xs text-slate-400">Không có nhiệm vụ</span>
              ) : (
                dayTasks.map(task => (
                  <button
                    key={task.id}
                    className={`text-xs text-left mb-1 p-1 rounded transition-all ${task.status === 'done' ? 'bg-emerald-100 text-emerald-700' : 'bg-yellow-100 text-yellow-700'} hover:bg-orange-100`}
                    onClick={() => setSelectedTask(task)}
                  >
                    {task.time}: {task.title}<br/>
                    Ưu tiên: {task.priority} | Trạng thái: {task.status === 'done' ? 'Hoàn thành' : 'Chưa xong'}<br/>
                    Tiến độ: {task.progress}%
                  </button>
                ))
              )}
            </div>
          );
        })}
      </div>
      {selectedTask && (
        <div className="fixed inset-0 bg-black/30 flex items-center justify-center z-50" onClick={() => setSelectedTask(null)}>
          <div className="bg-white rounded-2xl shadow-2xl p-6 min-w-[320px] max-w-[90vw]" onClick={e => e.stopPropagation()}>
            <h3 className="text-xl font-bold text-emerald-800 mb-2">{selectedTask.title}</h3>
            <p className="text-sm text-slate-600 mb-2">Ngày: {selectedTask.date} ({selectedTask.time})</p>
            <p className="text-sm text-slate-600 mb-2">Ưu tiên: {selectedTask.priority} | Trạng thái: {selectedTask.status === 'done' ? 'Hoàn thành' : 'Chưa xong'} | Tiến độ: {selectedTask.progress}%</p>
            <div className="mb-2">
              <strong>Mô tả nhiệm vụ:</strong>
              <div className="text-slate-700 mt-1">{selectedTask.detail.description}</div>
            </div>
            {selectedTask.detail.fertilizer && (
              <div className="mb-2">
                <strong>Loại phân:</strong> <span className="text-slate-700">{selectedTask.detail.fertilizer}</span>
              </div>
            )}
            {selectedTask.detail.amount && (
              <div className="mb-2">
                <strong>Lượng dùng:</strong> <span className="text-slate-700">{selectedTask.detail.amount}</span>
              </div>
            )}
            {selectedTask.detail.method && (
              <div className="mb-2">
                <strong>Phương pháp bón:</strong> <span className="text-slate-700">{selectedTask.detail.method}</span>
              </div>
            )}
            <button className="mt-4 px-6 py-2 bg-gradient-to-r from-emerald-500 to-teal-500 text-white rounded-xl font-bold shadow hover:from-emerald-600 hover:to-teal-600 transition-all" onClick={() => setSelectedTask(null)}>
              Đóng
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
