
import React from 'react';

interface Props {
  onNavigate: (view: 'PROFILE_EDITOR' | 'WALLET' | 'ROUTES') => void;
  onLogout: () => void;
}

const CaptainMine: React.FC<Props> = ({ onNavigate, onLogout }) => {
  return (
    <div className="flex flex-col h-full bg-slate-950 overflow-y-auto no-scrollbar">
      {/* 个人信息卡片 */}
      <div className="p-8 pt-12 bg-slate-900 rounded-b-[48px] border-b border-slate-800 shadow-2xl relative overflow-hidden">
        <div className="absolute top-0 right-0 p-12 opacity-5 scale-150 rotate-12 pointer-events-none">
          <svg className="w-40 h-40 text-blue-500" fill="currentColor" viewBox="0 0 24 24"><path d="M13 10V3L4 14h7v7l9-11h-7z" /></svg>
        </div>
        
        <div className="relative z-10 flex items-center justify-between mb-10">
          <div className="flex items-center space-x-6">
            <div className="relative">
              <img 
                src="https://images.unsplash.com/photo-1547425260-76bcadfb4f2c?w=400&h=400&fit=crop&q=80" 
                className="w-24 h-24 rounded-[32px] object-cover border-4 border-slate-800 shadow-2xl bg-slate-800" 
                alt="Captain Avatar"
              />
              <div className="absolute -bottom-2 -right-2 bg-blue-600 text-white text-[8px] font-black px-2 py-1 rounded-lg border-2 border-slate-900 uppercase">Pro</div>
            </div>
            <div>
              <h2 className="text-2xl font-black text-white italic tracking-tighter">王大海 <span className="text-blue-400 font-mono text-sm not-italic ml-1">#8827</span></h2>
              <p className="text-[10px] text-slate-500 font-bold uppercase tracking-widest mt-1">海狼号船长 · 从业12年</p>
              <div className="flex items-center space-x-3 mt-4">
                <div className="flex items-center space-x-1">
                  <span className="text-orange-500 font-black text-xs">4.9★</span>
                </div>
                <span className="text-slate-700 font-black text-[10px]">|</span>
                <span className="text-slate-400 font-black text-[10px] tracking-tighter uppercase">已接单 420</span>
              </div>
            </div>
          </div>
          
          {/* 个人资料编辑入口 - 移动至此 */}
          <button 
            onClick={() => onNavigate('PROFILE_EDITOR')}
            className="w-12 h-12 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center text-slate-400 hover:text-white active:scale-95 transition-all shadow-xl backdrop-blur-md"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </button>
        </div>

        <div className="grid grid-cols-3 gap-4 relative z-10">
          <div className="text-center py-4 bg-black/30 rounded-[24px] border border-slate-800/50">
            <p className="text-[9px] text-slate-600 font-black uppercase mb-1">今日收益</p>
            <p className="text-base font-black text-white italic">¥2,800</p>
          </div>
          <div className="text-center py-4 bg-black/30 rounded-[24px] border border-slate-800/50">
            <p className="text-[9px] text-slate-600 font-black uppercase mb-1">本月接单</p>
            <p className="text-base font-black text-white italic">28单</p>
          </div>
          <div className="text-center py-4 bg-black/30 rounded-[24px] border border-slate-800/50">
            <p className="text-[9px] text-slate-600 font-black uppercase mb-1">好评率</p>
            <p className="text-base font-black text-white italic">99%</p>
          </div>
        </div>
      </div>

      {/* 功能入口列表 */}
      <div className="px-6 py-10 space-y-6">
        <div className="space-y-4">
          <p className="text-[10px] text-slate-600 font-black uppercase tracking-[0.2em] italic ml-1 mb-4">功能中心 / Center</p>
          
          <button 
            onClick={() => onNavigate('WALLET')}
            className="w-full bg-slate-900 border border-slate-800 rounded-[32px] p-6 flex items-center justify-between group active:scale-[0.98] transition-all"
          >
            <div className="flex items-center space-x-5">
              <div className="w-12 h-12 bg-emerald-500/10 rounded-2xl flex items-center justify-center text-emerald-400 border border-emerald-500/20 group-hover:bg-emerald-500 group-hover:text-white transition-all">
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/></svg>
              </div>
              <div className="text-left">
                <p className="text-sm font-black text-white group-hover:text-emerald-400 transition-colors">我的钱包</p>
                <p className="text-[9px] text-slate-600 font-bold uppercase mt-1 tracking-tighter">My Wallet & Balance</p>
              </div>
            </div>
            <svg className="w-5 h-5 text-slate-700" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="M9 5l7 7-7 7" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"/></svg>
          </button>

          <button 
            onClick={() => onNavigate('ROUTES')}
            className="w-full bg-slate-900 border border-slate-800 rounded-[32px] p-6 flex items-center justify-between group active:scale-[0.98] transition-all"
          >
            <div className="flex items-center space-x-5">
              <div className="w-12 h-12 bg-blue-500/10 rounded-2xl flex items-center justify-center text-blue-400 border border-blue-500/20 group-hover:bg-blue-500 group-hover:text-white transition-all">
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="M9 20l-5.447-2.724A2 2 0 013 15.447V4.553a2 2 0 011.553-1.954l6-1.5a2 2 0 01.894 0l6 1.5a2 2 0 011.553 1.954v10.894a2 2 0 01-1.106 1.789L13 20v-5a1 1 0 00-1-1h-1a1 1 0 00-1 1v5z" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/></svg>
              </div>
              <div className="text-left">
                <p className="text-sm font-black text-white group-hover:text-blue-400 transition-colors">我的路线</p>
                <p className="text-[9px] text-slate-600 font-bold uppercase mt-1 tracking-tighter">My Route Templates</p>
              </div>
            </div>
            <svg className="w-5 h-5 text-slate-700" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="M9 5l7 7-7 7" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"/></svg>
          </button>
        </div>

        <button 
          onClick={onLogout}
          className="w-full py-6 mt-10 text-slate-700 hover:text-red-500 text-[11px] font-black uppercase tracking-[0.3em] transition-colors border border-dashed border-slate-800 rounded-[32px] italic"
        >
          切回钓友模式 / Switch To Angler
        </button>
      </div>

      <div className="py-20 text-center">
        <p className="text-[8px] text-slate-900 font-black uppercase tracking-widest italic opacity-50">Version 2.4.0 High-Performance Mode</p>
      </div>
    </div>
  );
};

export default CaptainMine;
