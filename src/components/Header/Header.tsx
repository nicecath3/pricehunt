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

  const { alerts, deleteAlert } = useAlerts();
  const waitingCount = alerts.filter((a) => a.status === "waiting").length;

  const listRef = useRef<HTMLUListElement>(null);
  const drag = useRef({ active: false, startY: 0, scrollTop: 0 });
  const [hasMoreBelow, setHasMoreBelow] = useState(false);

  useEffect(() => {
    const el = listRef.current;
    if (!el) return;
    const check = () =>
      setHasMoreBelow(el.scrollTop + el.clientHeight < el.scrollHeight - 2);
    check();
    el.addEventListener("scroll", check);
    return () => el.removeEventListener("scroll", check);
  }, [alerts]);

  useEffect(() => {
    const el = listRef.current;
    if (!el) return;
    const onWheel = (e: WheelEvent) => {
      e.preventDefault();
      el.scrollTop += e.deltaY;
    };
    el.addEventListener("wheel", onWheel, { passive: false });
    return () => el.removeEventListener("wheel", onWheel);
  }, [alerts]);

  const onListMouseDown = (e: React.MouseEvent) => {
    const el = listRef.current;
    if (!el) return;
    drag.current = { active: true, startY: e.clientY, scrollTop: el.scrollTop };
    el.style.cursor = "grabbing";
    el.style.userSelect = "none";
  };

  const onListMouseMove = (e: React.MouseEvent) => {
    if (!drag.current.active) return;
    const el = listRef.current;
    if (!el) return;
    el.scrollTop = drag.current.scrollTop - (e.clientY - drag.current.startY);
  };

  const onListMouseUp = () => {
    drag.current.active = false;
    const el = listRef.current;
    if (!el) return;
    el.style.cursor = "grab";
    el.style.userSelect = "";
  };

  useEffect(() => {
    setSearchText(searchParams.get("t") ?? "");
  }, [searchParams]);

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(e.target as Node)
      ) {
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
              <circle
                cx="11"
                cy="11"
                r="8"
                stroke="currentColor"
                strokeWidth="2"
              />
              <path
                d="m21 21-4.35-4.35"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
              />
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
                  <path
                    d="M18 6 6 18M6 6l12 12"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                  />
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
            <svg
              width="20"
              height="20"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
            >
              <path
                d="M18 8A6 6 0 006 8c0 7-3 9-3 9h18s-3-2-3-9"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
              <path
                d="M13.73 21a2 2 0 01-3.46 0"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
            {waitingCount > 0 && (
              <span className={styles.bellBadge}>
                {waitingCount > 9 ? "9+" : waitingCount}
              </span>
            )}
          </button>

          {dropdownOpen && (
            <div className={styles.dropdown}>
              <div className={styles.dropdownHeader}>
                <span className={styles.dropdownTitle}>🔔 알림 등록 내역</span>
                <span className={styles.dropdownCount}>
                  {alerts.length}개 등록됨
                </span>
              </div>

              {alerts.length === 0 ? (
                <div className={styles.dropdownEmpty}>
                  <svg
                    width="32"
                    height="32"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="1.5"
                  >
                    <path
                      d="M18 8A6 6 0 006 8c0 7-3 9-3 9h18s-3-2-3-9"
                      strokeLinecap="round"
                    />
                    <path d="M13.73 21a2 2 0 01-3.46 0" strokeLinecap="round" />
                  </svg>
                  <p>등록된 알림이 없습니다</p>
                </div>
              ) : (
                <div className={`${styles.dropdownListWrap} ${hasMoreBelow ? styles.dropdownListFade : ""}`}>
                  {hasMoreBelow && (
                    <div className={styles.dropdownListHint}>
                      <svg width="12" height="12" viewBox="0 0 24 24" fill="none">
                        <path d="M6 9l6 6 6-6" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
                      </svg>
                    </div>
                  )}
                  <ul
                    ref={listRef}
                    className={styles.dropdownList}
                    onMouseDown={onListMouseDown}
                    onMouseMove={onListMouseMove}
                    onMouseUp={onListMouseUp}
                    onMouseLeave={onListMouseUp}
                  >
                    {alerts.map((alert) => (
                      <AlertDropdownItem
                        key={alert.id}
                        alert={alert}
                        onDelete={deleteAlert}
                      />
                    ))}
                  </ul>
                </div>
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
}: {
  alert: AlertRecord;
  onDelete: (id: string) => void;
}) {
  const openLink = () => window.open(alert.productLink, "_blank");

  return (
    <li className={styles.dropdownItem}>
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src={alert.productImage}
        alt={alert.productTitle}
        className={styles.dropdownThumb}
        onClick={openLink}
        style={{ cursor: "pointer" }}
        onError={(e) => {
          (e.target as HTMLImageElement).style.visibility = "hidden";
        }}
      />

      <div className={styles.dropdownInfo}>
        <p
          className={styles.dropdownName}
          onClick={openLink}
          style={{ cursor: "pointer" }}
        >
          {alert.productTitle}
        </p>

        <div className={styles.dropdownMeta}>
          <span
            className={`${styles.dropdownMethod} ${alert.notifyMethod === "message" ? styles.sms : ""}`}
          >
            {alert.notifyMethod === "email" ? "이메일" : "문자"}
          </span>
          <span className={styles.dropdownContact}>{alert.contact}</span>
        </div>

        <div className={styles.priceRow}>
          <span className={styles.dropdownPriceLabel}>목표가</span>
          <span className={styles.dropdownPrice}>
            ₩{alert.targetPrice.toLocaleString()}
          </span>
        </div>
      </div>

      <button
        className={styles.dropdownDel}
        onClick={() => onDelete(alert.id)}
        title="삭제"
      >
        <svg
          width="14"
          height="14"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
        >
          <path d="M18 6 6 18M6 6l12 12" strokeLinecap="round" />
        </svg>
      </button>
    </li>
  );
}
