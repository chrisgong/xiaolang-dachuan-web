
import React, { useState, useRef, useEffect } from 'react';
import { CITIES, PLAY_STYLES, Icons } from '../constants';
import { OrderType, UserRequest, BoatFilters } from '../types';

interface Props {
  onRequest: (request: UserRequest) => void;
  onOpenOrders: () => void;
  onOpenFilters: () => void;
  onToggleIdentity: () => void;
  currentFilters: BoatFilters;
  // 竞价挂件相关
  activeBiddingCount: number;
  hasActiveBidding: boolean;
  onOpenBidding: () => void;
  hasNewBidNotify: boolean;
}

const RequestLauncher: React.FC<Props> = ({ 
  onRequest, 
  onOpenOrders, 
  onOpenFilters, 
  onToggleIdentity,
  currentFilters,
  activeBiddingCount,
  hasActiveBidding,
  onOpenBidding,
  hasNewBidNotify
}) => {
  const [type, setType] = useState<OrderType>(OrderType.SHARE);
  const [city, setCity] = useState(CITIES[0]);
  const [date, setDate] = useState(new Date().toISOString().split('T')[0]);
  const [people, setPeople] = useState(1);
  const [remarks, setRemarks] = useState("");

  // 拖拽逻辑状态
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState(false);
  const dragRef = useRef<HTMLDivElement>(null);
  const offsetRef = useRef({ x: 0, y: 0 });

  const handlePointerDown = (e: React.PointerEvent) => {
    if (!dragRef.current) return;
    setIsDragging(true);
    const rect = dragRef.current.getBoundingClientRect();
    offsetRef.current = {
      x: e.clientX - rect.left,
      y: e.clientY - rect.top
    };
    (e.target as HTMLElement).setPointerCapture(e.pointerId);
  };

  const handlePointerMove = (e: React.PointerEvent) => {
    if (!isDragging || !dragRef.current) return;
    
    const parent = dragRef.current.parentElement;
    if (!parent) return;
    const parentRect = parent.getBoundingClientRect();

    // 计算相对于容器左上角的新位置
    let newX = e.clientX - parentRect.left - offsetRef.current.x;
    let newY = e.clientY - parentRect.top - offsetRef.current.y;

    // 边界限制
    const maxX = parentRect.width - dragRef.current.offsetWidth;
    const maxY = parentRect.height - dragRef.current.offsetHeight;
    
    newX = Math.max(0, Math.min(newX, maxX));
    newY = Math.max(0, Math.min(newY, maxY));

    setPosition({ x: newX, y: newY });
  };

  const handlePointerUp = () => {
    setIsDragging(false);
  };

  // 初始化位置到右下角，避开底部主按钮
  useEffect(() => {
    if (dragRef.current && dragRef.current.parentElement) {
      const parentRect = dragRef.current.parentElement.getBoundingClientRect();
      setPosition({
        x: parentRect.width - dragRef.current.offsetWidth - 20,
        y: parentRect.height - dragRef.current.offsetHeight - 120
      });
    }
  }, []);

  const handleLaunch = () => {
    const request: UserRequest = {
      id: Date.now().toString(),
      city,
      date,
      people,
      style: "海钓行程", 
      remarks,
      type,
      filters: currentFilters
    };
    onRequest(request);
  };

  const addRecommendation = (tag: string) => {
    if (remarks.includes(tag)) return;
    setRemarks(prev => prev ? `${prev}, ${tag}` : tag);
  };

  return (
    <div className="flex flex-col h-full bg-white max-w-md mx-auto overflow-hidden relative select-none">
      {/* Header */}
      <div className="px-6 py-4 flex justify-between items-center bg-white shrink-0 border-b border-gray-50">
        <div className="flex items-center space-x-2">
          <div className="w-8 h-8 bg-blue-600 rounded-xl flex items-center justify-center shadow-lg shadow-blue-200">
             <svg className="w-5 h-5 text-white" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                <path d="M2 13C5 13 5 9 8 9C11 9 11 13 14 13C17 13 17 9 20 9" strokeWidth="3.5" strokeLinecap="round" strokeLinejoin="round"/>
                <path d="M2 17C5 17 5 13 8 13C11 13 11 17 14 17C17 17 17 13 20 13" strokeWidth="3.5" strokeLinecap="round" strokeLinejoin="round" opacity="0.4"/>
             </svg>
          </div>
          <h1 className="text-lg font-black italic tracking-tighter">小浪<span className="text-blue-600">打船</span></h1>
        </div>
        <div className="flex items-center space-x-2">
          <button onClick={onOpenOrders} className="p-2 text-gray-400 hover:text-blue-600 transition-colors">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" /></svg>
          </button>
          <button onClick={onToggleIdentity} className="text-[9px] font-black uppercase tracking-widest text-blue-600 bg-blue-50 px-3 py-1.5 rounded-full border border-blue-100">船长模式</button>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 overflow-y-auto px-6 pb-28 no-scrollbar space-y-5 pt-4">
        {/* Order Type Switch */}
        <div className="bg-gray-50 p-1 rounded-[20px] flex relative shadow-inner">
          <div 
            className={`absolute top-1 bottom-1 w-[calc(50%-4px)] bg-white rounded-[16px] shadow-sm transition-transform duration-300 ${type === OrderType.CHARTER ? 'translate-x-[100%]' : 'translate-x-0'}`}
          />
          <button 
            onClick={() => setType(OrderType.SHARE)}
            className={`flex-1 flex flex-col items-center py-3 rounded-[16px] relative z-10 transition-colors ${type === OrderType.SHARE ? 'text-blue-600' : 'text-gray-400'}`}
          >
            <Icons.Share />
            <span className="text-[9px] font-black mt-0.5 uppercase tracking-widest">拼船单 / Share</span>
          </button>
          <button 
            onClick={() => setType(OrderType.CHARTER)}
            className={`flex-1 flex flex-col items-center py-3 rounded-[16px] relative z-10 transition-colors ${type === OrderType.CHARTER ? 'text-blue-600' : 'text-gray-400'}`}
          >
            <Icons.Charter />
            <span className="text-[9px] font-black mt-0.5 uppercase tracking-widest">包船单 / Charter</span>
          </button>
        </div>

        {/* Location & Time Selection */}
        <div className="space-y-4">
           <div className="space-y-1.5">
              <label className="text-[9px] text-gray-400 font-black uppercase tracking-widest ml-1">登船城市 City</label>
              <select 
                 value={city} 
                 onChange={(e) => setCity(e.target.value)}
                 className="w-full bg-gray-50 border-2 border-transparent focus:border-blue-600 rounded-[18px] p-3 text-sm font-bold outline-none transition-all appearance-none"
              >
                {CITIES.map(c => <option key={c} value={c}>{c}</option>)}
              </select>
           </div>

           <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1.5">
                 <label className="text-[9px] text-gray-400 font-black uppercase tracking-widest ml-1">出发日期 Date</label>
                 <input 
                    type="date" 
                    value={date} 
                    onChange={(e) => setDate(e.target.value)}
                    className="w-full bg-gray-50 border-2 border-transparent focus:border-blue-600 rounded-[18px] p-3 text-sm font-bold outline-none transition-all"
                 />
              </div>
              <div className="space-y-1.5">
                 <label className="text-[9px] text-gray-400 font-black uppercase tracking-widest ml-1">
                   {type === OrderType.SHARE ? '拼船人数' : '乘船人数'}
                 </label>
                 <div className="flex items-center bg-gray-50 rounded-[18px] p-1.5 border-2 border-transparent">
                    <button onClick={() => setPeople(Math.max(1, people - 1))} className="w-8 h-8 flex items-center justify-center text-gray-400 hover:text-blue-600">
                       <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M20 12H4" /></svg>
                    </button>
                    <span className="flex-1 text-center font-black text-sm">{people}</span>
                    <button onClick={() => setPeople(people + 1)} className="w-8 h-8 flex items-center justify-center text-gray-400 hover:text-blue-600">
                       <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M12 4v16m8-8H4" /></svg>
                    </button>
                 </div>
              </div>
           </div>
        </div>

        {/* Advanced Config Section */}
        <div className="space-y-3 pt-3 border-t border-gray-100">
           <h3 className="text-[9px] text-gray-400 font-black uppercase tracking-[0.2em] italic ml-1">高级配置 Advanced</h3>
           <div className="flex space-x-2">
              <button 
                 onClick={onOpenFilters}
                 className="w-full bg-blue-50/50 hover:bg-blue-50 border border-blue-100/50 rounded-xl py-2.5 px-4 flex items-center justify-between transition-colors group"
              >
                 <span className="text-blue-600 font-black text-[11px]">船只配置要求</span>
                 <svg className="w-3 h-3 text-blue-400 group-hover:translate-x-0.5 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M9 5l7 7-7 7" /></svg>
              </button>
           </div>
        </div>

        {/* Remarks Section */}
        <div className="space-y-3 pt-3 border-t border-gray-100">
           <label className="text-[9px] text-gray-400 font-black uppercase tracking-[0.2em] italic ml-1">备注留言 Remarks</label>
           <div className="bg-gray-50 p-2.5 rounded-[18px] shadow-inner focus-within:ring-2 ring-blue-500/10 transition-all border border-transparent">
              <textarea 
                value={remarks}
                onChange={(e) => setRemarks(e.target.value)}
                placeholder="在此输入特殊需求..."
                className="w-full bg-transparent border-none outline-none text-[11px] font-bold min-h-[36px] text-gray-800 placeholder:text-gray-300 resize-none leading-relaxed"
              />
           </div>
           <div className="flex flex-wrap gap-1.5">
              {PLAY_STYLES.map(style => (
                <button 
                   key={style}
                   onClick={() => addRecommendation(style)}
                   className="px-2.5 py-1 bg-gray-100 hover:bg-blue-100 text-gray-500 hover:text-blue-600 text-[9px] font-black rounded-lg transition-colors border border-transparent hover:border-blue-200"
                >
                   {style}
                </button>
              ))}
           </div>
        </div>

        {/* Main Action Button */}
        <div className="pt-2 pb-6">
          <button 
            onClick={handleLaunch}
            className="w-full h-[48px] bg-blue-600 hover:bg-blue-700 text-white font-black rounded-[24px] shadow-[0_8px_30px_rgba(37,99,235,0.2)] active:scale-95 transition-all flex items-center justify-center space-x-2 px-6"
          >
            <span className="text-sm uppercase tracking-[0.05em] font-black italic">立即发布需求</span>
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="M14 5l7 7m0 0l-7 7m7-7H3" strokeWidth="3.5" strokeLinecap="round" strokeLinejoin="round"/></svg>
          </button>
        </div>
      </div>

      {/* 自由拖拽竞价雷达挂件 */}
      {hasActiveBidding && (
        <div 
          ref={dragRef}
          onPointerDown={handlePointerDown}
          onPointerMove={handlePointerMove}
          onPointerUp={handlePointerUp}
          onPointerCancel={handlePointerUp}
          style={{ 
            left: position.x, 
            top: position.y,
            touchAction: 'none',
            position: 'absolute',
          }}
          className={`z-50 cursor-move transition-shadow ${isDragging ? 'shadow-2xl scale-105' : 'shadow-xl'}`}
        >
           <button 
              onClick={(e) => {
                if (!isDragging) {
                  onOpenBidding();
                }
              }}
              className="flex items-center bg-slate-900 border-2 border-blue-500/50 rounded-full pl-4 pr-6 py-2.5 text-white relative overflow-hidden group active:scale-95 transition-all min-w-max"
           >
              {/* 高级声呐脉冲图标 */}
              <div className="relative w-8 h-8 flex items-center justify-center mr-4 shrink-0">
                 <div className="absolute inset-0 bg-blue-500/20 rounded-full animate-sonar-1"></div>
                 <div className="absolute inset-0 bg-blue-500/10 rounded-full animate-sonar-2"></div>
                 <svg className="w-5 h-5 text-blue-400 relative z-10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M12 12m-9 0a9 9 0 1 0 18 0a9 9 0 1 0 -18 0" opacity="0.2"/>
                    <path d="M12 12L19 12" className="animate-radar-sweep"/>
                    <circle cx="12" cy="12" r="2" fill="currentColor"/>
                    <path d="M12 3C7.03 3 3 7.03 3 12" opacity="0.4"/>
                 </svg>
              </div>

              {/* 文案 & 数字 */}
              <div className="flex flex-col items-start pr-1 min-w-max">
                 <div className="flex items-center space-x-1.5 whitespace-nowrap">
                    <span className="text-[13px] font-black tracking-tight italic">
                       {activeBiddingCount > 0 ? `${activeBiddingCount} 份报价` : '正在匹配船长'}
                    </span>
                 </div>
                 <p className="text-[7px] font-black text-slate-500 uppercase tracking-widest leading-none mt-0.5 whitespace-nowrap">
                    {activeBiddingCount > 0 ? 'Quotes Arrived' : 'Matching Captains'}
                 </p>
              </div>

              {/* 装饰拖动手柄 */}
              <div className="h-4 w-[1px] bg-slate-700 mx-3 shrink-0"></div>
              <div className="flex flex-col space-y-0.5 opacity-30 shrink-0">
                 <div className="w-1.5 h-[1px] bg-white"></div>
                 <div className="w-1.5 h-[1px] bg-white"></div>
                 <div className="w-1.5 h-[1px] bg-white"></div>
              </div>

              {/* 新消息红点 */}
              {hasNewBidNotify && (
                <div className="absolute top-0 right-0 w-3.5 h-3.5 bg-red-500 rounded-full border-2 border-slate-900 animate-bounce"></div>
              )}
           </button>
        </div>
      )}

      <style>{`
        @keyframes sonar-1 {
          0% { transform: scale(0.6); opacity: 0.8; }
          100% { transform: scale(1.8); opacity: 0; }
        }
        @keyframes sonar-2 {
          0% { transform: scale(0.4); opacity: 0.6; }
          100% { transform: scale(2.4); opacity: 0; }
        }
        @keyframes radar-sweep {
          from { transform: rotate(0deg); transform-origin: center; }
          to { transform: rotate(360deg); transform-origin: center; }
        }
        .animate-sonar-1 { animation: sonar-1 2s cubic-bezier(0, 0, 0.2, 1) infinite; }
        .animate-sonar-2 { animation: sonar-2 2s cubic-bezier(0, 0, 0.2, 1) infinite; animation-delay: 0.5s; }
        .animate-radar-sweep { animation: radar-sweep 2s linear infinite; }
        
        .cursor-move { cursor: move; cursor: grab; }
        .cursor-move:active { cursor: grabbing; }
      `}</style>
    </div>
  );
};

export default RequestLauncher;
