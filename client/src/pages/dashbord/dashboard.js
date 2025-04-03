import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { 
  faCompass, 
  faUserCog, 
  faSuitcase, 
  faMagic, 
  faEdit, 
  faSearch,
  faMapMarkerAlt,
  faCalendarAlt
} from '@fortawesome/free-solid-svg-icons';

const Dashboard = () => {
  return (
    <>
      <header>
        <h1>Welcome Back, Explorer!</h1>
        <p>Your personalized travel planning assistant to help you discover amazing destinations tailored just for you.</p>
      </header>

      <div className="container">
        <div className="card-grid">
          <div className="card">
            <h3><FontAwesomeIcon icon={faCompass} /> Quick Start</h3>
            <p>Generate a customized travel plan based on your preferences and past trips.</p>
            <button className="btn"><FontAwesomeIcon icon={faMagic} /> Generate Travel Plan</button>
          </div>

          <div className="card">
            <h3><FontAwesomeIcon icon={faUserCog} /> Your Preferences</h3>
            <div className="preference-item">
              <span className="preference-label">Budget:</span>
              <span className="preference-value">$1000</span>
            </div>
            <div className="preference-item">
              <span className="preference-label">Activity Type:</span>
              <span className="preference-value">Outdoor, Culture</span>
            </div>
            <div className="preference-item">
              <span className="preference-label">Preferred Distance:</span>
              <span className="preference-value">5 km</span>
            </div>
            <button className="btn btn-outline"><FontAwesomeIcon icon={faEdit} /> Edit Preferences</button>
          </div>

          <div className="card">
            <h3><FontAwesomeIcon icon={faSuitcase} /> Your Trips</h3>
            <div className="trip-card">
              <h4>Weekend Beach Getaway</h4>
              <p>
                <FontAwesomeIcon icon={faMapMarkerAlt} /> Malibu, California • 
                <FontAwesomeIcon icon={faCalendarAlt} /> Jun 10-12
              </p>
            </div>
            <div className="trip-card">
              <h4>Mountain Adventure</h4>
              <p>
                <FontAwesomeIcon icon={faMapMarkerAlt} /> Rocky Mountains • 
                <FontAwesomeIcon icon={faCalendarAlt} /> Aug 5-12
              </p>
            </div>
            <button className="btn"><FontAwesomeIcon icon={faSearch} /> View All Trips</button>
          </div>
        </div>
      </div>
    </>
  );
};

export default Dashboard;