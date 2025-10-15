import { useEffect, useState, useMemo } from "react";
import { motion } from "framer-motion";
import { FaCrown, FaMedal, FaStar, FaMars, FaVenus } from "react-icons/fa";

export default function Champions() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const ctrl = new AbortController();
    (async () => {
      try {
        const r = await fetch("/data/champions.json", {
          cache: "no-store",
          signal: ctrl.signal,
        });
        if (!r.ok) throw new Error("No se pudo cargar campeones");
        const json = await r.json();
        setData(json);
      } catch (e) {
        if (e.name !== "AbortError") setError(e.message);
      } finally {
        setLoading(false);
      }
    })();
    return () => ctrl.abort();
  }, []);

  const items = useMemo(() => {
    const raw = Array.isArray(data?.items) ? data.items : [];
    // Compatibilidad: si no trae categoria => "masculino"
    return raw.map((it) => ({
      categoria: it.categoria || "masculino",
      ...it,
    }));
  }, [data]);

  if (loading) {
    return (
      <section className="mx-auto max-w-6xl px-4">
        <Header />
        <SkeletonPodios />
      </section>
    );
  }

  if (error) {
    return (
      <section className="mx-auto max-w-6xl px-4">
        <Header />
        <div className="mt-6 rounded-md border border-red-200 bg-red-50 p-3 text-sm text-red-700">
          {error}
        </div>
      </section>
    );
  }

  // Agrupar por categoría
  const grupos = groupBy(items, (i) => i.categoria);
  const ordenCategorias = ["masculino", "femenino"]; // orden de render
  const etiquetas = {
    masculino: {
      label: "Categoría Masculina",
      icon: <FaMars className="text-sky-500" />,
    },
    femenino: {
      label: "Categoría Femenina",
      icon: <FaVenus className="text-rose-500" />,
    },
  };

  return (
    <section className="mx-auto max-w-6xl px-4">
      <Header periodo={data?.periodo} />

      {ordenCategorias.map((cat) => {
        const arr = (grupos.get(cat) || []).sort((a, b) => a.pos - b.pos);
        if (!arr.length) return null;
        const champ = arr.find((i) => i.pos === 1);
        const sub = arr.find((i) => i.pos === 2);

        return (
          <div key={cat} className="mt-10">
            {/* Subheader por categoría */}
            <div className="mb-3 flex items-center gap-2">
              {etiquetas[cat]?.icon}
              <h2 className="text-lg sm:text-xl font-bold">
                {etiquetas[cat]?.label || cat}
              </h2>
            </div>

            {/* Podio 2 niveles */}
            <div className="grid grid-cols-1 md:grid-cols-[1fr_1.1fr] gap-6 items-end">
              {sub && <Podio item={sub} tier="silver" low />}
              {champ && <Podio item={champ} tier="gold" highlight />}
            </div>
          </div>
        );
      })}

      <p className="mt-8 text-center text-xs text-slate-500">
        Datos mostrados para el periodo {data?.periodo || "actual"}.
      </p>
    </section>
  );
}

function Header({ periodo }) {
  return (
    <header className="flex items-center justify-between">
      <div className="flex items-center gap-2">
        <FaStar className="text-amber-400 text-xl drop-shadow-sm" />
        <h1 className="text-2xl font-extrabold tracking-tight">Campeones</h1>
      </div>
      {periodo && (
        <span className="rounded-full border border-emerald-200 bg-emerald-50 px-3 py-1 text-xs font-semibold text-emerald-700">
          {periodo}
        </span>
      )}
    </header>
  );
}

function Podio({ item, tier = "gold", highlight = false, low = false }) {
  const [c1 = "#10b981", c2 = "#065f46"] = item.colores || [];

  const metal =
    tier === "gold"
      ? {
          ring: "ring-amber-300",
          base: "from-amber-400 to-amber-600",
          glow: "rgba(245, 158, 11, 0.35)",
          icon: (
            <FaCrown className="text-amber-400 text-xl animate-bounce-slow" />
          ),
          titleClass: "text-amber-600",
        }
      : {
          ring: "ring-slate-300",
          base: "from-slate-300 to-slate-500",
          glow: "rgba(100, 116, 139, 0.28)",
          icon: <FaMedal className="text-slate-400 text-lg" />,
          titleClass: "text-slate-600 dark:text-slate-300",
        };

  return (
    <motion.article
      initial={{ opacity: 0, y: 18, scale: 0.98 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{ type: "spring", stiffness: 100, damping: 14 }}
      className={[
        "relative overflow-hidden rounded-2xl border bg-white shadow-sm dark:bg-slate-900 dark:border-slate-800",
        highlight ? "md:-translate-y-3" : "",
        low ? "md:translate-y-3" : "",
        "hover:shadow-xl transition-shadow duration-300",
      ].join(" ")}
      style={{
        boxShadow: highlight
          ? `0 12px 45px ${metal.glow}`
          : "0 8px 30px rgba(2,6,23,0.10)",
      }}>
      {/* Banda superior con colores del equipo */}
      <div
        className="h-24"
        style={{ backgroundImage: `linear-gradient(135deg, ${c1}, ${c2})` }}
      />

      {/* Contenido */}
      <div className="p-6 -mt-12 flex flex-col items-center text-center">
        <div
          className={`relative size-24 rounded-full ring-4 ${metal.ring} bg-white overflow-hidden shadow-lg`}>
          {item.escudo ? (
            <img
              src={item.escudo}
              alt={`Escudo ${item.equipo}`}
              className="size-full object-contain p-1.5"
              loading="lazy"
              decoding="async"
            />
          ) : (
            <div className="size-full grid place-items-center text-3xl">🏆</div>
          )}
        </div>

        {/* Icono según posición */}
        <div className="mt-2">{metal.icon}</div>

        <h3
          className={`mt-2 text-2xl font-extrabold tracking-tight ${metal.titleClass}`}>
          {item.equipo}
        </h3>
        <span className="mt-0.5 text-[11px] uppercase tracking-widest text-slate-500">
          {item.titulo || (tier === "gold" ? "Campeón" : "Bicampeón")}
        </span>

        {(item.marcador || item.capitan) && (
          <div className="mt-2 flex flex-wrap justify-center gap-2 text-xs text-slate-600 dark:text-slate-300">
            {item.marcador && (
              <span className="rounded border border-slate-200 bg-slate-50 px-2 py-0.5 dark:border-slate-700 dark:bg-slate-800">
                Marcador: {item.marcador}
              </span>
            )}
            {item.capitan && (
              <span className="rounded border border-slate-200 bg-slate-50 px-2 py-0.5 dark:border-slate-700 dark:bg-slate-800">
                Capitán: {item.capitan}
              </span>
            )}
          </div>
        )}

        {/* Base del podio */}
        <div className="mt-5 w-full">
          <div
            className={`mx-auto h-10 w-5/6 rounded-t-xl shadow-inner bg-gradient-to-br ${metal.base}`}
            style={{ filter: "saturate(0.9)" }}
          />
        </div>
      </div>
    </motion.article>
  );
}

function SkeletonPodios() {
  return (
    <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-6">
      {[...Array(2)].map((_, i) => (
        <div key={i} className="h-56 rounded-2xl bg-slate-200 animate-pulse" />
      ))}
    </div>
  );
}

function groupBy(arr, keyFn) {
  const map = new Map();
  for (const it of arr) {
    const k = keyFn(it);
    if (!map.has(k)) map.set(k, []);
    map.get(k).push(it);
  }
  return map;
}
