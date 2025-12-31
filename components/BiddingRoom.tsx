
import React, { useEffect, useState } from 'react';
import { UserRequest, CaptainBid, OrderType } from '../types';
import { Icons, STATIC_ASSETS } from '../constants';

interface Props {
  request: UserRequest;
  existingBids: CaptainBid[];
  biddingDone: boolean;
  onSelect: (bid: CaptainBid) => void;
  onMinimize: () => void;
  onCancel: () => void;
  onViewCaptain: (bid: CaptainBid) => void;
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

const BiddingRoom: React.FC<Props> = ({ request, existingBids, biddingDone, onSelect, onMinimize, onCancel, onViewCaptain }) => {
  const [feedbackIndex, setFeedbackIndex] = useState(0);
  const [logIndex, setLogIndex] = useState(0);
  const [isHeaderCollapsed, setIsHeaderCollapsed] = useState(false);
  
  const feedbackMessages = [
    `正在同步全岛 ${request.city} 实时气象与水流数据`,
    `指令已通过 AI 引擎精准推送至 15 位金牌船长`,
    `正在根据您的备注 “${request.remarks || '常规需求'}” 匹配最优航线`,
    `船长已接收指令，正在进行极速排期与报价响应`
  ];

  const systemLogs = [
    "正在搜索附近可用船只...",
    "分析船只航行稳定性...",
    "核验船长执业资质...",
    "规划航线最优路径...",
    "AI 匹配引擎运行中",
    "同步海洋实时气象数据..."
  ];

  useEffect(() => {
    if (!biddingDone) {
      // 提速反馈循环：由 3s 减为 1.5s
      const msgTimer = setInterval(() => {
        setFeedbackIndex(prev => (prev + 1) % feedbackMessages.length);
      }, 1500);
      // 提速系统日志滚动：由 1.2s 减为 0.8s
      const logTimer = setInterval(() => {
        setLogIndex(prev => (prev + 1) % systemLogs.length);
      }, 800);

      // 提速头部自动收起：由 3s 减为 1.2s，让用户尽快看到内容
      const collapseTimer = setTimeout(() => {
        setIsHeaderCollapsed(true);
      }, 1200);

      return () => {
        clearInterval(msgTimer);
        clearInterval(logTimer);
        clearTimeout(collapseTimer);
      };
    } else {
      setIsHeaderCollapsed(true);
    }
  }, [biddingDone, feedbackMessages.length, systemLogs.length]);

  const getRouteTitle = (bid: CaptainBid) => {
    const info = bid.routeInfo;
    if (info?.destination && info?.targetFish) {
      return `${info.destination}钓${info.targetFish}`;
    }
    if (info?.name && info.name.length < 20) return info.name;
    return "定制海钓方案";
  };

  const handleAvatarError = (e: React.SyntheticEvent<HTMLImageElement, Event>, name: string) => {
    e.currentTarget.src = `https://ui-avatars.com/api/?background=0D8ABC&color=fff&size=128&bold=true&name=${encodeURIComponent(name)}`;
  };

  const handleBoatImageError = (e: React.SyntheticEvent<HTMLImageElement, Event>) => {
    e.currentTarget.src = STATIC_ASSETS.FALLBACK_IMAGE;
  };

  return (
    <div className="flex flex-col h-full bg-slate-50 max-w-md mx-auto relative overflow-hidden">
      {/* Premium Cyber-Marine Header */}
      <div 
        className={`relative bg-[#020617] text-white shadow-[0_25px_60px_-15px_rgba(0,0,0,0.5)] shrink-0 transition-all duration-700 ease-in-out z-40 overflow-hidden ${
          isHeaderCollapsed ? 'pt-6 pb-8 rounded-b-[48px]' : 'pt-12 pb-14 rounded-b-[60px]'
        }`}
      >
        {/* Advanced Mesh Glow Background */}
        <div className="absolute inset-0 pointer-events-none overflow-hidden">
          <div className="absolute top-[-10%] left-[-10%] w-[250px] h-[250px] bg-blue-600/20 rounded-full blur-[80px] animate-pulse"></div>
          <div className="absolute bottom-[-10%] right-[-10%] w-[200px] h-[200px] bg-indigo-500/20 rounded-full blur-[80px] animate-pulse delay-1000"></div>
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[150%] h-[150%] bg-[radial-gradient(circle_at_center,rgba(59,130,246,0.05)_0%,transparent_70%)]"></div>
          {/* Subtle Scanlines */}
          <div className="absolute inset-0 opacity-[0.03] bg-[linear-gradient(rgba(18,16,16,0)_50%,rgba(0,0,0,0.25)_50%),linear-gradient(90deg,rgba(255,0,0,0.06),rgba(0,255,0,0.02),rgba(0,0,255,0.06))] bg-[length:100%_2px,3px_100%] pointer-events-none"></div>
        </div>

        {/* Header Controls */}
        <div className="px-6 flex items-center justify-between relative z-10 mb-6">
          <button 
            onClick={onMinimize} 
            className="w-10 h-10 flex items-center justify-center rounded-2xl bg-white/5 border border-white/10 backdrop-blur-2xl hover:bg-white/10 active:scale-90 transition-all shadow-[0_8px_20px_rgba(0,0,0,0.2)]"
          >
            <svg className="w-5 h-5 text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M19 9l-7 7-7-7" />
            </svg>
          </button>
          
          <div className="flex flex-col items-center">
             <h2 className={`font-black italic tracking-[0.25em] transition-all duration-500 text-white ${isHeaderCollapsed ? 'text-[11px]' : 'text-xs mb-1.5'}`}>竞价中心</h2>
             {!isHeaderCollapsed && <span className="text-[8px] font-bold text-blue-500/60 uppercase tracking-[0.4em] leading-none">海事智能同步</span>}
          </div>

          <button onClick={onCancel} className="text-[10px] font-black text-slate-500 hover:text-red-400 transition-colors uppercase tracking-[0.1em] px-2 py-1 italic">取消任务</button>
        </div>

        {/* Expanded Animation Content */}
        {!isHeaderCollapsed && (
          <div className="flex flex-col items-center animate-in fade-in zoom-in-95 duration-700 relative z-10 px-6">
            <div className="relative w-32 h-32 mb-6 flex items-center justify-center">
              <div className="absolute inset-0 border border-blue-500/20 rounded-full animate-[ping_3s_linear_infinite]"></div>
              <div className="absolute inset-4 border border-blue-500/30 rounded-full animate-[ping_3s_linear_infinite_1s]"></div>
              <div className="relative w-20 h-20 bg-blue-500/10 rounded-full backdrop-blur-3xl border border-blue-400/30 shadow-[0_0_40px_rgba(59,130,246,0.3)] flex items-center justify-center group overflow-hidden">
                 <div className="absolute inset-0 bg-gradient-to-t from-blue-500/20 to-transparent animate-[spin_4s_linear_infinite] origin-center"></div>
                 <svg className="w-8 h-8 text-blue-400 relative z-10" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M8.111 16.404a5.5 5.5 0 017.778 0M12 20h.01m-7.08-7.071c3.904-3.905 10.236-3.905 14.141 0M1.394 9.393c5.857-5.857 15.355-5.857 21.213 0" />
                 </svg>
              </div>
            </div>

            <div className="space-y-2 text-center">
               <h3 className="text-xl font-black italic tracking-tighter text-white flex items-center justify-center">
                  深度检索全岛运力
                  <span className="flex space-x-1 ml-2">
                     <span className="w-1.5 h-1.5 bg-blue-500 rounded-full animate-bounce"></span>
                     <span className="w-1.5 h-1.5 bg-blue-500 rounded-full animate-bounce delay-100"></span>
                     <span className="w-1.5 h-1.5 bg-blue-500 rounded-full animate-bounce delay-200"></span>
                  </span>
               </h3>
               <p className="text-[10px] text-blue-400/50 font-black tracking-[0.2em] italic font-mono">{systemLogs[logIndex]}</p>
               <div className="h-[1px] w-12 bg-blue-500/20 mx-auto mt-4 mb-4"></div>
               <p className="text-[11px] leading-relaxed text-slate-400 font-bold italic tracking-wide max-w-[280px] mx-auto opacity-80">
                  {feedbackMessages[feedbackIndex]}
               </p>
            </div>
          </div>
        )}

        {/* Collapsed Status Display */}
        {isHeaderCollapsed && (
          <div className="px-6 animate-in slide-in-from-top-4 duration-500 relative z-10">
            <div className="bg-white/[0.03] border border-white/10 rounded-[28px] p-4 flex items-center justify-between backdrop-blur-3xl shadow-inner">
              <div className="flex items-center space-x-4">
                <div className="relative flex items-center justify-center">
                  <div className={`w-3 h-3 rounded-full ${biddingDone ? 'bg-emerald-500' : 'bg-blue-500 animate-pulse'} shadow-[0_0_12px_rgba(59,130,246,0.5)]`}></div>
                  <div className={`absolute w-3 h-3 rounded-full ${biddingDone ? 'bg-emerald-500' : 'bg-blue-500'} animate-ping opacity-30`}></div>
                </div>
                <div>
                  <h4 className="text-[14px] font-black italic tracking-tight leading-none text-white mb-1.5">
                     {biddingDone ? '匹配已完成' : '极速匹配中...'}
                  </h4>
                  <p className="text-[9px] font-black text-slate-500 uppercase tracking-widest leading-none font-mono">
                     {biddingDone ? '网络已同步' : systemLogs[logIndex]}
                  </p>
                </div>
              </div>
              
              <div className="bg-blue-600/10 px-4 py-2 rounded-2xl border border-blue-500/20">
                <div className="flex items-baseline space-x-1">
                  <span className="text-sm font-black text-blue-400 italic font-mono leading-none">{existingBids.length}</span>
                  <span className="text-[8px] font-black text-white/40 uppercase tracking-tighter leading-none">份报价</span>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Quote List Area */}
      <div className="flex-1 overflow-y-auto px-4 py-8 space-y-5 no-scrollbar pb-32">
        {existingBids.length === 0 && !biddingDone && (
           <div className="text-center py-20 px-10">
              <div className="w-20 h-20 bg-slate-100 rounded-full flex items-center justify-center mx-auto mb-8 opacity-40 shadow-inner">
                <svg className="w-10 h-10 text-slate-300 animate-spin-slow" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/></svg>
              </div>
              <p className="text-xs font-black uppercase tracking-[0.1em] text-slate-300 leading-relaxed italic">
                正在握手全岛船长网格...<br/>
                <span className="text-[10px] opacity-60">请稍候，方案正在通过 AI 封装推送</span>
              </p>
           </div>
        )}

        {existingBids.sort((a,b) => a.price - b.price).map((bid) => (
          <div 
            key={bid.id} 
            onClick={() => onViewCaptain(bid)}
            className="bg-white rounded-[40px] shadow-[0_15px_40px_rgba(0,0,0,0.04)] border border-slate-100/50 overflow-hidden animate-in slide-in-from-bottom-8 duration-700 cursor-pointer active:scale-[0.98] transition-all group"
          >
            <div className="p-6 flex space-x-5 border-b border-slate-50">
               <div className="flex-1 min-w-0 flex flex-col justify-between">
                  <div className="space-y-2">
                    <div className="flex items-center space-x-2">
                      <span className={`text-[7px] font-black px-2 py-0.5 rounded-full uppercase ${bid.routeInfo?.oceanType === 'FAR' ? 'bg-indigo-600 text-white shadow-md shadow-indigo-100' : 'bg-emerald-500 text-white shadow-md shadow-emerald-100'}`}>
                        {bid.routeInfo?.oceanType === 'FAR' ? '远海航线' : '近海线路'}
                      </span>
                      <div className="flex items-center text-slate-400">
                        <svg className="w-2.5 h-2.5 mr-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" strokeWidth="3"/></svg>
                        <span className="text-[9px] font-black uppercase tracking-widest truncate max-w-[85px] italic">{bid.routeInfo?.destination || '具体钓点'}</span>
                      </div>
                    </div>
                    <h3 className="text-lg font-black text-slate-900 leading-tight italic tracking-tight line-clamp-1 group-hover:text-blue-600 transition-colors">
                      {getRouteTitle(bid)}
                    </h3>
                    
                    <div className="flex flex-wrap gap-1 mt-2 items-center">
                      {bid.includedServices?.slice(0, 3).map(sId => {
                        const service = SERVICE_MAP[sId] || { label: '服务', icon: '⚓' };
                        return (
                          <div key={sId} className="flex items-center bg-slate-50 px-1.5 py-0.5 rounded-lg border border-slate-100 transition-colors group-hover:border-blue-100 group-hover:bg-blue-50/30 shrink-0">
                            <span className="text-[10px] mr-1 select-none">{service.icon}</span>
                            <span className="text-[7px] font-black text-slate-500 uppercase tracking-tighter leading-none">{service.label}</span>
                          </div>
                        );
                      })}
                      {bid.includedServices && bid.includedServices.length > 3 && (
                        <div className="flex items-center bg-blue-50 px-1.5 py-0.5 rounded-lg border border-blue-100 shrink-0">
                          <span className="text-[7px] font-black text-blue-600 leading-none">+{bid.includedServices.length - 3}</span>
                        </div>
                      )}
                    </div>
                  </div>

                  <div className="mt-4 flex items-baseline space-x-1.5">
                    <span className="text-[11px] font-black text-blue-600 italic">¥</span>
                    <span className="text-3xl font-black text-blue-600 italic font-mono leading-none tracking-tighter">{bid.price}</span>
                    <span className="text-[8px] font-black text-slate-400 uppercase tracking-widest ml-1">
                      {request.type === OrderType.SHARE ? '/ 人' : '/ 全船'}
                    </span>
                  </div>
               </div>

               <div className="w-32 h-32 rounded-[32px] overflow-hidden shrink-0 relative shadow-xl group-hover:shadow-blue-200/40 transition-shadow">
                 <img 
                    src={bid.catchImages[0] || STATIC_ASSETS.BOAT_NEAR} 
                    onError={handleBoatImageError}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-1000" 
                    alt="Boat"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent opacity-90"></div>
                  <div className="absolute bottom-2 left-3 right-3">
                     <p className="text-[8px] text-white font-black uppercase tracking-widest italic truncate">{bid.boatName}</p>
                     <p className="text-[7px] text-white/60 font-black uppercase tracking-tighter truncate">{bid.boatSpecs}</p>
                  </div>
                  <div className="absolute top-2 right-2 bg-blue-600 text-[6px] text-white px-2 py-0.5 rounded-full font-black italic shadow-lg">实拍认证</div>
               </div>
            </div>

            <div className="px-6 py-5 flex items-center justify-between bg-slate-50/30">
              <div className="flex items-center space-x-3">
                <div className="relative">
                  <img src={bid.avatar} onError={(e) => handleAvatarError(e, bid.captainName)} className="w-10 h-10 rounded-2xl object-cover ring-2 ring-white shadow-md" />
                  <div className="absolute -bottom-1 -right-1 bg-yellow-400 text-white p-0.5 rounded-lg border border-white shadow-sm"><Icons.Star className="w-2 h-2" /></div>
                </div>
                <div className="min-w-0">
                  <h4 className="text-[12px] font-black text-slate-900 flex items-center italic leading-none mb-1">
                    {bid.captainName}
                    <span className="ml-2 text-[9px] text-orange-500 font-black">★ {bid.rating}</span>
                  </h4>
                  <p className="text-[8px] text-slate-400 font-black uppercase tracking-widest">历史接单 {bid.tripsCount} 次</p>
                </div>
              </div>

              <button 
                onClick={(e) => { e.stopPropagation(); onSelect(bid); }} 
                className="bg-blue-600 hover:bg-blue-700 text-white font-black px-8 py-3 rounded-2xl shadow-[0_10px_25px_rgba(37,99,235,0.2)] transition-all active:scale-95 active:shadow-none text-[11px] uppercase tracking-widest italic"
              >
                锁定此方案
              </button>
            </div>
          </div>
        ))}
      </div>

      <div className="px-8 py-6 bg-white border-t border-slate-100 flex items-center space-x-4 shrink-0 shadow-[0_-10px_40px_rgba(0,0,0,0.02)]">
        <div className="bg-amber-100/50 p-3 rounded-2xl text-amber-600 shadow-inner">
           <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" strokeWidth="2.5"/></svg>
        </div>
        <p className="text-[10px] text-slate-500 leading-relaxed italic font-bold">
          <span className="text-slate-900 font-black">海域安全托管</span>：定金由平台托管至行程结束，包含 50万 出海意外险，支持船长违约双倍赔付。
        </p>
      </div>

      <style>{`
        @keyframes spin-slow {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
        .animate-spin-slow {
          animation: spin-slow 8s linear infinite;
        }
      `}</style>
    </div>
  );
};

export default BiddingRoom;
