#![cfg_attr(
    all(not(debug_assertions), target_os = "windows"),
    windows_subsystem = "windows"
)]

mod database_operations;
mod file_operations;

use database_operations::{create_database, load_data};
use file_operations::create_file;

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
            load_data, //unified function to load data from database
            create_database,
        ])
        .plugin(tauri_plugin_serialport::init())
        .run(context)
        .expect("failed to run app");
}
