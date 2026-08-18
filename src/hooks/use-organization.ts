import { useEffect, useState, useCallback } from "react";
import {
  getOrganizationSetting,
  setOrganizationSetting,
} from "@/lib/db";
import {
  kelas as mockKelas,
  pengurusInti as mockPengurusInti,
  sie as mockSie,
  type KelasInfo,
  type Pengurus,
} from "@/data/kelas";

export interface OrganizationData {
  kelas: KelasInfo;
  pengurusInti: Pengurus[];
  sie: Pengurus[];
}

export const ORG_SETTINGS_KEY = "organization_data";

export function useOrganization() {
  const [data, setData] = useState<OrganizationData>({
    kelas: mockKelas,
    pengurusInti: mockPengurusInti,
    sie: mockSie,
  });
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchOrganization = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const stored = await getOrganizationSetting<OrganizationData>(ORG_SETTINGS_KEY);
      if (stored && stored.kelas) {
        setData(stored);
      } else {
        // Default ke mock
        setData({
          kelas: mockKelas,
          pengurusInti: mockPengurusInti,
          sie: mockSie,
        });
      }
    } catch (err) {
      console.warn("[useOrganization] fallback ke mock karena query gagal:", err);
      setData({
        kelas: mockKelas,
        pengurusInti: mockPengurusInti,
        sie: mockSie,
      });
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    void fetchOrganization();
  }, [fetchOrganization]);

  const saveOrganization = useCallback(async (newData: OrganizationData) => {
    await setOrganizationSetting(ORG_SETTINGS_KEY, newData);
    setData(newData);
  }, []);

  return {
    data,
    isLoading,
    error,
    refresh: fetchOrganization,
    save: saveOrganization,
  };
}
