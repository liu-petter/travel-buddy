import React from 'react';
import { FaCompass, FaMagic, FaUserCog, FaEdit, FaSuitcase, FaSearch, FaMapMarkerAlt, FaCalendarAlt } from 'react-icons/fa';
import "./index.css"

const DashboardPage = () => {
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
            <button className="btn"><FaMagic /> Generate Travel Plan</button>
          </div>

          <div className="card">
            <h3><FaUserCog /> Your Preferences</h3>
            <div className="preference-item">
              <span className="preference-label">Budget:</span>
              <span className="preference-value">$300</span>
            </div>
            <div className="preference-item">
              <span className="preference-label">Activity Type:</span>
              <span className="preference-value">Outdoor, Culture</span>
            </div>
            <div className="preference-item">
              <span className="preference-label">Preferred Distance:</span>
              <span className="preference-value">5 miles</span>
            </div>
            <button className="btn btn-outline"><FaEdit /> Edit Preferences</button>
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
            <button className="btn"><FaSearch /> View All Trips</button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DashboardPage;