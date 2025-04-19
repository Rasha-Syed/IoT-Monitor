const express = require("express");
const router = express.Router();
const { exec, execSync } = require("child_process");

 const path = require("path");

let simulatorProcess = null;  
let simulatorIsActive = false; 

// Check simulator status
router.get("/status", (req, res) => {
  res.json({ active: simulatorIsActive });
});

// Start the simulator
router.post("/start", (req, res) => {
  if (simulatorIsActive) {
    return res.status(400).send("Simulator is already running.");
  }

const simulatorPath = path.join(__dirname, "..", "simulator.js");

simulatorProcess = exec(`node ${simulatorPath}`, (error, stdout, stderr) => {
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

// Stop the simulator
router.post("/stop", (req, res) => {
  if (!simulatorIsActive) {
    return res.status(400).send("Simulator is not running.");
  }

  if (simulatorProcess) {
    simulatorProcess.kill("SIGINT");
    console.log("Simulator stopped");
  }

  simulatorIsActive = false;
  res.send("Simulator stopped");
});

module.exports = router;
