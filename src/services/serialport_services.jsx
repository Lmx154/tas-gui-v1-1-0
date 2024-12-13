// src/services/serialport_services.jsx
// This file contains the functions that are used to read and write data from the serial port.
// This is how it's working serialport_services.jsx=>App.js=>any component using App.js functions as props.
// Do NOT place any view logic in this file.
import { Serialport } from "tauri-plugin-serialport-api";
import { toast } from "react-toastify";

// Function to create a serial port instance
export const createSerialPort = (COMPort) => {
  return new Serialport({ path: COMPort, baudRate: 115200 });
};

// Function to capture console logs
export const captureConsoleLogs = (setInformation, message) => {
  setInformation((prevInfo) => prevInfo + "\n" + message);
};

// Function to open the serial port and start reading
export const openSerialport = async (serialport, setConnectionState, read, setInformation) => {
  try {
    await serialport.open();
    captureConsoleLogs(setInformation, "Serial port opened");
    read();
  } catch (err) {
    setConnectionState("btn-error");
    toast.error("Serial port not found.", {
      position: "bottom-left",
      autoClose: 5000,
      hideProgressBar: false,
      closeOnClick: true,
      pauseOnHover: true,
      draggable: true,
      progress: undefined,
      theme: "dark",
    });
    captureConsoleLogs(setInformation, `Error: ${err.message}`);
    console.error(err);
  }
};

// Function to write data to the serial port
export const writeSerialport = async (serialport, setConnectionState, setInformation) => {
  try {
    const res = await serialport.write("t");
    captureConsoleLogs(setInformation, `write serialport: ${res}`);
    console.log("write serialport: ", res);
  } catch (err) {
    setConnectionState("btn-error");
    captureConsoleLogs(setInformation, `Error: ${err.message}`);
    console.error(err);
  }
};

// Function to read data from the serial port
export const readSerialport = async (
  serialport,
  setConnectionState,
  listen,
  setInformation,
) => {
  try {
    const res = await serialport.read({ timeout: 1 });
    captureConsoleLogs(setInformation, "Reading from serial port");
    listen();
  } catch (err) {
    setConnectionState("btn-error");
    captureConsoleLogs(setInformation, `Error: ${err.message}`);
    console.error(err);
  }
};

// Function to listen for data on the serial port
export const listenSerialport = async (
  serialport,
  setConnectionState,
  parsePack,
  setsnrArray,
  setrssiArray,
  setInformation,
) => {
  try {
    await serialport.listen((data) => {
      console.log("Data received:", data); // Log received data
      captureConsoleLogs(setInformation, `Data received: ${data}`);
      data = data.split("$");
      data.shift();
      for (let pack of data) {
        pack = pack.split("\r\n");
        pack.pop();
        pack.shift();
        pack = pack.map((raw_packet) => raw_packet.split(","));
        if (
          pack.length !== 0 &&
          pack[0].length !== 0 &&
          pack[1].length !== 0 &&
          pack[2].length !== 0
        ) {
          console.log("Parsed pack:", pack); // Log parsed pack
          captureConsoleLogs(setInformation, `Parsed pack: ${JSON.stringify(pack)}`);
          setsnrArray((prevsnr) => [...prevsnr, pack[2][0]]);
          setrssiArray((prevrssi) => [...prevrssi, pack[1][0]]);
          parsePack(
            pack[0][0],
            pack[0][1],
            pack[0][2],
            pack[0][3],
            pack[0][4],
            pack[0][5],
            pack[0][6],
            pack[0][7],
            pack[0][8],
            pack[0][9],
            pack[0][10],
            pack[0][11],
            pack[0][12],
            pack[0][13],
            pack[0][14],
            pack[0][15],
            pack[0][16],
            pack[0][17],
            pack[0][18],
          );
        }
      }
    }, false);
    setConnectionState("btn-success btn-disabled");
    captureConsoleLogs(setInformation, `Listening to serial port`);
  } catch (err) {
    setConnectionState("btn-error");
    captureConsoleLogs(setInformation, `Error: ${err.message}`);
    console.error(err);
  }
};

// Function to cancel reading from the serial port
export const cancelReadSerialport = async (serialport, setInformation) => {
  try {
    const res = await serialport.cancelRead();
    captureConsoleLogs(setInformation, `cancel read: ${res}`);
    console.log("cancel read: ", res);
  } catch (err) {
    captureConsoleLogs(setInformation, `Error: ${err.message}`);
    console.error(err);
  }
};
