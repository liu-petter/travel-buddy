import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import LoginPage from "./pages/login";
import PreferencesPage from "./pages/preferences";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<LoginPage />} />
        <Route path="/preferences" element={<PreferencesPage />} />
      </Routes>
    </Router>
  );
}

export default App;
