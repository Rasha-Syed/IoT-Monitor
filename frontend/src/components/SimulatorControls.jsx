import React, { useState, useEffect } from "react";
import axios from "axios";

const backendUrl = "https://iot-monitor.onrender.com"; // Your live backend URL

const SimulatorControls = () => {
  // Track whether the simulator is running
  const [isRunning, setIsRunning] = useState(false);

  // Fetch simulator status from the backend
  const fetchStatus = async () => {
    try {
      const res = await axios.get(`${backendUrl}/api/simulator/status`);
      setIsRunning(res.data.active); // Update the state based on simulator status
    } catch (err) {
      console.error("Failed to fetch simulator status:", err.message);
    }
  };

  // Toggle the simulator (start or stop)
  const toggleSimulator = async (action) => {
    try {
      await axios.post(`${backendUrl}/api/simulator/${action}`);
      console.log(`Sent request to ${action} simulator`);
      fetchStatus(); // After starting/stopping, update the status
    } catch (err) {
      console.error(`Failed to ${action} simulator:`, err.message);
    }
  };

  // Get initial status when the component mounts
  useEffect(() => {
    fetchStatus();
  }, []);

  return (
    <div style={{ marginBottom: "20px" }}>
      <h3>Simulator Control</h3>
      <button onClick={() => toggleSimulator("start")} disabled={isRunning}>
        ▶️ Start Simulator
      </button>
      <button
        onClick={() => toggleSimulator("stop")}
        disabled={!isRunning}
        style={{ marginLeft: "10px" }}
      >
        ⏹️ Stop Simulator
      </button>
    </div>
  );
};

export default SimulatorControls;
