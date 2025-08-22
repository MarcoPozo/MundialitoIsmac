import { FaBolt } from "react-icons/fa";

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
      <div className="mt-3 flex items-center gap-2 sm:gap-3">
        <Team
          nombre={match.equipo1?.nombre || "Por definir"}
          escudo={match.equipo1?.escudo}
          className="basis-0 flex-1 min-w-0"
        />

        <div className="shrink-0 w-12 sm:w-16 text-center">
          {isFinal ? (
            <strong className="text-base sm:text-lg tabular-nums text-slate-800">
              {" "}
              {safeNum(match.equipo1?.goles)} - {safeNum(match.equipo2?.goles)}
            </strong>
          ) : (
            <FaBolt
              className={`inline-block text-xl ${
                isLive ? "text-red-600 animate-pulse" : "text-emerald-600"
              }`}
            />
          )}
        </div>

        <Team
          derecha
          nombre={match.equipo2?.nombre || "Por definir"}
          escudo={match.equipo2?.escudo}
          className="basis-0 flex-1 min-w-0 justify-end text-right"
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

function Team({ nombre, escudo, derecha = false, className = "" }) {
  return (
    <div
      className={`flex items-center gap-2 ${
        derecha ? "flex-row-reverse text-right" : ""
      } ${className}`}>
      {escudo ? (
        <img
          src={escudo}
          alt={nombre}
          className="w-8 h-8 sm:w-10 sm:h-10 object-contain shrink-0"
        />
      ) : (
        <div
          aria-hidden
          className="w-8 h-8 sm:w-10 sm:h-10 shrink-0 rounded-full bg-slate-200"
        />
      )}

      <span
        className="text-sm leading-tight sm:text-base sm:leading-snug whitespace-normal break-words sm:truncate"
        title={nombre}>
        {nombre}
      </span>
    </div>
  );
}
