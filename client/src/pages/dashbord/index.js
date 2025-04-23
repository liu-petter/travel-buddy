import React from 'react';
import { useNavigate } from 'react-router-dom';
import { FaCompass, FaMagic, FaSuitcase } from 'react-icons/fa';
import YourTrips from "./YourTrips";
import "./index.css";

const DashboardPage = () => {
  const navigator = useNavigate();

  return (
    <div className="travel-buddy">
      {}
      <header>
        <h1>Welcome Back, Explorer!</h1>
        <p>Your personalized travel planning assistant to help you discover amazing destinations tailored just for you.</p>
      </header>

      {}
      <div className="container">
        <div className="card-grid">
          {}
          <div className="card">
            <h3><FaCompass /> Quick Start</h3>
            <p>Generate a customized travel plan based on your preferences and past trips.</p>
            <button className="btn" onClick={() => navigator("/create-plan")}>
              <FaMagic /> Generate Travel Plan
            </button>
          </div>

          {}
          <div className="card your-trips-card">
            <h3><FaSuitcase /> Your Trips</h3>
            <YourTrips />
          </div>
        </div>
      </div>
    </div>
  );
};

export default DashboardPage;
