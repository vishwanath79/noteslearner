'use client';

import { useState } from 'react';

interface Settings {
  darkMode: boolean;
  autoAdvance: boolean;
  autoAdvanceDelay: number;
  keyboardShortcuts: boolean;
}

export default function SettingsPanel() {
  const [settings, setSettings] = useState<Settings>(() => {
    // Load settings from localStorage or use defaults
    const saved = localStorage.getItem('notes-learner-settings');
    return saved ? JSON.parse(saved) : {
      darkMode: false,
      autoAdvance: false,
      autoAdvanceDelay: 5,
      keyboardShortcuts: true,
    };
  });

  const updateSetting = <K extends keyof Settings>(key: K, value: Settings[K]) => {
    const newSettings = { ...settings, [key]: value };
    setSettings(newSettings);
    localStorage.setItem('notes-learner-settings', JSON.stringify(newSettings));
  };

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
      <h2 className="text-xl font-bold mb-4 text-gray-800 dark:text-white">Settings</h2>
      
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <label className="text-gray-700 dark:text-gray-300">Dark Mode</label>
          <input
            type="checkbox"
            checked={settings.darkMode}
            onChange={(e) => updateSetting('darkMode', e.target.checked)}
            className="toggle"
          />
        </div>

        <div className="flex items-center justify-between">
          <label className="text-gray-700 dark:text-gray-300">Auto Advance</label>
          <input
            type="checkbox"
            checked={settings.autoAdvance}
            onChange={(e) => updateSetting('autoAdvance', e.target.checked)}
            className="toggle"
          />
        </div>

        {settings.autoAdvance && (
          <div className="flex items-center justify-between">
            <label className="text-gray-700 dark:text-gray-300">
              Auto Advance Delay (seconds)
            </label>
            <input
              type="number"
              min="1"
              max="30"
              value={settings.autoAdvanceDelay}
              onChange={(e) => updateSetting('autoAdvanceDelay', Number(e.target.value))}
              className="w-20 px-2 py-1 border rounded"
            />
          </div>
        )}

        <div className="flex items-center justify-between">
          <label className="text-gray-700 dark:text-gray-300">Keyboard Shortcuts</label>
          <input
            type="checkbox"
            checked={settings.keyboardShortcuts}
            onChange={(e) => updateSetting('keyboardShortcuts', e.target.checked)}
            className="toggle"
          />
        </div>
      </div>

      <div className="mt-6 p-4 bg-gray-100 dark:bg-gray-700 rounded">
        <h3 className="text-sm font-bold mb-2 text-gray-700 dark:text-gray-300">
          Keyboard Shortcuts
        </h3>
        <ul className="text-sm text-gray-600 dark:text-gray-400 space-y-1">
          <li>→ or Space: Next card</li>
          <li>← : Previous card</li>
          <li>L: Switch to Learn mode</li>
          <li>R: Switch to Review mode</li>
          <li>S: Toggle settings</li>
        </ul>
      </div>
    </div>
  );
}