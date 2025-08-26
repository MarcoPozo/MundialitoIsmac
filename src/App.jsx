import { Routes, Route } from "react-router-dom";
import Layout from "./components/Layout";
import Home from "./views/Home";
import Gallery from "./views/Gallery";
import Table from "./views/Table";

export default function App() {
  return (
    <Routes>
      <Route element={<Layout />}>
        <Route index element={<Home />} />
        <Route path="galeria" element={<Gallery />} />
        <Route path="tabla" element={<Table />} />
      </Route>
    </Routes>
  );
}
