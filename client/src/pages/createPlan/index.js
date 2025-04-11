import React, { useState, useEffect } from "react"
import {APIProvider, Map, Marker} from '@vis.gl/react-google-maps';
import "./index.css"

const CreatePlanPage = () => {
  const [userLocation, setUserLocation] = useState(null);
  const [clickedLocation, setClickedLocation] = useState(null);
  const [isConfirmed, setIsConfirmed] = useState(false);

  const handleClickedLocation = (event) => {
    const { latLng } = event.detail;
    const lat = latLng.lat;
    const lng = latLng.lng;
    console.log("Marker created at:", lat, lng);
    setClickedLocation({lat, lng});
    setIsConfirmed(false);
  };

  const handleConfirmLocation = () => {
    console.log("Location confirmed:", clickedLocation);
    setIsConfirmed(true);

    // TODO
    // send location to api
  };

  // get current user location
  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const { latitude, longitude } = position.coords;
          setUserLocation({ lat: latitude, lng: longitude });
        },
        (error) => {
          console.error("Geolocation error:", error);
        }
      );
    } else {
      console.error("Geolocation not supported");
    }
  }, []);

  return (
    <div>
      <APIProvider apiKey={process.env.REACT_APP_GOOGLE_MAPS_API_KEY}>
        <Map
          style={{width: '100vw', height: '100vh'}}
          center={userLocation || {lat: 22.54992, lng: 0}}
          onClick={handleClickedLocation}
          defaultZoom={15}
          gestureHandling={'greedy'}
          disableDefaultUI={true}
        >
          {clickedLocation && <Marker position={clickedLocation} />}
        </Map>
        {clickedLocation && (
          <div className="confirm">
            <strong>Lat:</strong> {clickedLocation.lat} <br />
            <strong>Lng:</strong> {clickedLocation.lng} <br />
            <button
              onClick={handleConfirmLocation}
              className="confirm-btn"
            >
              Confirm Location
            </button>
            {isConfirmed && <p style={{ color: "green", marginTop: "0.5rem" }}>Location confirmed!</p>}
          </div>
        )}
      </APIProvider>
    </div>
  );
}

export default CreatePlanPage;