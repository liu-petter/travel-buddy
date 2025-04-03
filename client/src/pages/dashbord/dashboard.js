import React from 'react';
//import TripCard from './trip';
//import PreferenceItem from './pref';
import './dash.css';

const Dashboard = () => {
  return (
    <>
      <header>
        <h1>Welcome Back, Explorer!</h1>
        <p>Your personalized travel planning assistant...</p>
      </header>

      <div className="container">
        <div className="card-grid">
          {/* Quick Start Card */}
          <div className="card">
            <h3><i className="fas fa-compass"></i> Quick Start</h3>
            <p>Generate a customized travel plan...</p>
            <button className="btn"><i className="fas fa-magic"></i> Generate Travel Plan</button>
          </div>

          {/* Preferences Card *
          <div className="card">
            <h3><i className="fas fa-user-cog"></i> Your Preferences</h3>
            <PreferenceItem label="Budget:" value="$1000" />
            <PreferenceItem label="Activity Type:" value="Outdoor, Culture" />
            <PreferenceItem label="Preferred Distance:" value="5 km" />
            <button className="btn btn-outline"><i className="fas fa-edit"></i> Edit Preferences</button>
          </div> */}

          {/* Trips Card
          <div className="card">
            <h3><i className="fas fa-suitcase"></i> Your Trips</h3>
            <TripCard 
              title="Weekend Beach Getaway" 
              location="Malibu, California" 
              date="Jun 10-12" 
            />
            <TripCard 
              title="Mountain Adventure" 
              location="Rocky Mountains" 
              date="Aug 5-12" 
            />
            <button className="btn"><i className="fas fa-search"></i> View All Trips</button>
          </div> */}
        </div>
      </div>
    </>
  );
};

export default Dashboard;