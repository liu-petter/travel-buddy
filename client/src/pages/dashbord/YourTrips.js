import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { FaMapMarkerAlt, FaCalendarAlt, FaTrash } from 'react-icons/fa';
import './YourTrips.css';

const YourTrips = () => {
  const [trips, setTrips] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    // load saved trips from localStorage and show newest trips first
    const storedTrips = JSON.parse(localStorage.getItem('userTrips')) || [];
    setTrips(storedTrips.slice().reverse());
  }, []);

  const handleTripClick = (trip) => {
    // save selected trip and go to trip detail page
    localStorage.setItem('selectedTrip', JSON.stringify(trip));
    navigate(`/trip?city=${trip.city}`);
  };

  const handleDelete = (city) => {
    const cityKey = city.toLowerCase();

    // remove trip from UI
    const updatedTrips = trips.filter(t => t.city.toLowerCase() !== cityKey);
    setTrips(updatedTrips);

    // update stored trips list
    localStorage.setItem("userTrips", JSON.stringify(updatedTrips));

    // clean up all related data from localStorage
    localStorage.removeItem(`raw_${cityKey}`);
    localStorage.removeItem(`trip_${cityKey}`);
    localStorage.removeItem(`currentSwipeIndex_${cityKey}`);

    // if the deleted trip was selected, it'll get removed
    const selected = JSON.parse(localStorage.getItem("selectedTrip"));
    if (selected?.city?.toLowerCase() === cityKey) {
      localStorage.removeItem("selectedTrip");
    }
  };

  return (
    <div className="your-trips-wrapper">
      {/* if no trips exist, show message */}
      {trips.length === 0 ? (
        <div className="no-trips-message">
          <p>No trips yet. Create a plan to get started!</p>
        </div>
      ) : (
        // rendering each saved trip
        trips.map((trip, index) => (
          <div className="trip-card" key={index}>
            <div onClick={() => handleTripClick(trip)} style={{ cursor: 'pointer' }}>
              <h4>{trip.title}</h4>
              <p>
                <FaMapMarkerAlt /> {trip.city} • <FaCalendarAlt /> {trip.days} day{trip.days > 1 ? 's' : ''}
              </p>
            </div>
            <button
              className="delete-btn"
              onClick={() => handleDelete(trip.city)}
              title="Delete trip"
            >
              <FaTrash />
            </button>
          </div>
        ))
      )}
    </div>
  );
};

export default YourTrips;
