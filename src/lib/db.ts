import { supabase } from "./supabase";

export interface AnnouncementRow {
  id: string;
  title: string;
  summary: string;
  body: string | null;
  category: string;
  published: boolean;
  published_at: string | null;
  created_at: string;
  updated_at: string;
  created_by: string | null;
}

export interface AgendaRow {
  id: string;
  date: string;
  title: string;
  description: string | null;
  category: string;
  created_at: string;
  updated_at: string;
  created_by: string | null;
}

export interface ScheduleRow {
  id: string;
  day: "Senin" | "Selasa" | "Rabu" | "Kamis" | "Jumat";
  time_start: string;
  time_end: string | null;
  subject: string;
  teacher: string | null;
  is_break: boolean;
  sort_order: number;
  created_at: string;
  updated_at: string;
}

export interface MemberRow {
  id: string;
  absen_no: number;
  name: string;
  position: string | null;
  created_at: string;
  updated_at: string;
}

export interface GalleryPhotoRow {
  id: string;
  title: string;
  description: string | null;
  category: string;
  date: string;
  image_url: string;
  storage_path: string;
  aspect: string;
  sort_order: number;
  created_at: string;
  updated_at: string;
  created_by: string | null;
}

export interface ProfileRow {
  id: string;
  name: string | null;
  image: string | null;
  email: string | null;
  role: "admin" | "member" | "owner";
  created_at: string;
  updated_at: string;
}

export interface OrganizationSettingsRow<T = unknown> {
  key: string;
  value: T;
  updated_at: string;
}

// ---------------------------------------------------------------------------
// Announcements API
// ---------------------------------------------------------------------------
export async function getAnnouncements(publishedOnly = true): Promise<AnnouncementRow[]> {
  let query = supabase
    .from("announcements")
    .select("*")
    .order("published_at", { ascending: false, nullsFirst: false })
    .order("created_at", { ascending: false });

  if (publishedOnly) {
    query = query.eq("published", true);
  }

  const { data, error } = await query;
  if (error) throw error;
  return data ?? [];
}

export async function createAnnouncement(payload: {
  title: string;
  summary: string;
  body?: string | null;
  category?: string;
  published?: boolean;
}): Promise<AnnouncementRow> {
  const { data: user } = await supabase.auth.getUser();
  const { data, error } = await supabase
    .from("announcements")
    .insert({
      title: payload.title,
      summary: payload.summary,
      body: payload.body ?? null,
      category: payload.category ?? "Umum",
      published: payload.published ?? false,
      published_at: payload.published ? new Date().toISOString() : null,
      created_by: user.user?.id ?? null,
    })
    .select()
    .single();

  if (error) throw error;
  return data;
}

export async function updateAnnouncement(
  id: string,
  payload: Partial<Omit<AnnouncementRow, "id" | "created_at" | "updated_at">>
): Promise<AnnouncementRow> {
  const patch: Record<string, unknown> = { ...payload };
  if (payload.published !== undefined && payload.published_at === undefined) {
    patch.published_at = payload.published ? new Date().toISOString() : null;
  }

  const { data, error } = await supabase
    .from("announcements")
    .update(patch)
    .eq("id", id)
    .select()
    .single();

  if (error) throw error;
  return data;
}

export async function deleteAnnouncement(id: string): Promise<void> {
  const { error } = await supabase.from("announcements").delete().eq("id", id);
  if (error) throw error;
}

// ---------------------------------------------------------------------------
// Agenda API
// ---------------------------------------------------------------------------
export async function getAgendaItems(): Promise<AgendaRow[]> {
  const { data, error } = await supabase
    .from("agenda_items")
    .select("*")
    .order("date", { ascending: true });

  if (error) throw error;
  return data ?? [];
}

export async function createAgendaItem(payload: {
  date: string;
  title: string;
  description?: string | null;
  category?: string;
}): Promise<AgendaRow> {
  const { data: user } = await supabase.auth.getUser();
  const { data, error } = await supabase
    .from("agenda_items")
    .insert({
      date: payload.date,
      title: payload.title,
      description: payload.description ?? null,
      category: payload.category ?? "Kegiatan",
      created_by: user.user?.id ?? null,
    })
    .select()
    .single();

  if (error) throw error;
  return data;
}

export async function updateAgendaItem(
  id: string,
  payload: Partial<Omit<AgendaRow, "id" | "created_at" | "updated_at">>
): Promise<AgendaRow> {
  const { data, error } = await supabase
    .from("agenda_items")
    .update(payload)
    .eq("id", id)
    .select()
    .single();

  if (error) throw error;
  return data;
}

export async function deleteAgendaItem(id: string): Promise<void> {
  const { error } = await supabase.from("agenda_items").delete().eq("id", id);
  if (error) throw error;
}

// ---------------------------------------------------------------------------
// Schedules API
// ---------------------------------------------------------------------------
export async function getSchedules(): Promise<ScheduleRow[]> {
  const { data, error } = await supabase
    .from("schedules")
    .select("*")
    .order("sort_order", { ascending: true })
    .order("time_start", { ascending: true });

  if (error) throw error;
  return data ?? [];
}

export async function createSchedule(payload: {
  day: "Senin" | "Selasa" | "Rabu" | "Kamis" | "Jumat";
  time_start: string;
  time_end?: string | null;
  subject: string;
  teacher?: string | null;
  is_break?: boolean;
  sort_order?: number;
}): Promise<ScheduleRow> {
  const { data, error } = await supabase
    .from("schedules")
    .insert({
      day: payload.day,
      time_start: payload.time_start,
      time_end: payload.time_end ?? null,
      subject: payload.subject,
      teacher: payload.teacher ?? null,
      is_break: payload.is_break ?? false,
      sort_order: payload.sort_order ?? 0,
    })
    .select()
    .single();

  if (error) throw error;
  return data;
}

export async function updateSchedule(
  id: string,
  payload: Partial<Omit<ScheduleRow, "id" | "created_at" | "updated_at">>
): Promise<ScheduleRow> {
  const { data, error } = await supabase
    .from("schedules")
    .update(payload)
    .eq("id", id)
    .select()
    .single();

  if (error) throw error;
  return data;
}

export async function deleteSchedule(id: string): Promise<void> {
  const { error } = await supabase.from("schedules").delete().eq("id", id);
  if (error) throw error;
}

// ---------------------------------------------------------------------------
// Members API
// ---------------------------------------------------------------------------
export async function getMembers(): Promise<MemberRow[]> {
  const { data, error } = await supabase
    .from("members")
    .select("*")
    .order("absen_no", { ascending: true });

  if (error) throw error;
  return data ?? [];
}

export async function createMember(payload: {
  absen_no: number;
  name: string;
  position?: string | null;
}): Promise<MemberRow> {
  const { data, error } = await supabase
    .from("members")
    .insert({
      absen_no: payload.absen_no,
      name: payload.name,
      position: payload.position ?? null,
    })
    .select()
    .single();

  if (error) throw error;
  return data;
}

export async function updateMember(
  id: string,
  payload: Partial<Omit<MemberRow, "id" | "created_at" | "updated_at">>
): Promise<MemberRow> {
  const { data, error } = await supabase
    .from("members")
    .update(payload)
    .eq("id", id)
    .select()
    .single();

  if (error) throw error;
  return data;
}

export async function deleteMember(id: string): Promise<void> {
  const { error } = await supabase.from("members").delete().eq("id", id);
  if (error) throw error;
}

// ---------------------------------------------------------------------------
// Gallery Photos API
// ---------------------------------------------------------------------------
export async function getGalleryPhotos(): Promise<GalleryPhotoRow[]> {
  const { data, error } = await supabase
    .from("gallery_photos")
    .select("*")
    .order("date", { ascending: false })
    .order("created_at", { ascending: false });

  if (error) throw error;
  return data ?? [];
}

export async function createGalleryPhoto(payload: {
  title: string;
  description?: string | null;
  category?: string;
  date?: string;
  image_url: string;
  storage_path: string;
  aspect?: string;
  sort_order?: number;
}): Promise<GalleryPhotoRow> {
  const { data: user } = await supabase.auth.getUser();
  const { data, error } = await supabase
    .from("gallery_photos")
    .insert({
      title: payload.title,
      description: payload.description ?? null,
      category: payload.category ?? "Dokumentasi",
      date: payload.date ?? new Date().toISOString().slice(0, 10),
      image_url: payload.image_url,
      storage_path: payload.storage_path,
      aspect: payload.aspect ?? "4 / 3",
      sort_order: payload.sort_order ?? 0,
      created_by: user.user?.id ?? null,
    })
    .select()
    .single();

  if (error) throw error;
  return data;
}

export async function updateGalleryPhoto(
  id: string,
  payload: Partial<Omit<GalleryPhotoRow, "id" | "created_at" | "updated_at">>
): Promise<GalleryPhotoRow> {
  const { data, error } = await supabase
    .from("gallery_photos")
    .update(payload)
    .eq("id", id)
    .select()
    .single();

  if (error) throw error;
  return data;
}

export async function deleteGalleryPhoto(id: string): Promise<void> {
  const { error } = await supabase.from("gallery_photos").delete().eq("id", id);
  if (error) throw error;
}

// ---------------------------------------------------------------------------
// Organization Settings API
// ---------------------------------------------------------------------------
export async function getOrganizationSetting<T = unknown>(key: string): Promise<T | null> {
  const { data, error } = await supabase
    .from("organization_settings")
    .select("value")
    .eq("key", key)
    .maybeSingle();

  if (error) throw error;
  return (data?.value as T) ?? null;
}

export async function setOrganizationSetting<T = unknown>(key: string, value: T): Promise<void> {
  const { error } = await supabase
    .from("organization_settings")
    .upsert({
      key,
      value: value as unknown as Record<string, unknown>,
      updated_at: new Date().toISOString(),
    }, { onConflict: "key" });

  if (error) throw error;
}

// ---------------------------------------------------------------------------
// Profiles / User Management API (Owner Only)
// ---------------------------------------------------------------------------
export async function getAllProfiles(): Promise<ProfileRow[]> {
  const { data, error } = await supabase
    .from("profiles")
    .select("*")
    .order("created_at", { ascending: false });

  if (error) throw error;
  return data ?? [];
}

export async function updateProfileRole(
  userId: string,
  role: "admin" | "member" | "owner"
): Promise<ProfileRow> {
  const { data, error } = await supabase
    .from("profiles")
    .update({ role, updated_at: new Date().toISOString() })
    .eq("id", userId)
    .select()
    .single();

  if (error) throw error;
  return data;
}

// ---------------------------------------------------------------------------
// User Preferences API (per-user settings JSONB in profiles.settings)
// ---------------------------------------------------------------------------
export async function getUserSettings<T = Record<string, unknown>>(
  userId: string
): Promise<T | null> {
  const { data, error } = await supabase
    .from("profiles")
    .select("settings")
    .eq("id", userId)
    .maybeSingle();

  if (error) throw error;
  const settings = data?.settings;
  if (!settings || (typeof settings === "object" && Object.keys(settings as object).length === 0)) {
    return null;
  }
  return settings as T;
}

export async function updateUserSettings<T = Record<string, unknown>>(
  userId: string,
  settings: T
): Promise<void> {
  const { error } = await supabase
    .from("profiles")
    .update({
      settings: settings as unknown as Record<string, unknown>,
      updated_at: new Date().toISOString(),
    })
    .eq("id", userId);

  if (error) throw error;
}
