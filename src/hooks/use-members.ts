import { useEffect, useState, useCallback } from "react";
import {
  getMembers,
  createMember,
  updateMember,
  deleteMember,
  type MemberRow,
} from "@/lib/db";
import { anggota as mockAnggota } from "@/data/kelas";

export function useMembers() {
  const [data, setData] = useState<MemberRow[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchMembers = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const rows = await getMembers();
      if (rows.length === 0) {
        const fallback: MemberRow[] = mockAnggota.map((a) => ({
          id: `mock-${a.no}`,
          absen_no: a.no,
          name: a.nama,
          position: a.jabatan ?? null,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
        }));
        setData(fallback);
      } else {
        setData(rows);
      }
    } catch (err) {
      console.warn("[useMembers] fallback ke mock karena query gagal:", err);
      const fallback: MemberRow[] = mockAnggota.map((a) => ({
        id: `mock-${a.no}`,
        absen_no: a.no,
        name: a.nama,
        position: a.jabatan ?? null,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      }));
      setData(fallback);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    void fetchMembers();
  }, [fetchMembers]);

  return {
    data,
    isLoading,
    error,
    refresh: fetchMembers,
    create: createMember,
    update: updateMember,
    remove: deleteMember,
  };
}
