import { Suspense } from "react";
import ForgotPasswordContent from "./_components/forgot-password-content";

export default function ForgotPasswordPage() {
  return (
    <Suspense fallback={<div className="w-full min-h-screen bg-gray-950" />}>
      <ForgotPasswordContent />
    </Suspense>
  );
}
