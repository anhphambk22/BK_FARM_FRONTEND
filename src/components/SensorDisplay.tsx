
import { useEffect, useState } from "react";

export default function SensorDisplay() {
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    fetch("/api/sensor/all")
      .then((res) => {
        if (!res.ok) throw new Error("Lỗi khi lấy dữ liệu cảm biến");
        return res.json();
      })
      .then((d) => {
        setData(d);
        setLoading(false);
      })
      .catch((err) => {
        setError(err.message);
        setLoading(false);
      });
  }, []);

  if (loading) return <div>Đang tải dữ liệu cảm biến...</div>;
  if (error) return <div style={{ color: "red" }}>Lỗi: {error}</div>;
  if (!data) return <div>Không có dữ liệu cảm biến.</div>;

  // Lấy bản ghi mới nhất (theo timestamp lớn nhất)
  const allRecords = Object.values(data);
  const latest = allRecords
    .map((v: any) => v)
    .sort((a: any, b: any) => (b.timestamp || 0) - (a.timestamp || 0))[0];

  return (
    <div style={{ margin: "16px 0" }}>
      <h3>Dữ liệu cảm biến mới nhất:</h3>
      {latest ? (
        <ul>
          {Object.entries(latest).map(([k, v]) => (
            <li key={k}>
              <b>{k}:</b> {String(v)}
            </li>
          ))}
        </ul>
      ) : (
        <div>Không tìm thấy bản ghi nào.</div>
      )}
    </div>
  );
}
