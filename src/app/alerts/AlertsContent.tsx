"use client";
import { useState } from "react";
import Link from "next/link";
import styles from "./alerts.module.scss";
import { useAlerts } from "@/hooks/useAlerts";
import type { AlertRecord } from "@/types";

type FilterType = "all" | "email" | "message" | "waiting" | "done";

export default function AlertsContent() {
  const { alerts, deleteAlert } = useAlerts();
  const [filter, setFilter] = useState<FilterType>("all");

  const filtered = alerts.filter((a) => {
    if (filter === "all") return true;
    if (filter === "email") return a.notifyMethod === "email";
    if (filter === "message") return a.notifyMethod === "message";
    if (filter === "waiting") return a.status === "waiting";
    if (filter === "done") return a.status === "done";
    return true;
  });

  const FILTERS: { value: FilterType; label: string }[] = [
    { value: "all", label: "전체" },
    { value: "email", label: "이메일" },
    { value: "message", label: "문자" },
    { value: "waiting", label: "대기중" },
    { value: "done", label: "완료" },
  ];

  return (
    <div className={styles.page}>
      <div className={styles.container}>
        {/* 상단 뒤로가기 + 제목 */}
        <div className={styles.pageHeader}>
          <Link href="/" className={styles.backBtn}>
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M19 12H5M12 5l-7 7 7 7" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
            돌아가기
          </Link>
          <div>
            <h1 className={styles.title}>🔔 내 알림 내역</h1>
            <p className={styles.subtitle}>총 {alerts.length}개 등록됨</p>
          </div>
        </div>

        {/* 필터 칩 */}
        <div className={styles.filterRow}>
          {FILTERS.map((f) => (
            <button
              key={f.value}
              className={`${styles.filterChip} ${filter === f.value ? styles.active : ""}`}
              onClick={() => setFilter(f.value)}
            >
              {f.label}
            </button>
          ))}
        </div>

        {/* 목록 */}
        {filtered.length === 0 ? (
          <div className={styles.empty}>
            <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
              <path d="M18 8A6 6 0 006 8c0 7-3 9-3 9h18s-3-2-3-9" strokeLinecap="round" />
              <path d="M13.73 21a2 2 0 01-3.46 0" strokeLinecap="round" />
            </svg>
            <p>등록된 알림이 없습니다</p>
          </div>
        ) : (
          <ul className={styles.list}>
            {filtered.map((alert) => (
              <AlertCard key={alert.id} alert={alert} onDelete={deleteAlert} />
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}

function AlertCard({
  alert,
  onDelete,
}: {
  alert: AlertRecord;
  onDelete: (id: string) => void;
}) {
  const achieveRate = Math.min(
    100,
    Math.round(
      ((alert.currentPrice - alert.targetPrice) /
        (alert.currentPrice - alert.targetPrice * 0.5)) *
        100,
    ),
  );

  // 목표가 대비 현재가 달성률 (현재가 → 목표가 얼마나 왔는지)
  // currentPrice 기준으로 targetPrice에 가까울수록 100%
  const progressRate = Math.min(
    100,
    Math.max(
      0,
      Math.round(
        ((alert.currentPrice - alert.targetPrice) / alert.currentPrice) * 100 * 10,
      ),
    ),
  );

  const isDone = alert.status === "done";

  return (
    <li className={`${styles.card} ${isDone ? styles.cardDone : ""}`}>
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src={alert.productImage}
        alt={alert.productTitle}
        className={styles.thumb}
        onError={(e) => { (e.target as HTMLImageElement).src = "/placeholder.png"; }}
      />

      <div className={styles.cardInfo}>
        <p className={styles.cardName}>{alert.productTitle}</p>

        <div className={styles.badgeRow}>
          <span className={`${styles.badge} ${alert.notifyMethod === "email" ? styles.badgeEmail : styles.badgeSms}`}>
            {alert.notifyMethod === "email" ? "이메일" : "문자"}
          </span>
          <span className={`${styles.badge} ${isDone ? styles.badgeDone : styles.badgeWaiting}`}>
            {isDone ? "알림발송완료" : "대기중"}
          </span>
        </div>

        <div className={styles.priceRow}>
          <span className={styles.targetPrice}>₩{alert.targetPrice.toLocaleString()}</span>
          <span className={styles.currentPrice}>
            등록 시 현재가 ₩{alert.currentPrice.toLocaleString()}
          </span>
        </div>

        {!isDone && (
          <div className={styles.progressWrap}>
            <div className={styles.progressLabel}>
              <span>가격 할인율</span>
              <span>{Math.round((1 - alert.targetPrice / alert.currentPrice) * 100)}%</span>
            </div>
            <div className={styles.progressBar}>
              <div
                className={styles.progressFill}
                style={{ width: `${Math.round((1 - alert.targetPrice / alert.currentPrice) * 100)}%` }}
              />
            </div>
          </div>
        )}

        <p className={styles.registeredAt}>
          {new Date(alert.registeredAt).toLocaleDateString("ko-KR", {
            year: "numeric",
            month: "long",
            day: "numeric",
            hour: "2-digit",
            minute: "2-digit",
          })} 등록
        </p>
      </div>

      <div className={styles.cardActions}>
        <button className={styles.delBtn} onClick={() => onDelete(alert.id)}>
          삭제
        </button>
      </div>
    </li>
  );
}
