export default function MatchCard({ match }) {
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

  const isFinal = match.estado === "finalizado";
  const isLive = match.estado === "en_vivo";

  return (
    <article className="rounded-md border border-slate-200 bg-white p-4 shadow-sm">
      {/* Horarios */}
      <div className="text-xs text-slate-500 flex items-center gap-2">
        <span>{fecha}</span>
        <span>· {hora}</span>
        <span>· {match.sede}</span>
        {match.genero && (
          <span className="uppercase font-semibold text-emerald-600">
            {match.genero}
          </span>
        )}
        {match.jornada && (
          <span className="ml-auto text-emerald-700 font-semibold">
            {match.jornada}
          </span>
        )}
      </div>

      {/* Equipos */}
      <div className="mt-3 grid grid-cols-[1fr_auto_1fr] items-center gap-3 sm:gap-4">
        <Team
          nombre={match.equipo1?.nombre || "Por definir"}
          escudo={match.equipo1?.escudo}
        />

        <div className="shrink-0 w-12 sm:w-16 text-center">
          {isFinal ? (
            <strong className="text-base sm:text-lg tabular-nums text-slate-800">
              {safeNum(match.equipo1?.goles)} - {safeNum(match.equipo2?.goles)}
            </strong>
          ) : (
            <span
              className={`inline-block text-sm sm:text-base font-bold ${
                isLive ? "text-red-600 animate-pulse" : "text-emerald-600"
              }`}>
              VS
            </span>
          )}
        </div>

        <Team
          nombre={match.equipo2?.nombre || "Por definir"}
          escudo={match.equipo2?.escudo}
        />
      </div>

      {/* Estado */}
      {!isFinal && (
        <div
          className={`mt-2 text-center text-xs font-medium ${
            isLive ? "text-red-600" : "text-emerald-600"
          }`}>
          {isLive
            ? "EN VIVO"
            : match.estado === "aplazado"
            ? "Aplazado"
            : "Programado"}
        </div>
      )}

      {/* Observación opcional */}
      {match.observaciones && (
        <div className="mt-2 text-[11px] text-slate-500 italic">
          {match.observaciones}
        </div>
      )}
    </article>
  );
}

function Team({ nombre, escudo }) {
  return (
    <div className="flex flex-col items-center justify-center text-center">
      {escudo ? (
        <img
          src={escudo}
          alt={nombre}
          className="w-12 h-12 sm:w-14 sm:h-14 object-contain"
        />
      ) : (
        <div
          aria-hidden
          className="w-12 h-12 sm:w-14 sm:h-14 rounded-full bg-slate-200"
        />
      )}
      <span className="mt-1 text-sm sm:text-base leading-snug whitespace-normal break-words">
        {nombre}
      </span>
    </div>
  );
}

function safeNum(n) {
  return typeof n === "number" ? n : 0;
}
