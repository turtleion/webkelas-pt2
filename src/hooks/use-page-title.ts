import { useEffect } from "react";
import { useOrganization } from "./use-organization";

/** Set judul tab browser per halaman, dengan akhiran dinamis identitas kelas. */
export function usePageTitle(halaman: string) {
  const { data: orgData } = useOrganization();
  const { kelas } = orgData;

  useEffect(() => {
    const identitas = [kelas.nama, kelas.sekolah].filter(Boolean).join(" · ");
    document.title = identitas ? `${halaman} — ${identitas}` : halaman;
  }, [halaman, kelas.nama, kelas.sekolah]);
}
