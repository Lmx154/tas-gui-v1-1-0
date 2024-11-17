extern crate rusqlite;
use rusqlite::{Connection, Result};

#[tauri::command]
pub fn load_database_integer_database(
    column: String,
    database_name: String,
) -> Result<Vec<i32>, String> {
    let mut integer_vector = Vec::new();
    let column_name: &str = &column;
    let conn = match Connection::open(format!("{}.db", database_name)) {
        Ok(conn) => conn,
        Err(err) => return Err(format!("Error opening connection: {}", err.to_string())),
    };

    let mut stmt = match conn.prepare("SELECT * FROM flightData") {
        Ok(stmt) => stmt,
        Err(err) => return Err(format!("Error preparing statement: {}", err.to_string())),
    };

    let rows = match stmt.query_map([], |row| {
        let value: i32 = match row.get(column_name) {
            Ok(value) => value,
            Err(err) => return Err(err),
        };
        integer_vector.push(value);
        println!("This is the current year -> {:?}", value);
        Ok(value)
    }) {
        Ok(rows) => rows,
        Err(err) => return Err(format!("Error querying rows: {}", err.to_string())),
    };

    for _ in rows {
        println!("-");
    }

    Ok(integer_vector)
}

#[tauri::command]
pub fn create_database(
    user_specified_name: String,
    month: u32,
    day: u32,
    year: u32,
) -> Result<(), String> {
    let db_name = format!("{}_{}_{}_{}.db", user_specified_name, month, day, year);
    let conn = match Connection::open(&db_name) {
        Ok(conn) => conn,
        Err(err) => return Err(format!("Error opening connection: {}", err.to_string())),
    };

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

#[tauri::command]
pub fn load_database_string_database(
    column: String,
    database_name: String,
) -> Result<Vec<String>, String> {
    let mut string_vector = Vec::new();
    let column_name: &str = &column;
    let conn = match Connection::open(format!("{}.db", database_name)) {
        Ok(conn) => conn,
        Err(err) => return Err(format!("Error opening connection: {}", err.to_string())),
    };

    let mut stmt = match conn.prepare("SELECT * FROM flightData") {
        Ok(stmt) => stmt,
        Err(err) => return Err(format!("Error preparing statement: {}", err.to_string())),
    };

    let rows = match stmt.query_map([], |row| {
        let value: String = match row.get(column_name) {
            Ok(value) => value,
            Err(err) => return Err(err),
        };
        string_vector.push(value.clone());
        println!("This is the current year -> {:?}", value);
        Ok(value)
    }) {
        Ok(rows) => rows,
        Err(err) => return Err(format!("Error querying rows: {}", err.to_string())),
    };

    for _ in rows {
        println!("-");
    }

    Ok(string_vector)
}

#[tauri::command]
pub fn load_database_float_database(
    column: String,
    database_name: String,
) -> Result<Vec<f32>, String> {
    let mut float_vector = Vec::new();
    let column_name: &str = &column;
    let conn = match Connection::open(format!("{}.db", database_name)) {
        Ok(conn) => conn,
        Err(err) => return Err(format!("Error opening connection: {}", err.to_string())),
    };

    let mut stmt = match conn.prepare("SELECT * FROM flightData") {
        Ok(stmt) => stmt,
        Err(err) => return Err(format!("Error preparing statement: {}", err.to_string())),
    };

    let rows = match stmt.query_map([], |row| {
        let value: f32 = match row.get(column_name) {
            Ok(value) => value,
            Err(err) => return Err(err),
        };
        float_vector.push(value);
        println!("This is the current value -> {:?}", value);
        Ok(value)
    }) {
        Ok(rows) => rows,
        Err(err) => return Err(format!("Error querying rows: {}", err.to_string())),
    };

    for _ in rows {
        println!("-");
    }

    Ok(float_vector)
}
