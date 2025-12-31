
import React, { useState, useEffect } from 'react';
import { AppStatus, UserRequest, CaptainBid, Trip, BoatFilters, Identity, OrderType, RoutePreset } from './types';
import RequestLauncher from './components/RequestLauncher';
import BiddingRoom from './components/BiddingRoom';
import TripDetail from './components/TripDetail';
import OrderList from './components/OrderList';
import FilterSettings from './components/FilterSettings';
import CaptainProfile from './components/CaptainProfile';
import CaptainDynamicsList from './components/CaptainDynamicsList';
import CaptainReviewsList from './components/CaptainReviewsList';
import { generateCaptainBids } from './services/geminiService';
import { STATIC_ASSETS } from './constants';

// 船长端组件
import CaptainHome from './components/Captain/CaptainHome';
import CaptainQuote from './components/Captain/CaptainQuote';
import CaptainOrders from './components/Captain/CaptainOrders';
import CaptainOrderDetail from './components/Captain/CaptainOrderDetail'; 
import CaptainWallet from './components/Captain/CaptainWallet';
import CaptainScan from './components/Captain/CaptainScan';
import CaptainRoutes from './components/Captain/CaptainRoutes';
import CaptainRouteEditor from './components/Captain/CaptainRouteEditor';
import CaptainMine from './components/Captain/CaptainMine';

const DEFAULT_FILTERS: BoatFilters = {
  length: 12,
  width: 4,
  minPower: "",
  amenities: []
};

const MOCK_ROUTES: RoutePreset[] = [
  {
    id: 'route-1',
    name: '西鼓岛钓章红线',
    description: '此路线专为深海大物发烧友设计，直达西鼓岛核心沉船区。',
    oceanType: 'FAR',
    destination: '西鼓岛',
    targetFish: '章红',
    fishingSet: 'PE 6-8线, 300g-500g铁板',
    gearIncluded: '禧玛诺电绞、专业碳素船竿、专用支架',
    baitIncluded: '活南极虾、夜光硅胶假饵',
    otherItems: '进口晕船贴、专业救生衣、连体防水服',
    sharePrice: 1500,
    charterPrice: 6000,
    includedServices: ['gear', 'bait', 'insurance', 'guide']
  }
];

const INITIAL_ORDER_HISTORY: Trip[] = [
  {
    orderId: "HD-BIDDING-77",
    status: 'BIDDING',
    createdAt: Date.now() - 300000,
    request: { id: "req-x", city: "三亚", date: "2025-12-28", people: 6, style: "远海沉船钓", type: OrderType.CHARTER, remarks: "全员硬核钓友", createdAt: Date.now() - 300000 },
    bid: { 
      id: "bid-x", 
      captainName: "王大海", 
      boatName: "海狼号", 
      boatSpecs: "42尺专业快艇", 
      distance: 0.5, 
      price: 5800, 
      rating: 4.9, 
      tripsCount: 420, 
      avatar: STATIC_ASSETS.CAPTAIN_1, 
      catchImages: [STATIC_ASSETS.BOAT_FAR], 
      impressionTags: [], 
      includedServices: ['gear', 'bait', 'insurance', 'guide'], 
      routeInfo: MOCK_ROUTES[0] 
    },
    verifyCode: "000000"
  },
  {
    orderId: "HD-PENDING-01",
    status: 'PENDING_PAYMENT',
    createdAt: Date.now() - 600000,
    request: { id: "req-1", city: "三亚", date: "2025-12-25", people: 4, style: "近海路亚", type: OrderType.SHARE, remarks: "需要提供饮用水", createdAt: Date.now() - 600000 },
    bid: { 
      id: "bid-1", 
      captainName: "老张", 
      boatName: "逐浪1号", 
      boatSpecs: "15米专业钓船", 
      distance: 1.2, 
      price: 580, 
      rating: 4.9, 
      tripsCount: 342, 
      avatar: STATIC_ASSETS.CAPTAIN_2, 
      catchImages: [STATIC_ASSETS.BOAT_NEAR], 
      impressionTags: [], 
      includedServices: ['gear', 'bait', 'insurance', 'drinks'],
      routeInfo: { ...MOCK_ROUTES[0], name: '西鼓岛钓石斑线', destination: '西鼓岛', targetFish: '石斑' }
    },
    verifyCode: "123456"
  },
  {
    orderId: "HD-PAID-02",
    status: 'PAID',
    createdAt: Date.now() - 86400000,
    request: { id: "req-2", city: "万宁", date: "2025-12-20", people: 1, style: "大物挑战", type: OrderType.SHARE, remarks: "希望能钓到大章红", createdAt: Date.now() - 86400000 },
    bid: { 
      id: "bid-2", 
      captainName: "阿明", 
      boatName: "南海渔神", 
      boatSpecs: "11米铝合金快艇", 
      distance: 2.5, 
      price: 1200, 
      rating: 4.6, 
      tripsCount: 96, 
      avatar: STATIC_ASSETS.CAPTAIN_3, 
      catchImages: [STATIC_ASSETS.LUYA_BOAT], 
      impressionTags: [], 
      includedServices: ['gear', 'bait', 'insurance', 'guide', 'media'],
      routeInfo: { ...MOCK_ROUTES[0], name: '神州半岛大物线', destination: '神州半岛', targetFish: '章红' }
    },
    verifyCode: "888999"
  },
  {
    orderId: "HD-SERVICE-05",
    status: 'IN_SERVICE',
    createdAt: Date.now() - 7200000, // 2 hours ago
    request: { id: "req-5", city: "陵水", date: "2025-12-19", people: 2, style: "海钓体验", type: OrderType.SHARE, remarks: "", createdAt: Date.now() - 10000000 },
    bid: { 
      id: "bid-5", 
      captainName: "李船长", 
      boatName: "晨曦号", 
      boatSpecs: "32尺路亚艇", 
      distance: 0.8, 
      price: 450, 
      rating: 4.7, 
      tripsCount: 210, 
      avatar: STATIC_ASSETS.CAPTAIN_1, 
      catchImages: [STATIC_ASSETS.BOAT_NEAR], 
      impressionTags: [], 
      includedServices: ['gear', 'bait', 'insurance'],
      routeInfo: { ...MOCK_ROUTES[0], name: '分界洲岛近海线', destination: '分界洲岛', targetFish: '综合鱼种' }
    },
    verifyCode: "777888"
  },
  {
    orderId: "HD-DONE-03",
    status: 'COMPLETED',
    createdAt: Date.now() - 172800000,
    hasReviewed: true,
    request: { id: "req-3", city: "陵水", date: "2025-12-18", people: 8, style: "家庭休闲", type: OrderType.CHARTER, remarks: "有小孩，注意安全", createdAt: Date.now() - 172800000 },
    bid: { 
      id: "bid-3", 
      captainName: "陈船长", 
      boatName: "海之子", 
      boatSpecs: "双层豪华游艇", 
      distance: 3.1, 
      price: 3500, 
      rating: 4.8, 
      tripsCount: 156, 
      avatar: STATIC_ASSETS.CAPTAIN_1, 
      catchImages: [STATIC_ASSETS.OCEAN_VIEW], 
      impressionTags: [], 
      includedServices: ['drinks', 'insurance', 'media'],
      routeInfo: { ...MOCK_ROUTES[0], name: '分界洲岛观光线', destination: '分界洲岛', targetFish: '观光' }
    },
    verifyCode: "654321"
  },
  {
    orderId: "HD-CANCEL-04",
    status: 'CANCELLED',
    createdAt: Date.now() - 259200000,
    cancelReason: "天气恶劣，不宜出海",
    request: { id: "req-4", city: "海口", date: "2025-12-15", people: 2, style: "近海垂钓", type: OrderType.SHARE, remarks: "", createdAt: Date.now() - 259200000 },
    bid: { 
      id: "bid-4", 
      captainName: "刘师傅", 
      boatName: "老渔夫", 
      boatSpecs: "小型木质渔船", 
      distance: 5.0, 
      price: 300, 
      rating: 4.5, 
      tripsCount: 50, 
      avatar: STATIC_ASSETS.CAPTAIN_2, 
      catchImages: [STATIC_ASSETS.FISHING_CATCH], 
      impressionTags: [], 
      includedServices: ['bait', 'insurance'],
      routeInfo: { ...MOCK_ROUTES[0], name: '海口湾近海钓', destination: '海口湾', targetFish: '小鱼' }
    },
    verifyCode: "999000"
  }
];

const App: React.FC = () => {
  const [identity, setIdentity] = useState<Identity>(Identity.ANGLER);
  const [status, setStatus] = useState<AppStatus>(AppStatus.HOME);
  const [prevStatus, setPrevStatus] = useState<AppStatus>(AppStatus.HOME);
  const [captainActiveTab, setCaptainActiveTab] = useState<'BIDDING' | 'ONGOING' | 'COMPLETED'>('BIDDING');

  const [currentRequest, setCurrentRequest] = useState<UserRequest | null>(null);
  const [activeTrip, setActiveTrip] = useState<Trip | null>(null);
  const [orderHistory, setOrderHistory] = useState<Trip[]>(INITIAL_ORDER_HISTORY);
  const [boatFilters, setBoatFilters] = useState<BoatFilters>(DEFAULT_FILTERS);
  const [profileCaptain, setProfileCaptain] = useState<CaptainBid | null>(null);
  
  const [activeBids, setActiveBids] = useState<CaptainBid[]>([]);
  const [isBiddingDone, setIsBiddingDone] = useState(false);
  const [hasNewBidNotify, setHasNewBidNotify] = useState(false);
  const [activeDemand, setActiveDemand] = useState<UserRequest | null>(null);

  const [captainRoutes, setCaptainRoutes] = useState<RoutePreset[]>(MOCK_ROUTES);
  const [editingRoute, setEditingRoute] = useState<RoutePreset | null>(null);

  useEffect(() => {
    if (status === AppStatus.BIDDING || (currentRequest && !isBiddingDone)) {
       if (activeBids.length > 0 || isBiddingDone) return;
       
       const simulateBids = async () => {
          if (!currentRequest) return;
          try {
            const bids = await generateCaptainBids(currentRequest);
            if (!bids || bids.length === 0) {
              setIsBiddingDone(true);
              return;
            }
            
            bids.forEach((bid, index) => {
              // 极速体验优化：首单 300ms 几乎秒回，后续每 600-1000ms 一个
              const delay = index === 0 ? 300 : (index * 600) + Math.random() * 400;
              setTimeout(() => {
                setActiveBids(prev => {
                  const newBids = [...prev, bid];
                  if (status !== AppStatus.BIDDING) setHasNewBidNotify(true);
                  return newBids;
                });
                if (index === bids.length - 1) setIsBiddingDone(true);
              }, delay);
            });
          } catch (e) {
            console.error("Bidding simulation failed", e);
            setIsBiddingDone(true);
          }
       };
       simulateBids();
    }
  }, [currentRequest, isBiddingDone, status, activeBids.length]);

  const toggleIdentity = () => {
    if (identity === Identity.ANGLER) {
      setIdentity(Identity.CAPTAIN);
      setStatus(AppStatus.CAPTAIN_HOME);
    } else {
      setIdentity(Identity.ANGLER);
      setStatus(AppStatus.HOME);
    }
  };

  const handleLaunchRequest = (request: UserRequest) => {
    const requestWithTime = { ...request, createdAt: Date.now() };
    setCurrentRequest(requestWithTime);
    setActiveBids([]);
    setIsBiddingDone(false);
    setHasNewBidNotify(false);
    setStatus(AppStatus.BIDDING);
  };

  const handleSelectBid = (bid: CaptainBid) => {
    if (!currentRequest) return;
    const newTrip: Trip = {
      orderId: "HD" + Math.random().toString(36).substr(2, 9).toUpperCase(),
      request: currentRequest,
      bid: bid,
      verifyCode: Math.floor(100000 + Math.random() * 900000).toString(),
      status: 'PENDING_PAYMENT',
      createdAt: Date.now()
    };
    setOrderHistory(prev => [newTrip, ...prev]);
    setActiveTrip(newTrip);
    setCurrentRequest(null);
    setActiveBids([]);
    setStatus(AppStatus.TRIP);
  };

  const handleFinishTrip = (updatedTrip?: Trip) => {
    if (updatedTrip) {
      setOrderHistory(prev => prev.map(t => t.orderId === updatedTrip.orderId ? updatedTrip : t));
    }
    setStatus(AppStatus.ORDERS);
  };

  const handleReviewSubmit = () => {
    if (activeTrip) {
      setOrderHistory(prev => prev.map(t => t.orderId === activeTrip.orderId ? { ...t, hasReviewed: true } : t));
    }
    setStatus(AppStatus.ORDERS);
  };

  const showCaptainBottomNav = identity === Identity.CAPTAIN && [
    AppStatus.CAPTAIN_HOME, 
    AppStatus.CAPTAIN_ORDERS, 
    AppStatus.CAPTAIN_MINE
  ].includes(status);

  return (
    <div className="min-h-screen bg-slate-100 md:py-10">
      <div className="h-[100vh] md:h-[844px] md:w-[390px] mx-auto md:rounded-[48px] md:shadow-[0_40px_100px_rgba(0,0,0,0.2)] overflow-hidden bg-white relative flex flex-col">
        
        {identity === Identity.ANGLER && (
          <div className="flex-1 overflow-hidden relative">
            {status === AppStatus.HOME && (
              <RequestLauncher 
                onRequest={handleLaunchRequest} 
                onOpenOrders={() => setStatus(AppStatus.ORDERS)}
                onOpenFilters={() => setStatus(AppStatus.FILTER)}
                onToggleIdentity={toggleIdentity}
                currentFilters={boatFilters}
                activeBiddingCount={activeBids.length}
                hasActiveBidding={!!currentRequest}
                onOpenBidding={() => { setStatus(AppStatus.BIDDING); setHasNewBidNotify(false); }}
                hasNewBidNotify={hasNewBidNotify}
              />
            )}
            {status === AppStatus.BIDDING && currentRequest && (
              <BiddingRoom 
                request={currentRequest} 
                existingBids={activeBids} 
                biddingDone={isBiddingDone} 
                onSelect={handleSelectBid} 
                onMinimize={() => setStatus(AppStatus.HOME)}
                onCancel={() => { setCurrentRequest(null); setActiveBids([]); setStatus(AppStatus.HOME); }}
                onViewCaptain={(bid) => { setProfileCaptain(bid); setPrevStatus(AppStatus.BIDDING); setStatus(AppStatus.CAPTAIN_PROFILE); }} 
              />
            )}
            {status === AppStatus.ORDERS && <OrderList orders={orderHistory.filter(o => o.status !== 'BIDDING')} onSelect={(t) => { setActiveTrip(t); setStatus(AppStatus.TRIP); }} onBack={() => setStatus(AppStatus.HOME)} />}
            {status === AppStatus.TRIP && activeTrip && (
              <TripDetail 
                trip={activeTrip} 
                onFinish={handleFinishTrip} 
                onReviewSubmit={handleReviewSubmit} 
                onViewCaptain={() => { 
                  setProfileCaptain(activeTrip.bid); 
                  setPrevStatus(AppStatus.TRIP); 
                  setStatus(AppStatus.CAPTAIN_PROFILE); 
                }} 
              />
            )}
            {status === AppStatus.FILTER && <FilterSettings initialFilters={boatFilters} onSave={(f) => { setBoatFilters(f); setStatus(AppStatus.HOME); }} onBack={() => setStatus(AppStatus.HOME)} />}
            {status === AppStatus.CAPTAIN_PROFILE && profileCaptain && (
              <CaptainProfile 
                bid={profileCaptain} 
                onBack={() => setStatus(prevStatus)} 
                onSelect={handleSelectBid} 
                onViewDynamics={() => setStatus(AppStatus.CAPTAIN_DYNAMICS_LIST)} 
                onViewReviews={() => setStatus(AppStatus.CAPTAIN_REVIEWS_LIST)} 
              />
            )}
            {status === AppStatus.CAPTAIN_DYNAMICS_LIST && profileCaptain && <CaptainDynamicsList captainName={profileCaptain.captainName} onBack={() => setStatus(AppStatus.CAPTAIN_PROFILE)} />}
            {status === AppStatus.CAPTAIN_REVIEWS_LIST && profileCaptain && <CaptainReviewsList captainName={profileCaptain.captainName} onBack={() => setStatus(AppStatus.CAPTAIN_PROFILE)} />}
          </div>
        )}

        {identity === Identity.CAPTAIN && (
          <div className="flex-1 overflow-hidden flex flex-col bg-slate-900">
             <div className="flex-1 overflow-hidden">
                {status === AppStatus.CAPTAIN_HOME && (
                  <CaptainHome 
                    onQuote={(demand) => { setActiveDemand(demand); setStatus(AppStatus.CAPTAIN_QUOTE); }} 
                  />
                )}
                {status === AppStatus.CAPTAIN_QUOTE && activeDemand && (
                  <CaptainQuote 
                    demand={activeDemand} 
                    presets={captainRoutes}
                    onBack={() => setStatus(AppStatus.CAPTAIN_HOME)}
                    onManagePresets={() => setStatus(AppStatus.CAPTAIN_ROUTES)}
                    onConfirm={(price, services, route, manualIntro, customService) => {
                      alert("报价已提交！钓友将实时收到您的方案。");
                      setStatus(AppStatus.CAPTAIN_HOME);
                    }}
                  />
                )}
                {status === AppStatus.CAPTAIN_ORDERS && (
                  <CaptainOrders 
                    orders={orderHistory} 
                    activeTab={captainActiveTab} 
                    onTabChange={setCaptainActiveTab} 
                    onSelectOrder={(t) => { setActiveTrip(t); setStatus(AppStatus.CAPTAIN_ORDER_DETAIL); }} 
                    onScan={() => setStatus(AppStatus.CAPTAIN_SCAN)} 
                    onEndTrip={(id) => setOrderHistory(prev => prev.map(t => t.orderId === id ? {...t, status: 'COMPLETED'} : t))} 
                  />
                )}
                {status === AppStatus.CAPTAIN_ORDER_DETAIL && activeTrip && (
                  <CaptainOrderDetail 
                    trip={activeTrip} 
                    onBack={() => setStatus(AppStatus.CAPTAIN_ORDERS)}
                    onCancelOrder={(id) => setOrderHistory(prev => prev.map(t => t.orderId === id ? {...t, status: 'CANCELLED'} : t))}
                    onVerify={() => setStatus(AppStatus.CAPTAIN_SCAN)}
                  />
                )}
                {status === AppStatus.CAPTAIN_SCAN && (
                  <CaptainScan 
                    onBack={() => setStatus(AppStatus.CAPTAIN_ORDERS)} 
                    onSuccess={() => {
                      if (activeTrip) {
                        setOrderHistory(prev => prev.map(t => t.orderId === activeTrip.orderId ? {...t, status: 'IN_SERVICE'} : t));
                      }
                      setStatus(AppStatus.CAPTAIN_ORDERS);
                    }} 
                  />
                )}
                {status === AppStatus.CAPTAIN_ROUTES && (
                  <CaptainRoutes 
                    routes={captainRoutes} 
                    onAdd={() => { setEditingRoute(null); setStatus(AppStatus.CAPTAIN_ROUTE_EDITOR); }}
                    onEdit={(r) => { setEditingRoute(r); setStatus(AppStatus.CAPTAIN_ROUTE_EDITOR); }}
                    onBack={() => {
                      if (activeDemand && status === AppStatus.CAPTAIN_ROUTES) {
                        setStatus(AppStatus.CAPTAIN_QUOTE);
                      } else {
                        setStatus(AppStatus.CAPTAIN_MINE);
                      }
                    }}
                  />
                )}
                {status === AppStatus.CAPTAIN_ROUTE_EDITOR && (
                  <CaptainRouteEditor 
                    initialRoute={editingRoute || undefined}
                    onBack={() => setStatus(AppStatus.CAPTAIN_ROUTES)}
                    onSave={(newRoute) => {
                      setCaptainRoutes(prev => {
                        const exists = prev.find(r => r.id === newRoute.id);
                        if (exists) return prev.map(r => r.id === newRoute.id ? newRoute : r);
                        return [...prev, newRoute];
                      });
                      setStatus(AppStatus.CAPTAIN_ROUTES);
                    }}
                  />
                )}
                {status === AppStatus.CAPTAIN_MINE && (
                  <CaptainMine 
                    onNavigate={(view) => {
                      if (view === 'WALLET') setStatus(AppStatus.CAPTAIN_WALLET);
                      if (view === 'ROUTES') setStatus(AppStatus.CAPTAIN_ROUTES);
                    }} 
                    onLogout={toggleIdentity} 
                  />
                )}
                {status === AppStatus.CAPTAIN_WALLET && (
                  <CaptainWallet onBack={() => setStatus(AppStatus.CAPTAIN_MINE)} />
                )}
             </div>

             {showCaptainBottomNav && (
               <div className="bg-slate-900 border-t border-slate-800 p-4 pb-8 flex justify-around items-center shrink-0">
                  <button 
                    onClick={() => setStatus(AppStatus.CAPTAIN_HOME)}
                    className={`flex flex-col items-center space-y-1 ${status === AppStatus.CAPTAIN_HOME ? 'text-blue-400' : 'text-slate-500'}`}
                  >
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0 7 7 0 0114 0" strokeWidth="2.5"/></svg>
                    <span className="text-[10px] font-black uppercase tracking-tighter">抢单</span>
                  </button>
                  <button 
                    onClick={() => setStatus(AppStatus.CAPTAIN_ORDERS)}
                    className={`flex flex-col items-center space-y-1 ${status === AppStatus.CAPTAIN_ORDERS ? 'text-blue-400' : 'text-slate-500'}`}
                  >
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" strokeWidth="2.5"/></svg>
                    <span className="text-[10px] font-black uppercase tracking-tighter">订单</span>
                  </button>
                  <button 
                    onClick={() => setStatus(AppStatus.CAPTAIN_MINE)}
                    className={`flex flex-col items-center space-y-1 ${status === AppStatus.CAPTAIN_MINE ? 'text-blue-400' : 'text-slate-500'}`}
                  >
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" strokeWidth="2.5"/></svg>
                    <span className="text-[10px] font-black uppercase tracking-tighter">我的</span>
                  </button>
               </div>
             )}
          </div>
        )}
      </div>
    </div>
  );
};

export default App;
