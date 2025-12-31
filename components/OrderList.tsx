
import React, { useState } from 'react';
import { Trip } from '../types';
import { STATIC_ASSETS } from '../constants';

interface Props {
  orders: Trip[];
  onSelect: (trip: Trip) => void;
  onBack: () => void;
}

type TabType = 'ALL' | 'PENDING_PAYMENT' | 'PAID' | 'COMPLETED' | 'CANCELLED';

const OrderList: React.FC<Props> = ({ orders, onSelect, onBack }) => {
  const [activeTab, setActiveTab] = useState<TabType>('ALL');

  const tabs: { key: TabType, label: string }[] = [
    { key: 'ALL', label: '全部' },
    { key: 'PENDING_PAYMENT', label: '待付款' },
    { key: 'PAID', label: '待登船' },
    { key: 'COMPLETED', label: '待评价/已完成' },
    { key: 'CANCELLED', label: '已取消' },
  ];

  const filteredOrders = orders.filter(order => {
    if (activeTab === 'ALL') return true;
    if (activeTab === 'PAID') return order.status === 'PAID' || order.status === 'IN_SERVICE';
    if (activeTab === 'COMPLETED') return order.status === 'COMPLETED';
    return order.status === activeTab;
  });

  const getStatusConfig = (order: Trip) => {
    switch (order.status) {
      case 'PENDING_PAYMENT':
        return { label: '待支付', color: 'text-orange-500', btn: '去支付', btnStyle: 'bg-orange-500' };
      case 'PAID':
        return { label: '待登船', color: 'text-green-600', btn: '查看码', btnStyle: 'bg-slate-900' };
      case 'IN_SERVICE':
        return { label: '服务中', color: 'text-blue-600', btn: '进行中', btnStyle: 'bg-blue-600' };
      case 'COMPLETED':
        return { 
          label: order.hasReviewed ? '已完成' : '待评价', 
          color: order.hasReviewed ? 'text-gray-400' : 'text-blue-600', 
          btn: order.hasReviewed ? '再来一单' : '去评价', 
          btnStyle: order.hasReviewed ? 'bg-slate-200 !text-slate-500' : 'bg-blue-600' 
        };
      case 'CANCELLED':
        return { label: '已取消', color: 'text-red-500', btn: '已失效', btnStyle: 'bg-slate-200 !text-slate-400' };
      default:
        return { label: '详情', color: 'text-gray-400', btn: '详情', btnStyle: 'bg-slate-900' };
    }
  };

  const handleAvatarError = (e: React.SyntheticEvent<HTMLImageElement, Event>, name: string) => {
    e.currentTarget.src = `https://ui-avatars.com/api/?name=${encodeURIComponent(name)}&background=random&color=fff&size=64`;
  };

  const handleCatchImageError = (e: React.SyntheticEvent<HTMLImageElement, Event>) => {
    e.currentTarget.src = STATIC_ASSETS.FALLBACK_IMAGE;
  };

  // 统一标题合成逻辑
  const getOrderDisplayTitle = (order: Trip) => {
    const info = order.bid.routeInfo;
    if (info?.destination && info?.targetFish) {
      return `${info.destination}钓${info.targetFish}线`;
    }
    if (info?.name && info.name.length < 20) return info.name;
    return order.request.style || "定制海钓";
  };

  return (
    <div className="flex flex-col h-full bg-gray-50 max-w-md mx-auto relative">
      <div className="bg-white sticky top-0 z-30 shadow-sm border-b border-gray-100">
        <div className="p-4 flex items-center">
          <button onClick={onBack} className="p-2 -ml-2 text-gray-400 active:text-blue-600 transition-colors">
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M15 19l-7-7 7-7" /></svg>
          </button>
          <h2 className="flex-1 text-center font-black text-lg mr-8 italic tracking-tighter uppercase">行程订单 <span className="text-blue-600">ORDERS</span></h2>
        </div>
        
        <div className="flex px-2 overflow-x-auto no-scrollbar">
          {tabs.map(tab => (
            <button
              key={tab.key}
              onClick={() => setActiveTab(tab.key)}
              className={`flex-shrink-0 px-4 py-3 text-sm font-bold relative transition-colors ${activeTab === tab.key ? 'text-blue-600' : 'text-gray-500'}`}
            >
              {tab.label}
              {activeTab === tab.key && (
                <div className="absolute bottom-0 left-4 right-4 h-0.5 bg-blue-600 rounded-full" />
              )}
            </button>
          ))}
        </div>
      </div>

      <div className="flex-1 overflow-y-auto p-4 space-y-4 no-scrollbar pb-10">
        {filteredOrders.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-24 text-gray-300">
            <p className="text-sm font-black tracking-widest uppercase italic">暂无相关行程记录</p>
          </div>
        ) : (
          filteredOrders.sort((a,b) => b.createdAt - a.createdAt).map(order => {
            const config = getStatusConfig(order);
            const totalPrice = order.request.type === 'SHARE' ? order.bid.price * order.request.people : order.bid.price;
            
            // 使用静态资源或兜底图
            const itemImage = (order.bid.catchImages && order.bid.catchImages.length > 0) 
              ? order.bid.catchImages[0] 
              : STATIC_ASSETS.BOAT_NEAR;
            
            return (
              <div 
                key={order.orderId}
                onClick={() => onSelect(order)}
                className="bg-white rounded-[32px] overflow-hidden shadow-sm border border-gray-100 active:scale-[0.98] transition-all"
              >
                <div className="p-4 border-b border-gray-50 flex justify-between items-center bg-gray-50/30">
                  <div className="flex items-center space-x-2">
                    <img 
                      src={order.bid.avatar || STATIC_ASSETS.CAPTAIN_1} 
                      onError={(e) => handleAvatarError(e, order.bid.captainName)}
                      className="w-6 h-6 rounded-full object-cover ring-1 ring-gray-200 shadow-sm" 
                    />
                    <span className="text-[10px] font-black text-gray-800 italic uppercase tracking-tighter">{order.bid.captainName} · {order.bid.boatName}</span>
                  </div>
                  <span className={`text-[10px] font-black italic tracking-widest uppercase ${config.color}`}>{config.label}</span>
                </div>

                <div className="p-5 flex space-x-4">
                  <div className="w-20 h-20 bg-gray-100 rounded-2xl overflow-hidden shrink-0 shadow-inner">
                    <img 
                      src={itemImage} 
                      onError={handleCatchImageError}
                      className="w-full h-full object-cover" 
                    />
                  </div>
                  <div className="flex-1 min-w-0 flex flex-col justify-between">
                    <div>
                      <h3 className="text-sm font-black text-gray-900 truncate italic tracking-tight">{getOrderDisplayTitle(order)}</h3>
                      <p className="text-[9px] text-gray-400 font-bold uppercase tracking-widest mt-1">{order.request.city} · {order.request.date} · {order.request.people}人</p>
                    </div>
                    <div className="mt-3 flex items-baseline justify-between">
                       <p className="text-sm font-black text-slate-900 italic font-mono tracking-tighter">¥{totalPrice}</p>
                       <button className={`px-4 py-1.5 rounded-xl text-[10px] font-black shadow-lg text-white transition-all active:scale-95 ${config.btnStyle}`}>
                         {config.btn}
                       </button>
                    </div>
                  </div>
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
};

export default OrderList;
