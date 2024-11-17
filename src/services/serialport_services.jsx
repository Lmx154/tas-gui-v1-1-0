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
export const openSerialport = async (serialport, setConnectionState, read) => {
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
export const writeSerialport = async (serialport, setConnectionState) => {
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
) => {
  try {
    const res = await serialport.listen((data) => {
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
          console.log("this is pack");
          console.log(pack);
          console.log("this is pack[0]");
          console.log(pack[0]);
          console.log("this is pack[0][0]");
          console.log(pack[0][0]);
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
    console.log("listen serialport: ", res);
  } catch (err) {
    setConnectionState("btn-error");
    console.error(err);
  }
};

// Function to cancel reading from the serial port
export const cancelReadSerialport = async (serialport) => {
  try {
    const res = await serialport.cancelRead();
    console.log("cancel read: ", res);
  } catch (err) {
    console.error(err);
  }
};
