import { supabase } from "./supabase";

export interface TaskRow {
  id: string;
  date: string;
  title: string;
  description: string | null;
  category: string;
  subject: string;
  completed: boolean;
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

export interface ArticleRow {
  id: string;
  slug: string;
  title: string;
  description: string;
  content: string;
  cover_url: string;
  is_pinned: boolean;
  published: boolean;
  published_at: string | null;
  created_at: string;
  updated_at: string;
  created_by: string | null;
}

export interface MbgScheduleRow {
  id: string;
  day: string;
  date: string;
  menu: string;
  notes: string | null;
  created_at: string;
  updated_at: string;
}

export interface DutyScheduleRow {
  id: string;
  day: string;
  date: string;
  group_name: string;
  members: string[];
  area: string;
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
  verified: boolean;
  created_at: string;
  updated_at: string;
}

export interface OrganizationSettingsRow<T = unknown> {
  key: string;
  value: T;
  updated_at: string;
}


// ---------------------------------------------------------------------------
// Task API (`tugas` table, used by /tugas)
// ---------------------------------------------------------------------------
export async function getTasks(): Promise<TaskRow[]> {
  const { data, error } = await supabase
    .from("tugas")
    .select("*")
    .order("date", { ascending: true });

  if (error) throw error;
  return (data as TaskRow[]) ?? [];
}

export async function createTask(payload: {
  date: string;
  title: string;
  description?: string | null;
  category?: string;
  subject?: string;
  completed?: boolean;
}): Promise<TaskRow> {
  const { data: user } = await supabase.auth.getUser();
  const { data, error } = await supabase
    .from("tugas")
    .insert({
      date: payload.date,
      title: payload.title,
      description: payload.description ?? null,
      category: payload.category ?? "Kegiatan",
      subject: payload.subject ?? "Umum",
      completed: payload.completed ?? false,
      created_by: user.user?.id ?? null,
    })
    .select()
    .single();

  if (error) throw error;
  return data;
}

export async function updateTask(
  id: string,
  payload: Partial<Omit<TaskRow, "id" | "created_at" | "updated_at">>,
): Promise<TaskRow> {
  const { data, error } = await supabase
    .from("tugas")
    .update(payload)
    .eq("id", id)
    .select()
    .single();

  if (error) throw error;
  return data;
}

export async function deleteTask(id: string): Promise<void> {
  const { error } = await supabase.from("tugas").delete().eq("id", id);
  if (error) throw error;
}

// ---------------------------------------------------------------------------
// Agenda API (dedicated `agenda` table, used by /agenda)
// ---------------------------------------------------------------------------
export async function getAgendaItems(): Promise<AgendaRow[]> {
  const { data, error } = await supabase
    .from("agenda")
    .select("*")
    .order("date", { ascending: true });

  if (error) throw error;
  return (data as AgendaRow[]) ?? [];
}

export async function createAgendaItem(payload: {
  date: string;
  title: string;
  description?: string | null;
  category?: string;
}): Promise<AgendaRow> {
  const { data: user } = await supabase.auth.getUser();
  const { data, error } = await supabase
    .from("agenda")
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
  payload: Partial<Omit<AgendaRow, "id" | "created_at" | "updated_at">>,
): Promise<AgendaRow> {
  const { data, error } = await supabase
    .from("agenda")
    .update(payload)
    .eq("id", id)
    .select()
    .single();

  if (error) throw error;
  return data;
}

export async function deleteAgendaItem(id: string): Promise<void> {
  const { error } = await supabase.from("agenda").delete().eq("id", id);
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
  payload: Partial<Omit<ScheduleRow, "id" | "created_at" | "updated_at">>,
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
  payload: Partial<Omit<MemberRow, "id" | "created_at" | "updated_at">>,
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
  payload: Partial<Omit<GalleryPhotoRow, "id" | "created_at" | "updated_at">>,
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
// Articles API
// ---------------------------------------------------------------------------
export async function getArticles(publishedOnly = true): Promise<ArticleRow[]> {
  let query = supabase
    .from("articles")
    .select("*")
    .order("is_pinned", { ascending: false })
    .order("published_at", { ascending: false, nullsFirst: false })
    .order("created_at", { ascending: false });

  if (publishedOnly) {
    query = query.eq("published", true);
  }

  const { data, error } = await query;
  if (error) throw error;
  return data ?? [];
}

export async function getArticleBySlug(slug: string): Promise<ArticleRow | null> {
  const { data, error } = await supabase
    .from("articles")
    .select("*")
    .eq("slug", slug)
    .eq("published", true)
    .maybeSingle();
  if (error) throw error;
  return data;
}

export async function createArticle(payload: {
  slug: string;
  title: string;
  description: string;
  content: string;
  cover_url?: string;
  is_pinned?: boolean;
  published?: boolean;
}): Promise<ArticleRow> {
  const { data: user } = await supabase.auth.getUser();
  const { data, error } = await supabase
    .from("articles")
    .insert({
      slug: payload.slug,
      title: payload.title,
      description: payload.description,
      content: payload.content,
      cover_url: payload.cover_url ?? "",
      is_pinned: payload.is_pinned ?? false,
      published: payload.published ?? false,
      published_at: payload.published ? new Date().toISOString() : null,
      created_by: user.user?.id ?? null,
    })
    .select()
    .single();
  if (error) throw error;
  return data;
}

export async function updateArticle(
  id: string,
  payload: Partial<Omit<ArticleRow, "id" | "created_at" | "updated_at">>,
): Promise<ArticleRow> {
  const patch: Record<string, unknown> = { ...payload };
  if (payload.published !== undefined && payload.published_at === undefined) {
    patch.published_at = payload.published ? new Date().toISOString() : null;
  }
  const { data, error } = await supabase
    .from("articles")
    .update(patch)
    .eq("id", id)
    .select()
    .single();
  if (error) throw error;
  return data;
}

export async function deleteArticle(id: string): Promise<void> {
  const { error } = await supabase.from("articles").delete().eq("id", id);
  if (error) throw error;
}

// ---------------------------------------------------------------------------
// MBG Schedule API
// ---------------------------------------------------------------------------
export async function getMbgSchedule(): Promise<MbgScheduleRow[]> {
  const { data, error } = await supabase
    .from("mbg_schedule")
    .select("*")
    .order("date", { ascending: false });
  if (error) throw error;
  return data ?? [];
}

export async function createMbgSchedule(payload: {
  day: string;
  date: string;
  menu: string;
  notes?: string | null;
}): Promise<MbgScheduleRow> {
  const { data, error } = await supabase
    .from("mbg_schedule")
    .insert({ day: payload.day, date: payload.date, menu: payload.menu, notes: payload.notes ?? null })
    .select()
    .single();
  if (error) throw error;
  return data;
}

export async function updateMbgSchedule(
  id: string,
  payload: Partial<Omit<MbgScheduleRow, "id" | "created_at" | "updated_at">>,
): Promise<MbgScheduleRow> {
  const { data, error } = await supabase
    .from("mbg_schedule")
    .update(payload)
    .eq("id", id)
    .select()
    .single();
  if (error) throw error;
  return data;
}

export async function deleteMbgSchedule(id: string): Promise<void> {
  const { error } = await supabase.from("mbg_schedule").delete().eq("id", id);
  if (error) throw error;
}

// ---------------------------------------------------------------------------
// Duty/Piket Schedule API
// ---------------------------------------------------------------------------
export async function getDutySchedule(): Promise<DutyScheduleRow[]> {
  const { data, error } = await supabase
    .from("duty_schedule")
    .select("*")
    .order("date", { ascending: false });
  if (error) throw error;
  return data ?? [];
}

export async function createDutySchedule(payload: {
  day: string;
  date: string;
  group_name: string;
  members?: string[];
  area?: string;
}): Promise<DutyScheduleRow> {
  const { data, error } = await supabase
    .from("duty_schedule")
    .insert({
      day: payload.day,
      date: payload.date,
      group_name: payload.group_name,
      members: payload.members ?? [],
      area: payload.area ?? "",
    })
    .select()
    .single();
  if (error) throw error;
  return data;
}

export async function updateDutySchedule(
  id: string,
  payload: Partial<Omit<DutyScheduleRow, "id" | "created_at" | "updated_at">>,
): Promise<DutyScheduleRow> {
  const { data, error } = await supabase
    .from("duty_schedule")
    .update(payload)
    .eq("id", id)
    .select()
    .single();
  if (error) throw error;
  return data;
}

export async function deleteDutySchedule(id: string): Promise<void> {
  const { error } = await supabase.from("duty_schedule").delete().eq("id", id);
  if (error) throw error;
}

// ---------------------------------------------------------------------------
// Organization Settings API
// ---------------------------------------------------------------------------
export async function getOrganizationSetting<T = unknown>(
  key: string,
): Promise<T | null> {
  const { data, error } = await supabase
    .from("organization_settings")
    .select("value")
    .eq("key", key)
    .maybeSingle();

  if (error) throw error;
  return (data?.value as T) ?? null;
}

export async function setOrganizationSetting<T = unknown>(
  key: string,
  value: T,
): Promise<void> {
  const { error } = await supabase.from("organization_settings").upsert(
    {
      key,
      value: value as unknown as Record<string, unknown>,
      updated_at: new Date().toISOString(),
    },
    { onConflict: "key" },
  );

  if (error) throw error;
}

// ---------------------------------------------------------------------------
// Profiles / User Management API (Owner Only)
// ---------------------------------------------------------------------------
export async function getAllProfiles(): Promise<ProfileRow[]> {
  const { data, error } = await supabase
    .from("profiles")
    .select("id, name, image, email, role, verified, created_at, updated_at")
    .order("created_at", { ascending: false });

  if (error) throw error;
  return (data ?? []) as ProfileRow[];
}

export async function updateProfileRole(
  userId: string,
  role: "admin" | "member" | "owner",
): Promise<ProfileRow> {
  // Lewati RPC karena column grant tidak lagi mengizinkan update role
  // lewat PostgREST. RPC set_user_role memeriksa is_owner() di server.
  const { data, error } = await supabase.rpc("set_user_role", {
    p_user: userId,
    p_role: role,
  });
  if (error) throw error;
  return data as ProfileRow;
}

// ---------------------------------------------------------------------------
// Invitation Codes API
// ---------------------------------------------------------------------------

export interface InvitationCodeRow {
  id: string;
  code_prefix: string;
  created_by: string;
  created_at: string;
  expires_at: string;
  used_at: string | null;
  used_by: string | null;
  used_by_name: string | null;
  used_by_email: string | null;
  server_now: string;
}

export type RedeemResult =
  | "ok"
  | "invalid"
  | "expired"
  | "used"
  | "already_verified";

/** Buat kode undangan — Owner-only (diperiksa server). */
export async function createInvitationCode(
  codeHash: string,
  prefix: string,
): Promise<InvitationCodeRow> {
  const { data, error } = await supabase.rpc("create_invitation_code", {
    p_code_hash: codeHash,
    p_prefix: prefix,
  });
  if (error) throw error;
  return data as InvitationCodeRow;
}

/** Daftar semua kode undangan — Owner-only. */
export async function listInvitationCodes(): Promise<InvitationCodeRow[]> {
  const { data, error } = await supabase.rpc("list_invitation_codes");
  if (error) throw error;
  return (data ?? []) as InvitationCodeRow[];
}

/** Konsumsi kode undangan (atomic di server). Untuk user yang sedang login. */
export async function redeemInvitationCode(
  codeHash: string,
): Promise<RedeemResult> {
  const { data, error } = await supabase.rpc("redeem_invitation_code", {
    p_code_hash: codeHash,
  });
  if (error) throw error;
  return (data as RedeemResult) ?? "invalid";
}

// ---------------------------------------------------------------------------
// User Preferences API (per-user settings JSONB in profiles.settings)
// ---------------------------------------------------------------------------
export async function getUserSettings<T = Record<string, unknown>>(
  userId: string,
): Promise<T | null> {
  const { data, error } = await supabase
    .from("profiles")
    .select("settings")
    .eq("id", userId)
    .maybeSingle();

  if (error) throw error;
  const settings = data?.settings;
  if (
    !settings ||
    (typeof settings === "object" &&
      Object.keys(settings as object).length === 0)
  ) {
    return null;
  }
  return settings as T;
}

export async function updateUserSettings<T = Record<string, unknown>>(
  userId: string,
  settings: T,
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
