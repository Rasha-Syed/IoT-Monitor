const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
require('dotenv').config();

const app = express();
app.use(cors({
  origin: ["http://localhost:3000", "https://iot-monitor-oi4x--puce.vercel.app"], 
  methods: ["GET", "POST", "PUT", "DELETE"],
  credentials: true
}));
app.use(express.json());

// MongoDB Connection
mongoose.connect(process.env.MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
.then(() => console.log("Connected to MongoDB"))
.catch((err) => console.error("MongoDB connection error:", err));

// Routes
const sensorRoutes = require("./routes/sensorRoutes");
const simulatorRoutes = require("./routes/simulatorRoutes"); 
app.use("/api/sensors", sensorRoutes);
app.use("/api/simulator", simulatorRoutes); 

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));

