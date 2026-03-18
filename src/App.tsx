import { BrowserRouter, Routes, Route, Navigate } from "react-router";
import { ReactFlowProvider } from "@xyflow/react";
import SDRoadmap from "@/components/system-design/SDRoadmap";
import TitleBar from "@/components/TitleBar"


// flex-col: flexbox in vertical direction
// h-screen: height:100vh, div exactly viewport height
export default function App() {
  return (
    <BrowserRouter>
      <div className="h-screen flex flex-col">
        <TitleBar />
        <Routes>
          <Route path="/" element={<Navigate to="/system-design" replace />} />
          <Route path="/system-design" element={<ReactFlowProvider><SDRoadmap /></ReactFlowProvider>} />
        </Routes>
      </div>
    </BrowserRouter>
  );
}
