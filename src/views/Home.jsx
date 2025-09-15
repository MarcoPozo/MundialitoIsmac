import { Link } from "react-router-dom";
import { useEffect, useState } from "react";
import MatchCard from "../components/MatchCard";
import SectionTitle from "../components/SectionTitle";
import { FaCalendarAlt, FaTable } from "react-icons/fa";

export default function Home() {
  const [upcoming, setUpcoming] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const ctrl = new AbortController();
    (async () => {
      try {
        const res = await fetch("/data/matches.json", {
          cache: "no-store",
          signal: ctrl.signal,
        });
        if (!res.ok) throw new Error("No se pudo cargar la información");
        const data = await res.json();

        const todosFuturos = data.filter(
          (m) => m.estado === "programado" || m.estado === "en_vivo"
        );

        const fechasValidas = todosFuturos
          .map((m) => (Number.isFinite(m.fecha) ? m.fecha : -Infinity))
          .filter((n) => Number.isFinite(n));

        const ultimaFecha = fechasValidas.length
          ? Math.max(...fechasValidas)
          : null;

        const futuros =
          ultimaFecha !== null
            ? todosFuturos
                .filter((m) => m.fecha === ultimaFecha)
                .sort((a, b) => new Date(a.fecha_hora) - new Date(b.fecha_hora))
            : todosFuturos.sort(
                (a, b) => new Date(a.fecha_hora) - new Date(b.fecha_hora)
              );

        setUpcoming(futuros);
      } catch (e) {
        if (e.name !== "AbortError") setError(e.message);
      } finally {
        setLoading(false);
      }
    })();

    return () => ctrl.abort();
  }, []);

  return (
    <div className="space-y-8">
      {/* Hero */}
      <section className="relative overflow-hidden rounded-md border border-emerald-100 bg-gradient-to-br from-emerald-500 to-emerald-600 text-white">
        <div className="px-5 py-10 sm:px-8 sm:py-14 grid grid-cols-1 sm:grid-cols-[1fr_auto] items-center gap-6">
          <div>
            <h1 className="text-3xl sm:text-4xl font-extrabold">
              Mundialito Ismac
            </h1>
            <p className="mt-2 text-emerald-50">
              Partidos, resultados y galería. Toda la información del torneo.
            </p>

            <div className="mt-4 flex flex-wrap gap-2">
              <Link
                to="/cronograma"
                className="inline-flex items-center gap-2 px-4 py-2 rounded-md bg-white/95 text-emerald-700 font-semibold shadow hover:bg-white">
                <FaCalendarAlt />
                Ver Cronograma
              </Link>

              <Link
                to="/tabla"
                className="inline-flex items-center gap-2 px-4 py-2 rounded-md bg-emerald-800/60 border border-white/20 hover:bg-emerald-800/80">
                <FaTable />
                Tabla
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Próximos Partidos */}
      <section>
        <SectionTitle
          right={
            <Link
              to="/cronograma"
              className="text-sm text-emerald-700 hover:underline">
              Ver todo
            </Link>
          }>
          Próximos partidos - Semifinales
        </SectionTitle>

        {error && (
          <div className="text-sm text-red-600 bg-red-50 border border-red-200 rounded-md p-3">
            {error}
          </div>
        )}

        {loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {[...Array(3)].map((_, idx) => (
              <div
                key={idx}
                className="rounded-md border border-slate-200 bg-white p-4 shadow-sm animate-pulse">
                <div className="h-3 w-2/3 bg-slate-200 rounded" />
                <div className="mt-4 h-14 bg-slate-200 rounded" />
              </div>
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {upcoming.map((m) => (
              <MatchCard key={m.id_partido} match={m} />
            ))}

            {!upcoming.length && (
              <div className="text-slate-500">
                Sin partidos programados por ahora.
              </div>
            )}
          </div>
        )}
      </section>
    </div>
  );
}
