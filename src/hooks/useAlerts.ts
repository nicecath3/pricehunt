"use client";
import { useState, useEffect, useCallback } from "react";
import type { AlertRecord } from "@/types";
import { getAlerts, deleteAlert as deleteAlertStorage, updateAlertTargetPrice, ALERT_CHANGE_EVENT } from "@/lib/alertStorage";

export function useAlerts() {
  const [alerts, setAlerts] = useState<AlertRecord[]>([]);

  const reload = useCallback(() => {
    setAlerts(getAlerts());
  }, []);

  useEffect(() => {
    reload();
    // storage 이벤트: 다른 탭에서 변경될 때 반영
    window.addEventListener("storage", reload);
    // 커스텀 이벤트: 같은 탭에서 변경될 때 반영
    window.addEventListener(ALERT_CHANGE_EVENT, reload);
    return () => {
      window.removeEventListener("storage", reload);
      window.removeEventListener(ALERT_CHANGE_EVENT, reload);
    };
  }, [reload]);

  const deleteAlert = useCallback(
    (id: string) => {
      deleteAlertStorage(id);
      reload();
    },
    [reload],
  );

  const updateTargetPrice = useCallback(
    (id: string, price: number) => {
      updateAlertTargetPrice(id, price);
      reload();
    },
    [reload],
  );

  return { alerts, deleteAlert, updateTargetPrice, reload };
}
