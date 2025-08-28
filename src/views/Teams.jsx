import TeamCard from "../components/team/TeamCard";
import { useEffect, useMemo, useState } from "react";
import { FaUsers, FaSearch, FaFilter } from "react-icons/fa";

export default function Teams() {
  const [teams, setTeams] = useState([]);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);

  const [query, setQuery] = useState("");
  const [genero, setGenero] = useState("Todos");
  const [grupo, setGrupo] = useState("Todos");
  const [categoria, setCategoria] = useState("Todos");

  useEffect(() => {
    const ctrl = new AbortController();
    (async () => {
      try {
        const r = await fetch("/data/teams.json", {
          cache: "no-store",
          signal: ctrl.signal,
        });
        if (!r.ok) throw new Error("No se pudieron cargar los equipos");
        const data = await r.json();
        setTeams(data);
      } catch (error) {
        if (error.name !== "AbortError") setError(error.message);
      } finally {
        setLoading(false);
      }
    })();
    return () => ctrl.abort();
  }, []);

  const gruposOpts = useMemo(() => {
    const s = new Set(teams.map((t) => t.grupo).filter(Boolean));
    return ["Todos", ...Array.from(s)];
  }, [teams]);

  const generoOpts = ["Todos", "Masculino", "Femenino"];

  const categoriasOpts = useMemo(() => {
    const s = new Set(teams.map((t) => t.categoria).filter(Boolean));
    return ["Todos", ...Array.from(s)];
  }, [teams]);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    return teams.filter((t) => {
      const okQ =
        !q ||
        t.nombre.toLowerCase().includes(q) ||
        (t.siglas || "").toLowerCase().includes(q);
      const okG = genero === "Todos" || (t.genero || "Todos") === genero;
      const okGrp = grupo === "Todos" || (t.grupo || "Todos") === grupo;
      const okCat =
        categoria === "Todos" || (t.categoria || "Todos") === categoria;

      return okQ && okG && okGrp && okCat;
    });
  }, [teams, query, genero, grupo, categoria]);

  return (
    <section className="mx-auto max-w-6xl px-4">
      <header className="mb-4 flex items-center gap-3">
        <FaUsers className="text-2xl text-emerald-600" />
        <h1 className="text-xl sm:text-2xl font-bold">Equipos</h1>
      </header>

      {/* Filtros */}
      <div className="mb-4 flex flex-wrap items-center gap-2">
        <div className="relative w-full sm:w-72">
          <FaSearch className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" />
          <input
            type="search"
            placeholder="Buscar equipo"
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            className="w-full rounded-md border border-slate-300 pl-9 pr-3 py-2 outline-none focus:ring-2 focus:ring-emerald-300"
          />
        </div>

        <div className="inline-flex items-center gap-2 text-slate-600">
          <FaFilter />

          <select
            value={genero}
            onChange={(event) => setGenero(event.target.value)}
            className="rounded-md border border-slate-300 px-2 py-2 text-sm">
            {generoOpts.map((op) => (
              <option key={op} value={op}>
                {op}
              </option>
            ))}
          </select>

          <select
            value={grupo}
            onChange={(e) => setGrupo(e.target.value)}
            className="rounded-md border border-slate-300 px-2 py-2 text-sm">
            {gruposOpts.map((op) => (
              <option key={op} value={op}>
                {op}
              </option>
            ))}
          </select>

          <select
            value={categoria}
            onChange={(e) => setCategoria(e.target.value)}
            className="rounded-md border border-slate-300 px-2 py-2 text-sm">
            {categoriasOpts.map((op) => (
              <option key={op} value={op}>
                {op}
              </option>
            ))}
          </select>
        </div>
      </div>

      {error && (
        <div className="mb-4 rounded-md border border-red-200 bg-red-50 p-3 text-sm text-red-700">
          {error}
        </div>
      )}

      {loading ? (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
          {[...Array(8)].map((_, i) => (
            <div
              key={i}
              className="rounded-md border border-slate-200 bg-white p-4 shadow-sm animate-pulse">
              <div className="h-16 bg-slate-200 rounded" />
              <div className="mt-3 h-3 w-2/3 bg-slate-200 rounded" />
              <div className="mt-2 h-3 w-1/2 bg-slate-200 rounded" />
            </div>
          ))}
        </div>
      ) : filtered.length ? (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
          {filtered.map((t) => (
            <TeamCard key={t.id} team={t} />
          ))}
        </div>
      ) : (
        <p className="text-slate-500">
          No se encontraron equipos con esos filtros.
        </p>
      )}
    </section>
  );
}
