// src/services/database_services.jsx
// This file contains the functions that are used to read data from the database.
// In the future, these functions should be moved to the backend.
// The functions are used in the database.jsx file.
// The functions are readDataInteger, readDataString, readDataFloat, and readAllData.
// Do NOT add any view logic in this file. The view logic should be in the database.jsx file.
import { invoke } from "@tauri-apps/api/tauri";

export const readDataInteger = async (
  name,
  databaseSelected,
  setInformation,
  setStateFunctions,
) => {
  try {
    const tableData = await invoke("load_database_integer_database", {
      column: name,
      databaseName: databaseSelected,
    });
    setStateFunctions[name](tableData);

    if (name === "years" || name === "months" || name === "days") {
      setInformation(`function works: ${name} ${tableData[0]}`);
    }
  } catch (error) {
    setInformation(error);
  }
};

export const readDataString = async (
  name,
  databaseSelected,
  setInformation,
  setStateFunctions,
) => {
  try {
    const tableData = await invoke("load_database_string_database", {
      column: name,
      databaseName: databaseSelected,
    });
    setStateFunctions[name](tableData);
  } catch (error) {
    setInformation(error);
  }
};

export const readDataFloat = async (
  name,
  databaseSelected,
  setInformation,
  setStateFunctions,
) => {
  try {
    const tableData = await invoke("load_database_float_database", {
      column: name,
      databaseName: databaseSelected,
    });
    setStateFunctions[name](tableData);

    if (name === "Accel_x" || name === "Accel_y" || name === "altitude_gps") {
      setInformation(`function works: ${name} ${tableData[0]}`);
    }
  } catch (error) {
    setInformation(error);
  }
};

export const readAllData = async (
  databaseSelected,
  setInformation,
  setStateFunctions,
) => {
  try {
    const promises = [];
    const integer_column_names = [
      "years",
      "months",
      "days",
      "fixquality",
      "satellities",
    ];
    const string_column_names = ["weekdays", "times"];
    const float_column_names = [
      "Accel_x",
      "Accel_y",
      "Accel_Z",
      "gx",
      "gy",
      "gz",
      "Temperature_C",
      "Temperature",
      "Pressures",
      "Altitudes",
      "Humidity",
      "fixs",
      "latitudes",
      "longitudes",
      "speed",
      "altitude_gps",
    ];

    integer_column_names.forEach((name) =>
      promises.push(
        readDataInteger(
          name,
          databaseSelected,
          setInformation,
          setStateFunctions,
        ),
      ),
    );
    string_column_names.forEach((name) =>
      promises.push(
        readDataString(
          name,
          databaseSelected,
          setInformation,
          setStateFunctions,
        ),
      ),
    );
    float_column_names.forEach((name) =>
      promises.push(
        readDataFloat(
          name,
          databaseSelected,
          setInformation,
          setStateFunctions,
        ),
      ),
    );

    await Promise.all(promises);
  } catch (error) {
    setInformation(error);
  }
};
