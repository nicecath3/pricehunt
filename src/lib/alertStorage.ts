import type { AlertRecord } from "@/types";

const KEY = "pricehunt_alerts";

export function getAlerts(): AlertRecord[] {
  if (typeof window === "undefined") return [];
  try {
    return JSON.parse(localStorage.getItem(KEY) ?? "[]");
  } catch {
    return [];
  }
}

export function saveAlert(record: Omit<AlertRecord, "id" | "registeredAt">): AlertRecord {
  const alerts = getAlerts();
  const newRecord: AlertRecord = {
    ...record,
    id: `${Date.now()}-${Math.random().toString(36).slice(2, 7)}`,
    registeredAt: new Date().toISOString(),
  };
  localStorage.setItem(KEY, JSON.stringify([newRecord, ...alerts]));
  return newRecord;
}

export function deleteAlert(id: string): void {
  const alerts = getAlerts().filter((a) => a.id !== id);
  localStorage.setItem(KEY, JSON.stringify(alerts));
}

export function updateAlertStatus(id: string, status: AlertRecord["status"]): void {
  const alerts = getAlerts().map((a) => (a.id === id ? { ...a, status } : a));
  localStorage.setItem(KEY, JSON.stringify(alerts));
}
