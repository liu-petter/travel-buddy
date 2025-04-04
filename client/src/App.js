import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import LoginPage from "./pages/login";
import PreferencesPage from "./pages/preferences";
import SignupPage from "./pages/signup";
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
