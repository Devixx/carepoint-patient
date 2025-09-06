// src/app/loading.tsx
import CareLoader from "@/components/ui/CareLoader";

export default function GlobalLoading() {
  return <CareLoader variant="full" message="Preparing your patient portal" />;
}
