use crate::classifier::Classification;
use crate::config;
use crate::steam_api::{OwnedGame, StoreDetails};
use serde::{Deserialize, Serialize};
use std::collections::HashMap;
use std::fs;
use std::time::{SystemTime, UNIX_EPOCH};

const LIBRARY_CACHE_MAX_AGE_SECS: u64 = 24 * 60 * 60; // 24 hours

#[derive(Serialize, Deserialize)]
struct LibraryCache {
    steam_id: String,
    timestamp: f64,
    games: Vec<OwnedGame>,
}

/// Load cached library data if fresh enough.
pub fn load_library_cache(steam_id: &str) -> Option<Vec<OwnedGame>> {
    let path = config::library_cache_file();
    if !path.exists() {
        return None;
    }

    let data = fs::read_to_string(&path).ok()?;
    let cache: LibraryCache = serde_json::from_str(&data).ok()?;

    if cache.steam_id != steam_id {
        return None;
    }

    let now = SystemTime::now()
        .duration_since(UNIX_EPOCH)
        .ok()?
        .as_secs_f64();
    if (now - cache.timestamp) > LIBRARY_CACHE_MAX_AGE_SECS as f64 {
        return None;
    }

    Some(cache.games)
}

/// Save library data to cache.
pub fn save_library_cache(steam_id: &str, games: &[OwnedGame]) -> Result<(), String> {
    let dir = config::cache_dir();
    fs::create_dir_all(&dir).map_err(|e| format!("Failed to create cache dir: {e}"))?;

    let now = SystemTime::now()
        .duration_since(UNIX_EPOCH)
        .map_err(|e| format!("Time error: {e}"))?
        .as_secs_f64();

    let cache = LibraryCache {
        steam_id: steam_id.into(),
        timestamp: now,
        games: games.to_vec(),
    };

    let data = serde_json::to_string_pretty(&cache)
        .map_err(|e| format!("Failed to serialize library cache: {e}"))?;
    fs::write(config::library_cache_file(), data)
        .map_err(|e| format!("Failed to write library cache: {e}"))
}

/// Load store details cache.
pub fn load_store_cache() -> HashMap<String, StoreDetails> {
    let path = config::store_cache_file();
    if !path.exists() {
        return HashMap::new();
    }
    let data = match fs::read_to_string(&path) {
        Ok(d) => d,
        Err(_) => return HashMap::new(),
    };
    serde_json::from_str(&data).unwrap_or_default()
}

/// Save store details cache.
pub fn save_store_cache(cache: &HashMap<String, StoreDetails>) -> Result<(), String> {
    let dir = config::cache_dir();
    fs::create_dir_all(&dir).map_err(|e| format!("Failed to create cache dir: {e}"))?;
    let data = serde_json::to_string_pretty(cache)
        .map_err(|e| format!("Failed to serialize store cache: {e}"))?;
    fs::write(config::store_cache_file(), data)
        .map_err(|e| format!("Failed to write store cache: {e}"))
}

/// Load saved classifications.
pub fn load_saved_classifications() -> HashMap<u64, Classification> {
    let path = config::classifications_file();
    if !path.exists() {
        return HashMap::new();
    }
    let data = match fs::read_to_string(&path) {
        Ok(d) => d,
        Err(_) => return HashMap::new(),
    };
    let list: Vec<Classification> = match serde_json::from_str(&data) {
        Ok(l) => l,
        Err(_) => return HashMap::new(),
    };
    list.into_iter().map(|c| (c.appid, c)).collect()
}

/// Save classifications to file.
pub fn save_classifications(classifications: &[Classification]) -> Result<(), String> {
    let dir = config::cache_dir();
    fs::create_dir_all(&dir).map_err(|e| format!("Failed to create cache dir: {e}"))?;
    let data = serde_json::to_string_pretty(classifications)
        .map_err(|e| format!("Failed to serialize classifications: {e}"))?;
    fs::write(config::classifications_file(), data)
        .map_err(|e| format!("Failed to write classifications: {e}"))
}

/// Load user overrides (appid string → category string).
pub fn load_overrides() -> HashMap<String, String> {
    let path = config::overrides_file();
    if !path.exists() {
        return HashMap::new();
    }
    let data = match fs::read_to_string(&path) {
        Ok(d) => d,
        Err(_) => return HashMap::new(),
    };
    serde_json::from_str(&data).unwrap_or_default()
}

/// Save user overrides.
pub fn save_overrides(overrides: &HashMap<String, String>) -> Result<(), String> {
    let dir = config::config_dir();
    fs::create_dir_all(&dir).map_err(|e| format!("Failed to create config dir: {e}"))?;
    let data = serde_json::to_string_pretty(overrides)
        .map_err(|e| format!("Failed to serialize overrides: {e}"))?;
    fs::write(config::overrides_file(), data)
        .map_err(|e| format!("Failed to write overrides: {e}"))
}
