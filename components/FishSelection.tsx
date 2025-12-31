
import React, { useState } from 'react';
import { FISH_TYPES } from '../constants';

interface Props {
  initialSelection: string[];
  onSave: (selection: string[]) => void;
  onBack: () => void;
}

const FishSelection: React.FC<Props> = ({ initialSelection, onSave, onBack }) => {
  const [selected, setSelected] = useState<string[]>(initialSelection);

  const toggleFish = (fish: string) => {
    setSelected(prev => 
      prev.includes(fish) ? prev.filter(f => f !== fish) : [...prev, fish]
    );
  };

  return (
    <div className="flex flex-col h-full bg-white max-w-md mx-auto">
      <div className="p-4 flex items-center border-b">
        <button onClick={onBack} className="p-2">
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" /></svg>
        </button>
        <h2 className="flex-1 text-center font-bold text-lg mr-8">选择目标鱼种</h2>
      </div>

      <div className="flex-1 overflow-y-auto p-6">
        <p className="text-gray-400 text-sm mb-6">我们将把您的期望通知给擅长钓这些鱼种的船长。</p>
        <div className="grid grid-cols-2 gap-4">
          {FISH_TYPES.map(fish => (
            <button
              key={fish}
              onClick={() => toggleFish(fish)}
              className={`p-5 rounded-[24px] border-2 transition-all flex flex-col items-center justify-center space-y-2 ${selected.includes(fish) ? 'bg-blue-600 border-blue-600 text-white shadow-lg scale-[1.02]' : 'bg-gray-50 border-gray-100 text-gray-700'}`}
            >
              <span className="text-2xl">🐟</span>
              <span className="font-bold text-sm">{fish}</span>
            </button>
          ))}
        </div>
      </div>

      <div className="p-6 border-t">
        <button 
          onClick={() => onSave(selected)}
          className="w-full bg-blue-600 text-white font-bold py-4 rounded-2xl shadow-xl transition-all"
        >
          选好了 ({selected.length})
        </button>
      </div>
    </div>
  );
};

export default FishSelection;
