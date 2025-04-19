require('dotenv').config();
const axios = require("axios");

const sensors = ["Sensor_01", "Sensor_02", "Sensor_03"];
const apiUrl = process.env.API_BASE_URL;
setInterval(() => {
  sensors.forEach((deviceId) => {
    const data = {
      deviceId,
      temperature: Math.floor(Math.random() * 10) + 25,
      humidity: Math.floor(Math.random() * 20) + 40,
    };

    axios.post(`${apiUrl}/api/sensors`, data)
      .then(() => console.log(`Data sent from ${deviceId}`))
      .catch((err) => console.error("Error:", err.message));
  });
}, 5000);

