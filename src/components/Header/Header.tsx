"use client";
import { useState, useRef, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import styles from "./Header.module.scss";
import { useAlerts } from "@/hooks/useAlerts";

export default function Header() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const [searchText, setSearchText] = useState(searchParams.get("t") ?? "");
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const { alerts, deleteAlert } = useAlerts();
  const waitingCount = alerts.filter((a) => a.status === "waiting").length;

  useEffect(() => {
    setSearchText(searchParams.get("t") ?? "");
  }, [searchParams]);

  // 드롭다운 외부 클릭 시 닫기
  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setDropdownOpen(false);
      }
    };
    if (dropdownOpen) document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, [dropdownOpen]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!searchText.trim()) return;
    window.scrollTo({ top: 0 });
    const params = new URLSearchParams(searchParams.toString());
    params.set("t", searchText.trim());
    router.replace(`?${params.toString()}`);
  };

  return (
    <header className={styles.header}>
      <div className={styles.inner}>
        <a href="/" className={styles.logo}>
          <svg width="22" height="22" viewBox="0 0 24 24" fill="none">
            <path
              d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
          <span>PriceHunt</span>
        </a>

        <form className={styles.searchForm} onSubmit={handleSubmit}>
          <div className={styles.searchWrap}>
            <svg
              className={styles.searchIcon}
              width="16"
              height="16"
              viewBox="0 0 24 24"
              fill="none"
            >
              <circle cx="11" cy="11" r="8" stroke="currentColor" strokeWidth="2" />
              <path d="m21 21-4.35-4.35" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
            </svg>

            <input
              ref={inputRef}
              type="text"
              className={styles.searchInput}
              placeholder="상품명, 브랜드 검색"
              value={searchText}
              onChange={(e) => setSearchText(e.target.value)}
            />

            {searchText && (
              <button
                type="button"
                className={styles.clearBtn}
                onClick={() => {
                  setSearchText("");
                  inputRef.current?.focus();
                }}
              >
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none">
                  <path d="M18 6 6 18M6 6l12 12" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
                </svg>
              </button>
            )}
          </div>

          <button type="submit" className={styles.searchBtn}>
            검색
          </button>
        </form>

        {/* 벨 아이콘 */}
        <div className={styles.bellWrap} ref={dropdownRef}>
          <button
            className={styles.bellBtn}
            onClick={() => setDropdownOpen((v) => !v)}
            title="알림 내역"
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M18 8A6 6 0 006 8c0 7-3 9-3 9h18s-3-2-3-9" strokeLinecap="round" strokeLinejoin="round" />
              <path d="M13.73 21a2 2 0 01-3.46 0" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
            {waitingCount > 0 && (
              <span className={styles.bellBadge}>{waitingCount > 9 ? "9+" : waitingCount}</span>
            )}
          </button>

          {dropdownOpen && (
            <div className={styles.dropdown}>
              <div className={styles.dropdownHeader}>
                <span className={styles.dropdownTitle}>알림 내역</span>
                <span className={styles.dropdownCount}>{alerts.length}개 등록됨</span>
              </div>

              {alerts.length === 0 ? (
                <div className={styles.dropdownEmpty}>
                  <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                    <path d="M18 8A6 6 0 006 8c0 7-3 9-3 9h18s-3-2-3-9" strokeLinecap="round" />
                    <path d="M13.73 21a2 2 0 01-3.46 0" strokeLinecap="round" />
                  </svg>
                  <p>등록된 알림이 없습니다</p>
                </div>
              ) : (
                <ul className={styles.dropdownList}>
                  {alerts.slice(0, 4).map((alert) => (
                    <li key={alert.id} className={styles.dropdownItem}>
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img
                        src={alert.productImage}
                        alt={alert.productTitle}
                        className={styles.dropdownThumb}
                        onError={(e) => { (e.target as HTMLImageElement).src = "/placeholder.png"; }}
                      />
                      <div className={styles.dropdownInfo}>
                        <p className={styles.dropdownName}>{alert.productTitle}</p>
                        <div className={styles.dropdownMeta}>
                          <span className={styles.dropdownPrice}>
                            목표 ₩{alert.targetPrice.toLocaleString()}
                          </span>
                          <span className={`${styles.dropdownMethod} ${alert.notifyMethod === "message" ? styles.sms : ""}`}>
                            {alert.notifyMethod === "email" ? "이메일" : "문자"}
                          </span>
                        </div>
                      </div>
                      <button
                        className={styles.dropdownDel}
                        onClick={() => deleteAlert(alert.id)}
                        title="삭제"
                      >
                        ×
                      </button>
                    </li>
                  ))}
                </ul>
              )}

              <div className={styles.dropdownFooter}>
                <Link href="/alerts" onClick={() => setDropdownOpen(false)}>
                  전체 내역 보기 →
                </Link>
              </div>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
