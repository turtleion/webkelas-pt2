import type { MemberRow } from "@/lib/db";
import { inisialNama, padNomor } from "@/lib/tanggal";

interface MemberListProps {
  members: MemberRow[];
}

/** Shared member-row list — the /anggota member display, reused elsewhere
 *  (e.g. Jadwal Piket / MBG) so all member lists look consistent.
 *  absen_no <= 0 hides the number (for schedules without a roster number). */
export function MemberList({ members }: MemberListProps) {
  return (
    <ul className="grid gap-px bg-border sm:grid-cols-2">
      {members.map((a) => (
        <li
          key={a.id}
          className="flex items-center gap-4 bg-background px-4 py-4 md:px-5"
        >
          {a.absen_no > 0 && (
            <span className="kicker w-8 shrink-0 text-[10px]">
              {padNomor(a.absen_no)}
            </span>
          )}
          <span className="flex size-10 shrink-0 items-center justify-center border border-border bg-card/70 font-display text-sm italic">
            {inisialNama(a.name)}
          </span>
          <span className="min-w-0 flex-1">
            <span className="block truncate text-[14.5px]">{a.name}</span>
            {a.position && (
              <span className="kicker mt-0.5 block text-[9px] text-accent">
                {a.position}
              </span>
            )}
          </span>
        </li>
      ))}
    </ul>
  );
}