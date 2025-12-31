
import React, { useState, useEffect } from 'react';
import { UserRequest, OrderType, RoutePreset } from '../../types';

interface Props {
  demand: UserRequest;
  presets: RoutePreset[];
  onBack: () => void;
  onManagePresets?: () => void; 
  onConfirm: (price: number, services: string[], route?: RoutePreset, manualIntro?: string, customService?: string) => void;
}

const SERVICE_OPTIONS = [
  { id: 'gear', label: '专业渔具租赁', icon: '🎣' },
  { id: 'bait', label: '活饵/冰块供应', icon: '🧊' },
  { id: 'insurance', label: '出海意外保险', icon: '🛡️' },
  { id: 'drinks', label: '矿泉水/零食', icon: '🥤' },
  { id: 'guide', label: '全程钓鱼指导', icon: '👨‍🏫' },
  { id: 'media', label: '鱼获视频拍摄', icon: '📸' },
  { id: 'other', label: '其他自定义', icon: '➕' },
];

const CaptainQuote: React.FC<Props> = ({ demand, presets, onBack, onManagePresets, onConfirm }) => {
  const [price, setPrice] = useState<string>('');
  const [selectedServices, setSelectedServices] = useState<string[]>([]);
  const [customService, setCustomService] = useState<string>('');
  const [selectedRoute, setSelectedRoute] = useState<RoutePreset | null>(null);
  const [showPresetPicker, setShowPresetPicker] = useState(false);
  const [isEditingCustom, setIsEditingCustom] = useState(false);

  const [manualGear, setManualGear] = useState({
    rod: '',
    tackle: '',
    bait: '',
    others: ''
  });

  const isShare = demand.type === OrderType.SHARE;

  // 初始状态下，如果只有一个方案，默认选中
  useEffect(() => {
    if (presets.length > 0 && !selectedRoute) {
      // 也可以不默认选中，强制船长确认一次
    }
  }, [presets, selectedRoute]);

  const handleSelectRoute = (route: RoutePreset) => {
    setSelectedRoute(route);
    setPrice(isShare ? route.sharePrice.toString() : route.charterPrice.toString());
    setSelectedServices(route.includedServices || []);
    setCustomService(route.customService || '');
    setManualGear({
      rod: route.gearIncluded || '',
      tackle: route.fishingSet || '',
      bait: route.baitIncluded || '',
      others: route.otherItems || ''
    });
    setShowPresetPicker(false);
    setIsEditingCustom(false);
  };

  const toggleService = (id: string) => {
    setSelectedServices(prev =>
      prev.includes(id) ? prev.filter(s => s !== id) : [...prev, id]
    );
  };

  return (
    <div className="flex flex-col h-full bg-slate-950">
      {/* Header */}
      <div className="p-6 flex items-center border-b border-slate-800 bg-slate-900 shrink-0 z-30 shadow-xl">
        <button onClick={onBack} className="p-2 -ml-2 text-slate-400 hover:text-white transition-colors">
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M15 19l-7-7 7-7" /></svg>
        </button>
        <div className="flex-1 text-center">
          <h2 className="font-black text-lg text-white italic tracking-tighter uppercase leading-none">报价 <span className="text-blue-400">响应</span></h2>
          <p className="text-[8px] text-slate-500 font-bold uppercase tracking-[0.2em] mt-1 italic">Quotation Studio</p>
        </div>
        <div className="w-8"></div>
      </div>

      <div className="flex-1 overflow-y-auto p-6 space-y-8 no-scrollbar pb-40">
        
        {/* 1. 核心路线基准 (PM逻辑：必须基于预设，减少废话) */}
        <div className="space-y-4">
          <div className="flex items-center justify-between px-1">
            <div className="flex items-center space-x-2">
              <div className="w-1 h-3 bg-blue-500 rounded-full"></div>
              <p className="text-[10px] text-slate-500 font-black uppercase tracking-widest italic">选择基准路线方案 / Base Strategy</p>
            </div>
            {selectedRoute && (
              <button 
                onClick={() => setShowPresetPicker(true)}
                className="text-[10px] text-blue-400 font-black italic underline underline-offset-4"
              >
                切换方案
              </button>
            )}
          </div>
          
          {!selectedRoute ? (
             <button 
                onClick={() => setShowPresetPicker(true)}
                className="w-full py-10 bg-blue-600/5 border-2 border-dashed border-blue-500/20 rounded-[32px] flex flex-col items-center justify-center space-y-3 text-blue-400 group active:scale-[0.98] transition-all"
             >
                <div className="w-12 h-12 bg-blue-500/10 rounded-full flex items-center justify-center group-hover:bg-blue-600 group-hover:text-white transition-all shadow-inner">
                   <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="M9 20l-5.447-2.724A2 2 0 013 15.447V4.553a2 2 0 011.553-1.954l6-1.5a2 2 0 011.553 1.954v10.894a2 2 0 01-1.106 1.789L13 20v-5a1 1 0 00-1-1h-1a1 1 0 00-1 1v5z" strokeWidth="2.5"/></svg>
                </div>
                <div className="text-center">
                  <span className="text-[11px] font-black uppercase tracking-widest block">点击选择预设方案</span>
                  <span className="text-[8px] text-slate-600 uppercase mt-1">Select from library to quick start</span>
                </div>
             </button>
           ) : (
             <div className="bg-slate-900 border border-blue-500/30 rounded-[32px] p-6 animate-in zoom-in-95 relative overflow-hidden shadow-2xl">
                <div className="absolute top-0 right-0 w-24 h-24 bg-blue-500/5 rounded-full -mr-12 -mt-12"></div>
                <div className="relative z-10">
                   <div className="flex items-center space-x-2 mb-3">
                      <span className={`px-2 py-0.5 rounded text-[8px] font-black uppercase ${
                         selectedRoute.oceanType === 'FAR' ? 'bg-indigo-500 text-white' : 'bg-emerald-500 text-white'
                      }`}>
                         {selectedRoute.oceanType === 'FAR' ? '远海航线' : '近海线路'}
                      </span>
                      <span className="text-[9px] text-slate-500 font-bold uppercase tracking-tighter italic">FOUNDATION</span>
                   </div>
                   <h3 className="text-lg font-black text-white italic leading-tight mb-2">
                      {selectedRoute.destination}钓{selectedRoute.targetFish}
                   </h3>
                   <p className="text-[10px] text-slate-500 font-bold leading-relaxed italic line-clamp-2">
                     预设逻辑：{selectedRoute.description || '标准出海方案，包含专业引导。'}
                   </p>
                </div>
             </div>
           )}
        </div>

        {/* 2. 价格实时调整 (针对本次微调) */}
        <div className={`space-y-4 transition-all duration-500 ${!selectedRoute ? 'opacity-30 pointer-events-none grayscale' : ''}`}>
          <div className="flex items-center justify-between px-1">
            <div className="flex items-center space-x-2">
              <div className="w-1 h-3 bg-emerald-500 rounded-full"></div>
              <p className="text-[10px] text-slate-500 font-black uppercase tracking-widest italic">本次任务定价 / Pricing</p>
            </div>
            {selectedRoute && (
              <span className="text-[8px] text-slate-600 font-black uppercase">基准价: ¥{isShare ? selectedRoute.sharePrice : selectedRoute.charterPrice}</span>
            )}
          </div>
          
          <div className="bg-slate-900 border border-slate-800 rounded-[32px] p-8 text-center shadow-inner relative overflow-hidden">
              <label className="block text-[9px] font-black text-slate-600 uppercase tracking-widest mb-4 italic leading-none">
                {isShare ? '确认本次人均报价' : '确认本次包船总价'}
              </label>
              <div className="flex items-center justify-center">
                 <span className="text-3xl font-black text-slate-700 mr-2 italic">¥</span>
                 <input 
                   type="number" 
                   value={price}
                   onChange={(e) => setPrice(e.target.value)}
                   placeholder="0"
                   className="bg-transparent text-5xl font-black text-white outline-none w-full text-center placeholder-slate-800 italic font-mono"
                 />
              </div>
              {selectedRoute && price && parseFloat(price) !== (isShare ? selectedRoute.sharePrice : selectedRoute.charterPrice) && (
                <div className="mt-4 flex items-center justify-center space-x-1 animate-in fade-in slide-in-from-top-1">
                   <div className="w-1 h-1 rounded-full bg-orange-500"></div>
                   <p className="text-[8px] text-orange-500 font-black uppercase italic">检测到价格偏离预设方案</p>
                </div>
              )}
          </div>
        </div>

        {/* 3. 包含服务 (可在预设基础上增减) */}
        <div className={`space-y-4 transition-all duration-500 ${!selectedRoute ? 'opacity-30 pointer-events-none grayscale' : ''}`}>
          <div className="flex items-center space-x-2 px-1">
            <div className="w-1 h-3 bg-blue-500 rounded-full"></div>
            <p className="text-[10px] text-slate-500 font-black uppercase tracking-widest italic">包含服务微调 / Services</p>
          </div>
          <div className="bg-slate-900 border border-slate-800 rounded-[32px] p-6 space-y-6 shadow-xl">
              <div className="grid grid-cols-2 gap-3">
                 {SERVICE_OPTIONS.map(opt => (
                   <button 
                     key={opt.id}
                     onClick={() => toggleService(opt.id)}
                     className={`p-4 rounded-2xl border transition-all flex items-center space-x-3 text-left ${
                       selectedServices.includes(opt.id) 
                       ? 'bg-blue-600 border-blue-500 text-white shadow-lg' 
                       : 'bg-slate-950 border-slate-800 text-slate-600'
                     }`}
                   >
                      <span className="text-base">{opt.icon}</span>
                      <span className="text-[10px] font-black uppercase tracking-tighter truncate">{opt.label}</span>
                   </button>
                 ))}
              </div>

              {selectedServices.includes('other') && (
                <div className="animate-in slide-in-from-top-2 duration-300">
                   <input 
                     value={customService}
                     onChange={e => setCustomService(e.target.value)}
                     placeholder="特殊服务说明 (如: 免费提供海鲜午餐)"
                     className="w-full bg-slate-950 border border-blue-500/30 rounded-2xl p-4 text-xs font-bold text-blue-100 outline-none focus:border-blue-500 shadow-inner"
                   />
                </div>
              )}
          </div>
        </div>

        {/* 4. 针对性建议 (选填，PM：增加钓友信任度) */}
        <div className={`space-y-4 transition-all duration-500 ${!selectedRoute ? 'opacity-30 pointer-events-none grayscale' : ''}`}>
          <div className="flex items-center justify-between px-1">
            <div className="flex items-center space-x-2">
              <div className="w-1 h-3 bg-orange-500 rounded-full shadow-[0_0_8px_rgba(249,115,22,0.4)]"></div>
              <p className="text-[10px] text-slate-500 font-black uppercase tracking-widest italic">给钓友的专项建议 / Special Advice</p>
            </div>
            <button 
              onClick={() => setIsEditingCustom(!isEditingCustom)}
              className="text-[9px] text-slate-600 font-black uppercase italic underline underline-offset-2"
            >
              {isEditingCustom ? '锁定建议' : '编辑建议内容'}
            </button>
          </div>
          
          <div className="bg-slate-900 border border-slate-800 rounded-[32px] p-6 space-y-5 shadow-xl">
            {isEditingCustom ? (
              <div className="space-y-4 animate-in fade-in duration-300">
                <div className="space-y-2">
                  <label className="text-[9px] text-slate-600 font-black uppercase ml-1 italic leading-none">建议杆轮</label>
                  <input 
                    value={manualGear.rod} 
                    onChange={e => setManualGear({...manualGear, rod: e.target.value})} 
                    placeholder="如: 电绞 PE6-8号" 
                    className="w-full bg-slate-950 border border-slate-800 rounded-2xl p-4 text-xs font-bold text-white outline-none" 
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-[9px] text-slate-600 font-black uppercase ml-1 italic leading-none">鱼饵/配件</label>
                  <input 
                    value={manualGear.bait} 
                    onChange={e => setManualGear({...manualGear, bait: e.target.value})} 
                    placeholder="如: 300g铁板, 夜光" 
                    className="w-full bg-slate-950 border border-slate-800 rounded-2xl p-4 text-xs font-bold text-white outline-none" 
                  />
                </div>
              </div>
            ) : (
              <div className="bg-black/30 rounded-2xl p-5 border border-slate-800/50">
                 <p className="text-[11px] text-slate-400 font-bold italic leading-relaxed">
                   {manualGear.rod || manualGear.bait || manualGear.others ? (
                     `本次建议：${manualGear.rod ? '杆轮['+manualGear.rod+'] ' : ''}${manualGear.bait ? '鱼饵['+manualGear.bait+']' : ''}`
                   ) : '沿用预设建议，点击右上角可针对本次出海微调。'}
                 </p>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* 底部悬浮提交 */}
      <div className="fixed bottom-0 left-0 right-0 max-w-[390px] mx-auto p-8 pt-4 pb-14 bg-slate-900/95 backdrop-blur-2xl border-t border-slate-800 z-50">
         <button 
           disabled={!selectedRoute || !price}
           onClick={() => {
             const manualIntro = `杆轮：${manualGear.rod || '不限'} | 线组：${manualGear.tackle || '不限'} | 鱼饵：${manualGear.bait || '不限'} | 其他：${manualGear.others || '不限'}`;
             onConfirm(parseFloat(price), selectedServices, selectedRoute || undefined, manualIntro, customService);
           }}
           className="w-full bg-blue-600 disabled:bg-slate-800 disabled:text-slate-600 text-white font-black py-5 rounded-[24px] shadow-2xl shadow-blue-900/40 active:scale-95 transition-all text-sm uppercase tracking-widest italic"
         >
           {!selectedRoute ? '请先选择基准方案' : '确认并发送报价 (CONFIRM)'}
         </button>
      </div>

      {/* 预设方案选择弹层 */}
      {showPresetPicker && (
        <div className="fixed inset-0 z-[100] flex items-end justify-center bg-black/90 backdrop-blur-sm animate-in fade-in duration-300">
           <div className="fixed inset-0" onClick={() => setShowPresetPicker(false)}></div>
           <div className="w-full max-w-[390px] bg-slate-950 rounded-t-[40px] p-8 border-t border-slate-800 shadow-2xl animate-in slide-in-from-bottom-20 max-h-[85vh] flex flex-col relative z-10">
              <div className="w-12 h-1 bg-slate-800 rounded-full mx-auto mb-8 shrink-0"></div>
              
              <div className="mb-6 shrink-0 flex items-center justify-between">
                 <div>
                    <h3 className="text-lg font-black text-white italic tracking-tighter uppercase">选择 <span className="text-blue-400">路线方案</span></h3>
                    <p className="text-[9px] text-slate-500 font-bold uppercase tracking-widest mt-1 italic">Standard Route Library</p>
                 </div>
                 <button 
                    onClick={() => { setShowPresetPicker(false); onManagePresets?.(); }} 
                    className="flex items-center space-x-1.5 bg-blue-600/10 hover:bg-blue-600/20 text-blue-400 px-3 py-1.5 rounded-xl border border-blue-500/20 transition-colors group"
                 >
                    <svg className="w-3.5 h-3.5 group-hover:rotate-90 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="M12 4v16m8-8H4" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"/></svg>
                    <span className="text-[10px] font-black uppercase italic tracking-tighter">管理方案库</span>
                 </button>
              </div>
              
              <div className="flex-1 overflow-y-auto no-scrollbar pr-2 space-y-4 pb-10">
                 {presets.length === 0 ? (
                    <div className="py-12 flex flex-col items-center justify-center space-y-4 opacity-40">
                       <div className="w-16 h-16 bg-slate-900 rounded-full flex items-center justify-center border border-dashed border-slate-700 text-slate-700 text-2xl">?</div>
                       <p className="text-xs font-bold text-slate-500 italic text-center px-10 leading-relaxed">方案库为空，请先在“我的-路线”中录入常用的海钓线路方案。</p>
                    </div>
                 ) : (
                    presets.map(route => (
                       <button 
                         key={route.id}
                         onClick={() => handleSelectRoute(route)}
                         className={`w-full bg-slate-900 border rounded-[28px] p-6 text-left active:scale-[0.98] transition-all group relative overflow-hidden ${
                           selectedRoute?.id === route.id ? 'border-blue-500 ring-1 ring-blue-500/30' : 'border-slate-800 hover:border-slate-600'
                         }`}
                       >
                          {selectedRoute?.id === route.id && (
                            <div className="absolute top-0 right-0 p-2 bg-blue-600 text-white rounded-bl-xl shadow-lg">
                              <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="M5 13l4 4L19 7" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round"/></svg>
                            </div>
                          )}
                          <div className="flex justify-between items-start mb-3">
                             <div className="flex items-center space-x-2">
                                <span className={`px-1.5 py-0.5 rounded text-[7px] font-black uppercase ${
                                   route.oceanType === 'FAR' ? 'bg-indigo-500/20 text-indigo-400 border border-indigo-500/30' : 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'
                                }`}>
                                   {route.oceanType === 'FAR' ? '远海' : '近海'}
                                </span>
                                <h4 className="text-sm font-black text-white italic truncate max-w-[120px]">
                                   {route.destination}钓{route.targetFish}
                                </h4>
                             </div>
                             <span className="text-base font-black text-blue-400 italic font-mono leading-none">
                                ¥{isShare ? route.sharePrice : route.charterPrice}
                             </span>
                          </div>
                          <p className="text-[10px] text-slate-500 font-bold italic line-clamp-1">{route.description || '无详细方案说明'}</p>
                       </button>
                    ))
                 )}
              </div>

              <button 
                onClick={() => setShowPresetPicker(false)}
                className="w-full py-5 text-slate-500 text-xs font-black uppercase tracking-widest hover:text-white transition-colors border border-slate-800 rounded-[24px] shrink-0 mb-4 italic"
              >
                取消 (CANCEL)
              </button>
           </div>
        </div>
      )}
    </div>
  );
};

export default CaptainQuote;
