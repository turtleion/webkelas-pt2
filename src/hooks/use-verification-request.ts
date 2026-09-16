import { useCallback, useEffect, useState } from "react";
import {
  acceptAgreement,
  getMyVerificationRequest,
  submitVerificationRequest,
  type VerificationRequestRow,
} from "@/lib/db";

/**
 * State permintaan verifikasi user + aksi "Notify Admin" yang dipakai
 * bersama oleh WelcomeModal dan VerificationWarningBar.
 *
 * - getMyVerificationRequest: ambil request terbaru (pending/accepted/declined).
 * - requestVerification: alur Notify Admin — pastikan persetujuan
 *   ToS/Privasi tersimpan, lalu submit request (idempotent di server).
 */
export function useVerificationRequest() {
  const [request, setRequest] = useState<VerificationRequestRow | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const refresh = useCallback(async () => {
    try {
      const row = await getMyVerificationRequest();
      setRequest(row);
    } catch {
      setRequest(null);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    void refresh();
  }, [refresh]);

  const requestVerification = useCallback(
    async (user: {
      id: string;
      acceptedTosAt?: string | null;
      acceptedPrivacyAt?: string | null;
    }) => {
      setIsSubmitting(true);
      try {
        if (!user.acceptedTosAt) await acceptAgreement(user.id, "tos");
        if (!user.acceptedPrivacyAt) await acceptAgreement(user.id, "privacy");
        const row = await submitVerificationRequest();
        setRequest(row);
        return row;
      } finally {
        setIsSubmitting(false);
      }
    },
    [],
  );

  return {
    request,
    isLoading,
    isSubmitting,
    refresh,
    requestVerification,
  };
}