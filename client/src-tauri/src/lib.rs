use serde::Serialize;
use std::process::Command;

#[derive(Serialize)]
struct ApexProcessInfo {
    running: bool,
    process_name: String,
    pid: Option<u32>,
}

#[tauri::command]
fn detect_apex_process() -> Result<ApexProcessInfo, String> {
    let output = Command::new("tasklist")
        .args(["/FI", "IMAGENAME eq r5apex.exe", "/FO", "CSV", "/NH"])
        .output()
        .map_err(|error| format!("failed to run tasklist: {error}"))?;

    let stdout = String::from_utf8_lossy(&output.stdout);
    let first_line = stdout.lines().next().unwrap_or("").trim();

    if first_line.is_empty() || first_line.contains("No tasks are running") || first_line.contains("没有运行的任务") {
        return Ok(ApexProcessInfo {
            running: false,
            process_name: "r5apex.exe".into(),
            pid: None,
        });
    }

    let columns: Vec<&str> = first_line.split(',').collect();
    let pid = columns
        .get(1)
        .and_then(|value| value.trim_matches('"').parse::<u32>().ok());

    Ok(ApexProcessInfo {
        running: true,
        process_name: "r5apex.exe".into(),
        pid,
    })
}

#[cfg_attr(mobile, tauri::mobile_entry_point)]
pub fn run() {
    tauri::Builder::default()
        .plugin(tauri_plugin_opener::init())
        .invoke_handler(tauri::generate_handler![detect_apex_process])
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}
