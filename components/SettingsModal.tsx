
import React from 'react';
import { Settings } from '../types';

interface SettingsModalProps {
  settings: Settings;
  onSettingsChange: (newSettings: Settings) => void;
  onClose: () => void;
}

const Toggle: React.FC<{ label: string; enabled: boolean; onToggle: () => void }> = ({ label, enabled, onToggle }) => (
    <div className="flex justify-between items-center w-full">
        <span className="text-lg text-cyan-200">{label}</span>
        <button 
            onClick={onToggle}
            className={`w-14 h-8 rounded-full p-1 transition-colors duration-300 focus:outline-none focus:ring-2 focus:ring-cyan-400 ${enabled ? 'bg-cyan-500' : 'bg-gray-600'}`}
        >
            <div className={`w-6 h-6 rounded-full bg-white transform transition-transform duration-300 ${enabled ? 'translate-x-6' : 'translate-x-0'}`} />
        </button>
    </div>
);


export const SettingsModal: React.FC<SettingsModalProps> = ({ settings, onSettingsChange, onClose }) => {
  return (
    <div className="fixed inset-0 bg-black bg-opacity-70 flex items-center justify-center z-50 backdrop-blur-sm">
      <div className="bg-gray-900 border border-cyan-500 p-8 rounded-xl w-full max-w-md m-4 neon-box">
        <h2 className="text-3xl font-bold text-center mb-6 text-cyan-400 neon-text-cyan">Settings</h2>
        <div className="space-y-6">
          <Toggle 
            label="Music" 
            enabled={settings.music} 
            onToggle={() => onSettingsChange({ ...settings, music: !settings.music })}
          />
          <Toggle 
            label="Sound FX" 
            enabled={settings.sound} 
            onToggle={() => onSettingsChange({ ...settings, sound: !settings.sound })}
          />
          <Toggle 
            label="Vibration" 
            enabled={settings.vibration} 
            onToggle={() => onSettingsChange({ ...settings, vibration: !settings.vibration })}
          />
        </div>
        <button
          onClick={onClose}
          className="mt-8 w-full bg-cyan-500/20 border border-cyan-500 text-cyan-300 py-3 rounded-lg font-bold text-xl transition-all duration-300 hover:bg-cyan-500/40 hover:text-white neon-box"
        >
          Close
        </button>
      </div>
    </div>
  );
};
