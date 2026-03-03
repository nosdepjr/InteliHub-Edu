import { BrowserRouter, Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import CreateResource from "./pages/CreateResource";
import EditResource from "./pages/EditResource";
import "./styles.css";

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/create" element={<CreateResource />} />
        <Route path="/edit/:id" element={<EditResource />} />
      </Routes>
    </BrowserRouter>
  );
}