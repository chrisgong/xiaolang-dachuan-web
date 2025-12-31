
import React from 'react';
import { RoutePreset } from '../../types';

interface Props {
  routes: RoutePreset[];
  onAdd: () => void;
  onEdit: (route: RoutePreset) => void;
  onBack: () => void;
}

const SERVICE_MAP: Record<string, { label: string, icon: string }> = {
  gear: { label: '渔具', icon: '🎣' },
  bait: { label: '鱼饵', icon: '🧊' },
  insurance: { label: '保险', icon: '🛡️' },
  drinks: { label: '饮水', icon: '🥤' },
  guide: { label: '向导', icon: '👨‍🏫' },
  media: { label: '拍摄', icon: '📸' },
  other: { label: '定制', icon: '✨' },
};

const CaptainRoutes: React.FC<Props> = ({ routes, onAdd, onEdit, onBack }) => {
  return (
    <div className="flex flex-col h-full bg-slate-950">
      {/* 紧凑页头 */}
      <div className="p-6 bg-slate-900 border-b border-slate-800 shrink-0 flex items-center shadow-2xl z-10">
        <button onClick={onBack} className="p-2 -ml-2 text-slate-400 hover:text-white transition-colors mr-2">
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M15 19l-7-7 7-7" /></svg>
        </button>
        <div className="flex-1">
          <h1 className="text-xl font-black text-white italic tracking-tighter uppercase">路线 <span className="text-blue-400">方案库</span></h1>
          <p className="text-[9px] text-slate-500 font-bold uppercase mt-0.5 italic tracking-widest">Route Library</p>
        </div>
        <button 
          onClick={onAdd}
          className="w-10 h-10 bg-blue-600 text-white rounded-xl flex items-center justify-center shadow-lg shadow-blue-900/40 active:scale-95 transition-all"
        >
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="M12 4v16m8-8H4" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"/></svg>
        </button>
      </div>

      <div className="flex-1 overflow-y-auto p-4 space-y-4 no-scrollbar pb-32">
        {routes.map(route => {
          // 动态合成标题逻辑
          const displayTitle = (route.destination && route.targetFish) 
            ? `${route.destination}钓${route.targetFish}线`
            : route.name;

          return (
            <div key={route.id} className="bg-slate-900 border border-slate-800 rounded-[28px] p-5 shadow-xl relative overflow-hidden group hover:border-slate-700 transition-all active:scale-[0.98]">
              <div className="flex justify-between items-start mb-4">
                 <div className="flex-1 pr-4">
                    <div className="flex items-center space-x-2 mb-1.5">
                       <span className={`text-[7px] font-black px-1.5 py-0.5 rounded uppercase ${route.oceanType === 'FAR' ? 'bg-indigo-500/20 text-indigo-400 border border-indigo-500/20' : 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/20'}`}>
                          {route.oceanType === 'FAR' ? '远海' : '近海'}
                       </span>
                       {route.destination && (
                          <div className="flex items-center text-slate-500">
                            <svg className="w-2 h-2 mr-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" strokeWidth="3"/></svg>
                            <span className="text-[7px] font-black uppercase tracking-tighter italic">{route.destination}</span>
                          </div>
                       )}
                    </div>
                    <h3 className="text-base font-black text-white italic leading-snug line-clamp-1">{displayTitle}</h3>
                 </div>
                 <button onClick={(e) => { e.stopPropagation(); onEdit(route); }} className="w-10 h-10 bg-white/5 hover:bg-white/10 rounded-xl text-slate-400 hover:text-white transition-all border border-white/5 flex items-center justify-center shrink-0">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/></svg>
                 </button>
              </div>

              {/* 核心参数：价格与包含服务 */}
              <div className="flex items-center justify-between bg-black/30 rounded-2xl p-4 border border-slate-800/50">
                 <div className="flex space-x-6">
                   <div>
                      <p className="text-[8px] text-slate-600 font-black uppercase mb-0.5 italic tracking-tighter">拼船价</p>
                      <p className="text-sm font-black text-emerald-400 italic font-mono">¥{route.sharePrice}</p>
                   </div>
                   <div className="border-l border-slate-800 h-6 my-auto"></div>
                   <div>
                      <p className="text-[8px] text-slate-600 font-black uppercase mb-0.5 italic tracking-tighter">包船价</p>
                      <p className="text-sm font-black text-blue-400 italic font-mono">¥{route.charterPrice}</p>
                   </div>
                 </div>

                 <div className="flex -space-x-1.5">
                    {route.includedServices.slice(0, 4).map(sId => {
                      const service = SERVICE_MAP[sId] || { label: '服务', icon: '✨' };
                      return (
                        <div key={sId} className="w-7 h-7 bg-slate-800 border-2 border-slate-900 rounded-lg flex items-center justify-center shadow-lg group-hover:border-slate-700 transition-all">
                           <span className="text-[10px] select-none">{service.icon}</span>
                        </div>
                      );
                    })}
                    {route.includedServices.length > 4 && (
                      <div className="w-7 h-7 bg-slate-800 border-2 border-slate-900 rounded-lg flex items-center justify-center text-[8px] font-black text-slate-500">
                        +{route.includedServices.length - 4}
                      </div>
                    )}
                 </div>
              </div>
            </div>
          );
        })}

        <div className="text-center py-12">
           <p className="text-[9px] text-slate-800 font-black uppercase tracking-[0.4em] italic">方案库已加载完毕</p>
        </div>
      </div>
    </div>
  );
};

export default CaptainRoutes;
