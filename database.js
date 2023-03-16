import mysql from "mysql2";
import dotenv from "dotenv";
import { generateSlug } from "random-word-slugs";

dotenv.config();

const pool = mysql.createPool(process.env.MYSQL_CONNECTION_URL).promise();

export async function getAllRecordings() {
  const [rows] = await pool.query("SELECT * FROM Recordings");
  return rows;
}

export async function getLastRecording() {
  const [rows] = await pool.query("SELECT * FROM Recordings ORDER BY id DESC LIMIT 1");
  return rows;
}

export async function getAllSensors() {
  const [rows] = await pool.query("SELECT * FROM Sensors");
  return rows;
}

export async function getRecordingsFromSensor(id) {
  let rows;
  if (isNaN(Number(id))) {
    [rows] = await pool.query(
      "SELECT * FROM Recordings INNER JOIN Sensors ON Recordings.idSensor=Sensors.id WHERE label LIKE ?",
      [`%${id}%`]
    );
  } else {
    [rows] = await pool.query("SELECT * FROM Recordings WHERE idSensor = ?", [
      id,
    ]);
  }
  return rows;
}

export async function createRecording(hygrometry, temperature, macAddress, pressure) {
  let idSensor = 0;
  const now = new Date();
  // Conversion du format JS au format SQL qui suit la norme 8601
  const timeStamp = now.toISOString().slice(0, 19).replace("T", " ");
  const user = await checkUserExistence(macAddress);
  if (user === false) {
    const newUser = await createUser(macAddress, timeStamp);
    idSensor = newUser[0].insertId;
  } else {
    idSensor = user;
  }
  const result = await pool.query(
    "INSERT INTO Recordings (timeStamp, idSensor, hygrometry, temperature, pressure) VALUES (?,?,?,?,?)",
    [timeStamp, idSensor, hygrometry, temperature, pressure]
  );
  await pool.query("UPDATE Sensors SET lastConnected = ?", [timeStamp]);
  return result;
}

export async function createUser(macAddress, firstConnected) {
  const result = await pool.query(
    "INSERT INTO Sensors (macAddress, firstConnected, label) VALUES (?,?,?)",
    [macAddress, firstConnected, generateSlug()]
  );
  return result;
}

export async function checkUserExistence(macAddress) {
  const [result] = await pool.query(
    "SELECT * FROM Sensors WHERE macAddress = ?",
    [macAddress]
  );
  if (result.length === 0) {
    return false;
  } else {
    return result[0].id;
  }
}
