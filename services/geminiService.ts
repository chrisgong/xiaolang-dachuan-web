
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
  
  // 缩减生成条数（3-4条）并简化指令以加快 AI 响应
  const prompt = `
    作为海钓平台后端，请根据以下用户需求生成 3 到 4 条精选船长报价。
    
    需求：${request.city}, ${request.date}, ${request.people}人, ${request.style}, ${request.type === OrderType.SHARE ? '拼船' : '包船'}

    格式要求：
    1. 必须包含 routeInfo：destination(简短钓点), targetFish(主攻鱼), name(方案名，格式 "[destination]钓[targetFish]"), oceanType('NEAR'|'FAR')。
    2. 报价：拼船按人均，包船按整船。
    3. 服务：从 ['gear', 'bait', 'insurance', 'drinks', 'guide', 'media'] 中随机选 3 个英文 ID。
    4. manualIntro: 简短的专业自备建议。
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
          name: '西鼓岛钓章红',
          oceanType: 'FAR',
          destination: '西鼓岛',
          targetFish: '章红',
          description: '', fishingSet: '', gearIncluded: '', baitIncluded: '', otherItems: '', sharePrice: 0, charterPrice: 0, includedServices: []
        }
      }
    ];
  }
};
