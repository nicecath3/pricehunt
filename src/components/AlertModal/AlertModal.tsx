"use client";
import { useState, useEffect } from "react";
import styles from "./AlertModal.module.scss";
import type { Product, AlertFormData } from "@/types";
import { validateEmail, validatePhone } from "@/lib/validate";

interface AlertModalProps {
  product: Product;
  onClose: () => void;
}

type NotifyMethod = "email" | "message" | "";

export default function AlertModal({ product, onClose }: AlertModalProps) {
  const [targetPrice, setTargetPrice] = useState(
    Math.round(product.currentPrice * 0.9).toLocaleString(),
  );
  const [notifyMethod, setNotifyMethod] = useState<NotifyMethod>("");
  const [email, setEmail] = useState("");
  const [emailError, setEmailError] = useState("");
  const [phone, setPhone] = useState("");
  const [phoneError, setPhoneError] = useState("");
  const [error, setError] = useState("");
  const [submitted, setSubmitted] = useState(false);

  useEffect(() => {
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", handleKey);
    return () => window.removeEventListener("keydown", handleKey);
  }, [onClose]);

  const targetNum = parseInt(targetPrice.replace(/,/g, "")) || 0;
  const discount =
    targetNum > 0
      ? Math.round((1 - targetNum / product.currentPrice) * 100)
      : 0;

  const handleTargetChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const raw = e.target.value.replace(/[^0-9]/g, "");
    setTargetPrice(raw ? parseInt(raw).toLocaleString() : "");
    setError("");
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!targetNum) {
      setError("목표 가격을 입력해주세요.");
      return;
    }

    if (targetNum >= product.currentPrice) {
      setError("목표 가격은 현재가보다 낮아야 합니다.");
      return;
    }

    if (!notifyMethod) {
      setError("알림 방법을 선택해주세요.");
      return;
    }

    if (notifyMethod === "email") {
      const err = email ? validateEmail(email) : "이메일 주소를 입력해주세요.";
      if (err) {
        setEmailError(err);
        return;
      }
    }
    if (notifyMethod === "message") {
      const err = phone ? validatePhone(phone) : "전화번호를 입력해주세요.";
      if (err) {
        setPhoneError(err);
        return;
      }
    }

    setSubmitted(true);
  };

  if (submitted) {
    return (
      <div className={styles.overlay} onClick={onClose}>
        <div className={styles.modal} onClick={(e) => e.stopPropagation()}>
          <div className={styles.successContent}>
            <div className={styles.successIcon}>
              <svg width="32" height="32" viewBox="0 0 24 24" fill="none">
                <circle
                  cx="12"
                  cy="12"
                  r="12"
                  fill="var(--color-primary, #3b82f6)"
                  opacity="0.12"
                />
                <path
                  d="M7 12.5l3.5 3.5 6.5-7"
                  stroke="var(--color-primary, #3b82f6)"
                  strokeWidth="2.2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </div>
            <h3 className={styles.successTitle}>알림 신청 완료!</h3>
            <p className={styles.successDesc}>
              목표 가격{" "}
              <strong>
                {parseInt(targetPrice.replace(/,/g, "")).toLocaleString()}원
              </strong>{" "}
              도달 시<br />
              {notifyMethod === "email" ? `${email}로 이메일` : "문자"}을
              보내드립니다.
            </p>
            <button className={styles.submitBtn} onClick={onClose}>
              확인
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className={styles.overlay} onClick={onClose}>
      <div className={styles.modal} onClick={(e) => e.stopPropagation()}>
        <div className={styles.header}>
          <div>
            <h3 className={styles.title}>가격 알림 설정</h3>
            <p className={styles.subtitle}>
              목표 가격 도달 시 알림을 보내드립니다
            </p>
          </div>
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

        <div className={styles.productInfo}>
          <p className={styles.productName}>{product.title}</p>
          <p className={styles.productPrice}>
            현재가 <strong>{product.currentPrice.toLocaleString()}원</strong>
          </p>
        </div>

        <form onSubmit={handleSubmit} className={styles.form}>
          <div className={styles.field}>
            <label className={styles.label}>목표 가격</label>
            <div className={styles.priceInputWrap}>
              <input
                type="text"
                className={styles.priceInput}
                value={targetPrice}
                onChange={handleTargetChange}
                placeholder="예: 1,000,000"
                inputMode="numeric"
              />
              <span className={styles.priceUnit}>원</span>
            </div>
            {targetNum > 0 && targetNum < product.currentPrice && (
              <p className={styles.discountHint}>
                현재가 대비 {discount}% (
                {(product.currentPrice - targetNum).toLocaleString()}원) 할인
              </p>
            )}
          </div>

          <div className={styles.field}>
            <label className={styles.label}>알림 방법</label>

            <div className={styles.checkGroup}>
              <label className={styles.checkLabel}>
                <input
                  type="radio"
                  name="notifyMethod"
                  checked={notifyMethod === "email"}
                  onChange={() => {
                    setNotifyMethod("email");
                    setError("");
                  }}
                />
                <span className={styles.radioCircle} />
                <span>이메일 알림</span>
              </label>

              <label className={styles.checkLabel}>
                <input
                  type="radio"
                  name="notifyMethod"
                  checked={notifyMethod === "message"}
                  onChange={() => {
                    setNotifyMethod("message");
                    setError("");
                  }}
                />
                <span className={styles.radioCircle} />
                <span>문자 알림</span>
              </label>
            </div>
          </div>

          {notifyMethod === "email" && (
            <div className={styles.field}>
              <label className={styles.label}>이메일 주소</label>
              <input
                type="text"
                className={`${styles.textInput} ${emailError ? styles.inputError : ""}`}
                value={email}
                onChange={(e) => {
                  const v = e.target.value;
                  setEmail(v);
                  setEmailError(validateEmail(v));
                  setError("");
                }}
                placeholder="example@email.com"
              />
              {emailError && <p className={styles.fieldError}>{emailError}</p>}
            </div>
          )}

          {notifyMethod === "message" && (
            <div className={styles.field}>
              <label className={styles.label}>전화번호</label>
              <input
                type="tel"
                className={`${styles.textInput} ${phoneError ? styles.inputError : ""}`}
                value={phone}
                onChange={(e) => {
                  const v = e.target.value.replace(/[^0-9]/g, "");
                  setPhone(v);
                  setPhoneError(validatePhone(v));
                  setError("");
                }}
                placeholder="01012345678"
                maxLength={11}
                inputMode="numeric"
              />
              {phoneError && <p className={styles.fieldError}>{phoneError}</p>}
            </div>
          )}

          {error && <p className={styles.error}>{error}</p>}

          <div className={styles.actions}>
            <button
              type="button"
              className={styles.cancelBtn}
              onClick={onClose}
            >
              취소
            </button>
            <button type="submit" className={styles.submitBtn}>
              알림 신청
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
