import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { FaMapMarkerAlt, FaCalendarAlt, FaTrash } from 'react-icons/fa';
import './YourTrips.css';

const YourTrips = () => {
  const [trips, setTrips] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const storedTrips = JSON.parse(localStorage.getItem('userTrips')) || [];
    setTrips(storedTrips);
  }, []);

  const handleTripClick = (trip) => {
    localStorage.setItem('selectedTrip', JSON.stringify(trip));
    navigate(`/trip?city=${trip.city}`);
  };

  const handleDelete = (city) => {
    const updated = trips.filter(t => t.city.toLowerCase() !== city.toLowerCase());
    localStorage.setItem('userTrips', JSON.stringify(updated));
    localStorage.removeItem(`trip_${city.toLowerCase()}`);
    setTrips(updated);
  };

  return (
    <div className="your-trips-card">
      {trips.length === 0 ? (
        <p>No trips yet. Create a plan to get started!</p>
      ) : (
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
