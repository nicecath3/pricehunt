"use client";
import { useState, useEffect, useRef, useMemo } from "react";
import styles from "./page.module.scss";
import Header from "@/components/Header/Header";
import Sidebar from "@/components/Sidebar/Sidebar";
import ProductGrid from "@/components/ProductGrid/ProductGrid";
import ProductModal from "@/components/ProductModal/ProductModal";
import AlertModal from "@/components/AlertModal/AlertModal";
import { useSearch } from "@/hooks/useSearch";
import type { ViewMode } from "@/types";
import { useSearchParams } from "next/navigation";
import { alertProductAtom, selectProductAtom } from "@/store/atom";
import { useAtom } from "jotai";

export default function Home() {
  const searchParams = useSearchParams();
  const t = searchParams.get("t") ?? "마우스";
  const s = searchParams.get("s") ?? "sim";

  const {
    productList,
    total,
    loading,
    loadingMore,
    hasMore,
    loadMore,
    isFetching,
  } = useSearch({ t, s });

  const [viewMode, setViewMode] = useState<ViewMode>("grid");
  const [selectedProduct, setSelectedProduct] = useAtom(selectProductAtom);
  const [alertProduct, setAlertProduct] = useAtom(alertProductAtom);
  const categories = useMemo(
    () =>
      Array.from(new Set(productList.map((p) => p.category1).filter(Boolean))),
    [productList],
  );

  const sentinelRef = useRef<HTMLDivElement>(null);
  const loadMoreRef = useRef(loadMore);
  loadMoreRef.current = loadMore;
  const isFetchingRef = useRef(isFetching);
  isFetchingRef.current = isFetching;
  const blockRef = useRef(false);

  useEffect(() => {
    blockRef.current = true;
    window.scrollTo({ top: 0 });
  }, [t, s]);

  useEffect(() => {
    if (!loading) blockRef.current = false;
  }, [loading]);

  useEffect(() => {
    const el = sentinelRef.current;
    if (!el) return;

    const observer = new IntersectionObserver(
      (entries) => {
        if (
          entries[0].isIntersecting &&
          !isFetchingRef.current &&
          !blockRef.current
        ) {
          loadMoreRef.current();
        }
      },
      { rootMargin: "300px" },
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  return (
    <div className={styles.page}>
      <Header />

      <div className={styles.bodyOuter}>
        <div className={styles.body}>
          <Sidebar categories={categories} />

          <div className={styles.content}>
            <div className={styles.contentTop}>
              <p className={styles.resultInfo}>
                {loading ? (
                  "검색 중..."
                ) : (
                  <>
                    <strong>{total.toLocaleString()}</strong>개 상품
                  </>
                )}
              </p>

              <div className={styles.viewToggle}>
                <button
                  className={`${styles.viewBtn} ${viewMode === "list" ? styles.active : ""}`}
                  onClick={() => setViewMode("list")}
                  title="목록 보기"
                >
                  <svg width="15" height="15" viewBox="0 0 24 24" fill="none">
                    <path
                      d="M8 6h13M8 12h13M8 18h13M3 6h.01M3 12h.01M3 18h.01"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                    />
                  </svg>
                </button>

                <button
                  className={`${styles.viewBtn} ${viewMode === "grid" ? styles.active : ""}`}
                  onClick={() => setViewMode("grid")}
                  title="그리드 보기"
                >
                  <svg width="15" height="15" viewBox="0 0 24 24" fill="none">
                    <rect
                      x="3"
                      y="3"
                      width="7"
                      height="7"
                      rx="1"
                      stroke="currentColor"
                      strokeWidth="2"
                    />
                    <rect
                      x="14"
                      y="3"
                      width="7"
                      height="7"
                      rx="1"
                      stroke="currentColor"
                      strokeWidth="2"
                    />
                    <rect
                      x="3"
                      y="14"
                      width="7"
                      height="7"
                      rx="1"
                      stroke="currentColor"
                      strokeWidth="2"
                    />
                    <rect
                      x="14"
                      y="14"
                      width="7"
                      height="7"
                      rx="1"
                      stroke="currentColor"
                      strokeWidth="2"
                    />
                  </svg>
                </button>
              </div>
            </div>

            <ProductGrid
              products={productList}
              loading={loading}
              viewMode={viewMode}
            />

            <div ref={sentinelRef} className={styles.sentinel} />

            {loadingMore && (
              <div className={styles.loadingMore}>
                <span className={styles.spinner} />
                <span>더 불러오는 중...</span>
              </div>
            )}

            {!hasMore && !loading && productList.length > 0 && (
              <p className={styles.endMsg}>마지막 상품입니다</p>
            )}
          </div>
        </div>
      </div>

      {selectedProduct && (
        <ProductModal
          product={selectedProduct}
          onClose={() => setSelectedProduct(null)}
        />
      )}

      {alertProduct && (
        <AlertModal
          product={alertProduct}
          onClose={() => setAlertProduct(null)}
        />
      )}
    </div>
  );
}
