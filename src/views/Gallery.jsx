import { useEffect, useState } from "react";
import { FaImages, FaTimes } from "react-icons/fa";

export default function Gallery() {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [err, setErr] = useState(null);
  const [openIdx, setOpenIdx] = useState(null); // índice del lightbox

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
        setItems(data);
      } catch (e) {
        if (e.name !== "AbortError") setErr(e.message);
      } finally {
        setLoading(false);
      }
    })();
    return () => ctrl.abort();
  }, []);

  // Cerrar lightbox con ESC
  useEffect(() => {
    const onKey = (e) => e.key === "Escape" && setOpenIdx(null);
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  return (
    <section className="mx-auto max-w-6xl px-4">
      <header className="mb-4 flex items-center gap-3">
        <FaImages className="text-2xl text-emerald-600" />
        <h1 className="text-xl sm:text-2xl font-bold">Galería</h1>
      </header>

      {err && (
        <div className="mb-4 rounded-md border border-red-200 bg-red-50 p-3 text-sm text-red-700">
          {err}
        </div>
      )}

      {loading ? (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
          {[...Array(8)].map((_, i) => (
            <div
              key={i}
              className="aspect-[4/3] rounded-md bg-slate-200 animate-pulse"
            />
          ))}
        </div>
      ) : items.length ? (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
          {items.map((it, idx) => (
            <button
              key={it.id}
              type="button"
              className="group relative overflow-hidden rounded-md border border-slate-200 bg-white"
              onClick={() => setOpenIdx(idx)}>
              <img
                src={it.src}
                alt={it.alt || "Foto del torneo"}
                loading="lazy"
                className="aspect-[4/3] w-full object-cover transition-transform duration-200 group-hover:scale-[1.03] cursor-pointer"
              />
              {it.alt && (
                <span className="absolute inset-x-0 bottom-0 line-clamp-1 bg-black/50 px-2 py-1 text-[11px] text-white">
                  {it.alt}
                </span>
              )}
            </button>
          ))}
        </div>
      ) : (
        <p className="text-slate-500">Aún no hay fotos para mostrar.</p>
      )}

      {/* Lightbox simple */}
      {openIdx !== null && items[openIdx] && (
        <>
          <div
            className="fixed inset-0 z-50 bg-black/70"
            onClick={() => setOpenIdx(null)}
          />
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <div className="relative max-h-[90vh] w-auto max-w-[90vw]">
              <img
                src={items[openIdx].src}
                alt={items[openIdx].alt || "Foto del torneo"}
                className="max-h-[90vh] w-auto max-w-[90vw] rounded-md shadow-2xl"
              />
              <button
                type="button"
                className="absolute -top-3 -right-3 rounded-full bg-white p-2 text-slate-700 shadow hover:bg-slate-100 cursor-pointer"
                aria-label="Cerrar"
                onClick={() => setOpenIdx(null)}>
                <FaTimes />
              </button>
            </div>
          </div>
        </>
      )}
    </section>
  );
}
