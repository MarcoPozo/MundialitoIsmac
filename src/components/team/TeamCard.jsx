export default function TeamCard({ team }) {
  return (
    <article className="rounded-md border border-slate-200 bg-white p-4 shadow-sm flex flex-col items-center text-center hover:shadow transition">
      {team.escudo ? (
        <img
          src={team.escudo}
          alt={team.nombre}
          width={64}
          height={64}
          loading="lazy"
          className="w-16 h-16 object-contain"
        />
      ) : (
        <div className="w-16 h-16 rounded-full bg-slate-200" />
      )}

      <h3 className="mt-2 font-semibold truncate w-full" title={team.nombre}>
        {team.nombre}
      </h3>

      <div className="mt-1 flex flex-wrap items-center justify-center gap-1 text-[11px] text-slate-600">
        {team.siglas && (
          <span className="inline-flex items-center rounded px-2 py-0.5 bg-emerald-50 text-emerald-700 border border-emerald-200 font-semibold">
            {team.siglas}
          </span>
        )}

        {team.grupo && (
          <span className="inline-flex items-center rounded px-2 py-0.5 bg-slate-50 border border-slate-200">
            Grupo {team.grupo}
          </span>
        )}
        {team.genero && (
          <span className="inline-flex items-center rounded px-2 py-0.5 bg-slate-50 border border-slate-200">
            {team.genero}
          </span>
        )}

        {team.categoria && (
          <span className="inline-flex items-center rounded px-2 py-0.5 bg-slate-50 border border-slate-200">
            {team.categoria}
          </span>
        )}
      </div>
    </article>
  );
}
