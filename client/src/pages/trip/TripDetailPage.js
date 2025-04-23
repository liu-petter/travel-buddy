import React, { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { MapContainer, TileLayer, Marker, Popup, useMap } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import L from "leaflet";
import "./TripDetailPage.css";

// Fix default Leaflet marker icons
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png",
  iconUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png",
  shadowUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png",
});

// force Leaflet map to resize correctly 
const ResizeMapOnShow = () => {
  const map = useMap();
  useEffect(() => {
    setTimeout(() => {
      map.invalidateSize();
    }, 300);
  }, [map]);
  return null;
};

// calculate distance in miles between two lat and lng points using formula
const calculateDistance = (lat1, lon1, lat2, lon2) => {
  const toRad = (val) => (val * Math.PI) / 180;
  const R = 3958.8; // radius of earth 

  const dLat = toRad(lat2 - lat1);
  const dLon = toRad(lon2 - lon1);

  const a =
    Math.sin(dLat / 2) ** 2 +
    Math.cos(toRad(lat1)) * Math.cos(toRad(lat2)) * Math.sin(dLon / 2) ** 2;

  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return (R * c).toFixed(1);
};

const TripDetailPage = () => {
  const [searchParams] = useSearchParams();
  const city = searchParams.get("city");

  const [tripData, setTripData] = useState([]);
  const [showMap, setShowMap] = useState(false);
  const [userLocation, setUserLocation] = useState(null);

  useEffect(() => {
    // load trip data from localStorage
    const key = `trip_${city?.toLowerCase()}`;
    const data = localStorage.getItem(key);
    if (data) {
      setTripData(JSON.parse(data));
    }

    // get user's current location
    navigator.geolocation.getCurrentPosition(
      (position) => {
        setUserLocation({
          lat: position.coords.latitude,
          lng: position.coords.longitude,
        });
      },
      (err) => {
        console.warn("Geolocation error:", err);
      }
    );
  }, [city]);

  const toggleMap = () => {
    setShowMap((prev) => !prev);
  };

  const visiblePlaces = tripData.filter(
    (loc) => loc.latitude && loc.longitude
  );

  return (
    <div className="trip-detail-page">
      <h2>{tripData.length > 0 ? `${city} Trip Plan` : "No trip data found."}</h2>

      {/* list of locations distance from user */}
      <div className="location-cards">
        {tripData.map((place, index) => (
          <div key={index} className="location-card">
            <h3>{place.activity}</h3>
            <p>{place.exact_address}</p>
            {userLocation && place.latitude && place.longitude && (
              <p style={{ color: "#666", fontSize: "0.9rem" }}>
                {calculateDistance(
                  userLocation.lat,
                  userLocation.lng,
                  place.latitude,
                  place.longitude
                )}{" "}
                miles from you
              </p>
            )}
          </div>
        ))}
      </div>

      {/*  map view of selected locations */}
      {visiblePlaces.length > 0 && (
        <>
          <button onClick={toggleMap} className="map-toggle-btn">
            {showMap ? "Hide Map" : "View Map"}
          </button>

          {showMap && (
            <MapContainer
              center={[visiblePlaces[0].latitude, visiblePlaces[0].longitude]}
              zoom={13}
              style={{ width: "100%", height: "400px", marginTop: "20px" }}
              className="trip-map"
            >
              <ResizeMapOnShow />
              <TileLayer
                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                attribution="&copy; OpenStreetMap contributors"
              />
              {visiblePlaces.map((loc, idx) => (
                <Marker key={idx} position={[loc.latitude, loc.longitude]}>
                  <Popup>{loc.activity}</Popup>
                </Marker>
              ))}
            </MapContainer>
          )}
        </>
      )}
    </div>
  );
};

export default TripDetailPage;
