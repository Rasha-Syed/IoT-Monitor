import React, { useEffect, useState } from "react";
import axios from "axios";
import { Line } from "react-chartjs-2";
import 'chart.js/auto';
import SimulatorControls from "./SimulatorControls";

const Dashboard = () => {
  const [sensorData, setSensorData] = useState([]);
  const [deviceId, setDeviceId] = useState("");
  const [availableDevices, setAvailableDevices] = useState([]);
  const [lastTimestamp, setLastTimestamp] = useState(null);
  const [isActive, setIsActive] = useState(false);

  useEffect(() => {
    fetchAvailableDevices();
  }, []);

  useEffect(() => {
    if (deviceId) fetchSensorData();
    const interval = setInterval(() => {
      if (deviceId) fetchSensorData();
    }, 5000);

    return () => clearInterval(interval);
  }, [deviceId]);

  const fetchAvailableDevices = async () => {
    try {
      const res = await axios.get("http://localhost:5000/api/sensors/available");
      setAvailableDevices(res.data.map(d => d.deviceId));
      if (res.data.length > 0) setDeviceId(res.data[0].deviceId);
    } catch (err) {
      console.error("Error fetching available devices:", err.message);
    }
  };

  const fetchSensorData = async () => {
    try {
      const res = await axios.get(`http://localhost:5000/api/sensors?deviceId=${deviceId}`);
      setSensorData(res.data);

      if (res.data.length > 0) {
        const latest = new Date(res.data[res.data.length - 1].timestamp);
        setLastTimestamp(latest);

        // Determines if active: if last data < 10 seconds ago
        const now = new Date();
        const secondsDiff = (now - latest) / 1000;
        setIsActive(secondsDiff <= 10);
      } else {
        setIsActive(false);
      }

    } catch (err) {
      console.error("Error fetching sensor data:", err.message);
    }
  };

  const chartData = {
    labels: sensorData.map(d => new Date(d.timestamp).toLocaleTimeString()),
    datasets: [
      {
        label: "Temperature (°C)",
        data: sensorData.map(d => d.temperature),
        borderColor: "red",
        fill: false,
      },
      {
        label: "Humidity (%)",
        data: sensorData.map(d => d.humidity),
        borderColor: "blue",
        fill: false,
      },
    ],
  };

  return (
    <div style={{ padding: "20px" }}>
      <h2>IoT Device Dashboard</h2>
      <SimulatorControls />
      
      {/* Dropdown Row */}
      <div style={{ display: "flex", gap: "30px", marginBottom: "20px" }}>
        <div>
          <label>Sensor: </label>
          <select value={deviceId} onChange={(e) => setDeviceId(e.target.value)}>
            {availableDevices.map((id) => (
              <option key={id} value={id}>{id}</option>
            ))}
          </select>
        </div>
      </div>

      {/* Chart Section */}
      {sensorData.length === 0 ? (
        <p>No data available for this sensor.</p>
      ) : (
        <div style={{
          marginBottom: "30px",
          padding: "20px",
          border: "1px solid #ccc",
          borderRadius: "10px",
          backgroundColor: "#f8f8f8"
        }}>
          <h3>{deviceId} — <span style={{ color: isActive ? 'green' : 'gray' }}>{isActive ? "🟢 Active" : "🔴 Inactive"}</span></h3>
          {!isActive && lastTimestamp && (
            <p>Last data received at: {new Date(lastTimestamp).toLocaleTimeString()}</p>
          )}
          <Line data={chartData} />
        </div>
      )}
    </div>
  );
};

export default Dashboard;
