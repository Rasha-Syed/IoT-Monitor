const express = require("express");
const router = express.Router();
const { exec, execSync } = require("child_process");

let simulatorProcess = null;
let simulatorIsActive = false;  // Flag to keep track of simulator status

// Route to get the current simulator status
router.get("/status", (req, res) => {
  res.json({ active: simulatorIsActive });
});

// Route to start the simulator
router.post("/start", (req, res) => {
  if (simulatorIsActive) {
    return res.status(400).send("Simulator is already running.");
  }

  simulatorProcess = exec("node simulator.js", (error, stdout, stderr) => {
    if (error) {
      console.error(`Error starting simulator: ${error.message}`);
      return;
    }
    if (stderr) {
      console.error(`Simulator stderr: ${stderr}`);
      return;
    }
    console.log(`Simulator output: ${stdout}`);
  });

  simulatorIsActive = true;
  console.log("Simulator started");
  res.send("Simulator started");
});

// Route to stop the simulator
router.post("/stop", (req, res) => {
  if (!simulatorIsActive) {
    return res.status(400).send("Simulator is not running.");
  }

  if (simulatorProcess) {
    simulatorProcess.kill("SIGINT");  // Send a signal to stop the simulator process
    console.log("Simulator stopped");
  }

  simulatorIsActive = false;
  res.send("Simulator stopped");
});

module.exports = router;
