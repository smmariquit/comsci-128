import { Suspense } from "react";
import ForgotPasswordContent from "./_components/forgot-password-content";

export default function ForgotPasswordPage() {
  return (
    <Suspense>
      <ForgotPasswordContent />
    </Suspense>
  );
}
