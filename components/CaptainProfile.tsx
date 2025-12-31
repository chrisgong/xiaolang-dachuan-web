
import React from 'react';
import { CaptainBid } from '../types';
// Add import for Icons to fix the missing name error
import { Icons } from '../constants';

interface Props {
  bid: CaptainBid;
  onBack: () => void;
  onSelect?: (bid: CaptainBid) => void;
  onViewDynamics: () => void;
  onViewReviews: () => void;
}

const AMENITIES_LIST = [
  { label: "探鱼器", icon: "🛰️" },
  { label: "顶流机", icon: "⚙️" },
  { label: "夜钓照明", icon: "💡" },
  { label: "卫生间", icon: "🚽" },
  { label: "活鱼仓", icon: "🐟" },
  { label: "诱鱼灯", icon: "🔦" },
  { label: "对讲机", icon: "📡" },
  { label: "渔具", icon: "🎣" }
];

const MOCK_DYNAMICS = [
  { 
    id: 1, 
    type: 'video',
    cover: "https://images.unsplash.com/photo-1544551763-47a0159f9234?w=600&h=800&fit=crop", 
    caption: "今日三亚12海里，金枪鱼群爆护！", 
    date: "2小时前"
  },
  { 
    id: 2, 
    type: 'image',
    cover: "https://images.unsplash.com/photo-1516939884455-1445c8652f83?w=600&h=800&fit=crop", 
    caption: "极品红友鱼出水，力量感拉满。", 
    date: "昨天"
  }
];

const CaptainProfile: React.FC<Props> = ({ bid, onBack, onSelect, onViewDynamics, onViewReviews }) => {
  const handleAvatarError = (e: React.SyntheticEvent<HTMLImageElement, Event>) => {
    e.currentTarget.src = `https://ui-avatars.com/api/?background=0D8ABC&color=fff&name=${encodeURIComponent(bid.captainName)}&bold=true`;
  };

  const handleImageError = (e: React.SyntheticEvent<HTMLImageElement, Event>) => {
    e.currentTarget.src = "https://images.unsplash.com/photo-1551244072-5d12893278ab?w=800&h=600&fit=crop";
  };

  return (
    <div className="flex flex-col h-full bg-white max-w-md mx-auto overflow-y-auto no-scrollbar pb-32">
      {/* 1. 顶部：船只画廊 & 船名 */}
      <div className="relative h-[480px] shrink-0 overflow-hidden">
        <div className="flex h-full snap-x snap-mandatory overflow-x-auto no-scrollbar">
          {(bid.catchImages && bid.catchImages.length > 0 ? bid.catchImages : ["https://images.unsplash.com/photo-1544551763-47a0159f9234?w=800&h=1000&fit=crop"]).map((img, idx) => (
            <img key={idx} src={img} onError={handleImageError} className="w-full h-full object-cover snap-center" alt="Boat" />
          ))}
        </div>
        
        {/* 遮罩 & 船名信息 */}
        <div className="absolute inset-x-0 bottom-0 h-1/2 bg-gradient-to-t from-black/90 via-black/40 to-transparent pointer-events-none"></div>
        <button onClick={onBack} className="absolute top-6 left-6 p-2.5 bg-black/20 backdrop-blur-md rounded-2xl text-white border border-white/10 active:scale-90 transition-transform">
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M15 19l-7-7 7-7" /></svg>
        </button>

        {/* 调整 bottom 值，避免被下方悬浮卡片遮挡 */}
        <div className="absolute bottom-20 left-8 right-8 text-white z-0">
           <div className="flex items-center space-x-2 mb-2">
              <span className="bg-blue-600 text-white text-[8px] px-2 py-0.5 rounded font-black tracking-widest uppercase italic shadow-lg shadow-blue-900/40">船只详情</span>
              <span className="text-white/60 text-[10px] font-black uppercase tracking-widest">编号: {bid.id.slice(-4)}</span>
           </div>
           <h1 className="text-4xl font-black italic tracking-tighter drop-shadow-2xl">{bid.boatName}</h1>
           <p className="text-sm font-bold text-white/80 mt-1 italic opacity-80">{bid.boatSpecs}</p>
        </div>
      </div>

      {/* 2. 船长数字名片 (悬浮卡片感) */}
      <div className="mt-[-40px] px-6 relative z-10">
        <div className="bg-white rounded-[40px] shadow-2xl shadow-slate-200 border border-slate-100 p-8 flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <div className="relative">
              <img src={bid.avatar} onError={handleAvatarError} className="w-16 h-16 rounded-[24px] object-cover ring-4 ring-slate-50 shadow-md" />
              <div className="absolute -bottom-1 -right-1 bg-yellow-400 text-white p-1 rounded-lg border-2 border-white">
                <Icons.Star className="w-2.5 h-2.5 fill-current" />
              </div>
            </div>
            <div>
              <h2 className="text-xl font-black text-slate-900 italic leading-none mb-1">{bid.captainName}</h2>
              <div className="flex items-center space-x-2">
                 <span className="text-[10px] text-orange-500 font-black tracking-tighter">★ {bid.rating}</span>
                 <span className="text-[10px] text-slate-400 font-bold uppercase tracking-widest">/ 已带单 {bid.tripsCount}</span>
              </div>
            </div>
          </div>
          <div className="text-right">
             <p className="text-[8px] text-slate-400 font-black uppercase tracking-widest mb-1 italic">从业年限</p>
             <p className="text-sm font-black text-slate-900 italic tracking-tighter">12 年</p>
          </div>
        </div>
      </div>

      {/* 3. 船只硬核配置 */}
      <div className="px-6 mt-10 space-y-8">
        <section>
          <div className="flex items-center space-x-3 mb-5 px-1">
             <div className="w-1.5 h-5 bg-blue-600 rounded-full"></div>
             <h3 className="text-sm font-black text-slate-800 italic uppercase tracking-widest">硬件参数详情</h3>
          </div>
          <div className="grid grid-cols-4 gap-3 mb-6">
            {[
              { l: '长度', v: '12.5m', icon: '📏' },
              { l: '宽度', v: '3.8m', icon: '📐' },
              { l: '马力', v: '600HP', icon: '⚡' },
              { l: '核载', v: '12人', icon: '👥' }
            ].map((item, i) => (
              <div key={i} className="bg-slate-50 border border-slate-100 p-3 rounded-2xl text-center">
                <p className="text-[7px] text-gray-400 font-black uppercase tracking-tighter mb-1 italic">{item.l}</p>
                <p className="text-xs font-black text-slate-900 italic">{item.v}</p>
              </div>
            ))}
          </div>
          <div className="grid grid-cols-4 gap-2">
            {AMENITIES_LIST.map((item, i) => (
              <div key={i} className="flex flex-col items-center justify-center p-3 rounded-2xl bg-white border border-gray-100 shadow-sm transition-all hover:border-blue-100">
                <span className="text-lg mb-1">{item.icon}</span>
                <span className="text-[8px] font-bold text-slate-500 text-center tracking-tighter">{item.label}</span>
              </div>
            ))}
          </div>
        </section>

        {/* 4. 实时动态：今日战报 */}
        <section>
          <div className="flex justify-between items-center mb-5 px-1">
             <div className="flex items-center space-x-3">
                <div className="w-1.5 h-5 bg-emerald-500 rounded-full shadow-[0_0_8px_rgba(16,185,129,0.3)]"></div>
                <h3 className="text-sm font-black text-slate-800 italic uppercase tracking-widest">实时动态战报</h3>
             </div>
             <button onClick={onViewDynamics} className="text-[9px] text-blue-600 font-black uppercase tracking-widest italic">查看全部 +</button>
          </div>
          <div className="flex space-x-4 overflow-x-auto no-scrollbar py-1">
            {MOCK_DYNAMICS.map(dyn => (
              <div key={dyn.id} className="w-64 shrink-0 bg-white rounded-[32px] overflow-hidden border border-slate-100 shadow-xl shadow-slate-100">
                 <div className="h-44 relative">
                    <img src={dyn.cover} onError={handleImageError} className="w-full h-full object-cover" />
                    {dyn.type === 'video' && (
                       <div className="absolute inset-0 flex items-center justify-center bg-black/10">
                          <div className="w-10 h-10 bg-white/20 backdrop-blur-md rounded-full flex items-center justify-center border border-white/40">
                             <svg className="w-4 h-4 text-white ml-0.5" fill="currentColor" viewBox="0 0 20 20"><path d="M4.516 3.848a.5.5 0 01.76-.419l11 7a.5.5 0 010 .84l-11 7a.5.5 0 01-.76-.42V3.848z"/></svg>
                          </div>
                       </div>
                    )}
                 </div>
                 <div className="p-5">
                    <p className="text-xs text-slate-700 font-bold leading-relaxed line-clamp-2 italic">“{dyn.caption}”</p>
                    <div className="flex justify-between items-center mt-3 pt-3 border-t border-slate-50">
                       <span className="text-[8px] text-blue-500 font-black uppercase tracking-widest italic">动力社区推送</span>
                       <span className="text-[8px] text-slate-300 font-bold">{dyn.date}</span>
                    </div>
                 </div>
              </div>
            ))}
          </div>
        </section>

        {/* 5. 用户评价 */}
        <section className="pb-10">
          <div className="flex justify-between items-center mb-5 px-1">
             <div className="flex items-center space-x-3">
                <div className="w-1.5 h-5 bg-orange-500 rounded-full"></div>
                <h3 className="text-sm font-black text-slate-800 italic uppercase tracking-widest">评价口碑证言</h3>
             </div>
             <button onClick={onViewReviews} className="text-[9px] text-blue-600 font-black uppercase tracking-widest italic">查看更多 (42) +</button>
          </div>
          <div className="space-y-4">
             <div className="bg-slate-50 rounded-[32px] p-6 border border-slate-100 relative">
                <div className="flex justify-between items-start mb-3">
                   <div className="flex items-center space-x-2">
                      <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center text-[10px] font-black text-blue-600 border border-white">B</div>
                      <div>
                         <p className="text-[10px] font-black text-slate-900 leading-none mb-1">海钓达人-小白</p>
                         <p className="text-[8px] text-orange-500 font-bold">★★★★★ 极力推荐</p>
                      </div>
                   </div>
                   <span className="text-[8px] text-slate-300 font-bold">2025.12.20</span>
                </div>
                <p className="text-[11px] text-slate-600 font-bold leading-relaxed italic">“老张带点太稳了，第一次出海就中了两条章红，船也很干净，完全不晕船，极力推荐新手预订。”</p>
             </div>
          </div>
        </section>
      </div>

      {/* 底部吸底操作栏 */}
      <div className="fixed bottom-0 left-0 right-0 max-w-md mx-auto p-8 pt-4 pb-12 bg-white/95 backdrop-blur-xl border-t border-slate-100 flex items-center justify-between z-50 shadow-[0_-15px_40px_rgba(0,0,0,0.1)]">
         <div className="flex-1">
            <p className="text-[9px] text-slate-400 font-black uppercase tracking-widest mb-1 italic">航线最低报价</p>
            <div className="flex items-baseline space-x-1">
               <span className="text-3xl font-black text-orange-600 italic tracking-tighter">¥{bid.price}</span>
               <span className="text-[10px] text-slate-400 font-bold italic">每位</span>
            </div>
         </div>
         {onSelect && (
           <button onClick={() => onSelect(bid)} className="bg-blue-600 text-white font-black px-12 py-5 rounded-[22px] shadow-2xl shadow-blue-200 active:scale-95 transition-transform text-xs uppercase tracking-widest italic">
             立即预订该船
           </button>
         )}
      </div>
    </div>
  );
};

export default CaptainProfile;
