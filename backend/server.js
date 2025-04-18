const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");

const app = express();

app.use(cors({
  origin: ['http://localhost:3000', 'https://iot-monitor-one.vercel.app/'], 
  methods: ['GET', 'POST', 'PUT', 'DELETE'], 
  credentials: true 
}));

app.use(express.json());

mongoose.connect("mongodb+srv://rashanishath:1jtE4cE9cBX2B6LC@cluster0.y499y.mongodb.net/iot", {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
.then(() => console.log("Connected to MongoDB"))
.catch((err) => console.error("MongoDB connection error:", err));

// Routes
const sensorRoutes = require("./routes/sensorRoutes");
app.use("/api/sensors", sensorRoutes);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
