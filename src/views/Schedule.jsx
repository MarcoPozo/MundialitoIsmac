import MatchCard from "../components/MatchCard";
import { useEffect, useMemo, useState } from "react";
import SectionTitle from "../components/SectionTitle";
import { FaCalendarAlt, FaChevronDown, FaChevronUp } from "react-icons/fa";

export default function Schedule() {
  const [matches, setMatches] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [open, setOpen] = useState({});

  useEffect(() => {
    const ctrl = new AbortController();
    (async () => {
      try {
        const r = await fetch("/data/matches.json", {
          cache: "no-store",
          signal: ctrl.signal,
        });

        if (!r.ok) throw new Error("No se pudo cargar el cronogama");
        const data = await r.json();
        setMatches(data);
      } catch (error) {
        if (error.name !== "AbortErro") setError(error.message);
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  // Agrupar por fecha
  const porFecha = useMemo(() => {
    const map = new Map();
    for (const m of matches) {
      const f = Number.isInteger(m.fecha) ? m.fecha : 0;
      if (!map.has(f)) map.set(f, []);
      map.get(f).push(m);
    }

    for (const [f, arr] of map.entries()) {
      arr.sort((a, b) => new Date(a.fecha_hora) - new Date(b.fecha_hora));
      map.set(f, arr);
    }
    return map;
  }, [matches]);

  // Fechas ordenadas
  const listaFechas = useMemo(() => {
    return Array.from(porFecha.keys()).sort((a, b) => b - a);
  }, [porFecha]);

  //Muestra por defecto la ultima fecha
  useEffect(() => {
    if (!listaFechas.length) return;
    const latest = listaFechas[0];
    setOpen((prev) => {
      if (Object.keys(prev).length) return prev;
      return { [latest]: true };
    });
  }, [listaFechas]);

  const toggle = (f) => setOpen((s) => ({ ...s, [f]: !s[f] }));

  return (
    <section className="mx-auto max-w-6xl px-4">
      <header className="mb-4 flex items-center gap-3">
        <FaCalendarAlt className="text-2xl text-emerald-600" />
        <h1 className="text-xl sm:text-2xl font-bold">Cronograma</h1>
      </header>

      <SectionTitle>Fechas del torneo</SectionTitle>

      {error && (
        <div className="mb-4 rounded-md border border-red-200 bg-red-50 p-3 text-sm text-red-700">
          {error}
        </div>
      )}

      {loading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {[...Array(6)].map((_, i) => (
            <div
              key={i}
              className="rounded-md border border-slate-200 bg-white p-4 shadow-sm animate-pulse">
              <div className="h-3 w-1/2 bg-slate-200 rounded" />
              <div className="mt-3 h-14 bg-slate-200 rounded" />
            </div>
          ))}
        </div>
      ) : !listaFechas.length ? (
        <p className="text-slate-500">Aún no hay fechas cargadas.</p>
      ) : (
        <div className="space-y-6">
          {listaFechas.map((f) => {
            const partidos = porFecha.get(f) || [];
            const minDt = partidos.length
              ? new Date(partidos[0].fecha_hora)
              : null;
            const maxDt = partidos.length
              ? new Date(partidos[partidos.length - 1].fecha_hora)
              : null;
            const rango = minDt && maxDt ? formatRango(minDt, maxDt) : "";

            return (
              <div
                key={f}
                className="rounded-md border border-slate-200 bg-white shadow-sm">
                {/* Header Fecha */}
                <button
                  type="button"
                  onClick={() => toggle(f)}
                  className="w-full flex items-center justify-between px-4 py-3 text-left">
                  <div className="flex items-baseline gap-3">
                    <h3 className="text-lg font-semibold">
                      {f > 0 ? `Fecha ${f}` : "Sin fecha"}
                    </h3>
                    {rango && (
                      <span className="text-xs text-slate-500">{rango}</span>
                    )}
                  </div>
                  <span className="text-slate-500">
                    {open[f] ? <FaChevronUp /> : <FaChevronDown />}
                  </span>
                </button>

                {/* Contenido Fecha */}
                {open[f] && (
                  <div className="px-4 pb-4">
                    {partidos.length ? (
                      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                        {partidos.map((m) => (
                          <MatchCard key={m.id_partido} match={m} />
                        ))}
                      </div>
                    ) : (
                      <div className="p-4 text-sm text-slate-500">
                        No hay partidos en esta fecha.
                      </div>
                    )}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}
    </section>
  );
}

// Formato "sáb 30 ago – sáb 30 ago" o "vie 29 ago – sáb 30 ago"
function formatRango(minDt, maxDt) {
  const fmt = (d) =>
    d.toLocaleDateString("es-EC", {
      weekday: "short",
      day: "2-digit",
      month: "short",
    });
  const a = fmt(minDt);
  const b = fmt(maxDt);
  return a === b ? a : `${a} – ${b}`;
}
