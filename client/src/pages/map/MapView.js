import React, { useEffect, useState } from 'react';
import {
  MapContainer,
  TileLayer,
  Marker,
  Popup,
  useMap,
} from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';
import './MapView.css';
import { useNavigate } from "react-router-dom"
import { auth } from "../../config/firebase"
import { onAuthStateChanged } from "firebase/auth";

// Fix marker icon paths
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: require('leaflet/dist/images/marker-icon-2x.png'),
  iconUrl: require('leaflet/dist/images/marker-icon.png'),
  shadowUrl: require('leaflet/dist/images/marker-shadow.png'),
});

function calculateDistance(lat1, lon1, lat2, lon2) {
  const R = 6371;
  const dLat = (lat2 - lat1) * Math.PI / 180;
  const dLon = (lon2 - lon1) * Math.PI / 180;
  const a =
    Math.sin(dLat / 2) ** 2 +
    Math.cos(lat1 * Math.PI / 180) *
    Math.cos(lat2 * Math.PI / 180) *
    Math.sin(dLon / 2) ** 2;
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c * 0.621371;
}

function ChangeMapView({ coords }) {
  const map = useMap();
  useEffect(() => {
    map.setView(coords, 12);
  }, [coords, map]);
  return null;
}

function MapView() {
  const [locations, setLocations] = useState([]);
  const [userLocation, setUserLocation] = useState(null);

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
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (pos) => {
          setUserLocation({
            lat: pos.coords.latitude,
            lng: pos.coords.longitude,
          });
        },
        (err) => console.warn('Geolocation error:', err.message)
      );
    }
  }, []);

  useEffect(() => {
    const liked = localStorage.getItem('likedPlaces');
    if (liked) {
      setLocations(JSON.parse(liked));
    } else {
      fetch('/locations.json')
        .then((res) => res.json())
        .then((data) => setLocations(data));
    }
  }, []);

  const validLocations = locations.filter(
    (loc) => loc.latitude !== null && loc.longitude !== null
  );

  const defaultCenter =
    validLocations.length > 0
      ? [validLocations[0].latitude, validLocations[0].longitude]
      : [52.52, 13.405];

  const getDistance = (loc) => {
    const ref = userLocation || { lat: 52.52, lng: 13.405 };
    return calculateDistance(ref.lat, ref.lng, loc.latitude, loc.longitude).toFixed(2);
  };

  return (
    <div className="map-wrapper">
      <MapContainer center={defaultCenter} zoom={12} style={{ height: '100vh', width: '75%' }}>
        <TileLayer
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          attribution="&copy; OpenStreetMap contributors"
        />
        <ChangeMapView coords={defaultCenter} />

        {userLocation && (
          <Marker position={[userLocation.lat, userLocation.lng]}>
            <Popup>You are here</Popup>
          </Marker>
        )}

        {validLocations.map((loc, i) => (
          <Marker key={i} position={[loc.latitude, loc.longitude]}>
            <Popup>
              <strong>{loc.activity}</strong>
              <br />
              {loc.exact_address}
              <br />
              <em>{getDistance(loc)} miles from you</em>
            </Popup>
          </Marker>
        ))}
      </MapContainer>

      <div className="sidebar">
        <h3>Distances from you</h3>
        {validLocations.map((loc, i) => (
          <p key={i}>
            📍 <strong>{loc.activity}</strong>: {getDistance(loc)} miles
          </p>
        ))}
      </div>
    </div>
  );
}

export default MapView;
