import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import PreferencesPage from "./pages/preferences";
import DashboardPage from "./pages/dashbord";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<DashboardPage/>} />
        <Route path="/preferences" element={<PreferencesPage />} />
      </Routes>
    </Router>
  );
}

export default App;
