"use client";

import dynamic from "next/dynamic";

const CompleteProfileModal = dynamic(
  () => import("@/components/CompleteProfileModal"),
  { ssr: false }
);

export default function ProfileModalWrapper() {
  return <CompleteProfileModal />;
}
