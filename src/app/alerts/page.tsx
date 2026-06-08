import { Suspense } from "react";
import AlertsContent from "./AlertsContent";

export default function AlertsPage() {
  return (
    <Suspense>
      <AlertsContent />
    </Suspense>
  );
}
