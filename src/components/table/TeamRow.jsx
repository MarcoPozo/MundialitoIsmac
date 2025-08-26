export default function TeamRow({ idx, team, compacto = false }) {
  const pos = idx + 1;

  return (
    <div className="grid grid-cols-[2rem_minmax(0,1fr)_repeat(5,2.75rem)] items-center px-3 sm:px-4 py-2 sm:py-2.5">
      {/* Posición */}
      <div className="text-center text-xs font-bold text-slate-500">{pos}</div>

      {/* Equipo */}
      <div className="flex items-center gap-2 min-w-0">
        {team.escudo ? (
          <img
            src={team.escudo}
            alt={team.nombre}
            className="w-7 h-7 sm:w-8 sm:h-8 object-contain shrink-0"
          />
        ) : (
          <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-full bg-slate-200 shrink-0" />
        )}
        <div className="truncate font-medium">{team.nombre}</div>
      </div>

      {/* Stats */}
      <span className="text-center tabular-nums text-xs sm:text-sm">
        {team.pj}
      </span>
      <span className="text-center tabular-nums text-xs sm:text-sm">
        {team.gf}
      </span>
      <span className="text-center tabular-nums text-xs sm:text-sm">
        {team.ge}
      </span>
      <span className="text-center tabular-nums text-xs sm:text-sm">
        {team.gd}
      </span>
      <strong className="text-center tabular-nums text-xs sm:text-sm text-emerald-700">
        {team.pts}
      </strong>
    </div>
  );
}
