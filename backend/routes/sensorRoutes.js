const express = require("express");
const router = express.Router();
const SensorData = require("../models/sensorData");

router.post("/", async (req, res) => {
  try {
    const data = new SensorData(req.body);
    await data.save();
    res.status(201).json(data);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

router.get("/", async (req, res) => {
    const { filter, deviceId } = req.query;
  
    try {
      const query = deviceId ? { deviceId } : {};
      const data = await SensorData.find(query)
        .sort({ timestamp: -1 })
        .limit(20);
  
      res.json(data.reverse());
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  });
  
  

  router.get("/available", async (req, res) => {
    try {
      const data = await SensorData.aggregate([
        {
          $sort: { timestamp: -1 }
        },
        {
          $group: {
            _id: "$deviceId",
            latestData: { $first: "$$ROOT" }
          }
        },
        {
          $sort: { "latestData.timestamp": -1 }
        }
      ]);
  
      res.json(data.map(d => d.latestData));
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  });
  

module.exports = router;

