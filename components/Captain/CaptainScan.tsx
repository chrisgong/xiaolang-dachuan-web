
import React, { useState, useEffect } from 'react';

interface Props {
  onBack: () => void;
  onSuccess: () => void;
}

const CaptainScan: React.FC<Props> = ({ onBack, onSuccess }) => {
  const [isScanning, setIsScanning] = useState(true);

  // 模拟自动扫码识别闭环
  useEffect(() => {
    const timer = setTimeout(() => {
      setIsScanning(false);
      onSuccess();
    }, 3000); // 3秒模拟扫描时间
    return () => clearTimeout(timer);
  }, [onSuccess]);

  return (
    <div className="flex flex-col h-full bg-black relative overflow-hidden">
      {/* 顶部操作栏 */}
      <div className="absolute top-0 left-0 right-0 p-6 flex justify-between items-center z-20">
        <button onClick={onBack} className="p-2 bg-white/10 backdrop-blur-md rounded-full text-white">
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
        </button>
        <h2 className="text-white font-black text-sm uppercase tracking-widest">核销登船码</h2>
        <div className="w-10"></div>
      </div>

      {/* 扫码取景框容器 */}
      <div className="flex-1 flex flex-col items-center justify-center relative">
        {/* 模拟摄像头画面背景 */}
        <div className="absolute inset-0 bg-slate-900/40 flex items-center justify-center">
           {!isScanning && (
             <div className="bg-green-500/20 w-full h-full absolute inset-0 animate-pulse"></div>
           )}
        </div>

        {/* 扫描框区域 */}
        <div className="relative w-64 h-64 z-10">
          {/* 四角边框 */}
          <div className={`absolute top-0 left-0 w-8 h-8 border-t-4 border-l-4 transition-colors duration-500 ${isScanning ? 'border-blue-500' : 'border-green-500'}`}></div>
          <div className={`absolute top-0 right-0 w-8 h-8 border-t-4 border-r-4 transition-colors duration-500 ${isScanning ? 'border-blue-500' : 'border-green-500'}`}></div>
          <div className={`absolute bottom-0 left-0 w-8 h-8 border-b-4 border-l-4 transition-colors duration-500 ${isScanning ? 'border-blue-500' : 'border-green-500'}`}></div>
          <div className={`absolute bottom-0 right-0 w-8 h-8 border-b-4 border-r-4 transition-colors duration-500 ${isScanning ? 'border-blue-500' : 'border-green-500'}`}></div>

          {/* 扫描动画激光线 */}
          {isScanning && (
            <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-transparent via-blue-400 to-transparent shadow-[0_0_15px_rgba(59,130,246,0.8)] animate-[scan_2.5s_ease-in-out_infinite]"></div>
          )}
          
          {!isScanning && (
            <div className="absolute inset-0 flex items-center justify-center animate-in zoom-in-50 duration-300">
               <svg className="w-20 h-20 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
               </svg>
            </div>
          )}
          
          <style>{`
            @keyframes scan {
              0%, 100% { top: 0%; }
              50% { top: 100%; }
            }
          `}</style>
        </div>

        <div className="mt-12 text-center z-10 px-10">
          <p className="text-white/70 text-xs font-bold tracking-wider leading-relaxed">
            {isScanning ? (
              <>请将钓友的 <span className="text-blue-400">登船码/核销码</span> 放入框内<br/>系统将自动识别并完成核销</>
            ) : (
              <span className="text-green-400 text-sm font-black animate-pulse">识别成功，正在更新订单状态...</span>
            )}
          </p>
        </div>
      </div>

      {/* 底部功能区 */}
      <div className="p-10 flex flex-col items-center space-y-8 z-20 relative">
        <div className="flex space-x-12 opacity-50">
          <button className="flex flex-col items-center space-y-2 text-white/60">
            <div className="p-4 bg-white/5 rounded-full border border-white/10">
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" /></svg>
            </div>
            <span className="text-[10px] font-bold">手电筒</span>
          </button>
          <button className="flex flex-col items-center space-y-2 text-white/60">
            <div className="p-4 bg-white/5 rounded-full border border-white/10">
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg>
            </div>
            <span className="text-[10px] font-bold">相册导入</span>
          </button>
        </div>

        <button 
          onClick={onSuccess}
          className="text-blue-400 text-xs font-black underline underline-offset-4"
        >
          手动输入核销码
        </button>
      </div>
    </div>
  );
};

export default CaptainScan;
