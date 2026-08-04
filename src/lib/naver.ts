import type {
  NaverShoppingResponse,
  NaverShoppingItem,
  StorePrice,
  PricePoint,
} from "@/types";

const NAVER_API_URL = "https://openapi.naver.com/v1/search/shop.json";

export async function searchNaverShopping(params: {
  query: string;
  display: number;
  start: number;
  sort: string;
}): Promise<NaverShoppingResponse> {
  const { query, display = 12, start = 1, sort = "sim" } = params;
  const url = new URL(NAVER_API_URL);

  url.searchParams.set("query", query);
  url.searchParams.set("display", String(display));
  url.searchParams.set("start", String(start));
  url.searchParams.set("sort", sort);

  const res = await fetch(url.toString(), {
    headers: {
      "X-Naver-Client-Id": process.env.NAVER_CLIENT_ID!,
      "X-Naver-Client-Secret": process.env.NAVER_CLIENT_SECRET!,
    },
    next: { revalidate: 300 },
  });

  if (!res.ok) {
    const body = await res.text();
    throw new Error(`Naver API error: ${res.status} ${body}`);
  }

  return res.json();
}

// 14일치 가격 데이터 없어서 가상으로 목업데이터생성 마지막 가격만 조회 금액으로 일치
export function generateMockPriceHistory(
  basePrice: number,
  days = 14,
): PricePoint[] {
  const history: PricePoint[] = [];
  let price = basePrice * 1.12;
  const now = new Date();
  for (let i = days; i >= 0; i--) {
    const date = new Date(now);
    date.setDate(date.getDate() - i);
    price = Math.max(
      basePrice * 0.9,
      price * (1 + (Math.random() - 0.55) * 0.04),
    );
    history.push({
      date: date.toISOString().split("T")[0],
      price: Math.round(price),
    });
  }
  history[history.length - 1].price = basePrice;
  return history;
}

// 네이버가격 밖에 모르는 관계로 랜덤가격 쇼핑몰 추가
export function generateMockStores(
  basePrice: number,
  mallName: string,
  link: string,
): StorePrice[] {
  const malls = ["쿠팡", "11번가", "G마켓", "SSG.COM", "옥션"];
  const others = malls.filter((m) => m !== mallName).slice(0, 3);
  const stores: StorePrice[] = [
    { mallName, price: basePrice, link: link, isLowest: false },
    ...others.map((m, i) => ({
      mallName: m,
      price: Math.round(basePrice * (1.01 + i * 0.02)),
      link: link,
      isLowest: false,
    })),
  ].sort((a, b) => a.price - b.price);
  stores[0].isLowest = true;
  return stores;
}

export function mapNaverItem(item: NaverShoppingItem) {
  const currentPrice = parseInt(item.lprice) || 0;
  const history = generateMockPriceHistory(currentPrice);
  const historyPrices = history.map((h) => h.price);
  const lowPrice = Math.min(...historyPrices);
  const highPrice = Math.max(...historyPrices);
  const priceChange = currentPrice - history[0].price;
  const priceChangePercent =
    history[0].price > 0
      ? Math.round((priceChange / history[0].price) * 100)
      : 0;

  return {
    id: item.productId || `naver-${Math.random().toString(36).slice(2)}`,
    title: item.title.replace(/<[^>]*>/g, ""),
    image: item.image,
    link: item.link,
    currentPrice,
    lowPrice,
    highPrice,
    mallName: item.mallName,
    brand: item.brand,
    maker: item.maker,
    category1: item.category1 || "기타",
    category2: item.category2 || "",
    priceHistory: history,
    stores: generateMockStores(currentPrice, item.mallName, item.link),
    priceChange,
    priceChangePercent,
  };
}
