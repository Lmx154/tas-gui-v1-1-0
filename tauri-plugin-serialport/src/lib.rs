use tauri::{
    plugin::{Builder, TauriPlugin},
    Manager, Runtime,
};
// Import necessary components from the Tauri framework.

use command::{
    available_ports, cancel_read, close, close_all, force_close, open, read, write, write_binary,
};
use state::SerialportState;
use std::{
    collections::HashMap,
    sync::{Arc, Mutex},
};
// Import commands and state management for serial port operations, and standard library components for synchronization and collections.

mod command;
mod error;
mod state;
// Declare modules for commands, error handling, and state management.

/// Initializes the plugin.
pub fn init<R: Runtime>() -> TauriPlugin<R> {
    Builder::new("serialport")
        .invoke_handler(tauri::generate_handler![
            available_ports,
            cancel_read,
            close,
            close_all,
            force_close,
            open,
            read,
            write,
            write_binary,
        ])
        // Register the serial port command handlers that can be invoked from the frontend.
        .setup(move |app_handle| {
            app_handle.manage(SerialportState {
                serialports: Arc::new(Mutex::new(HashMap::new())),
            });
            // Set up the initial state for managing serial ports, using a thread-safe HashMap.

            Ok(())
        })
        .build()
    // Build and return the Tauri plugin.
}
