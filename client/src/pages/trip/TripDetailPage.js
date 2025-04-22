import React, { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { MapContainer, TileLayer, Marker, Popup, useMap } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import L from "leaflet";
import "./TripDetailPage.css";

delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl:
    "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png",
  iconUrl:
    "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png",
  shadowUrl:
    "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png",
});

// Helper to force Leaflet to resize map correctly
const ResizeMapOnShow = () => {
  const map = useMap();
  useEffect(() => {
    setTimeout(() => {
      map.invalidateSize();
    }, 300);
  }, [map]);
  return null;
};

const TripDetailPage = () => {
  const [searchParams] = useSearchParams();
  const city = searchParams.get("city");
  const [tripData, setTripData] = useState([]);
  const [showMap, setShowMap] = useState(false);

  useEffect(() => {
    const key = `trip_${city?.toLowerCase()}`;
    const data = localStorage.getItem(key);
    if (data) {
      setTripData(JSON.parse(data));
    }
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

      <div className="location-cards">
        {tripData.map((place, index) => (
          <div key={index} className="location-card">
            <h3>{place.activity}</h3>
            <p>{place.exact_address}</p>
          </div>
        ))}
      </div>

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
                <Marker
                  key={idx}
                  position={[loc.latitude, loc.longitude]}
                >
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
