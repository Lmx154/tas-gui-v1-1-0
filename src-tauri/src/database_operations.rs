extern crate rusqlite;
use rusqlite::types::Type;
use rusqlite::{Connection, Result};

#[tauri::command]
pub fn load_data(database_name: String) -> Result<Vec<(String, Vec<String>)>, String> {
    // Load data from the specified database and return it as a vector of column names and their values.
    let column_types = get_column_types(database_name.clone())?;
    let conn = match Connection::open(format!("{}.db", database_name)) {
        Ok(conn) => conn,
        Err(err) => return Err(format!("Error opening connection: {}", err.to_string())),
    };

    let mut data = Vec::new();

    for (column_name, data_type) in column_types {
        println!("Loading column: {} with type: {}", column_name, data_type);
        let mut stmt = match conn.prepare(&format!("SELECT {} FROM flightData", column_name)) {
            Ok(stmt) => stmt,
            Err(err) => return Err(format!("Error preparing statement: {}", err.to_string())),
        };

        let mut column_data = Vec::new();

        let rows = stmt.query_map([], |row| {
            let value: String = match data_type.as_str() {
                "INTEGER" => row.get::<_, i32>(0).map(|v| v.to_string()),
                "REAL" => row.get::<_, f32>(0).map(|v| v.to_string()),
                "TEXT" => row.get::<_, String>(0),
                _ => {
                    let error_message = format!("Invalid column type: {}", data_type);
                    println!("{}", error_message);
                    return Err(rusqlite::Error::InvalidColumnType(
                        0,
                        data_type.clone(),
                        Type::Text,
                    ));
                }
            }?;
            column_data.push(value);
            Ok(())
        });

        match rows {
            Ok(rows) => {
                for row in rows {
                    if let Err(err) = row {
                        let error_message =
                            format!("Error collecting rows for column {}: {}", column_name, err);
                        println!("{}", error_message);
                        return Err(error_message);
                    }
                }
            }
            Err(err) => {
                let error_message =
                    format!("Error querying rows for column {}: {}", column_name, err);
                println!("{}", error_message);
                return Err(error_message);
            }
        }

        data.push((column_name, column_data));
    }

    Ok(data)
}

#[tauri::command]
pub fn get_column_types(database_name: String) -> Result<Vec<(String, String)>, String> {
    // Get the column names and types from the specified database.
    let conn = match Connection::open(format!("{}.db", database_name)) {
        Ok(conn) => conn,
        Err(err) => return Err(format!("Error opening connection: {}", err.to_string())),
    };

    let mut stmt = match conn.prepare("PRAGMA table_info(flightData)") {
        Ok(stmt) => stmt,
        Err(err) => return Err(format!("Error preparing statement: {}", err.to_string())),
    };

    let column_info = match stmt.query_map([], |row| {
        let name: String = row.get(1)?;
        let data_type: String = row.get(2)?;
        Ok((name, data_type))
    }) {
        Ok(rows) => rows.collect::<Result<Vec<_>, _>>().map_err(|err| {
            let error_message = format!("Error collecting column info: {}", err);
            println!("{}", error_message);
            error_message
        })?,
        Err(err) => {
            let error_message = format!("Error querying column info: {}", err);
            println!("{}", error_message);
            return Err(error_message);
        }
    };

    Ok(column_info)
}

#[tauri::command]
pub fn create_database(
    user_specified_name: String,
    month: u32,
    day: u32,
    year: u32,
) -> Result<(), String> {
    // Create a new database with the specified name and date, and set up the flightData table schema.
    let db_name = format!("{}_{}_{}_{}.db", user_specified_name, month, day, year);
    let conn = match Connection::open(&db_name) {
        Ok(conn) => conn,
        Err(err) => return Err(format!("Error opening connection: {}", err.to_string())),
    };
    //DATABASE SCHEMA SPECIFIED HERE
    let create_table_query = r#"
        CREATE TABLE IF NOT EXISTS "flightData" (
            "years" INTEGER,
            "months" INTEGER,
            "days" INTEGER,
            "weekdays" TEXT,
            "times" TEXT,
            "Accel_x" REAL,
            "Accel_y" REAL,
            "Accel_Z" REAL,
            "gx" REAL,
            "gy" REAL,
            "gz" REAL,
            "Temperature_C" REAL,
            "Temperature" REAL,
            "Pressures" REAL,
            "Altitudes" REAL,
            "Humidity" REAL,
            "fixs" REAL,
            "fixquality" INTEGER,
            "latitudes" REAL,
            "longitudes" REAL,
            "speed" REAL,
            "altitude_gps" REAL,
            "satellities" INTEGER
        );
    "#;

    match conn.execute(create_table_query, []) {
        Ok(_) => Ok(()),
        Err(err) => Err(format!("Error creating table: {}", err.to_string())),
    }
}
