// src/App.js

import Map from "./components/Map";
import Graphs from "./components/Graphs";
import Console from "./components/Console";
import React, { useState, useEffect } from "react";
import Controls from "./components/Controls";
import Telemetry from "./components/Telemetry";
import Timeline from "./components/Timeline";
import Database from "./components/database";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import {
  createSerialPort,
  openSerialport,
  writeSerialport,
  readSerialport,
  listenSerialport,
  cancelReadSerialport,
} from "./services/serialport_services";

function App() {
  // State variables
  const [COMPort, setCOMPort] = useState("COM3");
  const [connectionState, setConnectionState] = useState("btn-warning");
  const [packets, setPackets] = useState([]);
  const [serialport, setSerialport] = useState(() => createSerialPort(COMPort));
  const [information, setInformation] = useState("right");
  const [yearArray, setYearArray] = useState([]);
  const [monthsArray, setMonthsArray] = useState([]);
  const [daysArray, setDaysArray] = useState([]);
  const [fixqualityArray, setfixqualityArray] = useState([]);
  const [satellitesArray, setsatellitesArray] = useState([]);
  const [weekdaysArray, setweekdaysArray] = useState([]);
  const [timesArray, settimesArray] = useState([]);
  const [Accel_xArray, setAccel_xArray] = useState([]);
  const [Accel_yArray, setAccel_yArray] = useState([]);
  const [Accel_ZArray, setAccel_ZArray] = useState([]);
  const [gxArray, setgxArray] = useState([]);
  const [gyArray, setgyArray] = useState([]);
  const [gzArray, setgzArray] = useState([]);
  const [Temperature_CArray, setTemperature_CArray] = useState([]);
  const [TemperatureArray, setTemperatureArray] = useState([]);
  const [PressuresArray, setPressuresArray] = useState([]);
  const [AltitudesArray, setAltitudesArray] = useState([]);
  const [HumidityArray, setHumidityArray] = useState([]);
  const [fixsArray, setfixsArray] = useState([]);
  const [latitudesArray, setlatitudesArray] = useState([]);
  const [longitudesArray, setlongitudesArray] = useState([]);
  const [speedArray, setspeedArray] = useState([]);
  const [altitudes_gpsArray, setaltitudes_gpsArray] = useState([]);
  const [currentIndex, setcurrentIndex] = useState(0);
  const [rssiArray, setrssiArray] = useState([]);
  const [snrArray, setsnrArray] = useState([]);
  const [filepath, setfilepath] = useState();
  const [live, setliveData] = useState(true);

  // Effect to update packets
  useEffect(() => {}, [packets]);

  // Effect to update serial port when COMPort changes
  useEffect(() => {
    const newSerialPort = createSerialPort(COMPort);
    setSerialport(newSerialPort);
  }, [COMPort]);

  // Function to parse packet data
  function parsePack(
    pack1,
    pack2,
    pack3,
    pack4,
    pack5,
    pack6,
    pack7,
    pack8,
    pack9,
    pack10,
    pack11,
    pack12,
    pack13,
    pack14,
    pack15,
    pack16,
    pack17,
    pack18,
  ) {
    parseMessage(pack1);
    setAccel_yArray((prevAccely) => [...prevAccely, pack2]);
    setAccel_ZArray((prevAccelz) => [...prevAccelz, pack3]);
    setgxArray((prevgxs) => [...prevgxs, pack4]);
    setgyArray((prevgys) => [...prevgys, pack5]);
    setgzArray((prevgzs) => [...prevgzs, pack6]);
    setTemperature_CArray((prevTempC) => [...prevTempC, pack7]);
    setTemperatureArray((prevTemp) => [...prevTemp, pack8]);
    setPressuresArray((prevTPressure) => [...prevTPressure, pack9]);
    setAltitudesArray((prevAltitudesArray) => [...prevAltitudesArray, pack10]);
    setHumidityArray((prevHumidity) => [...prevHumidity, pack11]);
    setfixsArray((prevfixs) => [...prevfixs, pack12]);
    setfixqualityArray((prevfixqlt) => [...prevfixqlt, pack13]);
    setlatitudesArray((prevlat) => [...prevlat, pack14]);
    setlongitudesArray((prevlon) => [...prevlon, pack15]);
    setspeedArray((prevsp) => [...prevsp, pack16]);
    setaltitudes_gpsArray((prevalt) => [...prevalt, pack17]);
    setsatellitesArray((prevsat) => [...prevsat, pack18]);
  }

  // Function to parse message string
  function parseMessage(inputString) {
    const pattern =
      /Message: \[(\d{4})\/(\d{1,2})\/(\d{1,2}) \((\w+)\) (\d{2}:\d{2}:\d{2})\] (-?\d+\.\d+)/;
    const match = inputString.match(pattern);

    if (match) {
      const year = parseInt(match[1], 10);
      const month = parseInt(match[2], 10);
      const day = parseInt(match[3], 10);
      const weekday = match[4];
      const time = match[5];
      const decimalValue = parseFloat(match[6]);
      setYearArray((prevYear) => [...prevYear, year]);
      setMonthsArray((prevMonth) => [...prevMonth, month]);
      setDaysArray((prevDay) => [...prevDay, day]);
      setweekdaysArray((prevWeekday) => [...prevWeekday, weekday]);
      setAccel_xArray((prevAccelx) => [...prevAccelx, decimalValue]);
      settimesArray((prevtimes) => [...prevtimes, time]);
    }
  }

  // Handlers for serial port operations
  function openSerialportHandler() {
    openSerialport(serialport, setConnectionState, readSerialportHandler, setInformation);
  }

  function writeSerialportHandler() {
    writeSerialport(serialport, setConnectionState, setInformation);
  }

  function readSerialportHandler() {
    readSerialport(serialport, setConnectionState, listenSerialportHandler, setInformation);
  }

  function listenSerialportHandler() {
    listenSerialport(
      serialport,
      setConnectionState,
      parsePack,
      setsnrArray,
      setrssiArray,
      setInformation,
    );
  }

  function cancelReadHandler() {
    cancelReadSerialport(serialport, setInformation);
  }

  // Conditional rendering based on live state
  if (live) {
    return (
      <div className="h-screen w-screen flex flex-col">
        <div className="flex w-full flex-1 p-2">
          <div className="flex-1 flex flex-col">
            <Map
              longitudesArray={longitudesArray}
              latitudesArray={latitudesArray}
            ></Map>
            <Console information={information}></Console>
          </div>
          <div className="divider divider-horizontal"></div>
          <div className="flex flex-col flex-1">
            <Graphs
              setliveData={setliveData}
              times_data={timesArray}
              altitudes_data={AltitudesArray}
              setInformation={setInformation}
            ></Graphs>
            <div className="flex flex-1">
              <Controls
                connectionState={connectionState}
                openSerialport={openSerialportHandler}
                setCOMPort={setCOMPort}
                COMPort={COMPort}
                setInformation={setInformation}
                setfilepath={setfilepath}
                filepath={filepath}
                cancelRead={cancelReadHandler}
              ></Controls>
              <div className="divider divider-horizontal mt-[16px]"></div>
              <Telemetry
                altitudes_array={AltitudesArray}
                satellites={satellitesArray}
                rssi={rssiArray}
                snr={snrArray}
                pressure={PressuresArray}
                Accel_ZArray={Accel_ZArray}
                longitudesArray={longitudesArray}
                latitudesArray={latitudesArray}
                gxArray={gxArray}
                gyArray={gyArray}
                gzArray={gzArray}
                Accel_xArray={Accel_xArray}
                Accel_yArray={Accel_yArray}
              ></Telemetry>
            </div>
          </div>
        </div>
        <Timeline></Timeline>
        <ToastContainer
          position="bottom-left"
          autoClose={5000}
          hideProgressBar={false}
          newestOnTop={false}
          closeOnClick
          rtl={false}
          pauseOnFocusLoss
          draggable
          pauseOnHover
          theme="dark"
        />
      </div>
    );
  } else {
    return (
      <Database
        setInformation={setInformation}
        setliveData={setliveData}
      ></Database>
    );
  }
}

export default App;
