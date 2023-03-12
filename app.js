import express from "express";
import dotenv from "dotenv";
dotenv.config();
import {
  getAllRecordings,
  checkUserExistence,
  createRecording,
  createUser,
  getRecordingsFromSensor,
  getAllSensors,
} from "./database.js";

const app = express();
app.use(express.json());

app.get("/recordings", async (req, res) => {
  const recordings = await getAllRecordings();
  res.set("transfer-encoding", "").send(recordings);
});

app.get("/sensors", async (req, res) => {
  const sensors = await getAllSensors();
  res.send(sensors);
});

app.get("/recordings/:id", async (req, res) => {
  const id = req.params.id;
  const recordings = await getRecordingsFromSensor(id);
  res.send(recordings);
});

app.post("/recordings", async (req, res) => {
  const { macAddress, hygrometry, temperature } = req.body;
  // console.log(req.body);
  const recording = await createRecording(hygrometry, temperature, macAddress);
  res.send(recording);
});

app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).send("Something broke!");
});

app.listen(process.env.PORT, () => {
  console.log("Server is running on port 8080");
});
