import TeamRow from "./TeamRow";

export default function GroupTable({ titulo, equipos = [], compacto = false }) {
  // Orden por PTS > GD > GF
  const rows = [...equipos].sort(
    (a, b) => b.pts - a.pts || b.gd - a.gd || b.gf - a.gf
  );

  return (
    <div className="rounded-md border border-slate-200 bg-white shadow-sm">
      <div className="flex items-center justify-between px-4 py-3 border-b border-slate-200">
        <h3 className="font-semibold">{titulo}</h3>
      </div>

      {/* Tabla con scroll en pantallas pequeñas */}
      <div className="overflow-x-auto">
        <div className="min-w-[360px]">
          {/* Encabezado */}
          <div className="grid grid-cols-[2rem_minmax(0,1fr)_repeat(5,2.75rem)] px-3 sm:px-4 py-2 text-[11px] sm:text-xs font-semibold text-slate-500">
            <div className="text-center">#</div>
            <div>Equipo</div>
            <div className="text-center">PJ</div>
            <div className="text-center">GF</div>
            <div className="text-center">GE</div>
            <div className="text-center">GD</div>
            <div className="text-center">PTS</div>
          </div>

          {/* Filas */}
          <div className="divide-y divide-slate-200">
            {rows.map((t, idx) => (
              <TeamRow
                key={t.id || idx}
                idx={idx}
                team={t}
                compacto={compacto}
              />
            ))}

            {rows.length === 0 && (
              <div className="p-4 text-sm text-slate-500">
                Sin equipos registrados.
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
