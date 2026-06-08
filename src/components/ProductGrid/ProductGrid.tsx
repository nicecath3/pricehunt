"use client";
import styles from "./ProductGrid.module.scss";
import ProductCard from "./ProductCard";
import type { Product, ViewMode } from "@/types";

interface ProductGridProps {
  products: Product[];
  loading: boolean;
  viewMode: ViewMode;
}

export default function ProductGrid({
  products,
  loading,
  viewMode,
}: ProductGridProps) {
  if (loading) {
    return (
      <div
        className={`${styles.grid} ${viewMode === "grid" ? styles.gridMode : styles.listMode}`}
      >
        {Array.from({ length: 10 }).map((_, i) => (
          <div
            key={i}
            className={`${styles.skeleton} ${viewMode === "grid" ? styles.skeletonGrid : styles.skeletonList}`}
          />
        ))}
      </div>
    );
  }

  if (!products.length) {
    return (
      <div className={styles.empty}>
        <svg
          width="40"
          height="40"
          viewBox="0 0 24 24"
          fill="none"
          className={styles.emptyIcon}
        >
          <circle
            cx="11"
            cy="11"
            r="8"
            stroke="currentColor"
            strokeWidth="1.5"
          />
          <path
            d="m21 21-4.35-4.35"
            stroke="currentColor"
            strokeWidth="1.5"
            strokeLinecap="round"
          />
          <path
            d="M8 11h6m-3-3v6"
            stroke="currentColor"
            strokeWidth="1.5"
            strokeLinecap="round"
          />
        </svg>
        <p className={styles.emptyTitle}>검색 결과가 없습니다</p>
      </div>
    );
  }

  return (
    <div
      className={`${styles.grid} ${viewMode === "grid" ? styles.gridMode : styles.listMode}`}
    >
      {products.map((product, i) => (
        <ProductCard key={`${product.id}-${i}`} product={product} viewMode={viewMode} />
      ))}
    </div>
  );
}
