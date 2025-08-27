export default function TeamRow({ idx, team }) {
  const pos = idx + 1;
  const siglas = team.siglas ?? "—";

  return (
    <>
      <div
        className="
          sm:hidden
          grid
          grid-cols-[2.25rem_2.5rem_repeat(5,minmax(2.2rem,1fr))]
          items-center
          px-2 py-2
          w-full
        ">
        {/* Logo */}
        <div className="flex items-center justify-center">
          {team.escudo ? (
            <img
              src={team.escudo}
              alt={team.nombre}
              className="w-7 h-7 object-contain shrink-0"
            />
          ) : (
            <div className="w-7 h-7 rounded-full bg-slate-200" />
          )}
        </div>

        {/* Siglas */}
        <div className="text-center text-xs font-semibold text-slate-700">
          {siglas}
        </div>

        {/* Stats */}
        <span className="text-center tabular-nums text-[11px]">{team.pj}</span>
        <span className="text-center tabular-nums text-[11px]">{team.gf}</span>
        <span className="text-center tabular-nums text-[11px]">{team.ge}</span>
        <span className="text-center tabular-nums text-[11px]">{team.gd}</span>
        <strong className="text-center tabular-nums text-[11px] text-emerald-700">
          {team.pts}
        </strong>
      </div>

      <div
        className="
          hidden sm:grid
          sm:grid-cols-[2rem_minmax(0,1fr)_repeat(5,2.75rem)]
          sm:items-center
          sm:px-4 sm:py-2.5
          w-full
        ">
        {/* Posición */}
        <div className="text-center text-xs font-bold text-slate-500">
          {pos}
        </div>

        {/* Equipo */}
        <div className="flex items-center gap-2 min-w-0">
          {team.escudo ? (
            <img
              src={team.escudo}
              alt={team.nombre}
              className="w-8 h-8 object-contain shrink-0"
            />
          ) : (
            <div className="w-8 h-8 rounded-full bg-slate-200 shrink-0" />
          )}
          <div className="truncate font-medium">{team.nombre}</div>
        </div>

        {/* Stats */}
        <span className="text-center tabular-nums text-sm">{team.pj}</span>
        <span className="text-center tabular-nums text-sm">{team.gf}</span>
        <span className="text-center tabular-nums text-sm">{team.ge}</span>
        <span className="text-center tabular-nums text-sm">{team.gd}</span>
        <strong className="text-center tabular-nums text-sm text-emerald-700">
          {team.pts}
        </strong>
      </div>
    </>
  );
}
