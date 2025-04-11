import React, { useState, useEffect } from "react"
import {APIProvider, Map, Marker} from '@vis.gl/react-google-maps';

const CreatePlanPage = () => {
  const [userLocation, setUserLocation] = useState(null);
  const [clickedLocation, setClickedLocation] = useState(null);

  const handleClickedLocation = (event) => {
    const { latLng } = event.detail;
    const lat = latLng.lat;
    const lng = latLng.lng;
    console.log("Marker created at:", lat, lng);
    setClickedLocation({lat, lng});

    // TODO
    // create sidebar to confirm location
    // then send lat, lng to AI api when avail
    // add styling
  }

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
          defaultCenter={{lat: 22.54992, lng: 0}}
          center={userLocation}
          onClick={handleClickedLocation}
          defaultZoom={3}
          gestureHandling={'greedy'}
          disableDefaultUI={true}
        >
          {clickedLocation && <Marker position={clickedLocation} />}
        </Map>
        {clickedLocation && (
          <div style={{ marginTop: "1rem" }}>
            <strong>Lat:</strong> {clickedLocation.lat} <br />
            <strong>Lng:</strong> {clickedLocation.lng}
          </div>
         )}
      </APIProvider>
    </div>
  );
}

export default CreatePlanPage;