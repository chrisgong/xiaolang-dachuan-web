
import React from 'react';

export const CITIES = ["三亚", "海口", "万宁", "陵水", "儋州"];

export const PLAY_STYLES = ["新手体验", "近海船钓", "远海船钓", "亲子休闲"];

export const FISH_TYPES = ["金枪鱼", "红友鱼", "石斑鱼", "马鲛鱼", "章红鱼", "沉船大物", "鱿鱼", "带鱼"];

// 选用更稳定的 Unsplash ID 确保图片显示正常
const US_BASE = "https://images.unsplash.com";
const US_CONFIG = "auto=format&fit=crop&q=80";

export const STATIC_ASSETS = {
  // 船只实拍
  BOAT_NEAR: `${US_BASE}/photo-1569263979104-865ab7cd8d13?${US_CONFIG}&w=800`,
  BOAT_FAR: `${US_BASE}/photo-1534073828943-f801091bb18c?${US_CONFIG}&w=800`,
  LUYA_BOAT: `${US_BASE}/photo-1540962351504-03099e0a754b?${US_CONFIG}&w=800`,
  OCEAN_VIEW: `${US_BASE}/photo-1520250497591-112f2f40a3f4?${US_CONFIG}&w=800`,
  FISHING_CATCH: `${US_BASE}/photo-1551244072-5d12893278ab?${US_CONFIG}&w=800`,
  
  // 默认兜底图
  FALLBACK_IMAGE: `${US_BASE}/photo-1507525428034-b723cf961d3e?${US_CONFIG}&w=800`,
  
  // 船长头像
  CAPTAIN_1: `${US_BASE}/photo-1544717297-fa95b3ee51f3?${US_CONFIG}&w=200&h=200`,
  CAPTAIN_2: `${US_BASE}/photo-1507003211169-0a1dd7228f2d?${US_CONFIG}&w=200&h=200`,
  CAPTAIN_3: `${US_BASE}/photo-1500648767791-00dcc994a43e?${US_CONFIG}&w=200&h=200`
};

export const Icons = {
  Share: () => (
    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
    </svg>
  ),
  Charter: () => (
    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
    </svg>
  ),
  Star: ({ className = "w-4 h-4" }: { className?: string }) => (
    <svg className={className} fill="currentColor" viewBox="0 0 20 20">
      <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
    </svg>
  )
};
