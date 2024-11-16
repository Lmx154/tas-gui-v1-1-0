// src/components/database.jsx
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";
import { Line, getElementAtEvent } from "react-chartjs-2";
import { useEffect, useRef, useState } from "react";
import {
  readDataInteger,
  readDataString,
  readDataFloat,
  readAllData,
} from "../services/database_services";

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
);

export const options = {
  responsive: true,
  maintainAspectRatio: false,
  plugins: {
    legend: {
      position: "top",
    },
  },
};

const Databases = ({ setInformation, setliveData }) => {
  const [dbyearArray, dbsetYearArray] = useState([]);
  const [dbmonthsArray, dbsetMonthsArray] = useState([]);
  const [dbdaysArray, dbsetDaysArray] = useState([]);
  const [dbfixqualityArray, dbsetfixqualityArray] = useState([]);
  const [dbsatellitiesArray, dbsetsatellitiesArray] = useState([]);
  const [dbweekdaysArray, dbsetweekdaysArray] = useState([]);
  const [dbtimesArray, dbsettimesArray] = useState([]);
  const [dbAccel_xArray, dbsetAccel_xArray] = useState([]);
  const [dbAccel_yArray, dbsetAccel_yArray] = useState([]);
  const [dbAccel_ZArray, dbsetAccel_ZArray] = useState([]);
  const [dbgxArray, dbsetgxArray] = useState([]);
  const [dbgyArray, dbsetgyArray] = useState([]);
  const [dbgzArray, dbsetgzArray] = useState([]);
  const [dbTemperature_CArray, dbsetTemperature_CArray] = useState([]);
  const [dbTemperatureArray, dbsetTemperatureArray] = useState([]);
  const [dbPressuresArray, dbsetPressuresArray] = useState([]);
  const [dbAltitudesArray, dbsetAltitudesArray] = useState([]);
  const [dbHumidityArray, dbsetHumidityArray] = useState([]);
  const [dbfixsArray, dbsetfixsArray] = useState([]);
  const [dblatitudesArray, dbsetlatitudesArray] = useState([]);
  const [dblongitudesArray, dbsetlongitudesArray] = useState([]);
  const [dbspeedArray, dbsetspeedArray] = useState([]);
  const [dbaltitudes_gpsArray, dbsetaltitudes_gpsArray] = useState([]);
  const [dbcurrentIndex, dbsetcurrentIndex] = useState(0);
  const [loadYear, setloadYear] = useState("2022-2023");
  const labels = dbtimesArray;
  const [makedbScreen, setmakedbScreen] = useState(false);

  const setStateFunctions = {
    years: dbsetYearArray,
    months: dbsetMonthsArray,
    days: dbsetDaysArray,
    fixquality: dbsetfixqualityArray,
    satellities: dbsetsatellitiesArray,
    weekdays: dbsetweekdaysArray,
    times: dbsettimesArray,
    Accel_x: dbsetAccel_xArray,
    Accel_y: dbsetAccel_yArray,
    Accel_Z: dbsetAccel_ZArray,
    gx: dbsetgxArray,
    gy: dbsetgyArray,
    gz: dbsetgzArray,
    Temperature_C: dbsetTemperature_CArray,
    Temperature: dbsetTemperatureArray,
    Pressures: dbsetPressuresArray,
    Altitudes: dbsetAltitudesArray,
    Humidity: dbsetHumidityArray,
    fixs: dbsetfixsArray,
    latitudes: dbsetlatitudesArray,
    longitudes: dbsetlongitudesArray,
    speed: dbsetspeedArray,
    altitude_gps: dbsetaltitudes_gpsArray,
  };

  const data = {
    labels,
    datasets: [
      {
        label: "Altitude",
        data: labels.map((label, index) => dbaltitudes_gpsArray[index]),
        borderColor: "rgb(255, 99, 132)",
        backgroundColor: "rgba(255, 99, 132, 0.5)",
      },
    ],
  };

  const chartRef = useRef();
  const onClick = (event) => {
    console.log(getElementAtEvent(chartRef.current, event)[0].index);
    dbsetcurrentIndex(getElementAtEvent(chartRef.current, event)[0].index);
    setInformation(`the new value of index is :  ${dbcurrentIndex}`);
  };

  const [activeTab, setActiveTab] = useState("Live");

  const handleTabClick = (tab) => {
    setActiveTab(tab);
    setliveData((prevLive) => !prevLive);
  };

  const [yearSelect, setyearSelect] = useState("2022-2023");
  const yearPicker = (e) => {
    setyearSelect(e.target.value);
    setloadYear(e.target.value);
    console.log(`the current load year is ->  ${loadYear}`);
  };

  if (makedbScreen === false) {
    return (
      <div className="flex flex-col flex-1">
        <div className="divider uppercase">Databases</div>
        <div className="tabs">
          <button
            id="DatabaseTab"
            className={`tab tab-bordered tab-${activeTab === "Databases" ? "active" : ""}`}
            onClick={() => handleTabClick("Databases")}
          >
            Live
          </button>
        </div>
        <div className="flex-1">
          <Line ref={chartRef} data={data} onClick={onClick} />
        </div>
        <div className="flex flex-col flex-1">
          <div className="flex-column">
            <button
              className={"btn btn-outline btn-error uppercase"}
              onClick={() => {
                readAllData(loadYear, setInformation, setStateFunctions);
              }}
            >
              Load:{`${yearSelect}`}
            </button>
            <button
              className={"btn btn-outline btn-error uppercase"}
              onClick={() => setmakedbScreen(true)}
            >
              {" "}
              New Database
            </button>
            <div>
              <label>
                Select Database
                <select value={yearSelect} onChange={yearPicker}>
                  <option value="2022-2023">2022-2023</option>
                  <option value="2023-2024">2023-2024</option>
                </select>
              </label>
            </div>
            <div className="flex-1">
              <div className="flex">
                <div className="flex flex-col">
                  <p className="font-mono text-md">
                    latitude: {`${dblatitudesArray[dbcurrentIndex]}`}
                  </p>
                  <p className="font-mono text-md">
                    longitudes: {`${dblongitudesArray[dbcurrentIndex]}`}
                  </p>
                  <p className="font-mono text-md">
                    GPS Sats: {`${dbsatellitiesArray[dbcurrentIndex]}`}
                  </p>
                  <p className="font-mono text-md">
                    BME Pres: {`${dbPressuresArray[dbcurrentIndex]}`}
                  </p>
                  <p className="font-mono text-md">
                    {" "}
                    Atltitude:{`${dbaltitudes_gpsArray[dbcurrentIndex]}`}
                  </p>
                </div>
                <div className="flex-1"></div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  } else {
    return <></>;
  }
};

export default Databases;
