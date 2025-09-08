export default function BracketMatch({ match }) {
  const dt = new Date(match.fecha_hora);
  const fecha = dt.toLocaleDateString("es-EC", {
    weekday: "short",
    day: "2-digit",
    month: "short",
  });
  const hora = dt.toLocaleTimeString("es-EC", {
    hour: "2-digit",
    minute: "2-digit",
    hour12: false,
  });

  // Normaliza equipo: puede venir como string o como objeto {nombre, escudo, goles}
  const norm = (side, placeholder) => {
    const e = match[side];
    if (!e) {
      return {
        nombre: placeholder || "Por definir",
        escudo: null,
        goles: null,
      };
    }
    if (typeof e === "string") {
      // No tenemos escudo si sólo llega string
      return { nombre: e, escudo: null, goles: null };
    }
    return {
      nombre: e.nombre || placeholder || "Por definir",
      escudo: e.escudo || null,
      goles: typeof e.goles === "number" ? e.goles : null,
    };
  };

  const e1 = norm("equipo1", match.placeholder1);
  const e2 = norm("equipo2", match.placeholder2);

  const isFinal = match.estado === "finalizado";

  return (
    <article className="rounded-md border border-slate-200 bg-white p-3 shadow-sm">
      <div className="text-[11px] text-slate-500 flex items-center justify-between">
        <span>
          {fecha} · {hora}
        </span>
        {match.sede && <span>{match.sede}</span>}
      </div>

      <div className="mt-2 space-y-2">
        {/* Equipo 1 */}
        <div className="flex items-center justify-between gap-2">
          <div className="min-w-0 flex items-center gap-2">
            {e1.escudo ? (
              <img
                src={e1.escudo}
                alt={e1.nombre}
                className="w-6 h-6 object-contain shrink-0"
              />
            ) : (
              <div
                className="w-6 h-6 rounded-full bg-slate-200 shrink-0"
                aria-hidden
              />
            )}
            <div className="truncate">{e1.nombre}</div>
          </div>
          <div className="tabular-nums font-semibold">
            {isFinal && e1.goles !== null ? e1.goles : ""}
          </div>
        </div>

        {/* Equipo 2 */}
        <div className="flex items-center justify-between gap-2">
          <div className="min-w-0 flex items-center gap-2">
            {e2.escudo ? (
              <img
                src={e2.escudo}
                alt={e2.nombre}
                className="w-6 h-6 object-contain shrink-0"
              />
            ) : (
              <div
                className="w-6 h-6 rounded-full bg-slate-200 shrink-0"
                aria-hidden
              />
            )}
            <div className="truncate">{e2.nombre}</div>
          </div>
          <div className="tabular-nums font-semibold">
            {isFinal && e2.goles !== null ? e2.goles : ""}
          </div>
        </div>

        {!isFinal && (
          <div className="text-center text-[11px] text-emerald-700 font-medium">
            {match.estado === "en_vivo" ? "EN VIVO" : "Programado"}
          </div>
        )}
      </div>
    </article>
  );
}
