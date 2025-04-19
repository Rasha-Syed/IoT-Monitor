const express = require("express");
const router = express.Router();
const { exec, execSync } = require("child_process");

let simulatorProcess = null;  
let simulatorIsActive = false; 


router.get("/status", (req, res) => {
  res.json({ active: simulatorIsActive });
});


router.post("/start", (req, res) => {
  if (simulatorIsActive) {
    return res.status(400).send("Simulator is already running.");
  }

  console.log("Starting the simulator...");
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

  // Kill the simulator process
  if (simulatorProcess) {
    simulatorProcess.kill("SIGINT");
    console.log("Simulator stopped");
  }

  simulatorIsActive = false;
  res.send("Simulator stopped");
});

module.exports = router;

