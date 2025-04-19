import React, { useState, useEffect } from "react";
import axios from "axios";

const backendUrl = "https://iot-monitor.onrender.com"; // This should be your live backend URL

const toggleSimulator = async (action) => {
  try {
    await axios.post(`${backendUrl}/api/simulator/${action}`);
    fetchStatus(); // After starting or stopping, check the status
    console.log(`Sent request to ${action} simulator`);

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
