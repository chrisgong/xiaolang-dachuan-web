
import React from 'react';
import { UserRequest, OrderType } from '../../types';

interface Props {
  onQuote: (demand: UserRequest) => void;
}

const MOCK_DEMANDS: UserRequest[] = [
  {
    id: 'req-1',
    city: '三亚',
    date: '2025-12-24',
    people: 4,
    style: '远海船钓',
    remarks: '想钓大鱼，有专业装备的优先，4位都是资深钓友',
    type: OrderType.SHARE,
    createdAt: Date.now() - 300000,
    contactName: "李先生",
    filters: { length: 12, width: 3, minPower: "300", amenities: ["探鱼器/顶流机", "卫生间"] }
  },
  {
    id: 'req-2',
    city: '三亚',
    date: '2025-12-25',
    people: 8,
    style: '近海船钓',
    remarks: '公司团建，自带了一些饮料',
    type: OrderType.CHARTER,
    createdAt: Date.now() - 1200000,
    contactName: "张经理",
    filters: { length: 15, width: 4, minPower: "", amenities: ["卫生间", "WIFI"] }
  },
  {
    id: 'req-3',
    city: '万宁',
    date: '2025-12-31',
    people: 6,
    style: '跨年海钓',
    remarks: '跨年夜出海，价格好谈',
    type: OrderType.CHARTER,
    createdAt: Date.now() - 3600000,
    contactName: "阿强",
    filters: { length: 10, width: 3, minPower: "200", amenities: ["诱鱼灯/活鱼舱", "WIFI"] }
  }
];

const CaptainHome: React.FC<Props> = ({ onQuote }) => {
  const formatDate = (dateStr: string) => {
    const dateParts = dateStr.split('-');
    return dateParts.length === 3 ? `${dateParts[1]}月${dateParts[2]}日` : dateStr;
  };

  return (
    <div className="flex flex-col h-full bg-slate-950">
      <div className="bg-slate-900/80 backdrop-blur-md p-6 pb-4 text-white rounded-b-[40px] shadow-2xl border-b border-slate-800">
        <div className="flex justify-between items-start">
           <div>
              <h1 className="text-xl font-black italic tracking-tighter uppercase">小浪 <span className="text-blue-400">抢单池</span></h1>
              <p className="text-[9px] text-slate-500 font-black uppercase mt-1 tracking-widest italic">MARKET OPPORTUNITIES</p>
           </div>
           <div className="w-8"></div>
        </div>
        
        <div className="mt-8 flex items-center justify-between bg-black/40 px-5 py-4 rounded-[24px] border border-slate-800 shadow-inner">
           <div className="flex items-center space-x-3">
              <div className="relative flex shrink-0">
                 <div className="w-2 h-2 bg-blue-500 rounded-full animate-ping absolute"></div>
                 <div className="w-2 h-2 bg-blue-500 rounded-full relative"></div>
              </div>
              <div className="flex flex-col justify-center space-y-0.5">
                 <h2 className="text-[11px] font-black text-slate-300 uppercase tracking-widest leading-none">实时需求动态</h2>
                 <p className="text-[8px] text-slate-600 font-black uppercase font-mono tracking-tighter opacity-80">LIVE STREAMING MONITOR</p>
              </div>
           </div>

           <div className="flex flex-col items-end justify-center space-y-0.5">
              <p className="text-[8px] text-slate-600 font-black uppercase tracking-[0.1em] leading-none">池内待抢需求</p>
              <div className="flex items-baseline space-x-1 leading-none">
                 <span className="text-xl font-black text-emerald-400 italic font-mono tracking-tighter">18</span>
                 <span className="text-[9px] text-slate-600 font-black uppercase font-mono italic">Orders</span>
              </div>
           </div>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto p-6 space-y-6 no-scrollbar pb-32">
        {MOCK_DEMANDS.map(demand => (
          <div key={demand.id} className="bg-slate-900 rounded-[32px] overflow-hidden border border-slate-800 shadow-xl hover:border-slate-700 transition-all group active:scale-[0.98]">
            <div className="flex justify-between items-center p-5 pb-2">
              <div className="flex items-center space-x-2">
                 <span className={`px-2 py-0.5 rounded text-[9px] font-black uppercase tracking-tighter ${demand.type === OrderType.SHARE ? 'bg-orange-500 text-white' : 'bg-blue-600 text-white'}`}>
                   {demand.type === OrderType.SHARE ? '拼船单' : '包船单'}
                 </span>
                 <span className="text-[9px] text-slate-600 font-mono">#{demand.id.split('-')[1] || '0824'}</span>
              </div>
              <span className="text-[10px] text-slate-500 font-bold italic">
                {(Date.now() - (demand.createdAt || 0)) / 1000 / 60 | 0}分钟前发布
              </span>
            </div>

            <div className="px-5 py-3">
               <div className="relative pl-4 py-1 border-l-2 border-blue-500/50 space-y-2.5">
                  {/* 合并后的核心信息行 */}
                  <div className="flex items-start space-x-2">
                    <div className="w-1.5 h-1.5 rounded-full bg-blue-500 mt-1.5 shrink-0 shadow-[0_0_8px_rgba(59,130,246,0.4)]"></div>
                    <p className="text-[13px] text-slate-300 font-bold italic leading-tight">
                      {formatDate(demand.date)} · {demand.city} · {demand.people}人
                    </p>
                  </div>

                  {demand.filters && (
                    <div className="flex items-start space-x-2">
                      <div className="w-1.5 h-1.5 rounded-full bg-slate-800 mt-1.5 shrink-0"></div>
                      <div className="flex flex-wrap gap-1 leading-tight">
                        <span className="text-[11px] text-slate-500 font-black uppercase tracking-tighter">[配置: </span>
                        {demand.filters.length > 1 && <span className="text-[11px] text-slate-400 font-bold italic">船长≥{demand.filters.length}m </span>}
                        {demand.filters.amenities.length > 0 && <span className="text-[11px] text-slate-400 font-bold italic">{demand.filters.amenities.join('、')}</span>}
                        <span className="text-[11px] text-slate-500 font-black uppercase tracking-tighter">]</span>
                      </div>
                    </div>
                  )}

                  {demand.remarks && (
                    <div className="flex items-start space-x-2">
                      <div className="w-1.5 h-1.5 rounded-full bg-orange-500/20 mt-1.5 shrink-0"></div>
                      <p className="text-[12px] text-slate-400 font-medium leading-relaxed italic">
                        备注: {demand.remarks}
                      </p>
                    </div>
                  )}
               </div>
            </div>

            <div className="px-5 pb-5 pt-3">
               <button 
                onClick={() => onQuote(demand)}
                className="w-full bg-blue-600 hover:bg-blue-500 text-white font-black py-4 rounded-2xl transition-all flex items-center justify-center space-x-3 group/btn shadow-lg shadow-blue-900/20"
               >
                 <span className="text-xs uppercase tracking-widest italic">立即参与报价抢单</span>
                 <svg className="w-4 h-4 transform group-hover/btn:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M13 7l5 5m0 0l-5 5m5-5H6"/></svg>
               </button>
            </div>
          </div>
        ))}
        
        <div className="text-center py-10">
           <p className="text-[9px] text-slate-700 font-black uppercase tracking-[0.3em]">已经到底了 END OF FEED</p>
        </div>
      </div>
    </div>
  );
};

export default CaptainHome;
