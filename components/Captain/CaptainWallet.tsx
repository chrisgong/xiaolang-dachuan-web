
import React, { useState } from 'react';

type WalletView = 'MAIN' | 'WITHDRAW' | 'BIND' | 'HISTORY';
type PayoutMethod = 'ALIPAY' | 'WECHAT' | 'BANK';
type HistoryFilter = 'ALL' | 'INCOME' | 'WITHDRAW';

interface Transaction {
  id: string;
  title: string;
  date: string;
  amount: number;
  type: 'INCOME' | 'WITHDRAW';
  status: 'SUCCESS' | 'PENDING' | 'FAILED';
  orderType?: 'SHARE' | 'CHARTER';
}

interface BoundAccount {
  type: PayoutMethod;
  name: string;
  account: string;
  bankName?: string;
}

interface Props {
  onBack?: () => void;
}

const CaptainWallet: React.FC<Props> = ({ onBack }) => {
  const [view, setView] = useState<WalletView>('MAIN');
  const [balance] = useState(12480.50);
  const [withdrawAmount, setWithdrawAmount] = useState('');
  const [selectedMethod, setSelectedMethod] = useState<PayoutMethod>('ALIPAY');
  const [isProcessing, setIsProcessing] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [historyFilter, setHistoryFilter] = useState<HistoryFilter>('ALL');

  const [accounts, setAccounts] = useState<BoundAccount[]>([
    { type: 'ALIPAY', name: '王大海', account: '138****8888' }
  ]);

  const transactions: Transaction[] = [
    { id: 'T1', title: "订单结算收入", date: "今天 14:20", amount: 2800.00, type: 'INCOME', status: 'SUCCESS', orderType: 'CHARTER' },
    { id: 'T2', title: "余额提现", date: "昨日 09:15", amount: -5000.00, type: 'WITHDRAW', status: 'SUCCESS' },
    { id: 'T3', title: "拼船订单结算", date: "2025-12-20", amount: 1200.00, type: 'INCOME', status: 'SUCCESS', orderType: 'SHARE' },
    { id: 'T4', title: "余额提现", date: "2025-12-18", amount: -2000.00, type: 'WITHDRAW', status: 'FAILED' },
    { id: 'T5', title: "平台活动奖励", date: "2025-12-15", amount: 200.00, type: 'INCOME', status: 'SUCCESS' }
  ];

  const filteredTransactions = transactions.filter(t => {
    if (historyFilter === 'ALL') return true;
    return t.type === historyFilter;
  });

  const handleWithdraw = () => {
    setIsProcessing(true);
    setTimeout(() => {
      setIsProcessing(false);
      setShowSuccess(true);
    }, 2000);
  };

  const currentBoundAccount = accounts.find(a => a.type === selectedMethod);

  // --- Sub-Views ---

  const MainView = () => (
    <div className="flex flex-col h-full animate-in fade-in duration-300">
      <div className="p-6">
        <div className="bg-gradient-to-br from-blue-600 to-indigo-700 rounded-[40px] p-8 shadow-2xl relative overflow-hidden">
          <div className="absolute top-0 right-0 p-10 opacity-10 scale-150">
            <svg className="w-40 h-40 text-white" fill="currentColor" viewBox="0 0 24 24"><path d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z"/></svg>
          </div>
          <div className="relative z-10">
            <p className="text-[10px] font-black text-white/60 uppercase tracking-widest mb-1 italic">可用余额 Available Balance</p>
            <h2 className="text-5xl font-black text-white italic tracking-tighter">¥{balance.toLocaleString('en-US', { minimumFractionDigits: 2 })}</h2>
            <div className="mt-8 flex space-x-3">
              <button 
                onClick={() => setView('WITHDRAW')}
                className="flex-1 bg-white text-blue-600 font-black py-4 rounded-2xl shadow-xl active:scale-95 transition-transform text-sm uppercase tracking-widest"
              >
                提现
              </button>
              <button 
                onClick={() => setView('BIND')}
                className="bg-white/10 text-white border border-white/30 font-black px-6 py-4 rounded-2xl active:scale-95 transition-transform text-sm"
              >
                账户管理
              </button>
            </div>
          </div>
        </div>

        <div className="mt-10 space-y-6">
          <div className="flex justify-between items-center px-2">
            <h3 className="text-xs font-black text-slate-500 uppercase tracking-widest">最近交易记录</h3>
            <button onClick={() => { setHistoryFilter('ALL'); setView('HISTORY'); }} className="text-[10px] text-blue-400 font-black">查看全部</button>
          </div>
          <div className="space-y-4">
            {transactions.slice(0, 3).map((item) => (
              <div key={item.id} className="bg-slate-900 rounded-3xl p-5 border border-slate-800 flex justify-between items-center">
                <div className="flex items-center space-x-4">
                  <div className={`w-10 h-10 rounded-2xl flex items-center justify-center border ${item.type === 'INCOME' ? 'bg-green-500/10 border-green-500/20 text-green-400' : 'bg-slate-800 border-slate-700 text-slate-400'}`}>
                    {item.type === 'INCOME' ? '↓' : '↑'}
                  </div>
                  <div>
                    <p className="text-sm font-black text-white">{item.title}</p>
                    <p className="text-[10px] text-slate-500 font-medium mt-1">{item.date}</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className={`text-sm font-black ${item.amount > 0 ? 'text-green-400' : 'text-slate-400'}`}>
                    {item.amount > 0 ? '+' : ''}{item.amount.toFixed(2)}
                  </p>
                  {item.status === 'FAILED' && <p className="text-[8px] text-red-400 font-black uppercase mt-1">提现失败</p>}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );

  const WithdrawView = () => (
    <div className="flex flex-col h-full animate-in slide-in-from-right-10 duration-300">
      <div className="p-6 border-b border-slate-800 flex items-center bg-slate-900 shrink-0">
        <button onClick={() => setView('MAIN')} className="p-2 -ml-2 text-slate-400 hover:text-white">
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" /></svg>
        </button>
        <h2 className="flex-1 text-center font-black text-lg text-white">发起提现</h2>
        <div className="w-8"></div>
      </div>

      <div className="flex-1 p-8 space-y-10 overflow-y-auto no-scrollbar pb-32">
        <div className="text-center">
          <p className="text-[10px] text-slate-500 font-black uppercase tracking-[0.2em] mb-4 italic">请输入提现金额</p>
          <div className="flex items-center justify-center bg-slate-900 border-2 border-slate-800 rounded-[32px] p-6 focus-within:border-blue-500 transition-all shadow-inner">
            <span className="text-3xl font-black text-slate-700 mr-2 italic">¥</span>
            <input 
              type="number" 
              value={withdrawAmount}
              onChange={(e) => setWithdrawAmount(e.target.value)}
              placeholder="0.00"
              className="bg-transparent text-5xl font-black text-white outline-none w-full text-center placeholder-slate-800 italic"
            />
          </div>
          <div className="mt-4 flex items-center justify-center space-x-3">
            <p className="text-[11px] text-slate-500 font-bold">可用余额 ¥{balance.toFixed(2)}</p>
            <button 
              onClick={() => setWithdrawAmount(balance.toString())}
              className="text-[11px] text-blue-400 font-black underline underline-offset-4 italic"
            >
              全部提现
            </button>
          </div>
        </div>

        <div className="space-y-4">
          <p className="text-[10px] text-slate-500 font-black uppercase tracking-widest px-2 italic">选择到账方式</p>
          <div className="grid grid-cols-3 gap-3">
            {(['ALIPAY', 'WECHAT', 'BANK'] as PayoutMethod[]).map((m) => (
              <button 
                key={m}
                onClick={() => setSelectedMethod(m)}
                className={`p-4 rounded-3xl border flex flex-col items-center justify-center space-y-2 transition-all ${selectedMethod === m ? 'bg-blue-600/10 border-blue-500 text-blue-400' : 'bg-slate-900 border-slate-800 text-slate-600'}`}
              >
                <div className="text-xl">
                  {m === 'ALIPAY' ? '🔹' : m === 'WECHAT' ? '🔸' : '🏦'}
                </div>
                <span className="text-[10px] font-black">{m === 'ALIPAY' ? '支付宝' : m === 'WECHAT' ? '微信' : '银行卡'}</span>
              </button>
            ))}
          </div>
        </div>

        <div className="bg-slate-900 rounded-[32px] p-6 border border-slate-800">
          {currentBoundAccount ? (
            <div className="flex justify-between items-center">
              <div className="flex items-center space-x-4">
                <div className="w-10 h-10 bg-slate-800 rounded-2xl flex items-center justify-center text-blue-400">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" strokeWidth="2"/></svg>
                </div>
                <div>
                  <p className="text-xs font-black text-white">{currentBoundAccount.name}</p>
                  <p className="text-[10px] text-slate-500 font-mono">{currentBoundAccount.account}</p>
                </div>
              </div>
              <button onClick={() => setView('BIND')} className="text-[10px] text-blue-400 font-black italic underline">修改</button>
            </div>
          ) : (
            <div className="text-center py-2">
              <p className="text-xs text-slate-500 font-bold mb-3 italic">尚未绑定该提现方式</p>
              <button 
                onClick={() => setView('BIND')}
                className="bg-blue-600/10 text-blue-400 text-[10px] font-black px-4 py-2 rounded-xl border border-blue-500/20 italic"
              >
                立即绑定
              </button>
            </div>
          )}
        </div>
      </div>

      <div className="fixed bottom-0 left-0 right-0 max-w-md mx-auto p-8 pt-4 pb-12 bg-slate-900/80 backdrop-blur-xl border-t border-slate-800 z-50">
        <button 
          disabled={!withdrawAmount || parseFloat(withdrawAmount) <= 0 || !currentBoundAccount || isProcessing}
          onClick={handleWithdraw}
          className="w-full bg-blue-600 disabled:bg-slate-800 disabled:text-slate-600 text-white font-black py-5 rounded-[24px] shadow-2xl shadow-blue-900/40 active:scale-95 transition-all text-sm uppercase tracking-[0.2em] italic"
        >
          {isProcessing ? '正在极速处理...' : '确认发起提现'}
        </button>
      </div>
    </div>
  );

  const BindView = () => (
    <div className="flex flex-col h-full animate-in slide-in-from-right-10 duration-300 bg-slate-950">
      <div className="p-6 border-b border-slate-800 flex items-center bg-slate-900 shrink-0">
        <button onClick={() => setView('MAIN')} className="p-2 -ml-2 text-slate-400 hover:text-white">
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" /></svg>
        </button>
        <h2 className="flex-1 text-center font-black text-lg text-white">账户管理</h2>
        <div className="w-8"></div>
      </div>

      <div className="flex-1 p-8 space-y-8 overflow-y-auto no-scrollbar">
        <div className="space-y-4">
          <p className="text-[10px] text-slate-500 font-black uppercase tracking-widest px-1 italic">绑定提现账户</p>
          <div className="space-y-4 bg-slate-900 rounded-[32px] p-8 border border-slate-800 shadow-xl">
            <div>
              <label className="text-[10px] text-slate-600 font-black uppercase block mb-3 italic">真实姓名 (必须与收款账号一致)</label>
              <input 
                type="text" 
                placeholder="请输入持卡人姓名"
                className="w-full bg-slate-950 border border-slate-800 rounded-2xl p-4 text-xs font-bold text-white outline-none focus:border-blue-500 transition-all"
              />
            </div>
            <div>
              <label className="text-[10px] text-slate-600 font-black uppercase block mb-3 italic">账号类型</label>
              <div className="flex space-x-2">
                {['ALIPAY', 'WECHAT', 'BANK'].map(t => (
                  <button 
                    key={t}
                    onClick={() => setSelectedMethod(t as PayoutMethod)}
                    className={`flex-1 py-3 rounded-xl border text-[10px] font-black ${selectedMethod === t ? 'bg-blue-600 border-blue-500 text-white' : 'bg-slate-950 border-slate-800 text-slate-500'}`}
                  >
                    {t === 'ALIPAY' ? '支付宝' : t === 'WECHAT' ? '微信' : '银行卡'}
                  </button>
                ))}
              </div>
            </div>
            <div>
              <label className="text-[10px] text-slate-600 font-black uppercase block mb-3 italic">
                {selectedMethod === 'BANK' ? '银行卡号' : '账号/手机号'}
              </label>
              <input 
                type="text" 
                placeholder={`请输入${selectedMethod === 'BANK' ? '银行卡号' : '账号'}`}
                className="w-full bg-slate-950 border border-slate-800 rounded-2xl p-4 text-xs font-bold text-white outline-none focus:border-blue-500 transition-all"
              />
            </div>
            {selectedMethod === 'BANK' && (
              <div>
                <label className="text-[10px] text-slate-600 font-black uppercase block mb-3 italic">开户银行名称</label>
                <input 
                  type="text" 
                  placeholder="如：中国工商银行"
                  className="w-full bg-slate-950 border border-slate-800 rounded-2xl p-4 text-xs font-bold text-white outline-none focus:border-blue-500 transition-all"
                />
              </div>
            )}
          </div>
        </div>

        <div className="bg-slate-900/50 p-6 rounded-[28px] border border-slate-800/50">
           <div className="flex items-start space-x-3">
              <div className="p-1.5 bg-blue-500/10 rounded-lg text-blue-400 mt-0.5">
                 <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" strokeWidth="2"/></svg>
              </div>
              <p className="text-[10px] text-slate-500 font-bold leading-relaxed italic">
                为了您的资金安全，提现账号一经绑定需通过人工客服审核后方可修改。请务必确认信息填写的准确性。
              </p>
           </div>
        </div>
      </div>

      <div className="p-8 pb-12 bg-slate-900 border-t border-slate-800">
         <button 
           onClick={() => { setAccounts([{ type: selectedMethod, name: '船长老王', account: '6222***********8888' }]); setView('MAIN'); }}
           className="w-full bg-blue-600 text-white font-black py-5 rounded-[24px] shadow-2xl shadow-blue-900/40 active:scale-95 transition-all text-sm uppercase tracking-widest italic"
         >
           提交绑定申请
         </button>
      </div>
    </div>
  );

  const HistoryView = () => (
    <div className="flex flex-col h-full animate-in slide-in-from-bottom-10 duration-500 bg-slate-950">
      <div className="p-6 border-b border-slate-800 flex flex-col bg-slate-900 shrink-0">
        <div className="flex items-center w-full mb-4">
          <button onClick={() => setView('MAIN')} className="p-2 -ml-2 text-slate-400 hover:text-white">
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" /></svg>
          </button>
          <h2 className="flex-1 text-center font-black text-lg text-white">收支明细</h2>
          <div className="w-8"></div>
        </div>
        
        {/* Filter Bar */}
        <div className="flex bg-black/40 p-1 rounded-2xl border border-slate-800">
          {[
            { id: 'ALL', label: '全部' },
            { id: 'INCOME', label: '收入' },
            { id: 'WITHDRAW', label: '提现' }
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setHistoryFilter(tab.id as HistoryFilter)}
              className={`flex-1 py-2 text-[10px] font-black uppercase tracking-widest rounded-xl transition-all ${
                historyFilter === tab.id 
                ? 'bg-blue-600 text-white shadow-lg' 
                : 'text-slate-500 hover:text-slate-300'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      <div className="flex-1 overflow-y-auto p-6 space-y-4 no-scrollbar">
        {filteredTransactions.length === 0 ? (
          <div className="text-center py-20 text-slate-700">
             <p className="text-[10px] font-black uppercase tracking-widest">暂无相关记录</p>
          </div>
        ) : (
          filteredTransactions.map((item) => (
            <div key={item.id} className="bg-slate-900 rounded-[32px] p-6 border border-slate-800 flex justify-between items-center transition-all hover:border-slate-700 animate-in fade-in duration-300">
              <div className="flex items-center space-x-4">
                <div className={`w-12 h-12 rounded-2xl flex items-center justify-center border ${item.type === 'INCOME' ? 'bg-green-500/10 border-green-500/20 text-green-400' : 'bg-slate-800 border-slate-700 text-slate-400'}`}>
                  {item.type === 'INCOME' ? (
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="M12 4v16m8-8l-8 8-8-8" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg>
                  ) : (
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="M12 20V4m8 8l-8-8-8 8" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg>
                  )}
                </div>
                <div>
                  <p className="text-sm font-black text-white">{item.title}</p>
                  <div className="flex items-center mt-1 space-x-2">
                    <p className="text-[10px] text-slate-500 font-bold">{item.date}</p>
                    {item.orderType && (
                        <span className="text-[8px] bg-slate-800 text-slate-400 px-1.5 py-0.5 rounded border border-slate-700 font-black uppercase tracking-tighter italic">
                          {item.orderType === 'SHARE' ? '拼船' : '包船'}
                        </span>
                    )}
                  </div>
                </div>
              </div>
              <div className="text-right">
                <p className={`text-base font-black italic ${item.amount > 0 ? 'text-green-400' : 'text-slate-200'}`}>
                  {item.amount > 0 ? '+' : ''}{item.amount.toFixed(2)}
                </p>
                <div className="flex items-center justify-end mt-1 space-x-1">
                  <div className={`w-1 h-1 rounded-full ${item.status === 'SUCCESS' ? 'bg-green-400' : item.status === 'PENDING' ? 'bg-blue-400' : 'bg-red-400'}`}></div>
                  <p className={`text-[8px] font-black uppercase tracking-tighter italic ${item.status === 'SUCCESS' ? 'text-slate-500' : item.status === 'PENDING' ? 'text-blue-400' : 'text-red-400'}`}>
                    {item.status === 'SUCCESS' ? '已入账' : item.status === 'PENDING' ? '处理中' : '失败'}
                  </p>
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );

  return (
    <div className="flex flex-col h-full bg-slate-950 relative">
      {/* 顶部标题 */}
      {view === 'MAIN' && (
        <div className="p-6 bg-slate-900 border-b border-slate-800 shrink-0 flex items-center">
          {onBack && (
            <button onClick={onBack} className="p-2 -ml-2 text-slate-400 hover:text-white transition-colors mr-2">
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" /></svg>
            </button>
          )}
          <h1 className="text-xl font-black text-white italic tracking-tighter uppercase">财务 <span className="text-blue-400">中心</span></h1>
        </div>
      )}

      <div className="flex-1 overflow-hidden">
        {view === 'MAIN' && <MainView />}
        {view === 'WITHDRAW' && <WithdrawView />}
        {view === 'BIND' && <BindView />}
        {view === 'HISTORY' && <HistoryView />}
      </div>

      {/* Success Modal */}
      {showSuccess && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-6 bg-black/90 backdrop-blur-xl animate-in fade-in duration-300">
           <div className="w-full max-w-xs bg-slate-900 rounded-[40px] p-10 border border-slate-800 text-center shadow-2xl animate-in zoom-in-95 duration-500">
              <div className="w-20 h-20 bg-green-500/10 rounded-full flex items-center justify-center mx-auto mb-6 border border-green-500/20">
                 <svg className="w-10 h-10 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7"/></svg>
              </div>
              <h2 className="text-xl font-black text-white mb-2 italic tracking-tighter">提现申请已提交</h2>
              <p className="text-xs text-slate-500 leading-relaxed font-bold italic">我们已收到您的提现申请，预计将在 <span className="text-blue-400 italic font-black">2小时内</span> 到达您的选定账户。</p>
              <button 
                onClick={() => { setShowSuccess(false); setView('MAIN'); setWithdrawAmount(''); }}
                className="mt-10 w-full bg-blue-600 text-white font-black py-4 rounded-2xl shadow-xl active:scale-95 transition-transform text-sm italic tracking-widest"
              >
                我知道了
              </button>
           </div>
        </div>
      )}
    </div>
  );
};

export default CaptainWallet;
