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

// Function to open the serial port and start reading
export const openSerialport = async (serialport, setConnectionState, read, setInformation) => {
  try {
    await serialport.open();
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
    console.error(err);
  }
};

// Function to write data to the serial port
export const writeSerialport = async (serialport, setConnectionState, setInformation) => {
  try {
    const res = await serialport.write("t");
    console.log("write serialport: ", res);
  } catch (err) {
    setConnectionState("btn-error");
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
    listen();
  } catch (err) {
    setConnectionState("btn-error");
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
      parsePack(data); // Call parsePack with the received data
    }, false);
    setConnectionState("btn-success btn-disabled");
  } catch (err) {
    setConnectionState("btn-error");
    console.error(err);
  }
};

// Function to cancel reading from the serial port
export const cancelReadSerialport = async (serialport, setInformation) => {
  try {
    const res = await serialport.cancelRead();
    console.log("cancel read: ", res);
  } catch (err) {
    console.error(err);
  }
};
