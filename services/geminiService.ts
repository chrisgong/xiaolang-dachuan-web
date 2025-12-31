
import { GoogleGenAI, Type } from "@google/genai";
import { UserRequest, CaptainBid, OrderType } from "../types";
import { STATIC_ASSETS } from "../constants";

const CAPTAIN_AVATARS = [
  STATIC_ASSETS.CAPTAIN_1,
  STATIC_ASSETS.CAPTAIN_2,
  STATIC_ASSETS.CAPTAIN_3
];

const MOCK_CATCH_IMAGES = [
  STATIC_ASSETS.BOAT_NEAR,
  STATIC_ASSETS.BOAT_FAR,
  STATIC_ASSETS.FISHING_CATCH,
  STATIC_ASSETS.OCEAN_VIEW,
  STATIC_ASSETS.LUYA_BOAT
];

// 定义标准服务 ID
const SERVICE_IDS = ['gear', 'bait', 'insurance', 'drinks', 'guide', 'media'];

export const generateCaptainBids = async (request: UserRequest): Promise<CaptainBid[]> => {
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
  
  const prompt = `
    作为海钓平台后端，请根据以下用户需求生成 3 到 5 条真实的船长抢单报价。
    
    用户需求：
    - 城市：${request.city}
    - 日期：${request.date}
    - 人数：${request.people}
    - 玩法：${request.style}
    - 类型：${request.type === OrderType.SHARE ? '拼船' : '包船'}

    报价规则：
    1. 报价必须包含 routeInfo 对象。
    2. routeInfo 包含：
       - destination: 具体的钓点名称（简短，如：七洲列岛、西鼓岛）
       - targetFish: 该线路主攻的鱼种（简短，如：章红、金枪鱼）
       - name: 方案标题。必须严格遵守 "[destination]钓[targetFish]线" 格式。
       - oceanType: 'NEAR' 或 'FAR'
    3. 拼船单：提供人均价 (通常在 300-1200元/人)
    4. 包船单：提供整船总价 (通常在 2000-15000元)
    5. 包含服务 (includedServices)：必须从以下英文ID列表中随机选择 3-5 个，严禁返回中文名称：
       ['gear', 'bait', 'insurance', 'drinks', 'guide', 'media']
    6. manualIntro: 船长给出的专业自备建议。
  `;

  try {
    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.ARRAY,
          items: {
            type: Type.OBJECT,
            properties: {
              id: { type: Type.STRING },
              captainName: { type: Type.STRING },
              boatName: { type: Type.STRING },
              boatSpecs: { type: Type.STRING },
              distance: { type: Type.NUMBER },
              price: { type: Type.NUMBER },
              rating: { type: Type.NUMBER },
              tripsCount: { type: Type.INTEGER },
              includedServices: {
                type: Type.ARRAY,
                items: { type: Type.STRING }
              },
              manualIntro: { type: Type.STRING },
              routeInfo: {
                type: Type.OBJECT,
                properties: {
                  name: { type: Type.STRING },
                  oceanType: { type: Type.STRING },
                  destination: { type: Type.STRING },
                  targetFish: { type: Type.STRING }
                }
              }
            },
            required: ["id", "captainName", "boatName", "boatSpecs", "distance", "price", "rating", "tripsCount", "includedServices", "routeInfo"]
          }
        }
      }
    });

    let cleanJson = response.text?.trim() || "[]";
    cleanJson = cleanJson.replace(/```json|```/g, '').trim();
    
    const bids: any[] = JSON.parse(cleanJson);
    
    return bids.map((bid, index) => ({
      ...bid,
      avatar: CAPTAIN_AVATARS[index % CAPTAIN_AVATARS.length],
      catchImages: [MOCK_CATCH_IMAGES[index % MOCK_CATCH_IMAGES.length]], 
      impressionTags: []
    }));
  } catch (error) {
    console.error("Failed to generate bids:", error);
    return [
      {
        id: "mock-1",
        captainName: "老张船长",
        boatName: "逐浪1号",
        boatSpecs: "32尺专业钓艇",
        distance: 1.2,
        price: request.type === OrderType.SHARE ? 500 : 3500,
        rating: 4.9,
        tripsCount: 125,
        avatar: CAPTAIN_AVATARS[0],
        catchImages: [MOCK_CATCH_IMAGES[0]],
        impressionTags: [],
        includedServices: ['gear', 'bait', 'insurance', 'guide'],
        routeInfo: {
          id: 'r1',
          name: '西鼓岛钓章红线',
          oceanType: 'FAR',
          destination: '西鼓岛',
          targetFish: '章红',
          description: '', fishingSet: '', gearIncluded: '', baitIncluded: '', otherItems: '', sharePrice: 0, charterPrice: 0, includedServices: []
        }
      }
    ];
  }
};
