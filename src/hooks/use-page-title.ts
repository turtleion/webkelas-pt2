import { useEffect } from "react";

/** Set judul tab browser per halaman, dengan akhiran identitas kelas. */
export function usePageTitle(halaman: string) {
  useEffect(() => {
    document.title = `${halaman} — X TKJ 1 · SMK Negeri 1 Cerme`;
  }, [halaman]);
}
