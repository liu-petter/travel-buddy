import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import PreferencesPage from "./pages/preferences";
import DashboardPage from "./pages/dashbord";
import CreatePlanPage from "./pages/createPlan";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<DashboardPage/>} />
        <Route path="/preferences" element={<PreferencesPage />} />
        <Route path="/create-plan" element={<CreatePlanPage />} />
      </Routes>
    </Router>
  );
}

export default App;
