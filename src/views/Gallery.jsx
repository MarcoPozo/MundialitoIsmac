import { useEffect, useMemo, useRef, useState } from "react";
import {
  FaImages,
  FaSearch,
  FaTimes,
  FaChevronLeft,
  FaChevronRight,
  FaDownload,
} from "react-icons/fa";

const PAGE_SIZE = 20;

export default function Gallery() {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [query, setQuery] = useState("");
  const [tag, setTag] = useState("todas");
  const [visible, setVisible] = useState(PAGE_SIZE);
  const [openIdx, setOpenIdx] = useState(null);

  const sentinelRef = useRef(null);

  // Cargar JSON
  useEffect(() => {
    const ctrl = new AbortController();
    (async () => {
      try {
        const r = await fetch("/data/gallery.json", {
          cache: "no-store",
          signal: ctrl.signal,
        });

        if (!r.ok) throw new Error("No se pudo cargar la galería");
        const data = await r.json();
        setItems(Array.isArray(data) ? data : []);
      } catch (error) {
        if (error.name !== "AbortError") setError(error.message);
      } finally {
        setLoading(false);
      }
    })();
    return () => ctrl.abort();
  }, []);

  // Tags
  const tagsDisponibles = useMemo(() => {
    const s = new Set();
    items.forEach((it) => (it.tags || []).forEach((t) => s.add(t)));
    return ["todas", ...Array.from(s).sort()];
  }, [items]);

  // Filtros y orden por fecha
  const normalizedQuery = query.trim().toLocaleLowerCase();
  const filtrados = useMemo(() => {
    let arr = [...items];
    if (tag !== "todas") {
      arr = arr.filter((it) => (it.tags || []).includes(tag));
    }

    if (normalizedQuery) {
      arr = arr.filter(
        (it) =>
          (it.alt || "").toLowerCase().includes(normalizedQuery) ||
          (it.tags || []).some((t) => t.toLowerCase().includes(normalizedQuery))
      );
    }
    arr.sort((a, b) => new Date(b.fecha || 0) - new Date(a.fecha || 0));
    return arr;
  }, [items, tag, normalizedQuery]);

  // Reset paginación
  useEffect(() => setVisible(PAGE_SIZE), [tag, normalizedQuery]);

  // Paginación infinita
  useEffect(() => {
    if (!sentinelRef.current) return;
    if (visible >= filtrados.length) return;

    const io = new IntersectionObserver(
      (entries) => {
        const e = entries[0];
        if (e.isIntersecting) {
          setVisible((v) => Math.min(v + PAGE_SIZE, filtrados.length));
        }
      },
      { root: null, rootMargin: "200px 0px", threshold: 0 }
    );

    io.observe(sentinelRef.current);
    return () => io.disconnect();
  }, [filtrados.length, visible]);

  // Teclas lightbox
  useEffect(() => {
    const onKey = (e) => {
      if (openIdx === null) return;
      if (e.key === "Escape") setOpenIdx(null);
      if (e.key === "ArrowLeft") setOpenIdx((i) => (i > 0 ? i - 1 : i));
      if (e.key === "ArrowRight")
        setOpenIdx((i) =>
          i < Math.min(visible, filtrados.length) - 1 ? i + 1 : i
        );
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [openIdx, visible, filtrados.length]);

  // Prefetch siguiente imagen
  useEffect(() => {
    if (openIdx === null) return;
    const next = filtrados[openIdx + 1];
    if (!next?.full) return;
    const link = document.createElement("link");
    link.rel = "preload";
    link.as = "image";
    link.href = next.full;
    document.head.appendChild(link);
    return () => document.head.removeChild(link);
  }, [openIdx, filtrados]);

  const visibleItems = filtrados.slice(0, visible);

  return (
    <section className="mx-auto max-w-6xl px-4">
      {/* Header */}
      <header className="mb-4 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
        <div className="flex items-center gap-3">
          <FaImages className="text-2xl text-emerald-600" />
          <h1 className="text-xl sm:text-2xl font-bold">Galería</h1>
        </div>

        {/* Controles */}
        <div className="flex flex-col sm:flex-row gap-2 sm:items-center">
          <div className="relative w-full sm:w-64">
            <FaSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" />
            <input
              type="search"
              placeholder="Buscar"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              className="w-full rounded-md border border-slate-300 pl-9 pr-3 py-1.5 outline-none focus:ring-2 focus:ring-emerald-300"
            />
          </div>

          <select
            value={tag}
            onChange={(e) => setTag(e.target.value)}
            className="rounded-md border border-slate-300 px-3 py-1.5 outline-none focus:ring-2 focus:ring-emerald-300">
            {tagsDisponibles.map((t) => (
              <option key={t} value={t}>
                {t[0].toUpperCase() + t.slice(1)}
              </option>
            ))}
          </select>
        </div>
      </header>

      {/* Errores */}
      {error && (
        <div className="mb-4 rounded-md border border-red-200 bg-red-50 p-3 text-sm text-red-700">
          {error}
        </div>
      )}

      {/* Grid */}
      {loading ? (
        <SkeletonGrid />
      ) : visibleItems.length ? (
        <>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3 [content-visibility:auto] [contain-intrinsic-size:1px_1200px]">
            {visibleItems.map((it, idx) => (
              <Thumb key={it.id} item={it} onClick={() => setOpenIdx(idx)} />
            ))}
          </div>

          {/* Paginacion infinita */}
          <div ref={sentinelRef} className="h-8" />
        </>
      ) : (
        <p className="text-slate-500">
          No hay resultados con los filtros actuales.
        </p>
      )}

      {/* Lightbox */}
      {openIdx !== null && visibleItems[openIdx] && (
        <Lightbox
          items={visibleItems}
          index={openIdx}
          onClose={() => setOpenIdx(null)}
          onPrev={() => setOpenIdx((i) => (i > 0 ? i - 1 : i))}
          onNext={() =>
            setOpenIdx((i) => (i < visibleItems.length - 1 ? i + 1 : i))
          }
        />
      )}
    </section>
  );
}

function SkeletonGrid() {
  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
      {[...Array(8)].map((_, idx) => (
        <div
          key={idx}
          className="aspect-[4/3] rounded-md bg-slate-200 animate-pulse"
        />
      ))}
    </div>
  );
}

function Thumb({ item, onClick }) {
  return (
    <button
      type="button"
      className="group relative overflow-hidden rounded-md border border-slate-200 bg-white cursor-pointer"
      onClick={onClick}>
      <img
        src={item.thumb}
        srcSet={`${item.thumb} 480w, ${item.full} 800w`}
        sizes="(min-width: 768px) 25vw, 50vw"
        alt={item.alt || "Foto del torneo"}
        loading="lazy"
        decoding="async"
        width="640"
        height="480"
        className="aspect-[4/3] w-full object-cover transition-transform duration-200 group-hover:scale-[1.03]"
      />
      {(item.alt || item.tags?.length) && (
        <span className="absolute inset-x-0 bottom-0 line-clamp-1 bg-black/45 px-2 py-1 text-[11px] text-white">
          {item.alt || (item.tags || []).join(", ")}
        </span>
      )}
    </button>
  );
}

function Lightbox({ items, index, onClose, onPrev, onNext }) {
  const cur = items[index];

  useEffect(() => {
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = prev;
    };
  }, []);

  // Nombre descarga
  const filename =
    (cur.full && cur.full.split("/").pop()) || `foto-${cur.id}.webp`;

  return (
    <>
      <div className="fixed inset-0 z-50 bg-black/70" onClick={onClose} />
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
        <div className="relative max-h-[90vh] w-auto max-w-[90vw]">
          <img
            src={cur.full}
            alt={cur.alt || "Foto del torneo"}
            className="max-h-[90vh] w-auto max-w-[90vw] rounded-md shadow-2xl"
            decoding="async"
          />

          {/* Cerrar */}
          <button
            type="button"
            className="absolute -top-3 -right-3 rounded-full bg-white p-2 text-slate-700 shadow hover:bg-slate-100 cursor-pointer"
            aria-label="Cerrar"
            onClick={onClose}>
            <FaTimes />
          </button>

          {/* Descargar */}
          <a
            href={cur.full}
            download={filename}
            className="absolute -top-3 right-10 rounded-full bg-white p-2 text-slate-700 shadow hover:bg-slate-100 cursor-pointer"
            aria-label="Descargar imagen"
            title="Descargar imagen">
            <FaDownload />
          </a>

          {/* Anterior / Siguiente */}
          <button
            type="button"
            className="absolute left-0 top-1/2 -translate-y-1/2 rounded-full bg-white/90 p-2 text-slate-700 shadow hover:bg-white cursor-pointer"
            onClick={onPrev}
            aria-label="Anterior">
            <FaChevronLeft />
          </button>
          <button
            type="button"
            className="absolute right-0 top-1/2 -translate-y-1/2 rounded-full bg-white/90 p-2 text-slate-700 shadow hover:bg-white cursor-pointer"
            onClick={onNext}
            aria-label="Siguiente">
            <FaChevronRight />
          </button>

          {/* Pie de foto */}
          {(cur.alt || cur.tags?.length || cur.fecha) && (
            <div className="mt-2 text-center text-xs text-white/90">
              {cur.alt && <div>{cur.alt}</div>}
              <div className="mt-1 flex flex-wrap items-center justify-center gap-2">
                {cur.fecha && (
                  <span className="rounded bg-black/40 px-2 py-0.5">
                    {cur.fecha}
                  </span>
                )}
                {(cur.tags || []).map((t) => (
                  <span key={t} className="rounded bg-black/40 px-2 py-0.5">
                    #{t}
                  </span>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </>
  );
}
