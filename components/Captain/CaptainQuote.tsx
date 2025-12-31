
import React, { useState } from 'react';
import { UserRequest, OrderType, RoutePreset } from '../../types';

interface Props {
  demand: UserRequest;
  presets: RoutePreset[];
  onBack: () => void;
  onManagePresets?: () => void; // 新增：管理/添加预设的回调
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
  const [selectedServices, setSelectedServices] = useState<string[]>(['gear', 'bait', 'insurance']);
  const [customService, setCustomService] = useState<string>('');
  const [selectedRoute, setSelectedRoute] = useState<RoutePreset | null>(null);
  const [showPresetPicker, setShowPresetPicker] = useState(false);

  const [manualGear, setManualGear] = useState({
    rod: '',
    tackle: '',
    bait: '',
    others: ''
  });

  const isShare = demand.type === OrderType.SHARE;

  // 统一标题合成逻辑
  const getRouteDisplayTitle = (r: RoutePreset | null) => {
    if (!r) return '';
    return (r.destination && r.targetFish) 
      ? `${r.destination}钓${r.targetFish}线`
      : r.name;
  };

  const handleSelectRoute = (route: RoutePreset) => {
    setSelectedRoute(route);
    setPrice(isShare ? route.sharePrice.toString() : route.charterPrice.toString());
    if (route.includedServices) {
      setSelectedServices(route.includedServices);
    }
    if (route.customService) {
      setCustomService(route.customService);
    }
    setManualGear({
      rod: route.gearIncluded || '',
      tackle: route.fishingSet || '',
      bait: route.baitIncluded || '',
      others: route.otherItems || ''
    });
    setShowPresetPicker(false);
  };

  const clearRoute = () => {
    setSelectedRoute(null);
    setPrice('');
    setCustomService('');
    setManualGear({ rod: '', tackle: '', bait: '', others: '' });
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
        
        {/* 1. 方案选择/定义 */}
        <div className="space-y-4">
          <div className="flex items-center space-x-2 px-1">
            <div className="w-1 h-3 bg-blue-500 rounded-full"></div>
            <p className="text-[10px] text-slate-500 font-black uppercase tracking-widest italic">方案定位 / Strategy</p>
          </div>
          
          {!selectedRoute ? (
             <button 
                onClick={() => setShowPresetPicker(true)}
                className="w-full py-8 bg-blue-600/5 border-2 border-dashed border-blue-500/20 rounded-[32px] flex flex-col items-center justify-center space-y-2 text-blue-400 group active:scale-[0.98] transition-all"
             >
                <div className="w-10 h-10 bg-blue-500/10 rounded-full flex items-center justify-center mb-1 group-hover:bg-blue-600 group-hover:text-white transition-all">
                   <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="M9 20l-5.447-2.724A2 2 0 013 15.447V4.553a2 2 0 011.553-1.954l6-1.5a2 2 0 01.894 0l6 1.5a2 2 0 011.553 1.954v10.894a2 2 0 01-1.106 1.789L13 20v-5a1 1 0 00-1-1h-1a1 1 0 00-1 1v5z" strokeWidth="2.5"/></svg>
                </div>
                <span className="text-[11px] font-black uppercase tracking-widest italic">从预设方案库快速导入</span>
             </button>
           ) : (
             <div className="bg-slate-900 border border-blue-500/30 rounded-[32px] p-6 animate-in zoom-in-95 relative overflow-hidden shadow-2xl">
                <div className="flex justify-between items-start mb-4">
                   <h3 className="text-base font-black text-white italic flex items-center flex-wrap pr-12 leading-relaxed">
                      <span className={`px-2 py-0.5 rounded text-[8px] font-black uppercase mr-2 shrink-0 ${
                         selectedRoute.oceanType === 'FAR' ? 'bg-indigo-500 text-white' : 'bg-emerald-500 text-white'
                      }`}>
                         {selectedRoute.oceanType === 'FAR' ? '远海' : '近海'}
                      </span>
                      {getRouteDisplayTitle(selectedRoute)}
                   </h3>
                   <button onClick={clearRoute} className="text-[10px] text-slate-500 font-black underline underline-offset-4 hover:text-white transition-colors absolute top-6 right-6 italic">重置</button>
                </div>
                <p className="text-[10px] text-slate-500 font-bold leading-relaxed italic border-t border-slate-800 pt-3">
                  已同步钓点：{selectedRoute.destination || '具体钓点面议'}
                </p>
             </div>
           )}
        </div>

        {/* 2. 定价中心 */}
        <div className="space-y-4">
          <div className="flex items-center space-x-2 px-1">
            <div className="w-1 h-3 bg-blue-500 rounded-full"></div>
            <p className="text-[10px] text-slate-500 font-black uppercase tracking-widest italic">确认报价 / Final Quote</p>
          </div>
          <div className="bg-slate-900 border border-slate-800 rounded-[32px] p-8 text-center shadow-inner">
              <label className="block text-[9px] font-black text-slate-600 uppercase tracking-widest mb-4 italic leading-none">
                {isShare ? '确认最终人均报价 (元/人)' : '确认整船一口价报价 (元)'}
              </label>
              <div className="flex items-center justify-center">
                 <span className="text-3xl font-black text-slate-700 mr-2 italic">¥</span>
                 <input 
                   type="number" 
                   value={price}
                   onChange={(e) => { setPrice(e.target.value); if(selectedRoute) setSelectedRoute(null); }}
                   placeholder="0"
                   className="bg-transparent text-5xl font-black text-white outline-none w-full text-center placeholder-slate-800 italic font-mono"
                 />
              </div>
          </div>
        </div>

        {/* 3. 包含服务 */}
        <div className="space-y-4">
          <div className="flex items-center space-x-2 px-1">
            <div className="w-1 h-3 bg-blue-500 rounded-full"></div>
            <p className="text-[10px] text-slate-500 font-black uppercase tracking-widest italic">包含服务项 / Captain Services</p>
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
                   <div className="relative">
                      <div className="absolute left-4 top-2 text-[8px] text-blue-400 font-black uppercase tracking-tighter italic">其它定制项说明</div>
                      <input 
                        value={customService}
                        onChange={e => setCustomService(e.target.value)}
                        placeholder="请输入其它服务（如：海鲜加工、专业航拍...）"
                        className="w-full bg-slate-950 border border-blue-500/30 rounded-2xl p-4 pt-8 text-xs font-bold text-blue-100 outline-none focus:border-blue-500 shadow-inner"
                      />
                   </div>
                </div>
              )}
          </div>
        </div>

        {/* 4. 钓友自备建议 */}
        <div className="space-y-4">
          <div className="flex items-center justify-between px-1">
            <div className="flex items-center space-x-2">
              <div className="w-1 h-3 bg-orange-500 rounded-full shadow-[0_0_8px_rgba(249,115,22,0.4)]"></div>
              <p className="text-[10px] text-slate-500 font-black uppercase tracking-widest italic">建议钓友自备 / Angler Prep</p>
            </div>
          </div>
          
          <div className="bg-slate-900 border border-slate-800 rounded-[32px] p-6 space-y-5 shadow-xl">
            <div className="space-y-2">
              <label className="text-[9px] text-slate-600 font-black uppercase ml-1 italic leading-none">建议杆轮型号</label>
              <input 
                value={manualGear.rod} 
                onChange={e => setManualGear({...manualGear, rod: e.target.value})} 
                placeholder="如：禧玛诺电绞、2000型水滴轮" 
                className="w-full bg-slate-950 border border-slate-800 rounded-2xl p-4 text-xs font-bold text-white outline-none focus:border-orange-500/50 transition-all shadow-inner" 
              />
            </div>
            <div className="space-y-2">
              <label className="text-[9px] text-slate-600 font-black uppercase ml-1 italic leading-none">建议线组规格</label>
              <input 
                value={manualGear.tackle} 
                onChange={e => setManualGear({...manualGear, tackle: e.target.value})} 
                placeholder="如：PE 6-8号线, 300g铁板" 
                className="w-full bg-slate-950 border border-slate-800 rounded-2xl p-4 text-xs font-bold text-white outline-none focus:border-orange-500/50 transition-all shadow-inner" 
              />
            </div>
            <div className="space-y-2">
              <label className="text-[9px] text-slate-600 font-black uppercase ml-1 italic leading-none">建议鱼饵/拟饵</label>
              <input 
                value={manualGear.bait} 
                onChange={e => setManualGear({...manualGear, bait: e.target.value})} 
                placeholder="如：15cm长型铁板、活南极虾" 
                className="w-full bg-slate-950 border border-slate-800 rounded-2xl p-4 text-xs font-bold text-white outline-none focus:border-orange-500/50 transition-all shadow-inner" 
              />
            </div>
            <div className="space-y-2">
              <label className="text-[9px] text-slate-600 font-black uppercase ml-1 italic leading-none">其他自备事项</label>
              <input 
                value={manualGear.others} 
                onChange={e => setManualGear({...manualGear, others: e.target.value})} 
                placeholder="如：晕船药、防晒服、冰块..." 
                className="w-full bg-slate-950 border border-slate-800 rounded-2xl p-4 text-xs font-bold text-white outline-none focus:border-orange-500/50 transition-all shadow-inner" 
              />
            </div>
          </div>
        </div>
      </div>

      {/* 底部悬浮提交 */}
      <div className="fixed bottom-0 left-0 right-0 max-w-[390px] mx-auto p-8 pt-4 pb-14 bg-slate-900/95 backdrop-blur-2xl border-t border-slate-800 z-50">
         <button 
           disabled={!price}
           onClick={() => {
             const manualIntro = `杆轮：${manualGear.rod || '不限'} | 线组：${manualGear.tackle || '不限'} | 鱼饵：${manualGear.bait || '不限'} | 其他：${manualGear.others || '不限'}`;
             onConfirm(parseFloat(price), selectedServices, selectedRoute || undefined, manualIntro, customService);
           }}
           className="w-full bg-blue-600 disabled:bg-slate-800 disabled:text-slate-600 text-white font-black py-5 rounded-[24px] shadow-2xl shadow-blue-900/40 active:scale-95 transition-all text-sm uppercase tracking-widest italic"
         >
           确认并提交抢单报价
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
                    <h3 className="text-lg font-black text-white italic tracking-tighter uppercase">选择 <span className="text-blue-400">方案预设</span></h3>
                    <p className="text-[9px] text-slate-500 font-bold uppercase tracking-widest mt-1 italic">Route Library</p>
                 </div>
                 <button 
                    onClick={() => onManagePresets?.()} 
                    className="flex items-center space-x-1.5 bg-blue-600/10 hover:bg-blue-600/20 text-blue-400 px-3 py-1.5 rounded-xl border border-blue-500/20 transition-colors group"
                 >
                    <svg className="w-3.5 h-3.5 group-hover:rotate-90 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="M12 4v16m8-8H4" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"/></svg>
                    <span className="text-[10px] font-black uppercase italic tracking-tighter">新增</span>
                 </button>
              </div>
              
              <div className="flex-1 overflow-y-auto no-scrollbar pr-2 space-y-4 pb-10">
                 {presets.length === 0 ? (
                    <div className="py-12 flex flex-col items-center justify-center space-y-4 opacity-40">
                       <div className="w-16 h-16 bg-slate-900 rounded-full flex items-center justify-center border border-dashed border-slate-700">
                          <svg className="w-8 h-8 text-slate-700" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="M9 20l-5.447-2.724A2 2 0 013 15.447V4.553a2 2 0 011.553-1.954l6-1.5a2 2 0 01.894 0l6 1.5a2 2 0 011.553 1.954v10.894a2 2 0 01-1.106 1.789L13 20v-5a1 1 0 00-1-1h-1a1 1 0 00-1 1v5z" strokeWidth="2.5"/></svg>
                       </div>
                       <p className="text-xs font-bold text-slate-500 italic">暂无方案，点击上方“新增”创建预设</p>
                    </div>
                 ) : (
                    presets.map(route => (
                       <button 
                         key={route.id}
                         onClick={() => handleSelectRoute(route)}
                         className="w-full bg-slate-900 border border-slate-800 rounded-[28px] p-6 text-left active:scale-[0.98] transition-all group hover:border-blue-500/40"
                       >
                          <div className="flex justify-between items-center">
                             <h4 className="text-sm font-black text-white group-hover:text-blue-400 transition-colors italic flex items-center flex-wrap leading-relaxed pr-2 flex-1">
                                <span className={`px-1.5 py-0.5 rounded text-[7px] font-black uppercase mr-2 shrink-0 ${
                                   route.oceanType === 'FAR' ? 'bg-indigo-500/20 text-indigo-400 border border-indigo-500/30' : 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'
                                }`}>
                                   {route.oceanType === 'FAR' ? '远海' : '近海'}
                                </span>
                                {getRouteDisplayTitle(route)}
                             </h4>
                             <span className="text-base font-black text-blue-400 italic font-mono shrink-0 ml-2">¥{isShare ? route.sharePrice : route.charterPrice}</span>
                          </div>
                       </button>
                    ))
                 )}
              </div>

              <button 
                onClick={() => setShowPresetPicker(false)}
                className="w-full py-5 text-slate-500 text-xs font-black uppercase tracking-widest hover:text-white transition-colors border border-slate-800 rounded-[24px] shrink-0 mb-4 italic"
              >
                取消
              </button>
           </div>
        </div>
      )}
    </div>
  );
};

export default CaptainQuote;
