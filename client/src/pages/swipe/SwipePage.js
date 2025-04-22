import React, { useEffect, useState } from 'react';
import TinderCard from 'react-tinder-card';
import { MapContainer, TileLayer, Marker } from 'react-leaflet';
import { useNavigate } from "react-router-dom"
import { auth } from "../../config/firebase"
import { onAuthStateChanged } from "firebase/auth";
import 'leaflet/dist/leaflet.css';
import './SwipePage.css';

const SwipePage = () => {
  const [places, setPlaces] = useState([]);
  const [liked, setLiked] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  
  const navigator = useNavigate();
  
  // bring user to dashboard if not logged in
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (!user) {
        navigator("/");
      }
    });
    return () => unsubscribe();
  }, [navigator]);

  useEffect(() => {
    fetch('/locations.json')
      .then((res) => res.json())
      .then((data) => {
        console.log('Loaded locations:', data);
        setPlaces(data);
        setCurrentIndex(0);
      })
      .catch((err) => console.error('Error loading locations.json:', err));
  }, []);

  const handleSwipe = (direction, place) => {
    if (direction === 'right') {
      setLiked((prev) => [...prev, place]);
    }
    setCurrentIndex((prev) => prev + 1);
  };

  const handleDone = () => {
    localStorage.setItem('likedPlaces', JSON.stringify(liked));
    window.location.href = '/map';
  };

  return (
    <div className="swipe-page">
      <h2>Swipe to Select Places You Like</h2>

      <div className="card-container">
        {places.length > 0 && currentIndex < places.length && (
          <TinderCard
            key={currentIndex}
            onSwipe={(dir) => {
              const place = places[currentIndex];
              setTimeout(() => handleSwipe(dir, place), 0);
            }}
            preventSwipe={['up', 'down']}
          >
            <div className="card">
              <h3>{places[currentIndex].activity}</h3>
              <p>{places[currentIndex].exact_address}</p>

              {places[currentIndex].latitude && places[currentIndex].longitude ? (
                <div className="mini-map">
                  <MapContainer
                    center={[places[currentIndex].latitude, places[currentIndex].longitude]}
                    zoom={13}
                    scrollWheelZoom={false}
                    dragging={false}
                    doubleClickZoom={false}
                    zoomControl={false}
                    style={{ height: '200px', width: '100%', marginTop: '15px', borderRadius: '8px' }}
                  >
                    <TileLayer
                      url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                      attribution="&copy; OpenStreetMap contributors"
                    />
                    <Marker position={[places[currentIndex].latitude, places[currentIndex].longitude]} />
                  </MapContainer>
                </div>
              ) : (
                <p style={{ fontStyle: 'italic', color: '#888' }}>
                  📍 Map preview unavailable for this location
                </p>
              )}
            </div>
          </TinderCard>
        )}
      </div>

      {currentIndex >= places.length && places.length > 0 && (
        <button onClick={handleDone} className="done-btn">
           View Your Selected Places
        </button>
      )}

      {places.length === 0 && (
        <p className="status-message">❗ No locations found. Try generating a new plan.</p>
      )}
    </div>
  );
};

export default SwipePage;
