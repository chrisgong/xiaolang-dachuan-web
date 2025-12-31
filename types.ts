
export enum OrderType {
  SHARE = 'SHARE',
  CHARTER = 'CHARTER'
}

export enum Identity {
  ANGLER = 'ANGLER',
  CAPTAIN = 'CAPTAIN'
}

export enum AppStatus {
  HOME = 'HOME',
  BIDDING = 'BIDDING',
  TRIP = 'TRIP',
  ORDERS = 'ORDERS',
  FILTER = 'FILTER',
  CAPTAIN_PROFILE = 'CAPTAIN_PROFILE',
  CAPTAIN_DYNAMICS_LIST = 'CAPTAIN_DYNAMICS_LIST',
  CAPTAIN_REVIEWS_LIST = 'CAPTAIN_REVIEWS_LIST',
  
  CAPTAIN_HOME = 'CAPTAIN_HOME',
  CAPTAIN_QUOTE = 'CAPTAIN_QUOTE',
  CAPTAIN_ORDERS = 'CAPTAIN_ORDERS',
  CAPTAIN_ORDER_DETAIL = 'CAPTAIN_ORDER_DETAIL',
  CAPTAIN_WALLET = 'CAPTAIN_WALLET',
  CAPTAIN_SCAN = 'CAPTAIN_SCAN',
  CAPTAIN_ROUTES = 'CAPTAIN_ROUTES',
  CAPTAIN_ROUTE_EDITOR = 'CAPTAIN_ROUTE_EDITOR',
  CAPTAIN_MINE = 'CAPTAIN_MINE',
  CAPTAIN_PROFILE_EDITOR = 'CAPTAIN_PROFILE_EDITOR'
}

export interface BoatFilters {
  length: number;
  width: number;
  minPower: string;
  amenities: string[];
}

export interface UserRequest {
  id: string; 
  city: string;
  date: string;
  people: number;
  style: string;
  remarks: string;
  type: OrderType;
  filters?: BoatFilters;
  createdAt?: number;
  contactName?: string;
  contactPhone?: string;
}

export interface RoutePreset {
  id: string;
  name: string;
  description: string;
  oceanType: 'FAR' | 'NEAR';
  destination: string;
  fishingSet: string;
  gearIncluded: string;
  baitIncluded: string;
  otherItems: string;
  sharePrice: number;
  charterPrice: number;
  includedServices: string[];
  customService?: string;
  targetFish?: string; // 修改为 string，支持手填
}

export interface CaptainBid {
  id: string;
  captainName: string;
  boatName: string;
  boatSpecs: string;
  distance: number;
  price: number;
  rating: number;
  tripsCount: number;
  avatar: string;
  catchImages: string[];
  impressionTags: string[]; 
  includedServices?: string[];
  customService?: string;
  routeInfo?: RoutePreset;
  manualIntro?: string;
}

export interface Trip {
  orderId: string;
  request: UserRequest;
  bid: CaptainBid;
  verifyCode: string;
  status: 'BIDDING' | 'PENDING_PAYMENT' | 'PAID' | 'IN_SERVICE' | 'COMPLETED' | 'CANCELLED';
  createdAt: number;
  hasReviewed?: boolean;
  cancelReason?: string;
}
