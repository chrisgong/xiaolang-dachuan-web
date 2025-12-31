
import React, { useState, useEffect } from 'react';
import { Trip, OrderType, RoutePreset } from '../types';
import { Icons, STATIC_ASSETS } from '../constants';

interface Props {
  trip: Trip;
  onFinish: (updatedTrip?: Trip) => void;
  onViewCaptain: () => void;
  onReviewSubmit: () => void; 
}

const SERVICE_MAP: Record<string, { label: string, icon: string }> = {
  gear: { label: '专业渔具', icon: '🎣' },
  bait: { label: '活饵供应', icon: '🧊' },
  insurance: { label: '意外保险', icon: '🛡️' },
  drinks: { label: '饮水零食', icon: '🥤' },
  guide: { label: '专业向导', icon: '👨‍🏫' },
  media: { label: '视频拍摄', icon: '📸' },
  other: { label: '其他定制', icon: '⚓' },
};

const TripDetail: React.FC<Props> = ({ trip, onFinish, onViewCaptain, onReviewSubmit }) => {
  const { orderId, request, bid, status, createdAt, hasReviewed } = trip;
  
  const isPendingPay = status === 'PENDING_PAYMENT';
  const isPaid = status === 'PAID';
  const isInService = status === 'IN_SERVICE';
  const isCompleted = status === 'COMPLETED';
  const isCancelled = status === 'CANCELLED';

  const [payCountdown, setPayCountdown] = useState(900);
  const [serviceDuration, setServiceDuration] = useState<number>(0);

  const getDisplayTitle = () => {
    const info = bid.routeInfo;
    if (info?.destination && info?.targetFish) {
      return `${info.destination}钓${info.targetFish}`;
    }
    if (info?.name && info.name.length < 20) return info.name;
    return "定制海钓行程";
  };

  const displayRouteTitle = getDisplayTitle();

  useEffect(() => {
    if (isPendingPay && payCountdown > 0) {
      const timer = setInterval(() => setPayCountdown(c => c - 1), 1000);
      return () => clearInterval(timer);
    }
  }, [isPendingPay, payCountdown]);

  useEffect(() => {
    if (isInService) {
      const updateDuration = () => {
        const startTime = createdAt; 
        const diff = Math.max(0, Math.floor((Date.now() - startTime) / 1000));
        setServiceDuration(diff);
      };
      updateDuration();
      const timer = setInterval(updateDuration, 1000);
      return () => clearInterval(timer);
    }
  }, [isInService, createdAt]);

  const formatDuration = (s: number) => {
    const h = Math.floor(s / 3600);
    const m = Math.floor((s % 3600) / 60);
    const rs = s % 60;
    return `${h < 10 ? '0' : ''}${h}:${m < 10 ? '0' : ''}${m}:${rs < 10 ? '0' : ''}${rs}`;
  };

  const totalPrice = request.type === OrderType.SHARE ? bid.price * request.people : bid.price;

  const handleAvatarError = (e: React.SyntheticEvent<HTMLImageElement, Event>) => {
    e.currentTarget.src = `https://ui-avatars.com/api/?name=${encodeURIComponent(bid.captainName)}&background=0D8ABC&color=fff&size=128&bold=true`;
  };

  const handleBoatImgError = (e: React.SyntheticEvent<HTMLImageElement, Event>) => {
    e.currentTarget.src = STATIC_ASSETS.FALLBACK_IMAGE;
  };

  const renderActiveHeader = () => (
    <div className={`p-6 pb-28 text-white shrink-0 transition-colors duration-500 relative ${
      isPendingPay ? 'bg-orange-500' : 
      isPaid ? 'bg-green-600' : 
      'bg-blue-600'
    }`}>
      <div className="flex items-center justify-between mb-8">
         <button onClick={() => onFinish()} className="p-2 -ml-2 bg-white/10 rounded-full active:scale-90 transition-transform">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M15 19l-7-7 7-7" /></svg>
         </button>
         <h2 className="text-lg font-black tracking-tight italic uppercase tracking-tighter">订单状态详情</h2>
         <button className="text-[10px] font-black uppercase border border-white/30 px-3 py-1 rounded-full bg-white/5 backdrop-blur-sm">客服</button>
      </div>

      <div className="animate-in fade-in slide-in-from-top-4 duration-500 relative z-10">
         {isPendingPay && (
           <div className="flex items-center justify-between">
              <div className="flex-1 pr-4">
                 <h1 className="text-2xl font-black italic tracking-tighter">待支付定金</h1>
                 <p className="text-[11px] opacity-90 mt-1.5 font-black italic uppercase tracking-tight leading-tight">锁定船长报价</p>
              </div>
              <div className="text-right shrink-0">
                 <p className="text-3xl font-black italic font-mono leading-none">¥{(totalPrice * 0.2).toFixed(0)}</p>
                 <p className="text-[8px] opacity-60 mt-1 uppercase font-black">Deposit</p>
              </div>
           </div>
         )}
         {isPaid && (
           <div className="space-y-1">
              <h1 className="text-2xl font-black italic uppercase tracking-tighter">待出海登船</h1>
              <p className="text-[10px] opacity-80 font-black italic uppercase tracking-widest leading-relaxed">方案：{displayRouteTitle}</p>
           </div>
         )}
         {isInService && (
           <div className="space-y-1">
              <h1 className="text-2xl font-black italic uppercase tracking-tighter">海钓进行中</h1>
              <p className="text-[10px] opacity-80 font-black italic uppercase tracking-widest">{displayRouteTitle}</p>
           </div>
         )}
      </div>
    </div>
  );

  const renderFinishedHeader = () => (
    <div className={`p-6 pb-28 text-white shrink-0 transition-colors duration-500 ${isCompleted ? 'bg-slate-900' : 'bg-red-500'}`}>
      <div className="flex items-center justify-between mb-8">
         <button onClick={() => onFinish()} className="p-2 -ml-2 bg-white/10 rounded-full">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M15 19l-7-7 7-7" /></svg>
         </button>
         <h2 className="text-lg font-black tracking-tight italic uppercase tracking-tighter">行程详情</h2>
         <div className="w-10"></div>
      </div>
      <div className="animate-in fade-in slide-in-from-top-4 duration-500 text-center">
         <h1 className="text-3xl font-black italic uppercase tracking-tighter">{isCompleted ? '行程已完成' : '订单已取消'}</h1>
      </div>
    </div>
  );

  return (
    <div className="flex flex-col h-full bg-gray-50 max-w-md mx-auto overflow-hidden relative text-slate-900">
      {(isCompleted || isCancelled) ? renderFinishedHeader() : renderActiveHeader()}
      <div className="flex-1 overflow-y-auto no-scrollbar pb-64 -mt-16 px-4 z-10 relative space-y-4">
         {isPaid && (
           <div className="bg-white rounded-[40px] shadow-2xl border border-gray-100 overflow-hidden text-center p-10">
               <div className="inline-block p-6 bg-slate-50 rounded-[32px] mb-6 shadow-inner ring-1 ring-gray-100/50">
                  <img src={`https://quickchart.io/qr?text=${trip.verifyCode}&size=200`} className="w-40 h-40 opacity-90" />
               </div>
               <p className="text-4xl font-mono font-black tracking-[0.2em] text-gray-900 mb-2">{trip.verifyCode}</p>
               <p className="text-[10px] text-gray-400 font-black uppercase tracking-widest italic">登船核销码</p>
           </div>
         )}
         {isInService && (
            <div className="bg-white rounded-[40px] p-10 text-center shadow-xl border border-gray-100">
               <p className="text-[10px] text-gray-400 font-black uppercase tracking-[0.2em] mb-4 italic">已服务时长 SERVICE DURATION</p>
               <h2 className="text-5xl font-mono font-black text-slate-900 italic tracking-tighter">{formatDuration(serviceDuration)}</h2>
            </div>
         )}
         
         {/* 行程核心信息卡片 */}
         <div className="bg-white rounded-[40px] shadow-2xl border border-gray-100 overflow-hidden p-8 space-y-6">
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                 <span className="text-gray-400 font-black text-[9px] uppercase italic tracking-widest">出发日期 DATE</span>
                 <span className="text-slate-800 font-black italic">{request.date}</span>
              </div>
              <div className="flex justify-between items-center">
                 <span className="text-gray-400 font-black text-[9px] uppercase italic tracking-widest">登船城市 CITY</span>
                 <span className="text-slate-800 font-black italic">{request.city}</span>
              </div>
              <div className="flex justify-between items-center">
                 <span className="text-gray-400 font-black text-[9px] uppercase italic tracking-widest">出行人数 PEOPLE</span>
                 <span className="text-slate-800 font-black italic">{request.people}位 ({request.type === OrderType.SHARE ? '拼船' : '包船'})</span>
              </div>
            </div>

            {/* 包含服务项列表 */}
            <div className="pt-6 border-t border-slate-50">
              <p className="text-gray-400 font-black text-[9px] uppercase italic tracking-widest mb-4">包含服务项 INCLUDED SERVICES</p>
              <div className="grid grid-cols-2 gap-3 mb-6">
                {bid.includedServices?.map(sId => {
                  const s = SERVICE_MAP[sId] || { label: '定制服务', icon: '⚓' };
                  return (
                    <div key={sId} className="bg-slate-50 p-4 rounded-2xl flex items-center space-x-3 border border-slate-100">
                      <span className="text-xl">{s.icon}</span>
                      <span className="text-[10px] font-black text-slate-600 uppercase tracking-tighter">{s.label}</span>
                    </div>
                  );
                })}
              </div>

              {/* 关键修复：船长报价时填写的自备建议（manualIntro） */}
              {bid.manualIntro && (
                <div className="animate-in fade-in slide-in-from-top-2 duration-500">
                   <div className="flex items-center space-x-2 mb-3">
                      <div className="w-1.5 h-4 bg-orange-500 rounded-full shadow-[0_0_8px_rgba(249,115,22,0.3)]"></div>
                      <p className="text-gray-400 font-black text-[9px] uppercase italic tracking-widest">钓友自备建议 ANGLER PREP</p>
                   </div>
                   <div className="bg-orange-50/50 p-5 rounded-3xl border border-orange-100 shadow-inner">
                      <p className="text-[11px] text-orange-900 font-bold leading-relaxed italic">
                        {bid.manualIntro}
                      </p>
                   </div>
                </div>
              )}
              
              {/* 如果没有 manualIntro 且处于待支付状态，显示默认提醒 */}
              {!bid.manualIntro && isPendingPay && (
                 <div className="mt-4 p-4 bg-slate-50 rounded-2xl border border-dashed border-slate-200">
                    <p className="text-[10px] text-slate-400 font-bold italic text-center">船长暂无特殊装备自备建议</p>
                 </div>
              )}
            </div>
         </div>

         {/* 船长卡片 - 调整后更紧凑 */}
         <div className="bg-white rounded-[40px] shadow-2xl border border-gray-100 overflow-hidden">
            {/* 缩小船只图片高度 */}
            <img src={bid.catchImages[0] || STATIC_ASSETS.BOAT_FAR} onError={handleBoatImgError} className="w-full h-36 object-cover" />
            <div className="p-6">
               <button onClick={onViewCaptain} className="w-full flex justify-between items-center bg-blue-50/30 p-4 rounded-[28px] border border-blue-100/10">
                  <div className="flex items-center space-x-4">
                     <img src={bid.avatar} onError={handleAvatarError} className="w-12 h-12 rounded-[18px] object-cover ring-2 ring-white shadow-md" />
                     <div className="min-w-0 text-left">
                        <h3 className="text-sm font-black text-slate-900 leading-tight italic">{bid.captainName}</h3>
                        <p className="text-[9px] text-gray-400 font-bold uppercase truncate italic">{bid.boatName}</p>
                     </div>
                  </div>
                  <div className="bg-blue-600 text-white px-5 py-2 rounded-xl text-[10px] font-black shadow-lg">对话</div>
               </button>
            </div>
         </div>
      </div>
    </div>
  );
};

export default TripDetail;
