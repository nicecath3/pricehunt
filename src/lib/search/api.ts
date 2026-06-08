import type { Product } from "@/types";

export interface ProductListResponse {
  data: Product[];
  total: number;
}

export const fetchProductList = async ({
  t,
  s,
  page,
}: {
  t: string;
  s: string;
  page: number;
}): Promise<ProductListResponse> => {
  const params = new URLSearchParams({ q: t, s, page: String(page) });

  const res = await fetch(`/api/search?${params}`);

  const json = await res.json();

  if (!json.success) throw new Error(json.error);

  return { data: json.data, total: json.total };
};
