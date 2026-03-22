#!/usr/bin/env python3
"""
Export golden fixtures from the current Python organizer.

Reads cached data from %APPDATA%/SteamBacklogOrganizer and runs the
classifier to produce deterministic outputs. These fixtures are used
to validate the Rust port produces identical results.

Usage:
    cd steam-backlog-organizer
    python scripts/export_fixtures.py
"""

import json
import sys
from pathlib import Path

# Add repo root so we can import organizer
repo_root = Path(__file__).resolve().parent.parent
sys.path.insert(0, str(repo_root))

import organizer

FIXTURES_DIR = repo_root / "fixtures"
FIXTURES_DIR.mkdir(exist_ok=True)


def scrub_api_keys(config: dict) -> dict:
    """Remove sensitive fields from config before saving."""
    return {k: v for k, v in config.items() if "key" not in k.lower()}


def export_library():
    """Export cached library data."""
    cache_path = organizer.LIBRARY_CACHE
    if not cache_path.exists():
        print(f"ERROR: No library cache at {cache_path}")
        print("Run the organizer once first to populate the cache.")
        sys.exit(1)

    raw = json.loads(cache_path.read_text(encoding="utf-8"))
    games = raw.get("games", [])
    print(f"  Library: {len(games)} games")

    out = FIXTURES_DIR / "golden_library.json"
    out.write_text(json.dumps(games, indent=2), encoding="utf-8")
    print(f"  -> {out}")
    return games


def export_store_details():
    """Export cached store details."""
    cache_path = organizer.STORE_CACHE
    if not cache_path.exists():
        print(f"ERROR: No store cache at {cache_path}")
        sys.exit(1)

    store_cache = json.loads(cache_path.read_text(encoding="utf-8"))
    print(f"  Store details: {len(store_cache)} entries")

    out = FIXTURES_DIR / "golden_store_details.json"
    out.write_text(json.dumps(store_cache, indent=2), encoding="utf-8")
    print(f"  -> {out}")
    return store_cache


def export_overrides():
    """Export current overrides."""
    overrides = organizer.load_overrides()
    print(f"  Overrides: {len(overrides)} entries")

    out = FIXTURES_DIR / "golden_overrides.json"
    out.write_text(json.dumps(overrides, indent=2), encoding="utf-8")
    print(f"  -> {out}")
    return overrides


def export_classifications(games_data, store_cache, overrides):
    """
    Run classify_all_games with NO saved classifications so every game
    goes through the rule engine (or overrides). This gives us the pure
    rules-vs-overrides output to compare against.
    """
    # Pass empty saved dict so every game is classified fresh by rules
    saved_empty = {}
    all_classified = organizer.classify_all_games(
        games_data, saved_empty, overrides, store_cache
    )

    # Sort by appid for stable diffs
    all_classified.sort(key=lambda g: g["appid"])

    print(f"  Classifications: {len(all_classified)} games")

    # Summary
    cats = {}
    for g in all_classified:
        cat = g.get("category", "UNKNOWN")
        cats[cat] = cats.get(cat, 0) + 1
    for cat, count in sorted(cats.items()):
        print(f"    {cat}: {count}")

    out = FIXTURES_DIR / "golden_classifications.json"
    out.write_text(json.dumps(all_classified, indent=2), encoding="utf-8")
    print(f"  -> {out}")
    return all_classified


def export_collections_structure(all_classified):
    """
    Export the categories dict (the grouping that would be written to Steam).
    We don't export the actual Steam cloud format since that depends on
    existing collection IDs, timestamps, etc. Instead we export the
    logical grouping: { category: [appid, ...] } sorted for stable diffs.
    """
    categories = {"COMPLETED": [], "IN_PROGRESS": [], "ENDLESS": [], "NOT_A_GAME": []}
    for game in all_classified:
        cat = game.get("category", "ENDLESS")
        categories.setdefault(cat, []).append(game["appid"])

    for cat in categories:
        categories[cat].sort()

    total = sum(len(v) for v in categories.values())
    print(f"  Collections structure: {total} games across {len(categories)} categories")

    out = FIXTURES_DIR / "golden_collections_output.json"
    out.write_text(json.dumps(categories, indent=2), encoding="utf-8")
    print(f"  -> {out}")


def main():
    print("=== Steam Backlog Organizer — Golden Fixture Export ===\n")

    print("[1/5] Exporting library cache...")
    games = export_library()

    print("\n[2/5] Exporting store details cache...")
    store_cache = export_store_details()

    print("\n[3/5] Exporting overrides...")
    overrides = export_overrides()

    print("\n[4/5] Running fresh classification (rules + overrides only)...")
    all_classified = export_classifications(games, store_cache, overrides)

    print("\n[5/5] Exporting collections structure...")
    export_collections_structure(all_classified)

    print("\n=== Done! All fixtures written to fixtures/ ===")
    print("Commit these files to use as parity test baselines.")


if __name__ == "__main__":
    main()
