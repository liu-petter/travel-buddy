import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import PreferencesPage from "./pages/preferences";
import DashboardPage from "./pages/dashbord";
import CreatePlanPage from './pages/createPlan/CreatePlanPage';
import Navbar from "./components/navbar";
import MapView from "./pages/map/MapView"; // ✅ Correct import

function App() {
  return (
    <Router>
      <Navbar />
      <div>
        <Routes>
          <Route path="/" element={<DashboardPage />} />
          <Route path="/preferences" element={<PreferencesPage />} />
          <Route path="/create-plan" element={<CreatePlanPage />} />
          <Route path="/map" element={<MapView />} /> {/* ✅ New route */}
        </Routes>
      </div>
    </Router>
  );
}

export default App;
