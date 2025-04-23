import React, { useEffect, useState } from "react";
import TinderCard from "react-tinder-card";
import { MapContainer, TileLayer, Marker } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import L from "leaflet";
import "./SwipePage.css";

const SwipePage = () => {
  const [places, setPlaces] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [showEndMessage, setShowEndMessage] = useState(false);

  useEffect(() => {
    // delay to ensure localStorage is ready before reading (timeout)
    const timer = setTimeout(() => {
      const selected = JSON.parse(localStorage.getItem("selectedTrip"));
      if (!selected || !selected.city) return;

      const rawKey = `raw_${selected.city.toLowerCase()}`;
      const rawData = JSON.parse(localStorage.getItem(rawKey)) || [];

      if (!Array.isArray(rawData) || rawData.length === 0) return;

      console.log("SwipePage loaded with", rawData.length, "places");
      setPlaces(rawData);
      setCurrentIndex(0);
    }, 300);

    return () => clearTimeout(timer);
  }, []);

  const handleSwipe = (dir, index) => {
    const selected = JSON.parse(localStorage.getItem("selectedTrip"));
    if (!selected || !selected.city) return;

    const cityKey = `trip_${selected.city.toLowerCase()}`;
    const existing = JSON.parse(localStorage.getItem(cityKey)) || [];

    // save place if user swiped right (liked it)
    if (dir === "right") {
      const updated = [...existing, places[index]];
      localStorage.setItem(cityKey, JSON.stringify(updated));
    }

    // if this was last card, wrap up the trip
    if (index === places.length - 1) {
      const liked = JSON.parse(localStorage.getItem(cityKey)) || [];

      if (liked.length > 0) {
        const meta = {
          city: selected.city,
          title: selected.city,
          days: selected.days,
          createdAt: Date.now(),
        };

        const existingTrips = JSON.parse(localStorage.getItem("userTrips")) || [];
        const filtered = existingTrips.filter(
          t => t.city.toLowerCase() !== selected.city.toLowerCase()
        );

        localStorage.setItem("userTrips", JSON.stringify([...filtered, meta]));
      } else {
        localStorage.removeItem(cityKey);
        alert("You didn’t like any places, so the trip won’t be saved.");
      }

      setShowEndMessage(true);
    }

    setCurrentIndex(prev => prev + 1);
  };

  return (
    <div className="swipe-page">
      <h2>Swipe to Select Places You Like</h2>

      <div className="swipe-card-container">
        {places.length > 0 && currentIndex < places.length && (
          <TinderCard
            className="swipe-card"
            key={currentIndex}
            onSwipe={(dir) => handleSwipe(dir, currentIndex)}
            preventSwipe={["up", "down"]}
          >
            <div className="card-content">
              <h3>{places[currentIndex].activity}</h3>
              <p>{places[currentIndex].exact_address}</p>

              {places[currentIndex].latitude !== null &&
               places[currentIndex].longitude !== null ? (
                <MapContainer
                  center={[places[currentIndex].latitude, places[currentIndex].longitude]}
                  zoom={13}
                  style={{ height: "200px", width: "100%" }}
                >
                  <TileLayer
                    url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                    attribution="&copy; OpenStreetMap contributors"
                  />
                  <Marker
                    position={[places[currentIndex].latitude, places[currentIndex].longitude]}
                    icon={L.icon({
                      iconUrl: "https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon.png",
                      iconSize: [25, 41],
                      iconAnchor: [12, 41],
                    })}
                  />
                </MapContainer>
              ) : (
                <p style={{ color: "red", fontWeight: "bold" }}>
                  Location unavailable for this place
                </p>
              )}
            </div>
          </TinderCard>
        )}

        {showEndMessage && (
          <div className="end-message" style={{ textAlign: "center", marginTop: "2rem" }}>
            <h3>You’ve finished swiping all the places for this trip</h3>
            <p>You can view your saved trip in <strong>Your Trips</strong>.</p>
            <button
              className="btn"
              onClick={() => window.location.href = "/"}
              style={{ marginTop: "1rem" }}
            >
              Go to Dashboard
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default SwipePage;
