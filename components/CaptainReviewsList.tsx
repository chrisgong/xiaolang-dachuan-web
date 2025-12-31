
import React from 'react';

interface Props {
  captainName: string;
  onBack: () => void;
}

const ALL_REVIEWS = [
  { id: 1, user: "海钓达人A", rating: 5, text: "老张船长找点真的准，这趟不虚此行！下次还得订他的船，推荐大家试试。", date: "3天前", tags: ["找鱼准", "态度好", "专业"] },
  { id: 2, user: "新手小白B", rating: 5, text: "对新手非常耐心，手把手教怎么打窝挂饵，满分推荐。船只整洁度非常高。", date: "1周前", tags: ["有耐心", "船整洁"] },
  { id: 3, user: "深海老鱼", rating: 4, text: "船很干净，装备都是新的，下次还来。虽然最后稍微有点晕船，但船长照顾得很好。", date: "2025-12-15", tags: ["配置高端", "照顾周到"] },
  { id: 4, user: "钓鱼狂客", rating: 5, text: "第二次订了，一如既往的稳。金枪鱼直接拉爆，爽！", date: "2025-12-10", tags: ["回头客", "爆护推荐"] }
];

const CaptainReviewsList: React.FC<Props> = ({ captainName, onBack }) => {
  return (
    <div className="flex flex-col h-full bg-gray-50 max-w-md mx-auto">
      <div className="p-4 flex items-center border-b sticky top-0 bg-white z-10 shadow-sm">
        <button onClick={onBack} className="p-2 -ml-2 text-gray-400 hover:text-blue-600 transition-colors">
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" /></svg>
        </button>
        <h2 className="flex-1 text-center font-black text-lg mr-8">{captainName} 的评价</h2>
      </div>

      <div className="flex-1 overflow-y-auto p-4 space-y-3 no-scrollbar">
        <div className="bg-white rounded-3xl p-6 shadow-sm border border-gray-100 flex items-center justify-between mb-2">
           <div>
              <p className="text-3xl font-black text-slate-800">4.9</p>
              <p className="text-[10px] text-gray-400 font-bold uppercase tracking-widest mt-1">综合评分 (5.0)</p>
           </div>
           <div className="flex -space-x-1">
              {[...Array(5)].map((_, i) => (
                <svg key={i} className="w-5 h-5 text-orange-400 fill-current" viewBox="0 0 20 20"><path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" /></svg>
              ))}
           </div>
        </div>

        {ALL_REVIEWS.map(rev => (
          <div key={rev.id} className="bg-white rounded-[28px] p-6 shadow-sm border border-gray-100 space-y-4">
             <div className="flex justify-between items-start">
                <div className="flex items-center space-x-3">
                   <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center text-sm font-black text-blue-600 border-2 border-white shadow-sm">
                     {rev.user.charAt(0)}
                   </div>
                   <div>
                      <p className="text-xs font-black text-gray-900 mb-0.5">{rev.user}</p>
                      <div className="flex text-[8px] text-orange-400">
                         {[...Array(5)].map((_, i) => (
                           <svg key={i} className={`w-2.5 h-2.5 ${i < rev.rating ? 'fill-current' : 'text-gray-200'}`} viewBox="0 0 20 20"><path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" /></svg>
                         ))}
                      </div>
                   </div>
                </div>
                <span className="text-[10px] text-gray-300 font-medium">{rev.date}</span>
             </div>
             <p className="text-xs text-gray-600 font-medium leading-relaxed italic">“{rev.text}”</p>
             <div className="flex flex-wrap gap-1.5 pt-1">
                {rev.tags.map((tag, idx) => (
                  <span key={idx} className="px-3 py-1 bg-gray-50 border border-gray-100 rounded-lg text-[10px] font-black text-gray-400">
                     {tag}
                  </span>
                ))}
             </div>
          </div>
        ))}
        
        <div className="py-10 text-center">
           <p className="text-[10px] text-gray-300 font-bold uppercase tracking-widest">到底了 · 只展示近六个月评价</p>
        </div>
      </div>
    </div>
  );
};

export default CaptainReviewsList;
