
import React, { useState } from 'react';
import { BoatFilters } from '../types';

interface Props {
  initialFilters: BoatFilters;
  onSave: (filters: BoatFilters) => void;
  onBack: () => void;
}

const AMENITIES_OPTIONS = [
  "探鱼器/顶流机", "夜钓照明", "卫生间", "诱鱼灯/活鱼舱", "WIFI", "对讲机/渔具"
];

const FilterSettings: React.FC<Props> = ({ initialFilters, onSave, onBack }) => {
  const [filters, setFilters] = useState<BoatFilters>(initialFilters);

  const toggleAmenity = (a: string) => {
    setFilters(prev => ({
      ...prev,
      amenities: prev.amenities.includes(a) 
        ? prev.amenities.filter(x => x !== a) 
        : [...prev.amenities, a]
    }));
  };

  return (
    <div className="flex flex-col h-full bg-white max-w-md mx-auto">
      <div className="p-4 flex items-center border-b">
        <button onClick={onBack} className="p-2">
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" /></svg>
        </button>
        <h2 className="flex-1 text-center font-bold text-lg mr-8">船只配置要求</h2>
      </div>

      <div className="flex-1 overflow-y-auto p-6 space-y-10">
        <section className="space-y-8">
          <div>
            <div className="flex justify-between items-center mb-6">
               <label className="text-sm font-bold text-gray-700 tracking-wide">船长要求 (L)</label>
               <span className="text-xl font-black text-blue-600">≥ {filters.length}m</span>
            </div>
            <input 
              type="range" min="1" max="60" 
              value={filters.length} 
              onChange={e => setFilters({...filters, length: parseInt(e.target.value)})}
              className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-blue-600"
            />
            <div className="flex justify-between text-[10px] text-gray-400 mt-2">
              <span>不限</span>
              <span>30米</span>
              <span>60米</span>
            </div>
          </div>

          <div>
            <div className="flex justify-between items-center mb-6">
               <label className="text-sm font-bold text-gray-700 tracking-wide">船宽要求 (W)</label>
               <span className="text-xl font-black text-blue-600">≥ {filters.width}m</span>
            </div>
            <input 
              type="range" min="1" max="10" 
              value={filters.width} 
              onChange={e => setFilters({...filters, width: parseInt(e.target.value)})}
              className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-blue-600"
            />
            <div className="flex justify-between text-[10px] text-gray-400 mt-2">
              <span>不限</span>
              <span>5米</span>
              <span>10米</span>
            </div>
          </div>
        </section>

        <section>
          <label className="block text-sm font-bold text-gray-700 mb-4">最小发动机功率 (HP)</label>
          <div className="relative">
            <input 
              type="number" 
              placeholder="请输入您期望的最小马力"
              value={filters.minPower}
              onChange={e => setFilters({...filters, minPower: e.target.value})}
              className="w-full bg-gray-50 p-4 pr-12 rounded-2xl outline-none border border-transparent focus:border-blue-300 font-bold transition-all"
            />
            <span className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 font-black text-xs">HP</span>
          </div>
          <p className="mt-2 text-[10px] text-gray-400 font-bold italic">仅匹配发动机马力大于或等于该数值的船只</p>
        </section>

        <section>
          <label className="block text-sm font-bold text-gray-700 mb-4">必需的功能配置</label>
          <div className="grid grid-cols-2 gap-3">
            {AMENITIES_OPTIONS.map(a => (
              <button
                key={a}
                onClick={() => toggleAmenity(a)}
                className={`p-4 rounded-2xl text-xs text-left border-2 transition-all flex items-center justify-between ${filters.amenities.includes(a) ? 'bg-blue-600 text-white border-blue-600 shadow-lg' : 'bg-gray-50 text-gray-600 border-gray-100'}`}
              >
                <span className="font-bold">{a}</span>
                {filters.amenities.includes(a) && <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" /></svg>}
              </button>
            ))}
          </div>
        </section>
      </div>

      <div className="p-6 border-t bg-white">
        <button 
          onClick={() => onSave(filters)}
          className="w-full bg-blue-600 text-white font-bold py-5 rounded-[20px] shadow-xl active:scale-[0.98] transition-transform"
        >
          确定配置要求
        </button>
      </div>
    </div>
  );
};

export default FilterSettings;
