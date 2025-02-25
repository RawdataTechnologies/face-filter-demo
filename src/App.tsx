import { CameraKit } from "./contexts/CameraKitContext";
import FilterPage from "./pages/FilterPage";
import { BrowserRouter, Route, Routes } from "react-router";
import SelectionPage from "./pages/SelectionPage";
import PreviewPage from "./pages/PreviewPage";
function App() {
  return (
    <>
      <BrowserRouter>
        <CameraKit>
          <Routes>
            <Route path="/" element={<SelectionPage />} />
            <Route path="/filters" element={<FilterPage />} />
            <Route path="/preview" element={<PreviewPage />} />
          </Routes>
        </CameraKit>
      </BrowserRouter>
    </>
  );
}

export default App;
