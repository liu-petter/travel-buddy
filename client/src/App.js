import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import DashboardPage from './pages/dashbord';
import CreatePlanPage from './pages/createPlan/CreatePlanPage';
import SwipePage from './pages/swipe/SwipePage';
import MapView from './pages/map/MapView';
import TripDetailPage from './pages/trip/TripDetailPage';
import Navbar from './components/navbar';

function App() {
  return (
    <Router>
      <Navbar />
      <div>
        <Routes>
          <Route path="/" element={<DashboardPage />} />
          <Route path="/create-plan" element={<CreatePlanPage />} />
          <Route path="/swipe" element={<SwipePage />} />
          <Route path="/map" element={<MapView />} />
          <Route path="/trip" element={<TripDetailPage />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
