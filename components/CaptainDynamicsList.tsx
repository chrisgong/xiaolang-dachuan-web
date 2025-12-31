
import React from 'react';

interface Props {
  captainName: string;
  onBack: () => void;
}

const ALL_DYNAMICS = [
  { id: 1, type: 'video', cover: "https://images.unsplash.com/photo-1542125387-c71274d94f0a?q=80&w=400&h=600&fit=crop", caption: "12海里处锁定金枪鱼群，今日大丰收！", date: "2小时前", source: "动力社区" },
  { id: 2, type: 'image', cover: "https://images.unsplash.com/photo-1529156069898-49953e39b3ac?q=80&w=400&h=600&fit=crop", caption: "极品红友鱼，拉力十足！", date: "昨天", source: "海友圈" },
  { id: 3, type: 'video', cover: "https://images.unsplash.com/photo-1516939884455-1445c8652f83?q=80&w=400&h=600&fit=crop", caption: "绝美日出，又是元气满满的一天。", date: "3天前", source: "动力社区" },
  { id: 4, type: 'image', cover: "https://images.unsplash.com/photo-1544717297-fa95b3ee51f3?q=80&w=400&h=600&fit=crop", caption: "新船整备完毕，期待各位钓友登船。", date: "5天前", source: "动力社区" }
];

const CaptainDynamicsList: React.FC<Props> = ({ captainName, onBack }) => {
  const handleImgError = (e: React.SyntheticEvent<HTMLImageElement, Event>) => {
    e.currentTarget.src = 'https://images.unsplash.com/photo-1551244072-5d12893278ab?q=80&w=600&h=400&auto=format&fit=crop';
  };

  return (
    <div className="flex flex-col h-full bg-white max-w-md mx-auto">
      <div className="p-4 flex items-center border-b sticky top-0 bg-white z-10">
        <button onClick={onBack} className="p-2 -ml-2 text-gray-400 hover:text-blue-600 transition-colors">
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" /></svg>
        </button>
        <h2 className="flex-1 text-center font-black text-lg mr-8">{captainName} 的动态</h2>
      </div>

      <div className="flex-1 overflow-y-auto p-4 space-y-4 no-scrollbar">
        {ALL_DYNAMICS.map(dyn => (
          <div key={dyn.id} className="bg-white rounded-[32px] overflow-hidden border border-gray-100 shadow-sm">
             <div className="relative aspect-[4/3]">
                <img src={dyn.cover} onError={handleImgError} className="w-full h-full object-cover" alt="Dynamic" />
                {dyn.type === 'video' && (
                  <div className="absolute inset-0 flex items-center justify-center bg-black/10">
                     <div className="w-12 h-12 bg-white/30 backdrop-blur-md rounded-full flex items-center justify-center border border-white/50">
                        <svg className="w-5 h-5 text-white ml-1" fill="currentColor" viewBox="0 0 20 20"><path d="M4.516 3.848a.5.5 0 01.76-.419l11 7a.5.5 0 010 .84l-11 7a.5.5 0 01-.76-.42V3.848z"/></svg>
                     </div>
                  </div>
                )}
                <div className="absolute top-4 left-4 px-3 py-1 bg-black/40 backdrop-blur-md rounded-full border border-white/20">
                   <span className="text-[10px] text-white font-black tracking-widest uppercase">{dyn.source}</span>
                </div>
             </div>
             <div className="p-5">
                <p className="text-sm text-gray-800 font-bold leading-relaxed mb-3">{dyn.caption}</p>
                <p className="text-xs text-gray-400 font-medium">{dyn.date}</p>
             </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default CaptainDynamicsList;
