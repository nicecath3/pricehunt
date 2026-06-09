"use client";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { CAT_ICONS, SORT_OPTIONS } from "@/components/Sidebar/support";
import styles from "./Sidebar.module.scss";
import { useState, useRef, useEffect } from "react";

interface SidebarProps {
  categories?: string[];
}

export default function Sidebar({ categories = [] }: SidebarProps) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const sort = searchParams.get("s") ?? "sim";
  const [category, setCategory] = useState("전체");

  const updateParam = (key: string, value: string) => {
    const params = new URLSearchParams(searchParams.toString());

    window.scrollTo({ top: 0 });
    setCategory("전체");

    params.set(key, value);
    router.replace(`${pathname}?${params.toString()}`);
  };

  const allCategories = ["전체", ...categories];

  const catListRef = useRef<HTMLUListElement>(null);
  const drag = useRef({ active: false, startY: 0, scrollTop: 0 });
  const [hasMoreBelow, setHasMoreBelow] = useState(false);

  useEffect(() => {
    const el = catListRef.current;
    if (!el) return;
    const check = () => {
      setHasMoreBelow(el.scrollTop + el.clientHeight < el.scrollHeight - 2);
    };
    check();
    el.addEventListener("scroll", check);
    return () => el.removeEventListener("scroll", check);
  }, [categories]);

  const onMouseDown = (e: React.MouseEvent) => {
    const el = catListRef.current;
    if (!el) return;
    drag.current = { active: true, startY: e.clientY, scrollTop: el.scrollTop };
    el.style.cursor = "grabbing";
    el.style.userSelect = "none";
  };

  const onMouseMove = (e: React.MouseEvent) => {
    if (!drag.current.active) return;
    const el = catListRef.current;
    if (!el) return;
    el.scrollTop = drag.current.scrollTop - (e.clientY - drag.current.startY);
  };

  const onMouseUp = () => {
    drag.current.active = false;
    const el = catListRef.current;
    if (!el) return;
    el.style.cursor = "grab";
    el.style.userSelect = "";
  };

  useEffect(() => {
    const el = catListRef.current;
    if (!el) return;
    const onWheel = (e: WheelEvent) => {
      e.preventDefault();
      el.scrollTop += e.deltaY;
    };
    el.addEventListener("wheel", onWheel, { passive: false });
    return () => el.removeEventListener("wheel", onWheel);
  }, [categories]);

  return (
    <aside className={styles.sidebar}>
      <>
        <section className={styles.section}>
          <h3 className={styles.sectionTitle}>카테고리</h3>
          <div
            className={`${styles.catListWrap} ${hasMoreBelow ? styles.catListFade : ""}`}
          >
            {hasMoreBelow && (
              <div className={styles.catListHint}>
                <svg width="12" height="12" viewBox="0 0 24 24" fill="none">
                  <path
                    d="M6 9l6 6 6-6"
                    stroke="currentColor"
                    strokeWidth="2.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              </div>
            )}
            <ul
              ref={catListRef}
              className={styles.catList}
              onMouseDown={onMouseDown}
              onMouseMove={onMouseMove}
              onMouseUp={onMouseUp}
              onMouseLeave={onMouseUp}
            >
              {allCategories.map((cat) => (
                <li key={cat}>
                  <button
                    className={`${styles.catBtn} ${cat === category ? styles.active : ""}`}
                    onClick={() => setCategory(cat)}
                  >
                    <span className={styles.catIcon}>
                      {CAT_ICONS[cat] || "•"}
                    </span>
                    <span className={styles.catLabel}>{cat}</span>
                  </button>
                </li>
              ))}
            </ul>
          </div>
        </section>
        <div className={styles.divider} />
      </>

      <section className={styles.section}>
        <h3 className={styles.sectionTitle}>정렬</h3>
        <ul className={styles.sortList}>
          {SORT_OPTIONS.map((opt) => (
            <li key={opt.value}>
              <button
                className={`${styles.sortBtn} ${opt.value === sort ? styles.active : ""}`}
                onClick={() => updateParam("s", opt.value)}
              >
                <span
                  className={`${styles.radio} ${opt.value === sort ? styles.radioActive : ""}`}
                />
                <div>
                  <span className={styles.sortLabel}>{opt.label}</span>
                  <span className={styles.sortDesc}>{opt.desc}</span>
                </div>
              </button>
            </li>
          ))}
        </ul>
      </section>
    </aside>
  );
}
