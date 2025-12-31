
import React, { useState, useEffect } from 'react';
import { Trip, OrderType } from '../../types';

interface Props {
  trip: Trip;
  onBack: () => void;
  onCancelOrder: (id: string, reason: string) => void;
  onVerify: () => void; 
}

const SERVICE_MAP: Record<string, { label: string, icon: string }> = {
  gear: { label: '渔具', icon: '🎣' },
  bait: { label: '鱼饵', icon: '🧊' },
  insurance: { label: '保险', icon: '🛡️' },
  drinks: { label: '饮水', icon: '🥤' },
  guide: { label: '向导', icon: '👨‍🏫' },
  media: { label: '拍摄', icon: '📸' },
  other: { label: '其他', icon: '✨' },
};

const CaptainOrderDetail: React.FC<Props> = ({ trip, onBack, onCancelOrder, onVerify }) => {
  const { orderId, request, bid, status, createdAt } = trip;
  const isCompleted = status === 'COMPLETED';
  const isCancelled = status === 'CANCELLED';
  const isPendingPay = status === 'PENDING_PAYMENT';
  const isPaid = status === 'PAID';
  const isInService = status === 'IN_SERVICE';
  const isBidding = status === 'BIDDING';

  const [showCancelDialog, setShowCancelDialog] = useState(false);
  const [showPhoneModal, setShowPhoneModal] = useState(false);
  const [customReason, setCustomReason] = useState("");
  const [serviceDuration, setServiceDuration] = useState<number>(0);

  const CANCEL_REASONS = ["天气恶劣，不宜出海", "船只临时故障", "身体不适", "其它原因"];

  const phoneNumbers = [
    { label: '主联系电话', value: request.contactPhone || '13800138000' }
  ];

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

  const handleCancelSubmit = (reason: string) => {
    onCancelOrder(orderId, reason);
    setShowCancelDialog(false);
    onBack();
  };

  const handleCall = (phone: string) => {
    window.location.href = `tel:${phone}`;
    setShowPhoneModal(false);
  };

  const totalPrice = request.type === OrderType.SHARE ? bid.price * request.people : bid.price;

  return (
    <div className="flex flex-col h-full bg-slate-950 text-white relative">
      <div className="p-6 border-b border-slate-800 flex items-center bg-slate-900 shrink-0 z-20">
        <button onClick={onBack} className="p-2 -ml-2 text-slate-400 hover:text-white transition-colors">
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" /></svg>
        </button>
        <h2 className="flex-1 text-center font-black text-lg italic tracking-tighter uppercase">订单 <span className="text-blue-400">详情</span></h2>
        <div className="w-8"></div>
      </div>

      <div className="flex-1 overflow-y-auto p-6 space-y-6 no-scrollbar pb-40">
        {/* 订单状态头部 */}
        <div className={`p-8 rounded-[40px] text-center border overflow-hidden ${
          isCompleted ? 'bg-blue-600/10 border-blue-500/20' : 
          isCancelled ? 'bg-red-600/10 border-red-500/20' : 
          (isBidding || isPendingPay) ? 'bg-orange-500/10 border-orange-500/20' :
          'bg-slate-900 border-slate-800'
        }`}>
           <p className="text-[10px] text-slate-500 font-black uppercase tracking-widest mb-2 italic">ORDER STATUS</p>
           <h1 className={`text-2xl font-black italic tracking-tighter ${
             isCompleted ? 'text-blue-400' : 
             isCancelled ? 'text-red-400' : 
             (isBidding || isPendingPay) ? 'text-orange-400' : 'text-white'
           }`}>
             {status === 'COMPLETED' ? '行程已完成' : 
              status === 'CANCELLED' ? '订单已取消' : 
              status === 'PAID' ? '已支付 · 待核销' : 
              status === 'IN_SERVICE' ? '实时服务中' : 
              status === 'BIDDING' ? '等待钓友选择' : '等待钓友支付'}
           </h1>
        </div>

        {/* 1. 钓友需求详细表单 */}
        <div className="bg-slate-900 rounded-[32px] border border-slate-800 overflow-hidden shadow-2xl">
          <div className="p-5 border-b border-slate-800 flex justify-between items-center bg-slate-900/50">
            <div className="flex items-center space-x-2">
              <div className="w-1.5 h-4 bg-blue-500 rounded-full"></div>
              <h3 className="text-xs font-black uppercase tracking-widest italic text-white">钓友需求表单 / ANGLER REQUEST</h3>
            </div>
            <span className="text-[8px] text-slate-500 font-black uppercase">ID: {request.id.slice(-4)}</span>
          </div>
          
          <div className="p-6 space-y-5">
            <div className="grid grid-cols-2 gap-y-4">
              <div>
                <p className="text-[9px] text-slate-600 font-black uppercase mb-1">出海日期</p>
                <p className="text-xs font-bold text-white">{request.date}</p>
              </div>
              <div>
                <p className="text-[9px] text-slate-600 font-black uppercase mb-1">登船城市</p>
                <p className="text-xs font-bold text-white">{request.city}</p>
              </div>
              <div>
                <p className="text-[9px] text-slate-600 font-black uppercase mb-1">预约人数</p>
                <p className="text-xs font-bold text-white">{request.people}人</p>
              </div>
            </div>

            {request.filters && (
              <div className="pt-4 border-t border-slate-800">
                <p className="text-[9px] text-slate-600 font-black uppercase mb-3 italic">硬件配置指定需求</p>
                <div className="flex flex-wrap gap-2">
                   {request.filters.length > 0 && <span className="bg-blue-600/10 text-blue-400 border border-blue-500/20 px-2 py-1 rounded text-[9px] font-black uppercase">船长 ≥{request.filters.length}m</span>}
                   {request.filters.minPower && <span className="bg-blue-600/10 text-blue-400 border border-blue-500/20 px-2 py-1 rounded text-[9px] font-black uppercase">功率 ≥{request.filters.minPower}HP</span>}
                   {request.filters.amenities.map(a => (
                     <span key={a} className="bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 px-2 py-1 rounded text-[9px] font-black uppercase">必选: {a}</span>
                   ))}
                </div>
              </div>
            )}

            {request.remarks && (
              <div className="pt-4 border-t border-slate-800">
                <p className="text-[9px] text-slate-600 font-black uppercase mb-2">补充留言</p>
                <p className="text-[11px] text-slate-400 italic leading-relaxed">“{request.remarks}”</p>
              </div>
            )}
          </div>
        </div>

        {/* 2. 船长报价详细表单 */}
        <div className="bg-slate-900 rounded-[32px] border border-blue-500/20 overflow-hidden shadow-2xl">
          <div className="p-5 border-b border-slate-800 flex justify-between items-center bg-blue-600/10">
            <div className="flex items-center space-x-2">
              <div className="w-1.5 h-4 bg-emerald-400 rounded-full"></div>
              <h3 className="text-xs font-black uppercase tracking-widest italic text-white">我的报价方案 / CAPTAIN QUOTE</h3>
            </div>
            <span className={`text-[8px] font-black px-2 py-0.5 rounded ${request.type === OrderType.SHARE ? 'bg-orange-500 text-white' : 'bg-blue-600 text-white'}`}>
               {request.type === OrderType.SHARE ? '拼船模式' : '包船模式'}
            </span>
          </div>

          <div className="p-6 space-y-6">
            {/* 核心价格与航线 */}
            <div className="flex justify-between items-start">
               <div>
                  <p className="text-[9px] text-slate-600 font-black uppercase mb-1">成交方案</p>
                  <h4 className="text-sm font-black text-white italic">{bid.routeInfo?.name || '定制航线'}</h4>
                  <p className="text-[10px] text-slate-500 font-bold mt-1">目的地：{bid.routeInfo?.destination || '具体钓点详谈'}</p>
               </div>
               <div className="text-right">
                  <p className="text-[9px] text-slate-600 font-black uppercase mb-1">成交价格</p>
                  <p className="text-2xl font-black text-blue-400 italic font-mono">¥{totalPrice}</p>
                  <p className="text-[8px] text-slate-600 font-black uppercase tracking-tighter">
                    {request.type === OrderType.SHARE ? `人均¥${bid.price}` : '一口价'}
                  </p>
               </div>
            </div>

            {/* 服务项 */}
            <div className="pt-6 border-t border-slate-800">
               <p className="text-[9px] text-slate-600 font-black uppercase mb-4 italic">包含服务项汇总</p>
               <div className="grid grid-cols-4 gap-3">
                  {bid.includedServices?.map(sId => (
                    <div key={sId} className="flex flex-col items-center justify-center p-3 rounded-2xl bg-slate-950 border border-slate-800">
                       <span className="text-lg mb-1">{SERVICE_MAP[sId]?.icon}</span>
                       <span className="text-[8px] text-slate-500 font-bold tracking-tighter">{SERVICE_MAP[sId]?.label}</span>
                    </div>
                  ))}
               </div>
            </div>

            {/* 专业建议 */}
            {bid.manualIntro && (
              <div className="pt-6 border-t border-slate-800">
                 <div className="flex items-center justify-between mb-3">
                    <p className="text-[9px] text-slate-600 font-black uppercase italic">专业自备建议</p>
                    <span className="text-[8px] bg-blue-600/20 text-blue-400 px-2 py-0.5 rounded font-black italic">PRO ADVICE</span>
                 </div>
                 <div className="bg-black/40 rounded-2xl p-4 border border-slate-800">
                    <p className="text-[11px] text-slate-400 font-bold leading-relaxed italic">
                       {bid.manualIntro}
                    </p>
                 </div>
              </div>
            )}
          </div>
        </div>

        {/* 底部功能性操作 */}
        <div className="pt-4 flex flex-col items-center space-y-6">
          {(!isPendingPay && !isBidding && !isCancelled) && (
            <div className="w-full bg-slate-900 rounded-[32px] p-6 border border-slate-800 shadow-2xl">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <div className="w-12 h-12 rounded-[18px] bg-blue-600/10 flex items-center justify-center border border-blue-500/20 text-blue-400 font-black">
                     {request.contactName?.charAt(0) || "钓"}
                  </div>
                  <div>
                    <p className="text-sm font-black text-white">{request.contactName || "实名钓友"}</p>
                    <p className="text-[9px] text-slate-500 font-black uppercase tracking-widest mt-0.5">{phoneNumbers[0].value}</p>
                  </div>
                </div>
                <button 
                  onClick={() => setShowPhoneModal(true)}
                  className="bg-blue-600 text-white text-[10px] font-black px-5 py-3 rounded-xl shadow-lg active:scale-95 transition-all"
                >
                  拨打电话
                </button>
              </div>
            </div>
          )}

          {(isBidding || isPendingPay || isPaid) && (
            <button 
              onClick={() => setShowCancelDialog(true)}
              className="text-[10px] text-slate-700 font-black uppercase tracking-[0.2em] border-b border-slate-800 pb-1 hover:text-red-500 hover:border-red-500/30 transition-all"
            >
              {isBidding ? '撤回抢单报价' : '取消本次行程任务'}
            </button>
          )}
        </div>
      </div>

      {isPaid && (
        <div className="fixed bottom-0 left-0 right-0 max-w-md mx-auto p-6 bg-slate-900/90 backdrop-blur-xl border-t border-slate-800 z-50">
           <button 
             onClick={onVerify}
             className="w-full bg-blue-600 hover:bg-blue-500 text-white font-black py-5 rounded-[24px] shadow-2xl shadow-blue-900/40 transition-all active:scale-95 flex items-center justify-center space-x-3"
           >
             <span className="text-sm uppercase tracking-widest font-black">核销登船码 Scan QR</span>
           </button>
        </div>
      )}

      {/* 电话弹窗 */}
      {showPhoneModal && (
        <div className="fixed inset-0 z-[110] flex items-end justify-center bg-black/80 backdrop-blur-sm animate-in fade-in duration-300">
          <div className="fixed inset-0" onClick={() => setShowPhoneModal(false)}></div>
          <div className="w-full max-w-md bg-slate-900 rounded-t-[40px] p-8 border-t border-slate-800 z-10 animate-in slide-in-from-bottom-20">
            <div className="w-12 h-1 bg-slate-800 rounded-full mx-auto mb-6"></div>
            <div className="flex items-center space-x-3 mb-8">
              <div className="w-10 h-10 bg-blue-600/20 rounded-2xl flex items-center justify-center text-blue-400">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" strokeWidth="2"/></svg>
              </div>
              <h3 className="text-lg font-black italic text-white leading-tight">联系钓友</h3>
            </div>
            {phoneNumbers.map((phone, idx) => (
              <button 
                key={idx}
                onClick={() => handleCall(phone.value)}
                className="w-full flex items-center justify-between p-6 rounded-[30px] bg-slate-800 hover:bg-slate-750 border border-slate-700 group transition-all"
              >
                <p className="text-xl font-mono font-black text-blue-400 group-hover:text-blue-300">{phone.value}</p>
              </button>
            ))}
            <button onClick={() => setShowPhoneModal(false)} className="w-full mt-8 py-5 text-slate-500 text-xs font-black uppercase tracking-widest border border-slate-800 rounded-[28px]">取消</button>
          </div>
        </div>
      )}

      {/* 取消弹窗 */}
      {showCancelDialog && (
        <div className="fixed inset-0 z-[100] flex items-end justify-center px-4 pb-10 bg-black/95 backdrop-blur-md animate-in fade-in duration-300">
           <div className="w-full max-sm bg-slate-900 rounded-[40px] p-8 border border-slate-800 shadow-2xl animate-in slide-in-from-bottom-20">
              <h2 className="text-xl font-black text-white mb-2 italic tracking-tighter">确认取消？</h2>
              <div className="space-y-2 my-6">
                 {CANCEL_REASONS.map(reason => (
                    <button key={reason} onClick={() => handleCancelSubmit(reason)} className="w-full text-left p-4 rounded-2xl bg-slate-800 border border-slate-800 text-xs font-bold text-slate-300 active:bg-blue-600 transition-all">{reason}</button>
                 ))}
              </div>
              <div className="flex space-x-4">
                 <button onClick={() => setShowCancelDialog(false)} className="flex-1 py-4 text-slate-500 text-xs font-black uppercase">返回</button>
                 <button onClick={() => handleCancelSubmit(customReason || "船长取消任务")} className="flex-[2] bg-red-600 text-white font-black py-4 rounded-2xl text-xs uppercase italic tracking-widest shadow-xl">确认执行</button>
              </div>
           </div>
        </div>
      )}
    </div>
  );
};

export default CaptainOrderDetail;
