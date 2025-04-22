import React, { useEffect, useState } from 'react';
import TinderCard from 'react-tinder-card';
import { MapContainer, TileLayer, Marker } from 'react-leaflet';
import { useNavigate } from "react-router-dom"
import { auth } from "../../config/firebase"
import { onAuthStateChanged } from "firebase/auth";
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';
import './SwipePage.css';

const SwipePage = () => {
  const [places, setPlaces] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  
  const navigate = useNavigate();
  
  // bring user to dashboard if not logged in
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (!user) {
        navigate("/");
      }
    });
    return () => unsubscribe();
  }, [navigate]);

  useEffect(() => {
    const selected = JSON.parse(localStorage.getItem('selectedTrip'));
    if (!selected || !selected.city) return;

    const cityKey = `trip_${selected.city.toLowerCase()}`;
    const tripLocations = JSON.parse(localStorage.getItem(cityKey)) || [];
    setPlaces(tripLocations);
    setCurrentIndex(0);
  }, []);

  const handleSwipe = (dir, index) => {
    if (dir === 'right') {
      const selected = JSON.parse(localStorage.getItem('selectedTrip'));
      const key = `trip_${selected.city.toLowerCase()}`;
      const liked = JSON.parse(localStorage.getItem(key)) || [];
      liked.push(places[index]);
      localStorage.setItem(key, JSON.stringify(liked));
    }
    setCurrentIndex((prev) => prev + 1);
  };

  return (
    <div className="swipe-page">
      <h2>Swipe to Select Places You Like</h2>
      <div className="card-container">
        {places.length > 0 && currentIndex < places.length && (
          <TinderCard
            key={currentIndex}
            onSwipe={(dir) => handleSwipe(dir, currentIndex)}
            preventSwipe={['up', 'down']}
          >
            <div className="card">
              <h3>{places[currentIndex].activity}</h3>
              <p>{places[currentIndex].exact_address}</p>
              {places[currentIndex].latitude && places[currentIndex].longitude ? (
                <div className="mini-map">
                  <MapContainer
                    center={[places[currentIndex].latitude, places[currentIndex].longitude]}
                    zoom={15}
                    scrollWheelZoom={false}
                    style={{ height: '200px', width: '100%' }}
                    dragging={false}
                    zoomControl={false}
                    doubleClickZoom={false}
                    attributionControl={false}
                  >
                    <TileLayer
                      url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                    />
                    <Marker
                      position={[places[currentIndex].latitude, places[currentIndex].longitude]}
                      icon={L.icon({
                        iconUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon.png',
                        iconSize: [25, 41],
                        iconAnchor: [12, 41],
                      })}
                    />
                  </MapContainer>
                </div>
              ) : (
                <p style={{ fontSize: '14px', marginTop: '10px', color: '#777' }}>
                  (No map preview available for this location)
                </p>
              )}
            </div>
          </TinderCard>
        )}

        {currentIndex >= places.length && (
          <div className="swipe-end">
            <p>No more places to swipe.</p>
            <button onClick={() => setCurrentIndex(0)}>Restart Swiping</button>
          </div>
        )}
      </div>
    </div>
  );
};

export default SwipePage;
