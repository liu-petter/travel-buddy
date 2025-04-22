import React from 'react';
import { useNavigate } from 'react-router-dom';
import { FaCompass, FaMagic, FaSuitcase, FaMapMarkerAlt, FaCalendarAlt } from 'react-icons/fa';
import "./index.css"

const DashboardPage = () => {
  const navigator = useNavigate();

  return (
    <div className="travel-buddy">
      {/* Header */}
      <header>
        <h1>Welcome Back, Explorer!</h1>
        <p>Your personalized travel planning assistant to help you discover amazing destinations tailored just for you.</p>
      </header>

      {/* Main Content */}
      <div className="container">
        <div className="card-grid">
          <div className="card">
            <h3><FaCompass /> Quick Start</h3>
            <p>Generate a customized travel plan based on your preferences and past trips.</p>
            <button className="btn" onClick={()=>navigator("/create-plan")}><FaMagic /> Generate Travel Plan</button>
          </div>

          <div className="card">
            <h3><FaSuitcase /> Your Trips</h3>
            <div className="trip-card">
              <h4>Weekend Beach Getaway</h4>
              <p><FaMapMarkerAlt /> Malibu, California • <FaCalendarAlt /> Jun 10-12</p>
            </div>
            <div className="trip-card">
              <h4>Mountain Adventure</h4>
              <p><FaMapMarkerAlt /> Rocky Mountains • <FaCalendarAlt /> Aug 5-12</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DashboardPage;