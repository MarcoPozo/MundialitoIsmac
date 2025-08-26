export default function TeamRow({ idx, team, compacto = false }) {
  const pos = idx + 1;

  return (
    <div className="px-3 sm:px-4 py-2 sm:py-2.5 flex items-center gap-2 sm:gap-3">
      {/* Posición */}
      <div className="w-6 text-center text-xs font-bold text-slate-500">
        {pos}
      </div>

      {/* Escudo y nombre */}
      <div className="flex items-center gap-2 min-w-0 flex-1">
        {team.escudo ? (
          <img
            src={team.escudo}
            alt={team.nombre}
            className="w-6 h-6 sm:w-7 sm:h-7 object-contain"
          />
        ) : (
          <div className="w-6 h-6 sm:w-7 sm:h-7 rounded-full bg-slate-200" />
        )}
        <div className="truncate font-medium">{team.nombre}</div>
      </div>

      {/* Stats */}
      <div
        className={`grid grid-cols-5 items-center gap-2 text-xs sm:text-sm text-slate-700 ${
          compacto ? "w-[220px]" : "w-[260px]"
        }`}>
        <span className="text-center tabular-nums">{team.pj}</span>
        <span className="text-center tabular-nums">{team.gf}</span>
        <span className="text-center tabular-nums">{team.ge}</span>
        <span className="text-center tabular-nums">{team.gd}</span>
        <strong className="text-center tabular-nums text-emerald-700">
          {team.pts}
        </strong>
      </div>
    </div>
  );
}
