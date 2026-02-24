import { Routes, Route } from "react-router-dom";
import HomePage from "./pages/HomePage.jsx";
import EvalPage from "./pages/EvalPage.jsx";
import ResultPage from "./pages/ResultPage.jsx";
import AdminPage from "./pages/AdminPage.jsx";

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<HomePage />} />
      <Route path="/eval/:token" element={<EvalPage />} />
      <Route path="/result/:token" element={<ResultPage />} />
      <Route path="/admin" element={<AdminPage />} />
    </Routes>
  );
}
