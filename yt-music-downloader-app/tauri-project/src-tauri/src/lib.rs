use std::path::PathBuf;
use serde::{Deserialize, Serialize};
use tauri::{Emitter, Window};
use tokio::process::Command as TokioCommand;
use uuid::Uuid;

#[derive(Debug, Serialize, Deserialize, Clone)]
pub struct DownloadInfo {
    pub id: String,
    pub url: String,
    pub title: String,
    pub duration: Option<String>,
    pub thumbnail: Option<String>,
    pub uploader: Option<String>,
}

#[derive(Debug, Serialize, Deserialize, Clone)]
pub struct DownloadProgress {
    pub id: String,
    pub status: String, // "downloading", "converting", "completed", "error"
    pub progress: f32,  // 0.0 to 100.0
    pub speed: Option<String>,
    pub eta: Option<String>,
    pub file_path: Option<String>,
}

#[derive(Debug, Serialize, Deserialize)]
pub struct SubscriptionStatus {
    pub active: bool,
    pub tier: String,
    pub downloads_used: u32,
    pub downloads_limit: Option<u32>,
}

#[derive(Debug, Serialize, Deserialize)]
pub struct USBDrive {
    pub name: String,
    pub path: String,
    pub capacity: u64,
    pub available: u64,
}

// Test function - can be removed later
#[tauri::command]
fn greet(name: &str) -> String {
    format!("Hello, {}! Welcome to YouTube Music Downloader Pro!", name)
}

// Get video/audio information from YouTube URL
#[tauri::command]
async fn get_video_info(url: String) -> Result<DownloadInfo, String> {
    let output = TokioCommand::new("yt-dlp")
        .args([
            "--dump-single-json",
            "--no-warnings",
            &url
        ])
        .output()
        .await
        .map_err(|e| format!("Failed to execute yt-dlp: {}", e))?;

    if !output.status.success() {
        let error = String::from_utf8_lossy(&output.stderr);
        return Err(format!("yt-dlp error: {}", error));
    }

    let json_str = String::from_utf8_lossy(&output.stdout);
    let json: serde_json::Value = serde_json::from_str(&json_str)
        .map_err(|e| format!("Failed to parse JSON: {}", e))?;

    let info = DownloadInfo {
        id: Uuid::new_v4().to_string(),
        url: url.clone(),
        title: json["title"].as_str().unwrap_or("Unknown").to_string(),
        duration: json["duration_string"].as_str().map(|s| s.to_string()),
        thumbnail: json["thumbnail"].as_str().map(|s| s.to_string()),
        uploader: json["uploader"].as_str().map(|s| s.to_string()),
    };

    Ok(info)
}

// Download audio from YouTube URL
#[tauri::command]
async fn download_audio(
    window: Window,
    url: String,
    output_path: String,
    quality: String,
) -> Result<String, String> {
    let download_id = Uuid::new_v4().to_string();

    // Emit initial progress
    let initial_progress = DownloadProgress {
        id: download_id.clone(),
        status: "starting".to_string(),
        progress: 0.0,
        speed: None,
        eta: None,
        file_path: None,
    };
    window.emit("download-progress", &initial_progress).ok();

    let quality_args = match quality.as_str() {
        "320" => vec!["--audio-quality", "0", "--audio-format", "mp3"],
        "256" => vec!["--audio-quality", "2", "--audio-format", "mp3"],
        "flac" => vec!["--audio-format", "flac"],
        _ => vec!["--audio-quality", "0", "--audio-format", "mp3"],
    };

    let output_template = format!("{}/%(title)s.%(ext)s", output_path);
    let mut cmd_args = vec![
        "--extract-audio",
        "--embed-metadata",
        "--embed-thumbnail",
        "--output", &output_template,
        &url,
    ];
    cmd_args.extend(quality_args);

    let mut child = TokioCommand::new("yt-dlp")
        .args(&cmd_args)
        .spawn()
        .map_err(|e| format!("Failed to spawn yt-dlp: {}", e))?;

    // Wait for the process to complete
    let status = child.wait().await
        .map_err(|e| format!("Failed to wait for yt-dlp: {}", e))?;

    if status.success() {
        let completed_progress = DownloadProgress {
            id: download_id.clone(),
            status: "completed".to_string(),
            progress: 100.0,
            speed: None,
            eta: None,
            file_path: Some(output_path.clone()),
        };
        window.emit("download-progress", &completed_progress).ok();
        Ok(download_id)
    } else {
        let error_progress = DownloadProgress {
            id: download_id.clone(),
            status: "error".to_string(),
            progress: 0.0,
            speed: None,
            eta: None,
            file_path: None,
        };
        window.emit("download-progress", &error_progress).ok();
        Err("Download failed".to_string())
    }
}

// Get list of available USB drives
#[tauri::command]
async fn get_usb_drives() -> Result<Vec<USBDrive>, String> {
    #[cfg(target_os = "macos")]
    {
        get_usb_drives_macos().await
    }
    #[cfg(target_os = "windows")]
    {
        get_usb_drives_windows().await
    }
    #[cfg(target_os = "linux")]
    {
        get_usb_drives_linux().await
    }
}

#[cfg(target_os = "macos")]
async fn get_usb_drives_macos() -> Result<Vec<USBDrive>, String> {
    let output = TokioCommand::new("df")
        .args(["-h"])
        .output()
        .await
        .map_err(|e| format!("Failed to execute df: {}", e))?;

    let output_str = String::from_utf8_lossy(&output.stdout);
    let mut drives = Vec::new();

    for line in output_str.lines().skip(1) {
        if line.contains("/Volumes/") && !line.contains("com.apple.TimeMachine") {
            let parts: Vec<&str> = line.split_whitespace().collect();
            if parts.len() >= 9 {
                let name = parts[8].split('/').last().unwrap_or("Unknown").to_string();
                let path = parts[8].to_string();

                drives.push(USBDrive {
                    name,
                    path,
                    capacity: 0, // Would need additional parsing
                    available: 0,
                });
            }
        }
    }

    Ok(drives)
}

#[cfg(target_os = "windows")]
async fn get_usb_drives_windows() -> Result<Vec<USBDrive>, String> {
    // Windows implementation using wmic or PowerShell
    let output = TokioCommand::new("wmic")
        .args(["logicaldisk", "get", "deviceid,description,size,freespace", "/format:csv"])
        .output()
        .await
        .map_err(|e| format!("Failed to execute wmic: {}", e))?;

    let output_str = String::from_utf8_lossy(&output.stdout);
    let mut drives = Vec::new();

    for line in output_str.lines().skip(1) {
        if line.contains("Removable Disk") {
            let parts: Vec<&str> = line.split(',').collect();
            if parts.len() >= 4 {
                drives.push(USBDrive {
                    name: format!("USB Drive ({})", parts[1]),
                    path: parts[1].to_string(),
                    capacity: parts[3].parse().unwrap_or(0),
                    available: parts[2].parse().unwrap_or(0),
                });
            }
        }
    }

    Ok(drives)
}

#[cfg(target_os = "linux")]
async fn get_usb_drives_linux() -> Result<Vec<USBDrive>, String> {
    // Linux implementation using lsblk
    let output = TokioCommand::new("lsblk")
        .args(["-o", "NAME,MOUNTPOINT,SIZE,AVAIL,TRAN", "-J"])
        .output()
        .await
        .map_err(|e| format!("Failed to execute lsblk: {}", e))?;

    let output_str = String::from_utf8_lossy(&output.stdout);
    let json: serde_json::Value = serde_json::from_str(&output_str)
        .map_err(|e| format!("Failed to parse lsblk JSON: {}", e))?;

    let mut drives = Vec::new();

    if let Some(blockdevices) = json["blockdevices"].as_array() {
        for device in blockdevices {
            if device["tran"].as_str() == Some("usb") {
                if let Some(mountpoint) = device["mountpoint"].as_str() {
                    drives.push(USBDrive {
                        name: device["name"].as_str().unwrap_or("Unknown").to_string(),
                        path: mountpoint.to_string(),
                        capacity: 0, // Would need size parsing
                        available: 0,
                    });
                }
            }
        }
    }

    Ok(drives)
}

// Verify subscription status with the Vercel API
#[tauri::command]
async fn verify_subscription(token: String) -> Result<SubscriptionStatus, String> {
    let client = reqwest::Client::new();

    let response = client
        .get("https://your-vercel-site.vercel.app/api/subscription/verify")
        .bearer_auth(token)
        .send()
        .await
        .map_err(|e| format!("Failed to verify subscription: {}", e))?;

    if response.status().is_success() {
        let status: SubscriptionStatus = response.json().await
            .map_err(|e| format!("Failed to parse response: {}", e))?;
        Ok(status)
    } else {
        Err("Subscription verification failed".to_string())
    }
}

// Copy files to USB drive
#[tauri::command]
async fn copy_to_usb(source_path: String, usb_path: String) -> Result<bool, String> {
    let source = PathBuf::from(&source_path);
    let destination = PathBuf::from(&usb_path).join(source.file_name().unwrap_or_default());

    tokio::fs::copy(&source, &destination)
        .await
        .map_err(|e| format!("Failed to copy file: {}", e))?;

    Ok(true)
}

// Select folder dialog
#[tauri::command]
async fn select_folder() -> Result<String, String> {
    // This would open a folder selection dialog
    // For now, return a default path
    Ok(String::from("/Users/Downloads"))
}

#[cfg_attr(mobile, tauri::mobile_entry_point)]
pub fn run() {
    tauri::Builder::default()
        .plugin(tauri_plugin_opener::init())
        .plugin(tauri_plugin_fs::init())
        .plugin(tauri_plugin_dialog::init())
        .plugin(tauri_plugin_http::init())
        .invoke_handler(tauri::generate_handler![
            greet,
            get_video_info,
            download_audio,
            get_usb_drives,
            verify_subscription,
            copy_to_usb,
            select_folder
        ])
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}