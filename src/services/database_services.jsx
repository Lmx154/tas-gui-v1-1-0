import { invoke } from "@tauri-apps/api/tauri";

export const loadData = async (
  databaseSelected,
  setInformation,
  setStateFunctions,
) => {
  try {
    const data = await invoke("load_data", { databaseName: databaseSelected });

    data.forEach(([column, values]) => {
      if (setStateFunctions[column]) {
        setStateFunctions[column](values);
      }
    });

    setInformation("Data loaded successfully.");
  } catch (error) {
    console.error("Error loading data:", error);
    setInformation(`Error loading data: ${error}`);
  }
};

export const createDatabase = async (
  userSpecifiedName,
  month,
  day,
  year,
  setInformation,
) => {
  try {
    await invoke("create_database", {
      userSpecifiedName,
      month,
      day,
      year,
    });
    setInformation(
      `Database ${userSpecifiedName}_${month}_${day}_${year}.db created successfully.`,
    );
  } catch (error) {
    console.error("Error creating database:", error);
    setInformation(`Error creating database: ${error}`);
  }
};
