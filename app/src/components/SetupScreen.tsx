import { useState } from "react";
import { open } from "@tauri-apps/plugin-shell";
import { saveConfig, checkConfig } from "../lib/commands";

interface Props {
  onComplete: () => void;
  error: string | null;
  hasExistingConfig: boolean;
}

export default function SetupScreen({ onComplete, error, hasExistingConfig }: Props) {
  const [apiKey, setApiKey] = useState("");
  const [steamId, setSteamId] = useState("");
  const [saving, setSaving] = useState(false);
  const [localError, setLocalError] = useState<string | null>(null);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!apiKey.trim() || !steamId.trim()) {
      setLocalError("Both fields are required.");
      return;
    }

    setSaving(true);
    setLocalError(null);
    try {
      await saveConfig(apiKey.trim(), steamId.trim());
      onComplete();
    } catch (err) {
      setLocalError(String(err));
      setSaving(false);
    }
  }

  async function handleUseSaved() {
    onComplete();
  }

  return (
    <div className="flex items-center justify-center h-screen">
      <div className="w-full max-w-md p-8">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-white mb-2">
            Gamekeeper
          </h1>
          <p className="text-steam-text-dim">
            Your personal Steam library manager.
          </p>
        </div>

        <div className="mb-6 p-4 rounded-lg bg-steam-surface border border-steam-border">
          <h3 className="text-sm font-medium text-white mb-2">Getting started</h3>
          <ol className="text-xs text-steam-text-dim space-y-2 list-decimal list-inside">
            <li>
              Get a free Steam Web API Key at{" "}
              <button
                type="button"
                onClick={() => open("https://steamcommunity.com/dev/apikey")}
                className="text-steam-blue hover:underline"
              >
                steamcommunity.com/dev/apikey
              </button>
              {" "}(requires a Steam account)
            </li>
            <li>
              Find your Steam ID at{" "}
              <button
                type="button"
                onClick={() => open("https://steamid.io")}
                className="text-steam-blue hover:underline"
              >
                steamid.io
              </button>
              {" "}— copy the <span className="text-steam-text">steamID64</span> (17-digit number)
            </li>
            <li>Paste both below and click Save &amp; Sync</li>
          </ol>
        </div>

        {hasExistingConfig && (
          <button
            onClick={handleUseSaved}
            className="w-full mb-6 py-3 px-4 rounded-lg bg-steam-blue text-white font-semibold hover:bg-steam-blue-hover transition-colors"
          >
            Sync with saved config
          </button>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-steam-text mb-1">
              Steam Web API Key
            </label>
            <input
              type="password"
              value={apiKey}
              onChange={(e) => setApiKey(e.target.value)}
              placeholder="Your Steam API key"
              className="w-full px-3 py-2 rounded-lg bg-steam-surface border border-steam-border text-white placeholder-steam-text-dim focus:border-steam-blue focus:outline-none"
            />
            <p className="text-xs text-steam-text-dim mt-1">
              Get one free at{" "}
              <button
                type="button"
                onClick={() => open("https://steamcommunity.com/dev/apikey")}
                className="text-steam-blue hover:underline"
              >
                steamcommunity.com/dev/apikey
              </button>
            </p>
          </div>

          <div>
            <label className="block text-sm font-medium text-steam-text mb-1">
              Steam ID
            </label>
            <input
              type="text"
              value={steamId}
              onChange={(e) => setSteamId(e.target.value)}
              placeholder="Your 17-digit Steam ID or vanity URL"
              className="w-full px-3 py-2 rounded-lg bg-steam-surface border border-steam-border text-white placeholder-steam-text-dim focus:border-steam-blue focus:outline-none"
            />
          </div>

          {(error || localError) && (
            <div className="p-3 rounded-lg bg-red-900/30 border border-red-700 text-red-300 text-sm">
              {localError || error}
            </div>
          )}

          <button
            type="submit"
            disabled={saving}
            className="w-full py-3 px-4 rounded-lg bg-steam-surface-light text-white font-semibold hover:bg-steam-blue transition-colors disabled:opacity-50"
          >
            {saving ? "Saving..." : hasExistingConfig ? "Update & Sync" : "Save & Sync"}
          </button>
        </form>
      </div>
    </div>
  );
}
