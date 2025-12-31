
import React, { useState } from 'react';
import { RoutePreset } from '../../types';
import { STATIC_ASSETS } from '../../constants';

interface Boat {
  id: string;
  name: string;
  image: string;
  specs: string;
  refSharePrice: number;
  refCharterPrice: number;
}

const MOCK_BOATS: Boat[] = [
  { id: 'boat-1', name: '海狼 Pro-42', image: STATIC_ASSETS.BOAT_FAR, specs: '42尺双发专业深海快艇', refSharePrice: 1200, refCharterPrice: 5800 },
  { id: 'boat-2', name: '极光号路亚', image: STATIC_ASSETS.BOAT_NEAR, specs: '32尺精品路亚快艇', refSharePrice: 480, refCharterPrice: 2800 },
];

const SERVICE_OPTIONS = [
  { id: 'gear', label: '渔具', icon: '🎣' },
  { id: 'bait', label: '鱼饵', icon: '🧊' },
  { id: 'insurance', label: '保险', icon: '🛡️' },
  { id: 'drinks', label: '饮水', icon: '🥤' },
  { id: 'guide', label: '向导', icon: '👨‍🏫' },
  { id: 'media', label: '拍摄', icon: '📸' },
  { id: 'other', label: '其他', icon: '✨' },
];

interface Props {
  initialRoute?: RoutePreset;
  onSave: (route: RoutePreset) => void;
  onBack: () => void;
}

const CaptainRouteEditor: React.FC<Props> = ({ initialRoute, onSave, onBack }) => {
  const [route, setRoute] = useState<RoutePreset>(initialRoute || {
    id: 'route-' + Date.now(),
    name: '', 
    description: '',
    oceanType: 'NEAR',
    destination: '',
    targetFish: '',
    fishingSet: '',
    gearIncluded: '',
    baitIncluded: '',
    otherItems: '', 
    sharePrice: 0,
    charterPrice: 0,
    includedServices: ['gear', 'bait', 'insurance'],
  });

  const [activeBoat, setActiveBoat] = useState<Boat>(MOCK_BOATS[0]);
  const [showBoatPicker, setShowBoatPicker] = useState(false);

  const generatedName = (route.destination && route.targetFish) 
    ? `${route.destination}钓${route.targetFish}` 
    : '';

  const handleSave = () => {
    if (!route.destination.trim() || !route.targetFish?.trim()) {
      alert("请填写目标钓点和主攻鱼种");
      return;
    }
    onSave({ ...route, name: generatedName });
  };

  const toggleService = (id: string) => {
    setRoute(prev => ({
      ...prev,
      includedServices: prev.includedServices.includes(id)
        ? prev.includedServices.filter(s => s !== id)
        : [...prev.includedServices, id]
    }));
  };

  return (
    <div className="flex flex-col h-full bg-slate-950 text-slate-200">
      {/* Header */}
      <div className="px-6 pt-12 pb-6 flex items-center justify-between bg-slate-900/80 backdrop-blur-xl sticky top-0 z-50 border-b border-slate-800">
        <button onClick={onBack} className="p-2 -ml-2 text-slate-400 hover:text-white transition-colors">
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M15 19l-7-7 7-7" /></svg>
        </button>
        <div className="text-center">
          <h2 className="text-sm font-black italic tracking-widest uppercase">发布 <span className="text-blue-500">海钓方案</span></h2>
          <p className="text-[8px] text-slate-600 font-bold uppercase tracking-[0.2em] mt-0.5 italic">Professional Studio</p>
        </div>
        <button onClick={handleSave} className="text-xs font-black text-blue-500 uppercase italic tracking-tighter hover:text-blue-400">完成发布</button>
      </div>

      <div className="flex-1 overflow-y-auto p-6 space-y-10 no-scrollbar pb-44">
        
        {/* Card 1: 核心航行定位 */}
        <section className="space-y-4">
           <div className="flex items-center justify-between px-1">
              <h3 className="text-[10px] text-slate-500 font-black uppercase tracking-widest italic flex items-center">
                 <span className="w-1.5 h-1.5 rounded-full bg-blue-500 mr-2 shadow-[0_0_8px_rgba(59,130,246,0.6)]"></span>
                 航线基础定位 / Identity
              </h3>
              <span className="text-[8px] text-blue-500/50 font-black uppercase tracking-tighter italic">Step 01</span>
           </div>

           <div className="bg-slate-900 border border-slate-800 rounded-[32px] p-6 space-y-6 shadow-2xl relative overflow-hidden">
              <div className="flex p-1 bg-slate-950 rounded-2xl border border-slate-800 relative z-10">
                <button onClick={() => setRoute({...route, oceanType: 'NEAR'})} className={`flex-1 py-3 rounded-xl text-[10px] font-black transition-all ${route.oceanType === 'NEAR' ? 'bg-emerald-500 text-white shadow-lg' : 'text-slate-600'}`}>近海线路</button>
                <button onClick={() => setRoute({...route, oceanType: 'FAR'})} className={`flex-1 py-3 rounded-xl text-[10px] font-black transition-all ${route.oceanType === 'FAR' ? 'bg-indigo-500 text-white shadow-lg' : 'text-slate-600'}`}>远海航线</button>
              </div>

              <div className="grid gap-5 relative z-10">
                 <div className="space-y-2">
                    <label className="text-[9px] text-slate-600 font-black uppercase ml-1 italic tracking-widest leading-none">目标钓点</label>
                    <input 
                      value={route.destination}
                      onChange={e => setRoute({...route, destination: e.target.value})}
                      placeholder="手动输入钓点名称"
                      className="w-full bg-slate-950 border border-slate-800 rounded-2xl p-4 text-sm font-black text-white outline-none focus:border-blue-500 transition-all shadow-inner"
                    />
                 </div>

                 <div className="space-y-2">
                    <label className="text-[9px] text-slate-600 font-black uppercase ml-1 italic tracking-widest leading-none">主攻鱼种</label>
                    <input 
                      value={route.targetFish}
                      onChange={e => setRoute({...route, targetFish: e.target.value})}
                      placeholder="手动输入主攻鱼类"
                      className="w-full bg-slate-950 border border-slate-800 rounded-2xl p-4 text-sm font-black text-white outline-none focus:border-blue-500 transition-all shadow-inner"
                    />
                 </div>
              </div>

              {generatedName && (
                <div className="pt-4 border-t border-slate-800/50">
                   <p className="text-[8px] text-slate-600 font-black uppercase mb-1 tracking-widest">方案名称预览</p>
                   <p className="text-xl font-black italic text-blue-400">“{generatedName}”</p>
                </div>
              )}
           </div>
        </section>

        {/* Card 2: 经营定价 */}
        <section className="space-y-4">
           <div className="flex items-center justify-between px-1">
              <h3 className="text-[10px] text-slate-500 font-black uppercase tracking-widest italic flex items-center">
                 <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 mr-2 shadow-[0_0_8px_rgba(16,185,129,0.6)]"></span>
                 价格与执航船只 / Business
              </h3>
              <span className="text-[8px] text-emerald-500/50 font-black uppercase tracking-tighter italic">Step 02</span>
           </div>

           <div className="bg-slate-900 border border-slate-800 rounded-[32px] overflow-hidden shadow-2xl">
              <button onClick={() => setShowBoatPicker(true)} className="w-full p-6 flex items-center justify-between border-b border-slate-800 hover:bg-slate-800/50 transition-colors">
                 <div className="flex items-center space-x-4 text-left">
                    <div className="w-16 h-12 bg-slate-950 rounded-xl overflow-hidden border border-slate-800">
                       <img src={activeBoat.image} className="w-full h-full object-cover" alt="Boat" />
                    </div>
                    <div>
                       <p className="text-xs font-black text-white italic">{activeBoat.name}</p>
                       <p className="text-[9px] text-slate-600 font-bold uppercase mt-1">{activeBoat.specs}</p>
                    </div>
                 </div>
                 <div className="bg-blue-600/10 text-blue-400 px-3 py-1.5 rounded-lg border border-blue-500/20 text-[9px] font-black italic uppercase">切换</div>
              </button>

              <div className="p-8 space-y-6 bg-slate-900/40">
                 <div className="grid grid-cols-2 gap-6">
                    <div className="space-y-3">
                       <label className="text-[9px] text-slate-600 font-black uppercase ml-1 italic tracking-widest">拼船均价</label>
                       <div className="relative">
                          <span className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-700 font-black italic text-sm">¥</span>
                          <input 
                            type="number" 
                            value={route.sharePrice || ''}
                            onChange={e => setRoute({...route, sharePrice: parseInt(e.target.value) || 0})}
                            placeholder="0"
                            className="w-full bg-slate-950 border border-slate-800 rounded-2xl p-4 pl-8 text-sm font-black text-white outline-none focus:border-emerald-500 transition-all shadow-inner font-mono italic"
                          />
                       </div>
                    </div>
                    <div className="space-y-3">
                       <label className="text-[9px] text-slate-600 font-black uppercase ml-1 italic tracking-widest">包船总价</label>
                       <div className="relative">
                          <span className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-700 font-black italic text-sm">¥</span>
                          <input 
                            type="number" 
                            value={route.charterPrice || ''}
                            onChange={e => setRoute({...route, charterPrice: parseInt(e.target.value) || 0})}
                            placeholder="0"
                            className="w-full bg-slate-950 border border-slate-800 rounded-2xl p-4 pl-8 text-sm font-black text-white outline-none focus:border-blue-500 transition-all shadow-inner font-mono italic"
                          />
                       </div>
                    </div>
                 </div>
              </div>
           </div>
        </section>

        {/* Card 3: 全景执行服务包 - 调整顺序：服务 > 装备 > 亮点 */}
        <section className="space-y-4">
           <div className="flex items-center justify-between px-1">
              <h3 className="text-[10px] text-slate-500 font-black uppercase tracking-widest italic flex items-center">
                 <span className="w-1.5 h-1.5 rounded-full bg-orange-500 mr-2 shadow-[0_0_8px_rgba(249,115,22,0.6)]"></span>
                 全景服务包 / Execution Pack
              </h3>
              <span className="text-[8px] text-orange-500/50 font-black uppercase tracking-tighter italic">Step 03</span>
           </div>

           <div className="bg-slate-900 border border-slate-800 rounded-[40px] p-8 space-y-10 shadow-2xl relative overflow-hidden">
              <div className="absolute top-0 right-0 w-40 h-40 bg-orange-500/5 rounded-full blur-3xl -mr-20 -mt-20"></div>

              {/* 1. 包含服务 (Services) - 最重要，第一位置 */}
              <div className="relative z-10 space-y-4">
                 <label className="text-[9px] text-slate-500 font-black uppercase tracking-widest italic leading-none flex items-center">
                    <span className="w-1.5 h-1.5 bg-blue-500 rounded-full mr-2 shadow-[0_0_8px_rgba(59,130,246,0.6)]"></span>
                    核心服务项 / Included Services
                 </label>
                 <div className="grid grid-cols-4 gap-2">
                    {SERVICE_OPTIONS.map(opt => (
                      <button 
                        key={opt.id}
                        onClick={() => toggleService(opt.id)}
                        className={`flex flex-col items-center justify-center p-3 rounded-2xl border transition-all ${
                          route.includedServices.includes(opt.id) 
                          ? 'bg-blue-600 border-blue-500 text-white shadow-lg' 
                          : 'bg-slate-950 border-slate-800 text-slate-700'
                        }`}
                      >
                        <span className="text-base mb-1">{opt.icon}</span>
                        <span className="text-[7px] font-black uppercase tracking-tighter whitespace-nowrap">{opt.label}</span>
                      </button>
                    ))}
                 </div>
                 {route.includedServices.includes('other') && (
                    <input 
                      value={route.customService || ''}
                      onChange={e => setRoute({...route, customService: e.target.value})}
                      placeholder="输入其他定制服务内容..."
                      className="w-full mt-2 bg-slate-950 border border-blue-500/30 rounded-xl p-3 text-[10px] font-bold text-blue-100 outline-none focus:border-blue-500 shadow-inner"
                    />
                 )}
              </div>

              {/* 2. 专业装备建议 (Gear Advices) - 第二位置 */}
              <div className="relative z-10 pt-8 border-t border-slate-800/50 space-y-5">
                 <label className="text-[9px] text-slate-500 font-black uppercase tracking-widest italic leading-none flex items-center justify-between">
                    <span className="flex items-center">
                       <span className="w-1.5 h-1.5 bg-orange-500 rounded-full mr-2 shadow-[0_0_8px_rgba(249,115,22,0.6)]"></span>
                       专业装备建议 / Gear Advices
                    </span>
                    <span className="text-[7px] bg-slate-800 px-2 py-0.5 rounded font-black">EXPERT GUIDANCE</span>
                 </label>
                 
                 <div className="grid gap-3">
                    <div className="relative group">
                       <span className="absolute left-4 top-1/2 -translate-y-1/2 text-[14px] opacity-40">🎣</span>
                       <input 
                          value={route.gearIncluded} 
                          onChange={e => setRoute({...route, gearIncluded: e.target.value})} 
                          placeholder="建议杆轮：如 禧玛诺电绞 / 2000型以上" 
                          className="w-full bg-slate-950 border border-slate-800 rounded-xl py-3.5 pl-12 pr-4 text-[11px] text-white outline-none focus:border-orange-500/50 transition-all shadow-inner" 
                       />
                    </div>
                    <div className="relative group">
                       <span className="absolute left-4 top-1/2 -translate-y-1/2 text-[14px] opacity-40">🧵</span>
                       <input 
                          value={route.fishingSet} 
                          onChange={e => setRoute({...route, fishingSet: e.target.value})} 
                          placeholder="建议线组：如 PE 6-8号 / 300g铁板" 
                          className="w-full bg-slate-950 border border-slate-800 rounded-xl py-3.5 pl-12 pr-4 text-[11px] text-white outline-none focus:border-orange-500/50 transition-all shadow-inner" 
                       />
                    </div>
                    <div className="relative group">
                       <span className="absolute left-4 top-1/2 -translate-y-1/2 text-[14px] opacity-40">🧊</span>
                       <input 
                          value={route.baitIncluded} 
                          onChange={e => setRoute({...route, baitIncluded: e.target.value})} 
                          placeholder="建议鱼饵：如 活南极虾 / 夜光假饵" 
                          className="w-full bg-slate-950 border border-slate-800 rounded-xl py-3.5 pl-12 pr-4 text-[11px] text-white outline-none focus:border-orange-500/50 transition-all shadow-inner" 
                       />
                    </div>
                    <div className="relative group">
                       <span className="absolute left-4 top-1/2 -translate-y-1/2 text-[14px] opacity-40">🎒</span>
                       <input 
                          value={route.otherItems} 
                          onChange={e => setRoute({...route, otherItems: e.target.value})} 
                          placeholder="自备建议：如 晕船贴、救生衣、防水服" 
                          className="w-full bg-slate-950 border border-slate-800 rounded-xl py-3.5 pl-12 pr-4 text-[11px] text-white outline-none focus:border-orange-500/50 transition-all shadow-inner" 
                       />
                    </div>
                 </div>
              </div>

              {/* 3. 路线亮点备注 (Highlights) - 第三位置，作为补充内容 */}
              <div className="relative z-10 pt-8 border-t border-slate-800/50 space-y-4">
                 <label className="text-[9px] text-slate-500 font-black uppercase tracking-widest italic leading-none flex items-center">
                    <span className="w-1.5 h-1.5 bg-indigo-500 rounded-full mr-2 shadow-[0_0_8px_rgba(99,102,241,0.6)]"></span>
                    路线亮点备注 / Trip Highlights
                 </label>
                 <textarea 
                    value={route.description}
                    onChange={e => setRoute({...route, description: e.target.value})}
                    placeholder="描述此航线的独特魅力，吸引钓友下单..."
                    className="w-full bg-slate-950 border border-slate-800 rounded-2xl p-4 text-xs font-bold text-slate-300 outline-none focus:border-blue-500 min-h-[140px] resize-none shadow-inner leading-relaxed"
                 />
              </div>
           </div>
        </section>
      </div>

      {/* Footer Action */}
      <div className="fixed bottom-0 left-0 right-0 max-w-[390px] mx-auto p-8 pt-4 pb-14 bg-slate-900/95 backdrop-blur-2xl border-t border-slate-800 z-50">
         <button onClick={handleSave} className="w-full bg-blue-600 hover:bg-blue-500 text-white font-black py-5 rounded-[24px] shadow-2xl shadow-blue-900/40 active:scale-95 transition-all text-sm uppercase tracking-widest italic">
           保存方案并同步库 (SYNC)
         </button>
      </div>

      {/* Boat Picker Modal */}
      {showBoatPicker && (
        <div className="fixed inset-0 z-[100] flex items-end justify-center bg-black/90 backdrop-blur-sm animate-in fade-in duration-300">
          <div className="fixed inset-0" onClick={() => setShowBoatPicker(false)}></div>
          <div className="w-full max-w-[390px] bg-slate-950 rounded-t-[40px] p-8 border-t border-slate-800 shadow-2xl animate-in slide-in-from-bottom-20 max-h-[70vh] flex flex-col relative z-10">
            <div className="w-12 h-1 bg-slate-800 rounded-full mx-auto mb-8 shrink-0"></div>
            <h3 className="text-lg font-black text-white italic tracking-tighter uppercase mb-6 text-center">选择执航船只</h3>
            <div className="flex-1 overflow-y-auto no-scrollbar space-y-4 pb-10">
               {MOCK_BOATS.map(boat => (
                 <button 
                   key={boat.id}
                   onClick={() => { setActiveBoat(boat); setShowBoatPicker(false); }}
                   className={`w-full bg-slate-900 border p-5 rounded-[28px] flex items-center space-x-4 transition-all group ${activeBoat.id === boat.id ? 'border-blue-500 bg-blue-500/5' : 'border-slate-800'}`}
                 >
                   <div className="w-20 h-16 rounded-xl overflow-hidden bg-slate-800 shrink-0">
                      <img src={boat.image} className="w-full h-full object-cover" />
                   </div>
                   <div className="text-left flex-1 min-w-0">
                     <p className="text-sm font-black text-white italic truncate">{boat.name}</p>
                     <p className="text-[9px] text-slate-500 font-bold uppercase tracking-tighter mt-1">{boat.specs}</p>
                   </div>
                 </button>
               ))}
            </div>
            <button onClick={() => setShowBoatPicker(false)} className="w-full py-5 text-slate-500 text-xs font-black uppercase tracking-widest border border-slate-800 rounded-[24px] italic mt-4">取消</button>
          </div>
        </div>
      )}
    </div>
  );
};

export default CaptainRouteEditor;
