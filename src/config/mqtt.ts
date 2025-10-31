export interface MqttConfig {
  url?: string; // ws(s)://host:port or wss://broker.example/mqtt
  username?: string;
  password?: string;
  // topic mapping for incoming sensor values
  topics: Partial<Record<
    | 'airTemperature'
    | 'airHumidity'
    | 'light'
    | 'soilTemperature'
    | 'soilMoisture'
    | 'soilPH'
    | 'nitrogen'
    | 'phosphorus'
    | 'potassium',
    string
  >>;
}

// Read from env with safe defaults (no connection if url is empty)
export const mqttConfig: MqttConfig = {
  url: import.meta.env.VITE_MQTT_URL as string | undefined,
  username: import.meta.env.VITE_MQTT_USERNAME as string | undefined,
  password: import.meta.env.VITE_MQTT_PASSWORD as string | undefined,
  topics: {
    // Example topics — change to match your broker
    airTemperature: import.meta.env.VITE_MQTT_T_AIR as string | undefined,
    airHumidity: import.meta.env.VITE_MQTT_T_AIR_H as string | undefined,
    light: import.meta.env.VITE_MQTT_T_LIGHT as string | undefined,
    soilTemperature: import.meta.env.VITE_MQTT_T_SOIL_T as string | undefined,
    soilMoisture: import.meta.env.VITE_MQTT_T_SOIL_M as string | undefined,
    soilPH: import.meta.env.VITE_MQTT_T_SOIL_PH as string | undefined,
    nitrogen: import.meta.env.VITE_MQTT_T_N as string | undefined,
    phosphorus: import.meta.env.VITE_MQTT_T_P as string | undefined,
    potassium: import.meta.env.VITE_MQTT_T_K as string | undefined,
  },
};
