import { sortType } from "@/types";

export const SORT_OPTIONS: sortType[] = [
  { value: "sim", label: "정확도순", desc: "정확도순으로 내림차순" },
  { value: "date", label: "날짜별 정렬", desc: "날짜순으로 내림차순" },
  { value: "asc", label: "가격 낮은순", desc: "저렴한 상품 먼저" },
  { value: "dsc", label: "가격 높은순", desc: "비싼 상품 먼저" },
];

export const CAT_ICONS: Record<string, string> = {
  전체: "◈",
  "디지털/가전": "💻",
  패션의류: "👗",
  "생활/건강": "🏠",
  "스포츠/레저": "⚽",
  뷰티: "✨",
};
