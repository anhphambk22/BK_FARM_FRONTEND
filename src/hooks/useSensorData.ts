// React hook: useSensorData
// Lắng nghe dữ liệu cảm biến real-time từ Firebase Realtime Database

import { useEffect, useState } from 'react';
import { database } from '../config/firebase';
import { ref, onValue, off } from 'firebase/database';

// Thay đổi path theo cấu trúc dữ liệu của bạn, ví dụ: 'gateway/data'
const SENSOR_DATA_PATH = 'gateway/data';

export function useSensorData() {
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const dbRef = ref(database, SENSOR_DATA_PATH);
    const handleValue = (snapshot: any) => {
      setData(snapshot.val());
      setLoading(false);
    };
    const handleError = (err: any) => {
      setError(err.message);
      setLoading(false);
    };
    onValue(dbRef, handleValue, handleError);
    return () => off(dbRef, 'value', handleValue);
  }, []);

  return { data, loading, error };
}
