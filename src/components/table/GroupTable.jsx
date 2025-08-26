import TeamRow from "./TeamRow";

export default function GroupTable({ titulo, equipos = [], compacto = false }) {
  const rows = [...equipos].sort(
    (a, b) => b.pts - a.pts || b.gd - a.gd || b.gf - a.gf
  );

  return (
    <div className="rounded-md border border-slate-200 bg-white shadow-sm">
      <div className="flex items-center justify-between px-4 py-3 border-b border-slate-200">
        <h3 className="font-semibold">{titulo}</h3>
        <div className="text-[11px] text-slate-500 hidden sm:block">
          PJ GF GE GD PTS
        </div>
      </div>

      <div className="divide-y divide-slate-200">
        {rows.map((t, idx) => (
          <TeamRow key={t.id || idx} idx={idx} team={t} compacto={compacto} />
        ))}

        {rows.length === 0 && (
          <div className="p-4 text-sm text-slate-500">
            Sin equipos registrados.
          </div>
        )}
      </div>
    </div>
  );
}
