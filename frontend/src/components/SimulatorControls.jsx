import React, { useState, useEffect } from "react";
import axios from "axios";

const backendUrl = process.env.REACT_APP_BASE_URL || "http://localhost:5000";

const SimulatorControls = () => {
  const [isRunning, setIsRunning] = useState(false);

  const fetchStatus = async () => {
    try {
      const res = await axios.get(`${backendUrl}/api/simulator/status`);
      setIsRunning(res.data.active);
    } catch (err) {
      console.error("Failed to fetch simulator status:", err.message);
    }
  };

  const toggleSimulator = async (action) => {
    try {
      await axios.post(`${backendUrl}/api/simulator/${action}`);
      fetchStatus();
    } catch (err) {
      console.error(`Failed to ${action} simulator:`, err.message);
    }
  };

  useEffect(() => {
    fetchStatus();
  }, []);

  return (
    <div style={{ marginBottom: "20px" }}>
      <h3>Simulator Control</h3>
      <button onClick={() => toggleSimulator("start")} disabled={isRunning}>
        ▶️ Start Simulator
      </button>
      <button onClick={() => toggleSimulator("stop")} disabled={!isRunning} style={{ marginLeft: "10px" }}>
        ⏹️ Stop Simulator
      </button>
    </div>
  );
};

export default SimulatorControls;
