import { useEffect, useRef } from 'react';
import type { MqttClient, IClientOptions } from 'mqtt';
import { mqttConfig } from '../config/mqtt';
import { useAppStore } from '../store/appStore';

/**
 * Hook to start MQTT connection (browser via WebSocket).
 * It connects only when VITE_MQTT_URL is provided.
 */
export default function useMqtt() {
  const updateSensorData = useAppStore((s) => s.updateSensorData);
  const clientRef = useRef<MqttClient | null>(null);

  useEffect(() => {
    const url = mqttConfig.url;
    if (!url) return; // not configured — do nothing

    let isMounted = true;

    (async () => {
      const mqtt = await import('mqtt');
      const options: IClientOptions = {
        username: mqttConfig.username,
        password: mqttConfig.password,
        reconnectPeriod: 3000,
        clean: true,
        // Keepalive helps detect dead connections
        keepalive: 30,
      };

      const client = mqtt.connect(url, options);
      clientRef.current = client;

      client.on('connect', () => {
        if (!isMounted) return;
        // Subscribe to all configured topics
        Object.values(mqttConfig.topics).forEach((topic) => {
          if (topic) client.subscribe(topic, { qos: 0 });
        });
      });

      client.on('message', (topic, payload) => {
        // Find which sensor this topic maps to
        for (const [field, t] of Object.entries(mqttConfig.topics)) {
          if (t && topic === t) {
            const text = payload.toString();
            const num = Number(text);
            // Accept both numeric and string values; if NaN, skip
            if (!Number.isNaN(num)) {
              const payload = { [field]: num } as Parameters<typeof updateSensorData>[0];
              updateSensorData(payload);
            }
            break;
          }
        }
      });

      client.on('error', (err) => {
        console.error('MQTT error:', err?.message || err);
      });
    })();

    return () => {
      isMounted = false;
      if (clientRef.current) {
        try { clientRef.current.end(true); } catch { /* noop */ }
        clientRef.current = null;
      }
    };
  }, [updateSensorData]);
}
