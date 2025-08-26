import { useEffect, useState } from "react";
import { FaTable } from "react-icons/fa";
import GroupTable from "../components/table/GroupTable";

export default function Table() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const ctrl = new AbortController();
    (async () => {
      try {
        const res = await fetch("/data/table.json", {
          cache: "no-store",
          signal: ctrl.signal,
        });

        if (!res.ok)
          throw new Error("No se pudo cargar la tabla de posiciones");
        const json = await res.json();
        setData(json);
      } catch (error) {
        if (error.name !== "AbortError") setError(error.message);
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  return (
    <section className="mx-auto max-w-6xl px-4">
      <header className="mb-4 flex items-center gap-3">
        <FaTable className="text-2xl text-emerald-600" />
        <h1 className="text-xl sm:text-2xl font-bold">Tabla de posiciones</h1>
      </header>

      {error && (
        <div className="mb-4 rounded-md border border-red-200 bg-red-50 p-3 text-sm text-red-700">
          {error}
        </div>
      )}

      {loading || !data ? (
        <SkeletonGrid />
      ) : (
        <div className="space-y-8">
          {/* Grupo Masculino */}
          {data.masculino?.tipo === "grupos" &&
            data.masculino?.grupos?.length > 0 && (
              <div>
                <h2 className="mb-3 text-lg font-bold">
                  Masculino · Fase de grupos
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {data.masculino.grupos.map((g) => (
                    <GroupTable
                      key={g.clave || g.nombre}
                      titulo={g.nombre}
                      equipos={g.equipos || []}
                    />
                  ))}
                </div>
              </div>
            )}

          {/* Liga Femenina */}
          {data.femenino?.tipo === "liga" && (
            <div>
              <h2 className="mb-3 text-lg font-bold">Femenino · Liga</h2>
              <GroupTable
                titulo={data.femenino.titulo || "Femenino"}
                equipos={data.femenino.equipos || []}
                compacto
              />
            </div>
          )}

          {data.actualizado && (
            <p className="text-xs text-slate-500">
              Actualizado: {data.actualizado}
            </p>
          )}
        </div>
      )}
    </section>
  );
}

function SkeletonGrid() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      {[...Array(4)].map((_, i) => (
        <div
          key={i}
          className="rounded-md border border-slate-200 bg-white p-4">
          <div className="h-4 w-1/3 bg-slate-200 rounded" />

          <div className="mt-3 space-y-2">
            {[...Array(5)].map((_, j) => (
              <div key={j} className="h-8 bg-slate-100 rounded" />
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}
