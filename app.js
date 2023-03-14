import express from "express";
import cors from "cors";
import dotenv from "dotenv";
dotenv.config();
import {
  getAllRecordings,
  checkUserExistence,
  createRecording,
  createUser,
  getRecordingsFromSensor,
  getAllSensors,
  getLastRecording,
} from "./database.js";
console.log(await getLastRecording());
const app = express();
app.use(express.json());
app.use(cors());
app.use("/", express.static("./front-end/dist/testfile"));


app.get("/recordings", async (req, res) => {
  const recordings = await getAllRecordings();
  res.send(recordings);
});

app.get("/recordings/last", async (req, res) => {
  const recording = await getLastRecording();
  res.send(recording);
  console.log(recording);
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
  const { macAddress, hygrometry, temperature, pressure } = req.body;
  // console.log(req.body);
  const recording = await createRecording(hygrometry, temperature, macAddress, pressure);
  res.send(recording);
});

app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).send("Something broke!");
});

app.listen(process.env.PORT, () => {
  console.log(`Server is running on port ${process.env.PORT}`);
});
