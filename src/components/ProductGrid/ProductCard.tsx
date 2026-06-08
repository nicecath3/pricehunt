"use client";
import { useState } from "react";
import Image from "next/image";
import styles from "./ProductCard.module.scss";
import type { Product, ViewMode } from "@/types";
import { alertProductAtom, selectProductAtom } from "@/store/atom";
import { useAtom } from "jotai";

interface ProductCardProps {
  product: Product;
  viewMode: ViewMode;
}

export default function ProductCard({ product, viewMode }: ProductCardProps) {
  const [imgError, setImgError] = useState(false);

  const [, setSelectedProduct] = useAtom(selectProductAtom);
  const [, setAlertProduct] = useAtom(alertProductAtom);

  const isDown = product.priceChange < 0;
  const isUp = product.priceChange > 0;

  const handleAlert = (e: React.MouseEvent) => {
    e.stopPropagation();
    setAlertProduct(product);
  };

  const imgContent = imgError ? (
    <div className={styles.imgFallback}>
      <svg width="32" height="32" viewBox="0 0 24 24" fill="none">
        <rect
          x="3"
          y="3"
          width="18"
          height="18"
          rx="3"
          stroke="currentColor"
          strokeWidth="1.5"
        />
        <circle cx="8.5" cy="8.5" r="1.5" fill="currentColor" />
        <path
          d="m21 15-5-5L5 21"
          stroke="currentColor"
          strokeWidth="1.5"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    </div>
  ) : (
    <Image
      src={product.image}
      alt={product.title}
      fill
      className={styles.img}
      unoptimized
      onError={() => setImgError(true)}
    />
  );

  if (viewMode === "list") {
    return (
      <div
        className={styles.listCard}
        onClick={() => setSelectedProduct(product)}
      >
        <div className={styles.listImgWrap}>{imgContent}</div>
        <div className={styles.listBody}>
          {product.category1 && (
            <span className={styles.catChip}>{product.category1}</span>
          )}
          <p className={styles.listTitle}>{product.title}</p>
          <p className={styles.listMall}>{product.mallName}</p>
        </div>
        <div className={styles.listRight}>
          <div className={styles.priceRow}>
            <span className={styles.price}>
              {product.currentPrice.toLocaleString()}원
            </span>
            {product.priceChange !== 0 && (
              <span
                className={`${styles.badge} ${isDown ? styles.badgeDown : styles.badgeUp}`}
              >
                {isDown ? "▼" : "▲"}
                {Math.abs(product.priceChangePercent)}%
              </span>
            )}
          </div>
          <p className={styles.lowPrice}>
            최저 {product.lowPrice.toLocaleString()}원
          </p>
          <button className={styles.alertBtnSm} onClick={handleAlert}>
            <BellIcon /> 알림
          </button>
        </div>
      </div>
    );
  }

  return (
    <div
      className={styles.gridCard}
      onClick={() => setSelectedProduct(product)}
    >
      <div className={styles.gridImgWrap}>{imgContent}</div>
      <div className={styles.gridBody}>
        {product.category1 && (
          <span className={styles.catChip}>{product.category1}</span>
        )}
        <p className={styles.gridTitle}>{product.title}</p>
        <p className={styles.gridMall}>{product.mallName}</p>
        <div className={styles.gridPriceArea}>
          <div className={styles.priceRow}>
            <span className={styles.price}>
              {product.currentPrice.toLocaleString()}원
            </span>
            {product.priceChange !== 0 && (
              <span
                className={`${styles.badge} ${isDown ? styles.badgeDown : styles.badgeUp}`}
              >
                {isDown ? "▼" : "▲"}
                {Math.abs(product.priceChangePercent)}%
              </span>
            )}
          </div>
          <p className={styles.lowPrice}>
            최저 {product.lowPrice.toLocaleString()}원
          </p>
        </div>
      </div>
      <div className={styles.gridFooter}>
        <button className={styles.alertBtn} onClick={handleAlert}>
          <BellIcon /> 알림 신청
        </button>
      </div>
    </div>
  );
}

function BellIcon() {
  return (
    <svg width="13" height="13" viewBox="0 0 24 24" fill="none">
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
  );
}
