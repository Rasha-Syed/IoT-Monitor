const axios = require("axios");

const sensors = ["Sensor_01", "Sensor_02", "Sensor_03"];

setInterval(() => {
  sensors.forEach((deviceId) => {
    const data = {
      deviceId,
      temperature: Math.floor(Math.random() * 10) + 25,
      humidity: Math.floor(Math.random() * 20) + 40,
    };

    axios.post("https://iot-monitor.onrender.com/api/sensors", data)
      .then(() => console.log(`Data sent from ${deviceId}`))
      .catch((err) => console.error("Error:", err.message));
  });
}, 5000);

