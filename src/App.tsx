import { BrowserRouter, Routes, Route, Navigate } from "react-router";
import { SDRoadmap } from "@/components/system-design/SDRoadmap";
import TitleBar from "@/components/TitleBar"


// TODO: Algo part
export default function App() {
  return (
    <BrowserRouter>
      <TitleBar />
      <Routes>
        <Route path="/" element={<Navigate to="/system-design" replace />} />
        <Route path="/system-design" element={<SDRoadmap />} />
      </Routes>
    </BrowserRouter>
  );
}
