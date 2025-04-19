require('dotenv').config();
const axios = require("axios");

const sensors = ["Sensor_01", "Sensor_02", "Sensor_03"];
const apiUrl = process.env.API_BASE_URL || "http://localhost:5000";

setInterval(async () => {
  try {
    const { data } = await axios.get(`${apiUrl}/api/simulator/status`);
    if (!data.active) return;  // Only send data if simulator is active

    sensors.forEach((deviceId) => {
      const payload = {
        deviceId,
        temperature: Math.floor(Math.random() * 10) + 25,
        humidity: Math.floor(Math.random() * 20) + 40,
      };

      axios.post(`${apiUrl}/api/sensors`, payload)
        .then(() => console.log(`Data sent from ${deviceId}`))
        .catch(err => console.error("Data send error:", err.message));
    });
  } catch (err) {
    console.error("Simulator error:", err.message);
  }
}, 5000);
