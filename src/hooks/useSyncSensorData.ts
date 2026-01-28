import { useEffect } from "react";
import { useAppStore } from "../store/appStore";

// Map dữ liệu cảm biến từ API về đúng tên biến trong store
function mapSensorData(raw: any) {
  return {
    airTemperature: raw.Temp_SW || 0,
    airHumidity: raw.RH_SW || 0,
    light: 0, // Nếu có trường ánh sáng thì thay vào đây
    soilTemperature: raw.Temp_THEC || 0,
    soilMoisture: raw.RH_THEC || 0,
    soilPH: raw.pH || 0,
    soilEC: raw.EC_THEC || 0,
    nitrogen: raw.N || 0,
    phosphorus: raw.P || 0,
    potassium: raw.K || 0,
  };
}

export default function useSyncSensorData() {
  const updateSensorData = useAppStore((s) => s.updateSensorData);

  useEffect(() => {
    let timer: any;
    const fetchData = () => {
      fetch("/api/sensor/all")
        .then((res) => res.json())
        .then((data) => {
          const allRecords = Object.values(data);
          const latest = allRecords
            .map((v: any) => v)
            .sort((a: any, b: any) => (b.timestamp || 0) - (a.timestamp || 0))[0];
          if (latest) {
            console.log("Latest sensor record:", latest);
            updateSensorData(mapSensorData(latest));
            
          }
        })
        .finally(() => {
          timer = setTimeout(fetchData, 5000); // Lặp lại sau 5 giây
        });
    };
    fetchData();
    return () => clearTimeout(timer);
  }, [updateSensorData]);
}
