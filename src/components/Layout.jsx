import logoCamaleon from "../assets/images/logoCamaleon.png";
import { AnimatePresence, motion } from "framer-motion";
import { useEffect, useRef, useState } from "react";
import { NavLink, Outlet } from "react-router-dom";

import {
  FaHome,
  FaCalendarAlt,
  FaTable,
  FaUsers,
  FaImages,
  FaRegCopyright,
} from "react-icons/fa";
import { FaBars, FaXmark } from "react-icons/fa6";

export default function Layout() {
  const [open, setOpen] = useState(false);
  const panelRef = useRef(null);
  const btnRef = useRef(null);

  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    return () => (document.body.style.overflow = "");
  }, [open]);

  useEffect(() => {
    function onClickOutside(event) {
      if (!open) return;
      if (
        panelRef.current &&
        !panelRef.current.contains(event.target) &&
        !btnRef.current.contains(event.target)
      ) {
        setOpen(false);
      }
    }

    document.addEventListener("mousedown", onClickOutside);
    return () => document.removeEventListener("mousedown", onClickOutside);
  }, [open]);

  return (
    <div className="min-h-dvh bg-slate-50 text-slate-900">
      {/* Navbar */}
      <header className="sticky top-0 z-50 bg-white/90 backdrop-blur border-b border-slate-200">
        <nav className="mx-auto max-w-6xl px-4 py-3 flex items-center justify-between">
          <div className="flex items-center gap-3 min-w-0">
            <img
              src={logoCamaleon}
              alt="Logo camaleon"
              className="size-8 shrink-0"
            />
            <h2 className="font-bold truncate">Mundialito Ismac</h2>
          </div>

          {/* Menu Hamburguesa */}
          <button
            ref={btnRef}
            type="button"
            className={`inline-flex items-center gap-2 rounded-md border border-slate-200 px-3 py-1.5 hover:bg-slate-100 md:hidden ${
              open ? "opacity-0 pointer-events-none" : ""
            }`}
            onClick={() => setOpen((v) => !v)}>
            <FaBars />
          </button>

          {/* Menu Horizontal */}
          <div className="hidden md:flex gap-2">
            <LinkItem to="/" icon={<FaHome />}>
              Inicio
            </LinkItem>
            <LinkItem to="/partidos" icon={<FaCalendarAlt />}>
              Cronograma
            </LinkItem>
            <LinkItem to="/tabla" icon={<FaTable />}>
              Tabla
            </LinkItem>
            <LinkItem to="/equipos" icon={<FaUsers />}>
              Equipos
            </LinkItem>
            <LinkItem to="/galeria" icon={<FaImages />}>
              Galería
            </LinkItem>
          </div>
        </nav>
      </header>

      {/* Drawer */}
      <AnimatePresence>
        {open && (
          <>
            <motion.div
              className="fixed inset-0 z-[60] bg-black/40"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setOpen(false)}
            />

            {/* Panel */}
            <motion.aside
              id="mobile-menu"
              ref={panelRef}
              className="fixed left-0 top-0 z-[70] h-full w-72 max-w-[85%] bg-white shadow-xl border-r border-slate-200"
              initial={{ x: -320 }}
              animate={{ x: 0 }}
              exit={{ x: -320 }}
              transition={{ type: "tween", duration: 0.2 }}>
              <div className="flex items-center justify-between px-4 py-3 border-b border-slate-200">
                <div className="flex items-center gap-2">
                  <img
                    src={logoCamaleon}
                    alt="Logo Camaleon"
                    className="size-7"
                  />
                  <strong className="text-sm">Mundialito Ismac</strong>
                </div>

                <button
                  type="button"
                  className="p-2 hover:bg-slate-100"
                  onClick={() => setOpen(false)}>
                  <FaXmark />
                </button>
              </div>

              <nav className="p-2 flex flex-col gap-1">
                <LinkItem
                  mobile
                  to="/"
                  icon={<FaHome />}
                  onNavigate={() => setOpen(false)}>
                  Inicio
                </LinkItem>
                <LinkItem
                  mobile
                  to="/partidos"
                  icon={<FaCalendarAlt />}
                  onNavigate={() => setOpen(false)}>
                  Cronograma
                </LinkItem>
                <LinkItem
                  mobile
                  to="/tabla"
                  icon={<FaTable />}
                  onNavigate={() => setOpen(false)}>
                  Tabla
                </LinkItem>
                <LinkItem
                  mobile
                  to="/equipos"
                  icon={<FaUsers />}
                  onNavigate={() => setOpen(false)}>
                  Equipos
                </LinkItem>
                <LinkItem
                  mobile
                  to="/galeria"
                  icon={<FaImages />}
                  onNavigate={() => setOpen(false)}>
                  Galería
                </LinkItem>
              </nav>
            </motion.aside>
          </>
        )}
      </AnimatePresence>

      <main>
        <Outlet />
      </main>

      <footer className="mt-10 border-t border-slate-200">
        <div className="mx-auto max-w-6xl px-4 py-6 text-sm text-slate-500 flex items-center justify-center">
          <FaRegCopyright className="mr-2" />
          {new Date().getFullYear()} Mundialito ISMAC
        </div>
      </footer>
    </div>
  );
}

function LinkItem({ to, icon, children, mobile = false, onNavigate }) {
  const base =
    "flex items-center gap-2 rounded-md px-3 py-2 whitespace-nowrap transition";
  const activeDesktop = "bg-emerald-500 text-white";
  const idleDesktop = "hover:bg-slate-100";
  const activeMobile =
    "bg-emerald-50 text-emerald-700 border border-emerald-200";
  const idleMobile = "hover:bg-slate-50";

  return (
    <NavLink
      to={to}
      onClick={onNavigate}
      className={({ isActive }) =>
        [
          base,
          mobile
            ? isActive
              ? activeMobile
              : idleMobile
            : isActive
            ? activeDesktop
            : idleDesktop,
        ].join(" ")
      }>
      <span className="text-lg">{icon}</span>
      <span className="text-sm sm:text-base">{children}</span>
    </NavLink>
  );
}
