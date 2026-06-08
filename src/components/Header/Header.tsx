"use client";
import { useState, useRef, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import styles from "./Header.module.scss";
import { useAlerts } from "@/hooks/useAlerts";
import type { AlertRecord } from "@/types";

export default function Header() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const [searchText, setSearchText] = useState(searchParams.get("t") ?? "");
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const { alerts, deleteAlert, updateTargetPrice } = useAlerts();
  const waitingCount = alerts.filter((a) => a.status === "waiting").length;

  useEffect(() => {
    setSearchText(searchParams.get("t") ?? "");
  }, [searchParams]);

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
            <svg className={styles.searchIcon} width="16" height="16" viewBox="0 0 24 24" fill="none">
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
              <button type="button" className={styles.clearBtn} onClick={() => { setSearchText(""); inputRef.current?.focus(); }}>
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none">
                  <path d="M18 6 6 18M6 6l12 12" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
                </svg>
              </button>
            )}
          </div>
          <button type="submit" className={styles.searchBtn}>검색</button>
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
                <span className={styles.dropdownTitle}>🔔 알림 내역</span>
                <span className={styles.dropdownCount}>{alerts.length}개 등록됨</span>
              </div>

              {alerts.length === 0 ? (
                <div className={styles.dropdownEmpty}>
                  <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                    <path d="M18 8A6 6 0 006 8c0 7-3 9-3 9h18s-3-2-3-9" strokeLinecap="round" />
                    <path d="M13.73 21a2 2 0 01-3.46 0" strokeLinecap="round" />
                  </svg>
                  <p>등록된 알림이 없습니다</p>
                </div>
              ) : (
                <ul className={styles.dropdownList}>
                  {alerts.map((alert) => (
                    <AlertDropdownItem
                      key={alert.id}
                      alert={alert}
                      onDelete={deleteAlert}
                      onUpdatePrice={updateTargetPrice}
                    />
                  ))}
                </ul>
              )}
            </div>
          )}
        </div>
      </div>
    </header>
  );
}

/* ── 알림 아이템 (인라인 목표가 수정) ── */
function AlertDropdownItem({
  alert,
  onDelete,
  onUpdatePrice,
}: {
  alert: AlertRecord;
  onDelete: (id: string) => void;
  onUpdatePrice: (id: string, price: number) => void;
}) {
  const [editing, setEditing] = useState(false);
  const [inputVal, setInputVal] = useState(alert.targetPrice.toLocaleString());

  const handleEditStart = () => {
    setInputVal(alert.targetPrice.toLocaleString());
    setEditing(true);
  };

  const handleSave = () => {
    const num = parseInt(inputVal.replace(/,/g, ""), 10);
    if (!num || num <= 0) return;
    if (num >= alert.currentPrice) {
      alert && window.alert("목표가는 현재가보다 낮아야 합니다.");
      return;
    }
    onUpdatePrice(alert.id, num);
    setEditing(false);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") handleSave();
    if (e.key === "Escape") setEditing(false);
  };

  const discountRate = Math.round((1 - alert.targetPrice / alert.currentPrice) * 100);

  return (
    <li className={styles.dropdownItem}>
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src={alert.productImage}
        alt={alert.productTitle}
        className={styles.dropdownThumb}
        onError={(e) => { (e.target as HTMLImageElement).style.visibility = "hidden"; }}
      />

      <div className={styles.dropdownInfo}>
        <p className={styles.dropdownName}>{alert.productTitle}</p>

        <div className={styles.dropdownMeta}>
          <span className={`${styles.dropdownMethod} ${alert.notifyMethod === "message" ? styles.sms : ""}`}>
            {alert.notifyMethod === "email" ? "이메일" : "문자"}
          </span>
          <span className={styles.dropdownContact}>{alert.contact}</span>
        </div>

        {/* 목표가 영역 */}
        {editing ? (
          <div className={styles.editRow}>
            <span className={styles.editUnit}>₩</span>
            <input
              className={styles.editInput}
              value={inputVal}
              autoFocus
              inputMode="numeric"
              onChange={(e) => {
                const raw = e.target.value.replace(/[^0-9]/g, "");
                setInputVal(raw ? parseInt(raw).toLocaleString() : "");
              }}
              onKeyDown={handleKeyDown}
            />
            <button className={styles.editSave} onClick={handleSave}>저장</button>
            <button className={styles.editCancel} onClick={() => setEditing(false)}>✕</button>
          </div>
        ) : (
          <div className={styles.priceRow}>
            <span className={styles.dropdownPrice}>₩{alert.targetPrice.toLocaleString()}</span>
            <span className={styles.discountBadge}>-{discountRate}%</span>
            <button className={styles.editBtn} onClick={handleEditStart}>
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                <path d="M11 4H4a2 2 0 00-2 2v14a2 2 0 002 2h14a2 2 0 002-2v-7" strokeLinecap="round" strokeLinejoin="round"/>
                <path d="M18.5 2.5a2.121 2.121 0 013 3L12 15l-4 1 1-4 9.5-9.5z" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
              수정
            </button>
          </div>
        )}
      </div>

      <button
        className={styles.dropdownDel}
        onClick={() => onDelete(alert.id)}
        title="삭제"
      >
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <path d="M18 6 6 18M6 6l12 12" strokeLinecap="round" />
        </svg>
      </button>
    </li>
  );
}
