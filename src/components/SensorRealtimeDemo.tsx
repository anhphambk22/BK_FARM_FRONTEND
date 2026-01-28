// 2. Lắng nghe dữ liệu real-time trong component React
import React, { useEffect, useState } from 'react';
import { database } from '../config/firebase';
import { ref, onValue, off } from 'firebase/database';

export default function SensorRealtimeDemo() {
  const [sensorData, setSensorData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const dbRef = ref(database, 'gateway/data');
    const handleValue = (snapshot) => {
      setSensorData(snapshot.val());
      setLoading(false);
    };
    const handleError = (err) => {
      setError(err.message);
      setLoading(false);
    };
    onValue(dbRef, handleValue, handleError);
    return () => off(dbRef, 'value', handleValue);
  }, []);

  if (loading) return <div>Đang tải dữ liệu cảm biến...</div>;
  if (error) return <div className="text-red-600">Lỗi: {error}</div>;
  if (!sensorData) return <div>Không có dữ liệu cảm biến.</div>;

  return (
    <div>
      <h2>Dữ liệu cảm biến real-time</h2>
      <pre>{JSON.stringify(sensorData, null, 2)}</pre>
    </div>
  );
}
