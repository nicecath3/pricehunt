import { NextRequest, NextResponse } from "next/server";
import { searchNaverShopping, mapNaverItem } from "@/lib/naver";
import { Product, SortOption } from "@/types";

const ITEMS_PER_PAGE = 20;

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const query = searchParams.get("q");
  const page = Number(searchParams.get("page")) || 1;
  const sort = (searchParams.get("s") as SortOption) || "sim";

  if (!query) {
    return NextResponse.json(
      { success: false, error: "검색어를 입력해주세요." },
      { status: 400 },
    );
  }

  const start = (page - 1) * ITEMS_PER_PAGE + 1;

  try {
    const result = await searchNaverShopping({
      query,
      display: ITEMS_PER_PAGE,
      start,
      sort,
    });

    const products: Product[] = result.items.map(mapNaverItem);

    return NextResponse.json({
      success: true,
      data: products,
      total: Math.min(result.total, 1000),
    });
  } catch (error) {
    console.error("[/api/search] Naver shopping search failed:", error);
    return NextResponse.json(
      { success: false, error: "검색 중 오류가 발생했습니다." },
      { status: 500 },
    );
  }
}
