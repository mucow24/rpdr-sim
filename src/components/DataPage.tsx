import { useRef, useState } from 'react';
import { useStore } from '../store/useStore';

type Status = { text: string; id: number };

function downloadJson(filename: string, body: string) {
  const blob = new Blob([body], { type: 'application/json' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = filename;
  a.click();
  URL.revokeObjectURL(url);
}

function readFileAsJson(file: File): Promise<unknown> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onerror = () => reject(new Error('File read failed'));
    reader.onload = () => {
      try {
        resolve(JSON.parse(reader.result as string));
      } catch (err) {
        reject(err);
      }
    };
    reader.readAsText(file);
  });
}

export default function DataPage() {
  const reloadQueensFromSource = useStore((s) => s.reloadQueensFromSource);
  const reloadSeasonsFromSource = useStore((s) => s.reloadSeasonsFromSource);
  const importQueensJson = useStore((s) => s.importQueensJson);
  const exportQueensJson = useStore((s) => s.exportQueensJson);
  const importSeasonsJson = useStore((s) => s.importSeasonsJson);
  const exportSeasonsJson = useStore((s) => s.exportSeasonsJson);

  const queensInputRef = useRef<HTMLInputElement>(null);
  const seasonsInputRef = useRef<HTMLInputElement>(null);

  const [queensStatus, setQueensStatus] = useState<Status | null>(null);
  const [seasonsStatus, setSeasonsStatus] = useState<Status | null>(null);
  const statusIdRef = useRef(0);
  const queensTimerRef = useRef<number | null>(null);
  const seasonsTimerRef = useRef<number | null>(null);

  const showQueensStatus = (text: string) => {
    if (queensTimerRef.current) window.clearTimeout(queensTimerRef.current);
    const id = ++statusIdRef.current;
    setQueensStatus({ text, id });
    queensTimerRef.current = window.setTimeout(() => setQueensStatus(null), 3000);
  };

  const showSeasonsStatus = (text: string) => {
    if (seasonsTimerRef.current) window.clearTimeout(seasonsTimerRef.current);
    const id = ++statusIdRef.current;
    setSeasonsStatus({ text, id });
    seasonsTimerRef.current = window.setTimeout(() => setSeasonsStatus(null), 3000);
  };

  const handleReloadQueens = () => {
    if (
      window.confirm(
        'Reload queens from season files? Any manual calibrations will be discarded. Episode overrides will be preserved.',
      )
    ) {
      reloadQueensFromSource();
    }
  };

  const handleReloadSeasons = () => {
    if (
      window.confirm(
        'Reload seasons from season files? Any episode edits will be discarded. Queen stats will be preserved.',
      )
    ) {
      reloadSeasonsFromSource();
    }
  };

  const countQueensInJson = (json: string): number => {
    try {
      const parsed = JSON.parse(json) as Record<string, { queens?: unknown[] }>;
      return Object.values(parsed).reduce(
        (sum, s) => sum + (Array.isArray(s?.queens) ? s.queens.length : 0),
        0,
      );
    } catch {
      return 0;
    }
  };

  const countQueensInParsed = (parsed: unknown): number => {
    if (!parsed || typeof parsed !== 'object' || Array.isArray(parsed)) return 0;
    return Object.values(parsed as Record<string, { queens?: unknown[] }>).reduce(
      (sum, s) => sum + (Array.isArray(s?.queens) ? s.queens.length : 0),
      0,
    );
  };

  const countSeasonsInParsed = (parsed: unknown): number => {
    if (!parsed || typeof parsed !== 'object' || Array.isArray(parsed)) return 0;
    return Object.keys(parsed as Record<string, unknown>).length;
  };

  const handleExportQueens = () => {
    const json = exportQueensJson();
    downloadJson('rpdr-queens.json', json);
    showQueensStatus(`✅ ${countQueensInJson(json)} queens successfully exported`);
  };

  const handleExportSeasons = () => {
    const json = exportSeasonsJson();
    downloadJson('rpdr-seasons.json', json);
    const count = Object.keys(JSON.parse(json) as Record<string, unknown>).length;
    showSeasonsStatus(`✅ ${count} seasons successfully exported`);
  };

  const handleImportQueens = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    e.target.value = '';
    if (!file) return;
    try {
      const parsed = await readFileAsJson(file);
      const ok = importQueensJson(parsed);
      if (!ok) {
        alert('Invalid queens JSON — no changes applied.');
        return;
      }
      showQueensStatus(`✅ ${countQueensInParsed(parsed)} queens successfully imported`);
    } catch {
      alert('Could not parse JSON file.');
    }
  };

  const handleImportSeasons = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    e.target.value = '';
    if (!file) return;
    try {
      const parsed = await readFileAsJson(file);
      const ok = importSeasonsJson(parsed);
      if (!ok) {
        alert('Invalid seasons JSON — no changes applied.');
        return;
      }
      showSeasonsStatus(`✅ ${countSeasonsInParsed(parsed)} seasons successfully imported`);
    } catch {
      alert('Could not parse JSON file.');
    }
  };

  return (
    <div className="max-w-2xl space-y-6">
      <section className="bg-[#111118] border border-[#1a1a24] rounded-lg p-4">
        <h3 className="text-sm font-medium text-[#ddd] mb-1">Queens</h3>
        <p className="text-xs text-[#666] mb-3">
          Queen roster and per-stat ratings. Reload pulls fresh values from the
          season source files, discarding any manual calibration edits.
        </p>
        <div className="flex flex-wrap gap-2">
          <button
            onClick={handleReloadQueens}
            className="text-xs text-[#888] hover:text-[#ccc] bg-[#1a1a24] border border-[#2a2a3a] hover:border-[#3a3a4a] px-3 py-1.5 rounded transition-colors"
          >
            Reload queens from source
          </button>
          <button
            onClick={() => queensInputRef.current?.click()}
            className="text-xs text-[#888] hover:text-[#ccc] bg-[#1a1a24] border border-[#2a2a3a] hover:border-[#3a3a4a] px-3 py-1.5 rounded transition-colors"
          >
            Import queens JSON
          </button>
          <input
            ref={queensInputRef}
            type="file"
            accept=".json,application/json"
            onChange={handleImportQueens}
            className="hidden"
          />
          <button
            onClick={handleExportQueens}
            className="text-xs text-[#888] hover:text-[#ccc] bg-[#1a1a24] border border-[#2a2a3a] hover:border-[#3a3a4a] px-3 py-1.5 rounded transition-colors"
          >
            Export queens JSON
          </button>
        </div>
        <div className="h-4 mt-3" aria-live="polite">
          {queensStatus && (
            <p
              key={queensStatus.id}
              className="text-xs text-emerald-400 leading-4"
              style={{ animation: 'fadeOut 3s ease-out forwards' }}
            >
              {queensStatus.text}
            </p>
          )}
        </div>
      </section>

      <section className="bg-[#111118] border border-[#1a1a24] rounded-lg p-4">
        <h3 className="text-sm font-medium text-[#ddd] mb-1">Seasons</h3>
        <p className="text-xs text-[#666] mb-3">
          Season episodes, archetypes, and outcomes. Reload pulls fresh values
          from the season source files, discarding any episode edits made via
          the sim. Queen stats are preserved.
        </p>
        <div className="flex flex-wrap gap-2">
          <button
            onClick={handleReloadSeasons}
            className="text-xs text-[#888] hover:text-[#ccc] bg-[#1a1a24] border border-[#2a2a3a] hover:border-[#3a3a4a] px-3 py-1.5 rounded transition-colors"
          >
            Reload seasons from source
          </button>
          <button
            onClick={() => seasonsInputRef.current?.click()}
            className="text-xs text-[#888] hover:text-[#ccc] bg-[#1a1a24] border border-[#2a2a3a] hover:border-[#3a3a4a] px-3 py-1.5 rounded transition-colors"
          >
            Import seasons JSON
          </button>
          <input
            ref={seasonsInputRef}
            type="file"
            accept=".json,application/json"
            onChange={handleImportSeasons}
            className="hidden"
          />
          <button
            onClick={handleExportSeasons}
            className="text-xs text-[#888] hover:text-[#ccc] bg-[#1a1a24] border border-[#2a2a3a] hover:border-[#3a3a4a] px-3 py-1.5 rounded transition-colors"
          >
            Export seasons JSON
          </button>
        </div>
        <div className="h-4 mt-3" aria-live="polite">
          {seasonsStatus && (
            <p
              key={seasonsStatus.id}
              className="text-xs text-emerald-400 leading-4"
              style={{ animation: 'fadeOut 3s ease-out forwards' }}
            >
              {seasonsStatus.text}
            </p>
          )}
        </div>
      </section>
    </div>
  );
}
