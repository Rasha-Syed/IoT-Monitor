const express = require("express");
const router = express.Router();
const path = require("path");
const { exec } = require("child_process");

let simulatorProcess = null;
let simulatorIsActive = false;

// ✅ Get simulator status
router.get("/status", (req, res) => {
  res.json({ active: simulatorIsActive });
});

// ✅ Start simulator
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
    }
    console.log(`Simulator output: ${stdout}`);
  });

  simulatorIsActive = true;
  console.log("Simulator started");
  res.send("Simulator started");
});

// ✅ Stop simulator
router.post("/stop", (req, res) => {
  if (!simulatorIsActive) {
    return res.status(400).send("Simulator is not running.");
  }

  if (simulatorProcess) {
    simulatorProcess.kill("SIGINT");
    console.log("Simulator process killed");
  }

  simulatorIsActive = false;
  res.send("Simulator stopped");
});

module.exports = router;
