import { useInfiniteQuery } from "@tanstack/react-query";
import { fetchProductList } from "@/lib/search/api";

const PAGE_SIZE = 20;

export function useSearch({ t, s }: { t: string; s: string }) {
  const {
    data,
    fetchNextPage,
    hasNextPage,
    isFetching,
    isFetchingNextPage,
    error,
  } = useInfiniteQuery({
    queryKey: ["getProductList", t, s],
    queryFn: ({ pageParam }) => fetchProductList({ t, s, page: pageParam }),
    initialPageParam: 1,
    refetchOnWindowFocus: false,
    gcTime: 0,
    getNextPageParam: (lastPage, allPages) => {
      const loaded = allPages.length * PAGE_SIZE;
      return loaded < lastPage.total ? allPages.length + 1 : undefined;
    },
  });

  const productList = data?.pages.flatMap((p) => p.data) ?? [];
  const total = data?.pages[0]?.total ?? 0;

  return {
    productList,
    total,
    loading: isFetching && !isFetchingNextPage,
    loadingMore: isFetchingNextPage,
    isFetching,
    error: error?.message ?? null,
    hasMore: !!hasNextPage,
    loadMore: fetchNextPage,
  };
}
