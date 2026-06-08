"use client";
import { useState, useRef, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { useQueryClient } from "@tanstack/react-query";
import styles from "./Header.module.scss";

export default function Header() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const queryClient = useQueryClient();

  const [searchText, setSearchText] = useState(searchParams.get("t") ?? "");
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    setSearchText(searchParams.get("t") ?? "");
  }, [searchParams]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!searchText.trim()) return;

    window.scrollTo({ top: 0 });

    const params = new URLSearchParams(searchParams.toString());
    params.set("t", searchText.trim());

    router.replace(`?${params.toString()}`);
    // queryClient.invalidateQueries({ queryKey: ["getProductListuctList"] });
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
      </div>
    </header>
  );
}
