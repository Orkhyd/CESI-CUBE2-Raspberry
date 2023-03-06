import mysql from "mysql2";
import dotenv from "dotenv";
import { generateSlug } from "random-word-slugs";

dotenv.config();
const pool = mysql.createPool(process.env.MYSQL_CONNECTION_URL).promise();

export async function getAllRecordings() {
  const [rows] = await pool.query("SELECT * FROM Recordings");
  return rows;
}

export async function getRecordingsFromSensor(id) {
  const [rows] = await pool.query(
    "SELECT * FROM Recordings WHERE idSensor = ?",
    [id]
  );
  return rows;
}

const allRecordings = await getAllRecordings();
const recordingsFromSensor = await getRecordingsFromSensor(2);
console.log(recordingsFromSensor);

export async function createRecording(hygrometry, temperature, macAddress) {
  const timeStamp = Date.now();
  const user = await checkUserExistence(macAddress);
  if (user === false) {
    const newUser = await createUser(macAddress, timeStamp);
    const idSensor = newUser.insertId;
  } else {
    idSensor = user;
  }
  const result = await pool.query(
    "INSERT INTO Recordings (timeStamp, idSensor, hygrometry, temperature) VALUES (?,?,?,?)",
    [timeStamp, idSensor, hygrometry, temperature]
  );
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
  return result.length === 0 ? false : result[0].insertId;
}
