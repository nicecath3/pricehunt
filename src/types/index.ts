export interface NaverShoppingItem {
  title: string;
  link: string;
  image: string;
  lprice: string;
  hprice: string;
  mallName: string;
  productId: string;
  productType: string;
  brand: string;
  maker: string;
  category1: string;
  category2: string;
  category3: string;
  category4: string;
}

export interface NaverShoppingResponse {
  lastBuildDate: string;
  total: number;
  start: number;
  display: number;
  items: NaverShoppingItem[];
}

export interface PricePoint {
  date: string;
  price: number;
}

export interface StorePrice {
  mallName: string;
  price: number;
  link: string;
  isLowest: boolean;
}

export interface Product {
  id: string;
  title: string;
  image: string;
  link: string;
  currentPrice: number;
  lowPrice: number;
  highPrice: number;
  mallName: string;
  brand: string;
  maker: string;
  category1: string;
  category2: string;
  priceHistory: PricePoint[];
  stores: StorePrice[];
  priceChange: number;
  priceChangePercent: number;
}

export type SortOption = "asc" | "dsc" | "sim" | "date";
export type ViewMode = "list" | "grid";

export interface sortType {
  value: SortOption;
  label: string;
  desc: string;
}

export interface SearchParams {
  query: string;
  sort: SortOption;
  category: string;
  page: number;
}

export interface SearchResult {
  items: Product[];
  total: number;
}

export interface AlertFormData {
  productId: string;
  productTitle: string;
  currentPrice: number;
  targetPrice: number;
  notifyEmail: boolean;
  notifyPush: boolean;
  email: string;
}
