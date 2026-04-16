import { useRef } from 'react';
import { useStore } from '../store/useStore';

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

  const handleExportQueens = () => {
    downloadJson('rpdr-queens.json', exportQueensJson());
  };

  const handleExportSeasons = () => {
    downloadJson('rpdr-seasons.json', exportSeasonsJson());
  };

  const handleImportQueens = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    e.target.value = '';
    if (!file) return;
    try {
      const parsed = await readFileAsJson(file);
      const ok = importQueensJson(parsed);
      if (!ok) alert('Invalid queens JSON — no changes applied.');
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
      if (!ok) alert('Invalid seasons JSON — no changes applied.');
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
            className="text-xs text-amber-300 bg-amber-500/20 hover:bg-amber-500/30 border border-amber-500/40 px-3 py-1.5 rounded transition-colors font-medium"
          >
            Export queens JSON
          </button>
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
            className="text-xs text-amber-300 bg-amber-500/20 hover:bg-amber-500/30 border border-amber-500/40 px-3 py-1.5 rounded transition-colors font-medium"
          >
            Export seasons JSON
          </button>
        </div>
      </section>
    </div>
  );
}
