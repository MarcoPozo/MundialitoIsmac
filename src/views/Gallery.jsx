import { FaImages, FaHome } from "react-icons/fa";
import { Link } from "react-router-dom";

export default function Gallery() {
  return (
    <section className="mx-auto max-w-3xl">
      <div className="rounded-md border border-emerald-100 bg-emerald-50 p-6 text-emerald-900">
        <div className="flex items-center gap-3">
          <FaImages className="text-2xl" />
          <h1 className="text-xl sm:text-2xl font-bold">Galería</h1>
        </div>

        <p className="mt-3 text-sm sm:text-base">
          Estamos trabajando en esta sección. Pronto podrás ver las fotos del
          campeonato <strong>Mundialito ISMAC</strong>.
        </p>

        <div className="mt-4 flex gap-2">
          <Link
            to="/"
            className="inline-flex items-center gap-2 rounded-md bg-emerald-600 px-4 py-2 text-white hover:bg-emerald-700">
            <FaHome />
            Volver al inicio
          </Link>
        </div>
      </div>
    </section>
  );
}
