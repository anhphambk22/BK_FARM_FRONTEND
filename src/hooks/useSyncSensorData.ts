import { useEffect } from "react";
import { useAppStore } from "../store/appStore";

function mapSensorData(raw: any) {
  return {
    airTemperature: raw.Temp_SW || 0,
    airHumidity: raw.RH_SW || 0,
    light: 0,
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
  const API_URL = import.meta.env.VITE_API_URL;

  useEffect(() => {
    let timer: any;

    const fetchData = () => {
      fetch(`${API_URL}/api/sensor/all`)
        .then((res) => res.json())
        .then((data) => {
          const allRecords = Object.values(data);
          const latest = allRecords
            .sort(
              (a: any, b: any) =>
                (b.timestamp || 0) - (a.timestamp || 0)
            )[0];

          if (latest) {
            console.log("Latest sensor record:", latest);
            updateSensorData(mapSensorData(latest));
          }
        })
        .finally(() => {
          timer = setTimeout(fetchData, 5000);
        });
    };

    fetchData();
    return () => clearTimeout(timer);
  }, [updateSensorData, API_URL]);
}
