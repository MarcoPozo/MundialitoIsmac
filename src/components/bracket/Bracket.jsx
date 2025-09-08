import { useMemo } from "react";
import BracketMatch from "./BracketMatch";

export default function Bracket({ matches = [] }) {
  const elim = useMemo(
    () => matches.filter((m) => m.etapa === "eliminatoria"),
    [matches]
  );

  if (!elim.length) return null;

  const byRound = useMemo(() => {
    const rounds = {
      cuartos: [],
      semifinal: [],
      final_masculino: [],
      final_femenino: [],
    };
    for (const m of elim) {
      if (rounds[m.ronda]) rounds[m.ronda].push(m);
    }
    Object.keys(rounds).forEach((r) => {
      rounds[r].sort((a, b) => new Date(a.fecha_hora) - new Date(b.fecha_hora));
    });
    return rounds;
  }, [elim]);

  return (
    <section className="mb-8">
      <div className="rounded-md border border-emerald-200 bg-white shadow-sm">
        <div className="px-4 py-3 border-b border-emerald-200">
          <h3 className="font-semibold text-emerald-700">Fase eliminatoria</h3>
          <p className="text-xs text-slate-500">
            Cuartos · Semifinales · Finales
          </p>
        </div>

        <div className="p-4 grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Cuartos */}
          <div>
            <h4 className="mb-2 font-semibold">Cuartos de final</h4>
            <div className="space-y-3">
              {byRound.cuartos.length ? (
                byRound.cuartos.map((m) => (
                  <BracketMatch key={m.id_partido} match={m} />
                ))
              ) : (
                <p className="text-sm text-slate-500">Aún no definidos.</p>
              )}
            </div>
          </div>

          {/* Semifinales */}
          <div>
            <h4 className="mb-2 font-semibold">Semifinales</h4>
            <div className="space-y-3">
              {byRound.semifinal.length ? (
                byRound.semifinal.map((m) => (
                  <BracketMatch key={m.id_partido} match={m} />
                ))
              ) : (
                <p className="text-sm text-slate-500">Aún no definidos.</p>
              )}
            </div>
          </div>

          {/* Finales */}
          <div>
            <h4 className="mb-2 font-semibold">Finales</h4>
            <div className="space-y-3">
              {byRound.final_masculino.map((m) => (
                <BracketMatch key={m.id_partido} match={m} />
              ))}
              {byRound.final_femenino.map((m) => (
                <BracketMatch key={m.id_partido} match={m} />
              ))}
              {!byRound.final_masculino.length &&
                !byRound.final_femenino.length && (
                  <p className="text-sm text-slate-500">Aún no definidos.</p>
                )}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
