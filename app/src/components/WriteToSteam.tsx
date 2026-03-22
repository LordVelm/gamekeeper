import { useState, useEffect } from "react";
import {
  checkSteamRunning,
  getSteamAccounts,
  writeToSteam,
  SteamAccount,
} from "../lib/commands";

interface Props {
  onClose: () => void;
  totalGames: number;
}

type WritePhase = "checking" | "steam-running" | "select-account" | "writing" | "done" | "error";

export default function WriteToSteam({ onClose, totalGames }: Props) {
  const [phase, setPhase] = useState<WritePhase>("checking");
  const [accounts, setAccounts] = useState<SteamAccount[]>([]);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    checkStatus();
  }, []);

  async function checkStatus() {
    try {
      const running = await checkSteamRunning();
      if (running) {
        setPhase("steam-running");
        return;
      }

      const accts = await getSteamAccounts();
      setAccounts(accts);

      if (accts.length === 0) {
        setError("No Steam userdata directory found. Is Steam installed?");
        setPhase("error");
      } else if (accts.length === 1) {
        // Auto-select single account
        await doWrite(accts[0].path);
      } else {
        setPhase("select-account");
      }
    } catch (e) {
      setError(String(e));
      setPhase("error");
    }
  }

  async function doWrite(accountPath: string) {
    setPhase("writing");
    try {
      await writeToSteam(accountPath);
      setPhase("done");
    } catch (e) {
      setError(String(e));
      setPhase("error");
    }
  }

  async function handleRetryCheck() {
    setPhase("checking");
    setError(null);
    await checkStatus();
  }

  return (
    <div
      className="fixed inset-0 top-9 bg-black/60 flex items-center justify-center z-50 animate-fadeIn"
      onClick={onClose}
    >
      <div
        className="bg-steam-surface rounded-xl w-full max-w-md mx-4 p-6 border border-steam-border animate-scaleIn"
        onClick={(e) => e.stopPropagation()}
      >
        <h2 className="text-lg font-bold text-white mb-4">
          Write to Steam Collections
        </h2>

        {phase === "checking" && (
          <div className="flex items-center gap-3 text-steam-text-dim">
            <div className="w-5 h-5 border-2 border-steam-blue border-t-transparent rounded-full animate-spin" />
            Checking Steam status...
          </div>
        )}

        {phase === "steam-running" && (
          <div className="space-y-4">
            <div className="p-4 rounded-lg bg-red-900/20 border border-red-700/50">
              <div className="text-red-300 font-medium mb-1">
                Steam is running
              </div>
              <div className="text-sm text-red-300/70">
                Please close Steam completely before writing collections.
                <br />
                <span className="text-xs">
                  Steam tray icon → Exit Steam, or Task Manager → End Task
                </span>
              </div>
            </div>
            <div className="flex gap-2">
              <button
                onClick={handleRetryCheck}
                className="flex-1 py-2 rounded-lg bg-steam-blue text-white font-medium hover:bg-steam-blue-hover transition-colors"
              >
                Check again
              </button>
              <button
                onClick={onClose}
                className="flex-1 py-2 rounded-lg bg-steam-surface-light text-steam-text-dim hover:text-white transition-colors"
              >
                Cancel
              </button>
            </div>
          </div>
        )}

        {phase === "select-account" && (
          <div className="space-y-3">
            <div className="text-sm text-steam-text-dim mb-2">
              Multiple Steam accounts found. Select one:
            </div>
            {accounts.map((acct) => (
              <button
                key={acct.id}
                onClick={() => doWrite(acct.path)}
                className="w-full py-3 px-4 rounded-lg bg-steam-surface-light text-white text-left hover:bg-steam-blue/20 transition-colors border border-steam-border"
              >
                Account: {acct.id}
              </button>
            ))}
            <button
              onClick={onClose}
              className="w-full py-2 rounded-lg text-sm text-steam-text-dim hover:text-white transition-colors"
            >
              Cancel
            </button>
          </div>
        )}

        {phase === "writing" && (
          <div className="flex items-center gap-3 text-steam-text-dim">
            <div className="w-5 h-5 border-2 border-steam-blue border-t-transparent rounded-full animate-spin" />
            Writing {totalGames} games to Steam collections...
          </div>
        )}

        {phase === "done" && (
          <div className="space-y-4">
            <div className="p-4 rounded-lg bg-green-900/20 border border-green-700/50">
              <div className="text-green-300 font-medium mb-1">
                Collections written!
              </div>
              <div className="text-sm text-green-300/70">
                Start Steam to see your updated collections in the library sidebar.
              </div>
            </div>
            <div className="text-xs text-steam-text-dim">
              Created/updated: SBO: Completed, SBO: In Progress, SBO: Endless, SBO: Not a Game
            </div>
            <button
              onClick={onClose}
              className="w-full py-2 rounded-lg bg-steam-blue text-white font-medium hover:bg-steam-blue-hover transition-colors"
            >
              Done
            </button>
          </div>
        )}

        {phase === "error" && (
          <div className="space-y-4">
            <div className="p-4 rounded-lg bg-red-900/20 border border-red-700/50">
              <div className="text-red-300 font-medium mb-1">Error</div>
              <div className="text-sm text-red-300/70">{error}</div>
            </div>
            <button
              onClick={onClose}
              className="w-full py-2 rounded-lg bg-steam-surface-light text-steam-text-dim hover:text-white transition-colors"
            >
              Close
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
