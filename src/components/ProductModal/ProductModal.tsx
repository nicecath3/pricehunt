"use client";
import { useEffect } from "react";
import Image from "next/image";
import dynamic from "next/dynamic";
import styles from "./ProductModal.module.scss";
import type { Product } from "@/types";
import { alertProductAtom } from "@/store/atom";
import { useAtom } from "jotai";

const PriceChart = dynamic(() => import("./PriceChart"), { ssr: false });

interface ProductModalProps {
  product: Product;
  onClose: () => void;
}

export default function ProductModal({ product, onClose }: ProductModalProps) {
  const [alertProduct, setAlertProduct] = useAtom(alertProductAtom);

  const isDown = product.priceChange < 0;
  const isUp = product.priceChange > 0;
  const lowestStore = product.stores.find((s) => s.isLowest);

  useEffect(() => {
    document.body.style.overflow = "hidden";
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", handleKey);
    return () => {
      document.body.style.overflow = "";
      window.removeEventListener("keydown", handleKey);
    };
  }, [onClose]);

  return (
    <div className={styles.overlay} onClick={onClose}>
      <div className={styles.modal} onClick={(e) => e.stopPropagation()}>
        <div className={styles.modalHeader}>
          <div className={styles.headerInfo}>
            {product.category1 && (
              <span className={styles.catTag}>{product.category1}</span>
            )}
            <h2 className={styles.modalTitle}>{product.title}</h2>
          </div>

          <div className={styles.headerActions}>
            <button
              className={styles.alertBtn}
              onClick={() => setAlertProduct(product)}
            >
              <svg width="15" height="15" viewBox="0 0 24 24" fill="none">
                <path
                  d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
                <path
                  d="M13.73 21a2 2 0 0 1-3.46 0"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                />
              </svg>
              알림 신청
            </button>

            <button className={styles.closeBtn} onClick={onClose}>
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
                <path
                  d="M18 6 6 18M6 6l12 12"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                />
              </svg>
            </button>
          </div>
        </div>

        <div className={styles.modalBody}>
          <div className={styles.leftPanel}>
            <div className={styles.imgWrap}>
              <Image
                src={product.image}
                alt={product.title}
                fill
                className={styles.productImg}
                unoptimized
              />
            </div>

            <div className={styles.metaList}>
              {product.brand && (
                <div className={styles.metaRow}>
                  <span className={styles.metaLabel}>브랜드</span>
                  <span className={styles.metaValue}>{product.brand}</span>
                </div>
              )}

              {product.maker && product.maker !== product.brand && (
                <div className={styles.metaRow}>
                  <span className={styles.metaLabel}>제조사</span>
                  <span className={styles.metaValue}>{product.maker}</span>
                </div>
              )}

              <div className={styles.metaRow}>
                <span className={styles.metaLabel}>판매처</span>
                <span className={styles.metaValue}>{product.mallName}</span>
              </div>

              {product.category2 && (
                <div className={styles.metaRow}>
                  <span className={styles.metaLabel}>카테고리</span>
                  <span className={styles.metaValue}>
                    {product.category1} &gt; {product.category2}
                  </span>
                </div>
              )}
            </div>
            <a
              href={product.link}
              target="_blank"
              rel="noopener noreferrer"
              className={styles.buyBtn}
            >
              최저가로 구매
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none">
                <path
                  d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                />
                <path
                  d="M15 3h6v6"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
                <path
                  d="m10 14 11-11"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                />
              </svg>
            </a>
          </div>

          <div className={styles.rightPanel}>
            <div className={styles.priceStats}>
              <div className={styles.statCard}>
                <span className={styles.statLabel}>현재가</span>

                <span className={styles.statValue}>
                  {product.currentPrice.toLocaleString()}원
                </span>

                {product.priceChange !== 0 && (
                  <span
                    className={`${styles.statChange} ${isDown ? styles.down : isUp ? styles.up : ""}`}
                  >
                    {isDown ? "▼" : "▲"} {Math.abs(product.priceChangePercent)}%
                  </span>
                )}
              </div>

              <div className={styles.statCard}>
                <span className={styles.statLabel}>최저가</span>
                <span className={`${styles.statValue} ${styles.low}`}>
                  {product.lowPrice.toLocaleString()}원
                </span>
                {lowestStore && (
                  <span className={styles.statSub}>{lowestStore.mallName}</span>
                )}
              </div>

              <div className={styles.statCard}>
                <span className={styles.statLabel}>최고가</span>
                <span className={`${styles.statValue} ${styles.high}`}>
                  {product.highPrice.toLocaleString()}원
                </span>
              </div>
            </div>

            <div className={styles.chartSection}>
              <h3 className={styles.sectionTitle}>14일 가격 추이</h3>
              <div className={styles.chartWrap}>
                <PriceChart history={product.priceHistory} />
              </div>
            </div>

            <div className={styles.storesSection}>
              <h3 className={styles.sectionTitle}>쇼핑몰별 가격</h3>
              <div className={styles.storeList}>
                {product.stores.map((store, i) => (
                  <div
                    key={i}
                    className={`${styles.storeRow} ${store.isLowest ? styles.lowestRow : ""}`}
                  >
                    <div className={styles.storeName}>
                      {store.isLowest && (
                        <span className={styles.lowestBadge}>최저</span>
                      )}
                      <span>{store.mallName}</span>
                    </div>

                    <span
                      className={`${styles.storePrice} ${store.isLowest ? styles.lowestPrice : ""}`}
                    >
                      {store.price.toLocaleString()}원
                    </span>

                    <a
                      href={store.link}
                      target="_blank"
                      rel="noopener noreferrer"
                      className={styles.storeLink}
                      onClick={(e) => e.stopPropagation()}
                    >
                      바로가기
                    </a>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
