#![cfg_attr(
    all(not(debug_assertions), target_os = "windows"),
    windows_subsystem = "windows"
)]

mod database_operations;
mod file_operations;

use database_operations::{create_database, load_data};
use file_operations::create_file;
// Import functions from the database_operations and file_operations modules.

fn main() {
    let context = tauri::generate_context!();

    tauri::Builder::default()
        .menu(if cfg!(target_os = "macos") {
            tauri::Menu::os_default(&context.package_info().name)
        } else {
            tauri::Menu::default()
        })
        .invoke_handler(tauri::generate_handler![
            create_file,
            load_data, // Unified function to load data from the database.
            create_database,
        ])
        // Register functions as commands that can be invoked from the frontend.
        .plugin(tauri_plugin_serialport::init())
        // Initialize the Tauri serialport plugin for serial port communication.
        .run(context)
        .expect("failed to run app");
    // Handle errors that occur while running the application.
}
