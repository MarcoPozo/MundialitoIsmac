import { Routes, Route } from "react-router-dom";
import Layout from "./components/Layout";
import Home from "./views/Home";
import Gallery from "./views/Gallery";
import Table from "./views/Table";
import Teams from "./views/Teams";
import Schedule from "./views/Schedule";
import Champions from "./views/Champions";

export default function App() {
  return (
    <Routes>
      <Route element={<Layout />}>
        <Route index element={<Home />} />
        <Route path="galeria" element={<Gallery />} />
        <Route path="tabla" element={<Table />} />
        <Route path="equipos" element={<Teams />} />
        <Route path="cronograma" element={<Schedule />} />
        <Route path="campeones" element={<Champions />} />
      </Route>
    </Routes>
  );
}
