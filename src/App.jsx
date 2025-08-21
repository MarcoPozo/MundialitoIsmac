import { Routes, Route } from "react-router-dom";
import Layout from "./components/Layout";
import Home from "./views/Home";

export default function App() {
  return (
    <Routes>
      <Route element={<Layout />}>
        <Route index element={<Home />} />
      </Route>
    </Routes>
  );
}
