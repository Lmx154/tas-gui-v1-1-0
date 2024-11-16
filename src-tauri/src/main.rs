#![cfg_attr(
    all(not(debug_assertions), target_os = "windows"),
    windows_subsystem = "windows"
)]

mod database_operations;
mod file_operations;

use database_operations::{
    load_database_float_database, load_database_integer_database, load_database_string_database,
};
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
            load_database_integer_database,
            load_database_string_database,
            load_database_float_database,
        ])
        .plugin(tauri_plugin_serialport::init())
        .run(context)
        .expect("failed to run app");
}
