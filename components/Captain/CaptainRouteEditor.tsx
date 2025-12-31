
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
  config: string;
}

const MOCK_BOATS: Boat[] = [
  {
    id: 'boat-1',
    name: '海狼 Pro-42',
    image: STATIC_ASSETS.BOAT_FAR,
    specs: '42尺双发专业深海快艇',
    refSharePrice: 1200,
    refCharterPrice: 5800,
    config: '1200HP / 探鱼雷达 / 电绞支架'
  },
  {
    id: 'boat-2',
    name: '极光号路亚',
    image: STATIC_ASSETS.BOAT_NEAR,
    specs: '32尺精品路亚快艇',
    refSharePrice: 480,
    refCharterPrice: 2800,
    config: '300HP / 顶流机 / 16轴竿架'
  },
  {
    id: 'boat-3',
    name: '逐浪游艇号',
    image: STATIC_ASSETS.LUYA_BOAT,
    specs: '48尺豪华双层观光游艇',
    refSharePrice: 1500,
    refCharterPrice: 8800,
    config: '飞桥控制 / KTV内舱 / 淋浴'
  }
];

interface Props {
  initialRoute?: RoutePreset;
  onSave: (route: RoutePreset) => void;
  onBack: () => void;
}

const SERVICE_OPTIONS = [
  { id: 'gear', label: '渔具租赁', icon: '🎣' },
  { id: 'bait', label: '活饵供应', icon: '🧊' },
  { id: 'insurance', label: '出海保险', icon: '🛡️' },
  { id: 'drinks', label: '矿泉零食', icon: '🥤' },
  { id: 'guide', label: '专业指导', icon: '👨‍🏫' },
  { id: 'media', label: '战果拍摄', icon: '📸' },
  { id: 'other', label: '其他定制', icon: '➕' },
];

const CaptainRouteEditor: React.FC<Props> = ({ initialRoute, onSave, onBack }) => {
  const [selectedBoat, setSelectedBoat] = useState<Boat>(MOCK_BOATS[0]);
  const [showBoatPicker, setShowBoatPicker] = useState(false);

  const [route, setRoute] = useState<RoutePreset>(initialRoute || {
    id: 'route-' + Date.now(),
    name: '', 
    description: '',
    oceanType: 'NEAR',
    destination: '',
    fishingSet: '',
    gearIncluded: '',
    baitIncluded: '',
    otherItems: '', 
    sharePrice: MOCK_BOATS[0].refSharePrice,
    charterPrice: MOCK_BOATS[0].refCharterPrice,
    includedServices: ['gear', 'bait', 'insurance'],
    customService: '',
    targetFish: ''
  });

  // 标题即时预览逻辑
  const generatedName = (route.destination && route.targetFish) 
    ? `${route.destination}钓${route.targetFish}线` 
    : '';

  const handleSave = () => {
    if (!route.destination.trim() || !route.targetFish?.trim()) {
      alert("请填写目标钓点和主攻鱼种，我们将为您自动生成方案标题");
      return;
    }
    
    // 合成最终方案名称
    const finalRoute = {
      ...route,
      name: generatedName
    };
    
    onSave(finalRoute);
  };

  const toggleService = (id: string) => {
    setRoute(prev => ({
      ...prev,
      includedServices: prev.includedServices.includes(id)
        ? prev.includedServices.filter(s => s !== id)
        : [...prev.includedServices, id]
    }));
  };

  const handleSelectBoat = (boat: Boat) => {
    setSelectedBoat(boat);
    setRoute(prev => ({
      ...prev,
      sharePrice: boat.refSharePrice,
      charterPrice: boat.refCharterPrice
    }));
    setShowBoatPicker(false);
  };

  return (
    <div className="flex flex-col h-full bg-slate-950">
      {/* 顶部标题栏 */}
      <div className="p-6 bg-slate-900 border-b border-slate-800 flex items-center shrink-0 z-30 shadow-2xl">
        <button onClick={onBack} className="p-2 -ml-2 text-slate-500 hover:text-white transition-colors">
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M15 19l-7-7 7-7" /></svg>
        </button>
        <div className="flex-1 text-center">
          <h2 className="font-black text-lg text-white italic tracking-tighter uppercase leading-none">发布 <span className="text-blue-400">海钓方案</span></h2>
          <p className="text-[8px] text-slate-500 font-bold uppercase tracking-[0.2em] mt-1 italic">Vessel Route Design</p>
        </div>
        <div className="w-8"></div>
      </div>

      <div className="flex-1 overflow-y-auto p-6 space-y-10 no-scrollbar pb-44">
        
        {/* Card 1: 核心产品定位 (必填) */}
        <section className="space-y-4">
          <div className="flex items-center justify-between px-1">
            <h3 className="text-[11px] text-slate-500 font-black uppercase tracking-widest italic flex items-center">
              <span className="w-4 h-4 rounded-full bg-blue-600 text-white flex items-center justify-center text-[8px] not-italic mr-2">1</span>
              核心航行定位 / Core Setup
            </h3>
            <span className="text-[8px] text-blue-500 font-black uppercase bg-blue-500/10 px-2 py-0.5 rounded">必填项</span>
          </div>
          <div className="bg-slate-900 border border-slate-800 rounded-[32px] p-6 space-y-6 shadow-xl">
            {/* 远近海切换 */}
            <div className="space-y-3">
              <div className="flex p-1 bg-slate-950 rounded-2xl border border-slate-800">
                <button onClick={() => setRoute({...route, oceanType: 'NEAR'})} className={`flex-1 py-3 rounded-xl text-[10px] font-black transition-all ${route.oceanType === 'NEAR' ? 'bg-emerald-500 text-white shadow-lg' : 'text-slate-600'}`}>近海线路 (NEAR)</button>
                <button onClick={() => setRoute({...route, oceanType: 'FAR'})} className={`flex-1 py-3 rounded-xl text-[10px] font-black transition-all ${route.oceanType === 'FAR' ? 'bg-indigo-500 text-white shadow-lg' : 'text-slate-600'}`}>远海线路 (FAR)</button>
              </div>
            </div>

            {/* 目标钓点 (必填) */}
            <div className="space-y-2">
              <label className="text-[9px] text-slate-700 font-black uppercase ml-1 italic tracking-widest">目标钓点 (必填)</label>
              <input 
                value={route.destination}
                onChange={e => setRoute({...route, destination: e.target.value})}
                placeholder="如：西鼓岛沉船区、七洲列岛"
                className="w-full bg-slate-950 border border-slate-800 rounded-2xl p-4 text-sm font-black text-white outline-none focus:border-blue-500 transition-all shadow-inner placeholder:text-slate-800"
              />
            </div>

            {/* 主攻鱼种 (必填) */}
            <div className="space-y-2">
              <label className="text-[9px] text-slate-700 font-black uppercase ml-1 italic tracking-widest">主攻鱼种 (必填)</label>
              <input 
                value={route.targetFish}
                onChange={e => setRoute({...route, targetFish: e.target.value})}
                placeholder="如：章红、金枪、大石斑"
                className="w-full bg-slate-950 border border-slate-800 rounded-2xl p-4 text-sm font-black text-white outline-none focus:border-blue-500 transition-all shadow-inner placeholder:text-slate-800"
              />
            </div>

            {/* 方案名称预览 (自动生成) */}
            {generatedName && (
              <div className="pt-2 border-t border-slate-800 animate-in fade-in slide-in-from-top-1">
                <p className="text-[8px] text-slate-600 font-black uppercase tracking-widest mb-2 italic">预览方案标题 (钓友可见)</p>
                <div className="bg-blue-600/5 border border-blue-500/20 rounded-xl p-3">
                   <p className="text-sm font-black text-blue-400 italic">“{generatedName}”</p>
                </div>
              </div>
            )}
          </div>
        </section>

        {/* Card 2: 船只与价格 (商业核心) */}
        <section className="space-y-4">
          <div className="flex items-center justify-between px-1">
            <h3 className="text-[11px] text-slate-500 font-black uppercase tracking-widest italic flex items-center">
              <span className="w-4 h-4 rounded-full bg-slate-800 text-slate-500 flex items-center justify-center text-[8px] not-italic mr-2">2</span>
              执行船只与定价 / Vessel & Price
            </h3>
          </div>
          
          <div className="space-y-4">
             {/* 船只选择入口 */}
             <button 
                onClick={() => setShowBoatPicker(true)}
                className="w-full bg-slate-900 border border-slate-800 rounded-[28px] p-4 flex items-center justify-between group active:scale-[0.98] transition-all"
             >
                <div className="flex items-center space-x-4">
                   <div className="w-14 h-10 rounded-lg overflow-hidden border border-slate-800 shrink-0">
                      <img src={selectedBoat.image} className="w-full h-full object-cover" alt="Vessel" />
                   </div>
                   <div className="text-left">
                      <p className="text-xs font-black text-white italic">{selectedBoat.name}</p>
                      <p className="text-[8px] text-slate-600 font-bold uppercase tracking-tighter mt-0.5">{selectedBoat.specs}</p>
                   </div>
                </div>
                <div className="text-blue-500 flex items-center space-x-1">
                   <span className="text-[9px] font-black italic underline underline-offset-4">切换</span>
                   <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="M9 5l7 7-7 7" strokeWidth="3" strokeLinecap="round"/></svg>
                </div>
             </button>

             {/* 定价输入区 */}
             <div className="bg-slate-900 border border-slate-800 rounded-[32px] p-6 grid grid-cols-2 gap-4 shadow-2xl">
                <div className="space-y-2">
                  <label className="text-[8px] text-slate-600 font-black ml-1 uppercase tracking-widest leading-none">拼船人均价</label>
                  <div className="flex items-center bg-slate-950 rounded-2xl p-4 border border-slate-800 focus-within:border-blue-500 transition-all">
                    <span className="text-slate-600 font-black mr-1 text-[10px] italic">¥</span>
                    <input 
                       type="number" 
                       value={route.sharePrice || ''} 
                       onChange={e => setRoute({...route, sharePrice: parseFloat(e.target.value) || 0})} 
                       placeholder="0" 
                       className="bg-transparent w-full outline-none text-white font-black text-xl font-mono italic" 
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <label className="text-[8px] text-slate-600 font-black ml-1 uppercase tracking-widest leading-none">包船一口价</label>
                  <div className="flex items-center bg-slate-950 rounded-2xl p-4 border border-slate-800 focus-within:border-blue-500 transition-all">
                    <span className="text-slate-600 font-black mr-1 text-[10px] italic">¥</span>
                    <input 
                       type="number" 
                       value={route.charterPrice || ''} 
                       onChange={e => setRoute({...route, charterPrice: parseFloat(e.target.value) || 0})} 
                       placeholder="0" 
                       className="bg-transparent w-full outline-none text-white font-black text-xl font-mono italic" 
                    />
                  </div>
                </div>
             </div>
          </div>
        </section>

        {/* Card 3: 包含服务 (选填) */}
        <section className="space-y-4">
          <div className="flex items-center justify-between px-1">
            <h3 className="text-[11px] text-slate-500 font-black uppercase tracking-widest italic flex items-center">
              <span className="w-4 h-4 rounded-full bg-slate-800 text-slate-500 flex items-center justify-center text-[8px] not-italic mr-2">3</span>
              包含服务内容 / Services
            </h3>
            <span className="text-[8px] text-slate-700 font-black uppercase tracking-widest">Optional</span>
          </div>

          <div className="bg-slate-900 border border-slate-800 rounded-[32px] p-6 space-y-6 shadow-xl">
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
              <div className="animate-in slide-in-from-top-2 duration-300">
                <input 
                  value={route.customService}
                  onChange={e => setRoute({...route, customService: e.target.value})}
                  placeholder="请输入其它定制服务项..."
                  className="w-full bg-slate-950 border border-blue-500/40 rounded-2xl p-4 text-xs font-bold text-blue-100 outline-none focus:border-blue-500 shadow-inner"
                />
              </div>
            )}
          </div>
        </section>

        {/* Card 4: 装备建议 (选填) */}
        <section className="space-y-4">
          <div className="flex items-center justify-between px-1">
            <h3 className="text-[11px] text-slate-500 font-black uppercase tracking-widest italic flex items-center">
              <span className="w-4 h-4 rounded-full bg-slate-800 text-slate-500 flex items-center justify-center text-[8px] not-italic mr-2">4</span>
              专业装备建议 / Gear Advice
            </h3>
            <span className="text-[8px] text-slate-700 font-black uppercase tracking-widest">Professional</span>
          </div>

          <div className="bg-slate-900 border border-slate-800 rounded-[32px] p-6 space-y-5 shadow-xl">
            <div className="grid gap-4">
              <div className="space-y-2">
                <label className="text-[9px] text-slate-700 font-black uppercase ml-1 italic tracking-widest leading-none">建议杆轮型号</label>
                <input 
                  value={route.gearIncluded} 
                  onChange={e => setRoute({...route, gearIncluded: e.target.value})} 
                  placeholder="如：禧玛诺电绞、2000型以上水滴轮..." 
                  className="w-full bg-slate-950 border border-slate-800 rounded-2xl p-4 text-[11px] text-slate-300 outline-none focus:border-blue-500/50" 
                />
              </div>
              <div className="space-y-2">
                <label className="text-[9px] text-slate-700 font-black uppercase ml-1 italic tracking-widest leading-none">建议线组规格</label>
                <input 
                  value={route.fishingSet} 
                  onChange={e => setRoute({...route, fishingSet: e.target.value})} 
                  placeholder="如：PE 6-8号线, 300g铁板..." 
                  className="w-full bg-slate-950 border border-slate-800 rounded-2xl p-4 text-[11px] text-slate-300 outline-none focus:border-blue-500/50" 
                />
              </div>
              <div className="space-y-2">
                <label className="text-[9px] text-slate-700 font-black uppercase ml-1 italic tracking-widest leading-none">建议鱼饵/拟饵</label>
                <input 
                  value={route.baitIncluded} 
                  onChange={e => setRoute({...route, baitIncluded: e.target.value})} 
                  placeholder="如：活虾、南极虾、夜光假饵..." 
                  className="w-full bg-slate-950 border border-slate-800 rounded-2xl p-4 text-[11px] text-slate-300 outline-none focus:border-blue-500/50" 
                />
              </div>
            </div>
          </div>
        </section>

        <div className="py-12 text-center opacity-30">
          <p className="text-[8px] text-slate-700 font-black uppercase tracking-[0.4em] italic leading-relaxed">系统将根据钓点和鱼种自动生成方案名称<br/>提升钓友搜索与选择效率</p>
        </div>
      </div>

      {/* 底部悬浮发布按钮 */}
      <div className="fixed bottom-0 left-0 right-0 max-w-[390px] mx-auto p-8 pt-4 pb-14 bg-slate-900/95 backdrop-blur-2xl border-t border-slate-800 z-50 shadow-[0_-10px_40px_rgba(0,0,0,0.5)]">
         <button 
           onClick={handleSave}
           className="w-full bg-blue-600 hover:bg-blue-500 text-white font-black py-5 rounded-[24px] shadow-2xl shadow-blue-900/40 active:scale-95 transition-all text-sm uppercase tracking-[0.2em] italic"
         >
           完成并同步方案库
         </button>
      </div>

      {/* 船只选择弹窗 (同前逻辑) */}
      {showBoatPicker && (
        <div className="fixed inset-0 z-[100] flex items-end justify-center bg-black/90 backdrop-blur-sm animate-in fade-in duration-300">
           <div className="fixed inset-0" onClick={() => setShowBoatPicker(false)}></div>
           <div className="w-full max-w-[390px] bg-slate-950 rounded-t-[40px] p-8 border-t border-slate-800 shadow-2xl animate-in slide-in-from-bottom-20 max-h-[85vh] flex flex-col relative z-10">
              <div className="w-12 h-1 bg-slate-800 rounded-full mx-auto mb-8 shrink-0"></div>
              
              <div className="mb-6 shrink-0 text-center">
                 <h3 className="text-lg font-black text-white italic tracking-tighter uppercase">选择 <span className="text-blue-400">执行船只</span></h3>
              </div>
              
              <div className="flex-1 overflow-y-auto no-scrollbar pr-2 space-y-4 pb-10">
                 {MOCK_BOATS.map(boat => (
                    <button 
                      key={boat.id}
                      onClick={() => handleSelectBoat(boat)}
                      className={`w-full bg-slate-900 border rounded-[28px] p-5 text-left active:scale-[0.98] transition-all group relative overflow-hidden ${
                        selectedBoat.id === boat.id ? 'border-blue-500' : 'border-slate-800'
                      }`}
                    >
                       <div className="flex items-center space-x-4">
                          <div className="w-20 h-16 rounded-xl overflow-hidden bg-slate-800 shrink-0 border border-slate-800">
                             <img src={boat.image} className="w-full h-full object-cover" alt={boat.name} />
                          </div>
                          <div className="flex-1 min-w-0">
                             <div className="flex justify-between items-start">
                                <h4 className="text-sm font-black text-white italic truncate pr-2">{boat.name}</h4>
                                <div className="text-right shrink-0">
                                   <p className="text-[10px] text-emerald-400 font-black italic font-mono leading-none">¥{boat.refSharePrice}</p>
                                   <p className="text-[7px] text-slate-600 font-bold uppercase mt-0.5 tracking-tighter">参考价</p>
                                </div>
                             </div>
                             <p className="text-[9px] text-slate-500 font-bold uppercase tracking-tighter mt-1 italic">{boat.specs}</p>
                          </div>
                       </div>
                    </button>
                 ))}
              </div>

              <button 
                onClick={() => setShowBoatPicker(false)}
                className="w-full py-5 text-slate-500 text-[10px] font-black uppercase tracking-widest hover:text-white transition-colors border border-slate-800 rounded-[24px] shrink-0 mb-4 italic"
              >
                取消 (CANCEL)
              </button>
           </div>
        </div>
      )}
    </div>
  );
};

export default CaptainRouteEditor;
