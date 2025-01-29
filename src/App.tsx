import { BrowserRouter as Router, Routes, Route, Link } from "react-router-dom";
import DoctorPage from "./pages/DoctorPage";
import PharmacyPage from "./pages/PharmacyPage";

function App() {
  return (
    <Router>
      <div className="min-h-screen bg-gray-100 p-10">
        <nav className="mb-4 flex gap-4">
          <Link to="/doctor" className="text-blue-500">Doctor</Link>
          <Link to="/pharmacy" className="text-green-500">Pharmacy</Link>
        </nav>
        <Routes>
          <Route path="/doctor" element={<DoctorPage />} />
          <Route path="/pharmacy" element={<PharmacyPage />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
