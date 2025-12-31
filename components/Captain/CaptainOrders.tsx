
import React from 'react';
import { Trip } from '../../types';

type TabType = 'BIDDING' | 'ONGOING' | 'COMPLETED';

interface Props {
  orders: Trip[];
  activeTab: TabType;
  onTabChange: (tab: TabType) => void;
  onSelectOrder: (order: Trip) => void;
  onScan: () => void;
  onEndTrip: (id: string) => void;
}

const CaptainOrders: React.FC<Props> = ({ orders, activeTab, onTabChange, onSelectOrder, onScan, onEndTrip }) => {
  const biddingOrders = orders.filter(o => 
    o.status === 'BIDDING' || 
    o.status === 'PENDING_PAYMENT' || 
    (o.status === 'CANCELLED' && o.verifyCode === '000000')
  );
  
  const ongoingOrders = orders.filter(o => o.status === 'PAID' || o.status === 'IN_SERVICE');
  
  const completedOrders = orders.filter(o => 
    o.status === 'COMPLETED' || 
    (o.status === 'CANCELLED' && o.verifyCode !== '000000')
  );

  const displayOrders = activeTab === 'BIDDING' ? biddingOrders : activeTab === 'ONGOING' ? ongoingOrders : completedOrders;

  const formatDate = (dateStr: string) => {
    const parts = dateStr.split('-');
    return parts.length === 3 ? `${parts[1]}月${parts[2]}日` : dateStr;
  };

  return (
    <div className="flex flex-col h-full bg-slate-950">
      <div className="bg-slate-900 border-b border-slate-800 shrink-0">
         <div className="p-6 pb-2">
            <h1 className="text-xl font-black text-white italic tracking-tighter uppercase">
              订单 <span className="text-blue-400 underline decoration-2 decoration-blue-500/50">中心</span>
            </h1>
            <p className="text-[9px] text-slate-500 font-bold uppercase mt-1 italic">报价追踪 • 航行任务看板</p>
         </div>
         <div className="flex px-4">
            {[
              { id: 'BIDDING', label: '竞标中' },
              { id: 'ONGOING', label: '进行中' },
              { id: 'COMPLETED', label: '已结束' }
            ].map(t => (
              <button 
                key={t.id}
                onClick={() => onTabChange(t.id as TabType)}
                className={`flex-1 py-4 text-[10px] font-black transition-all relative ${activeTab === t.id ? 'text-blue-400' : 'text-slate-500'}`}
              >
                {t.label}
                {activeTab === t.id && <div className="absolute bottom-0 left-4 right-4 h-1 bg-blue-400 rounded-t-full shadow-[0_-2px_10px_rgba(59,130,246,0.5)]"></div>}
              </button>
            ))}
         </div>
      </div>
      
      <div className="flex-1 overflow-y-auto p-6 space-y-6 no-scrollbar pb-24">
        {displayOrders.length === 0 ? (
          <div className="text-center py-20 text-slate-700">
            <div className="bg-slate-900/50 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4 border border-slate-800">
               <svg className="w-8 h-8 opacity-20" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" strokeWidth="2"/></svg>
            </div>
            <p className="text-[10px] font-black uppercase tracking-widest">暂无该分类订单</p>
          </div>
        ) : (
          displayOrders.map(order => {
            const totalPrice = order.request.type === 'SHARE' ? order.bid.price * order.request.people : order.bid.price;

            return (
              <div 
                key={order.orderId} 
                onClick={() => onSelectOrder(order)}
                className={`bg-slate-800 rounded-[32px] p-6 border border-slate-700 active:scale-[0.98] transition-all hover:border-slate-600 ${order.status === 'IN_SERVICE' ? 'ring-2 ring-blue-500/50' : ''}`}
              >
                <div className="flex justify-between items-start mb-6">
                  <div className="flex items-center space-x-2">
                      <span className={`px-2 py-1 rounded-lg text-[10px] font-black uppercase tracking-tighter ${order.request.type === 'SHARE' ? 'bg-orange-500/10 text-orange-400 border border-orange-500/20' : 'bg-blue-500/10 text-blue-400 border border-blue-500/20'}`}>
                        {order.request.type === 'SHARE' ? '拼船' : '包船'}
                      </span>
                      <p className="text-[10px] text-slate-500 font-mono">#{order.orderId}</p>
                  </div>
                  <span className={`text-[10px] font-black px-3 py-1 rounded-full flex items-center ${
                    order.status === 'BIDDING' ? 'text-blue-400 bg-blue-400/10' :
                    order.status === 'PENDING_PAYMENT' ? 'text-orange-400 bg-orange-400/10' :
                    order.status === 'IN_SERVICE' ? 'text-blue-400 bg-blue-400/10 animate-pulse' :
                    order.status === 'PAID' ? 'text-green-400 bg-green-400/10' :
                    order.status === 'CANCELLED' ? 'text-red-400/50 bg-red-400/5' :
                    'text-slate-300 bg-slate-300/10'
                  }`}>
                    {order.status === 'BIDDING' ? '等待钓友选择' : 
                     order.status === 'PENDING_PAYMENT' ? '等待钓友支付' :
                     order.status === 'IN_SERVICE' ? '实时服务中' : 
                     order.status === 'PAID' ? '已支付·待出海' : 
                     order.status === 'CANCELLED' ? (order.verifyCode === '000000' ? '竞标失败' : '订单已取消') : 
                     order.status === 'COMPLETED' ? '行程已完成' : '已结束'}
                  </span>
                </div>

                <div className="mb-6">
                  <div className="flex justify-between items-center">
                      <h3 className="text-lg font-black text-white italic">
                        {formatDate(order.request.date)} · {order.request.city} · {order.request.people}人
                      </h3>
                      <p className="text-lg font-black text-blue-400 italic font-mono">¥{totalPrice}</p>
                  </div>
                </div>

                <div className="flex space-x-2.5" onClick={e => e.stopPropagation()}>
                  {order.status === 'BIDDING' && (
                    <button className="w-full bg-slate-900 border border-slate-700 text-slate-500 font-black py-3.5 rounded-2xl text-[10px] active:scale-95 transition-all">
                      撤回我的报价
                    </button>
                  )}
                  {order.status === 'PAID' && (
                    <>
                      <button className="flex-1 bg-slate-700 hover:bg-slate-600 text-white font-black py-3.5 rounded-2xl text-[10px] transition-all active:scale-95 shadow-lg shadow-black/20">
                        对话
                      </button>
                      <button onClick={onScan} className="flex-[2] bg-blue-600 hover:bg-blue-500 text-white font-black py-3.5 rounded-2xl text-[10px] shadow-lg shadow-blue-900/40 active:scale-95 transition-all">
                        核销登船
                      </button>
                    </>
                  )}
                  {order.status === 'IN_SERVICE' && (
                    <>
                      <button className="flex-1 bg-slate-700 text-white font-black py-3.5 rounded-2xl text-[10px] active:scale-95">
                        通话
                      </button>
                      <button onClick={() => onEndTrip(order.orderId)} className="flex-[2] bg-slate-200 text-slate-900 font-black py-3.5 rounded-2xl text-[10px] active:scale-95 shadow-lg transition-all">
                        结束本次航行
                      </button>
                    </>
                  )}
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
};

export default CaptainOrders;
