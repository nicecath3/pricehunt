"use client";
import { useState, useEffect, useCallback } from "react";
import type { AlertRecord } from "@/types";
import { getAlerts, deleteAlert as deleteAlertStorage } from "@/lib/alertStorage";

export function useAlerts() {
  const [alerts, setAlerts] = useState<AlertRecord[]>([]);

  const reload = useCallback(() => {
    setAlerts(getAlerts());
  }, []);

  useEffect(() => {
    reload();
    // storage 이벤트: 다른 탭에서 변경될 때도 반영
    window.addEventListener("storage", reload);
    return () => window.removeEventListener("storage", reload);
  }, [reload]);

  const deleteAlert = useCallback(
    (id: string) => {
      deleteAlertStorage(id);
      reload();
    },
    [reload],
  );

  return { alerts, deleteAlert, reload };
}
