import React, {useState} from "react"
import TinderCard from 'react-tinder-card'
import {APIProvider, Map, Marker} from '@vis.gl/react-google-maps';
import "./index.css"

function PreferencesPage() {
  const preferences = [
    { category: "Eiffel Tower", coord: { lat: 48.8584, lng: 2.2945 } },
    { category: "Louvre Museum", coord: { lat: 48.8606, lng: 2.3376 } },
    { category: "Louvre Museum", coord: { lat: null, lng: null } }
  ];

  /* other test locations
    { category: "Notre-Dame Cathedral", coord: { lat: 48.852968, lng: 2.349902 } },
    { category: "Sacré-Cœur Basilica", coord: { lat: 48.8867, lng: 2.3431 } },
    { category: "Champs-Élysées", coord: { lat: 48.8698, lng: 2.3076 } },
    { category: "Arc de Triomphe", coord: { lat: 48.8738, lng: 2.2950 } },
    { category: "Musée d'Orsay", coord: { lat: 48.8600, lng: 2.3266 } },
    { category: "Luxembourg Gardens", coord: { lat: 48.8462, lng: 2.3372 } },
    { category: "Montmartre", coord: { lat: 48.8867, lng: 2.3431 } },
    { category: "Place de la Concorde", coord: { lat: 48.8656, lng: 2.3212 } },
  */

  const swiped = (direction, nameToDelete) => {
    if (direction === "left") {
      // delete location from backend copy of travel plan
      console.log("Deleteing: ", nameToDelete);
    }
  }

  const outOfFrame = (name) => {
    console.log(name + ' left the screen!');
  }

  return (
    <div className="card-container">
      <div className="card-stack">
      {preferences.map((preference) => {
        const coordinates = {
          lat: preference.coord.lat ?? 0,
          lng: preference.coord.lng ?? 0,
        };

        return (
          <TinderCard 
            className='swipable-card' 
            key={preference.category} 
            onSwipe={(dir) => swiped(dir, preference.category)} 
            onCardLeftScreen={() => outOfFrame(preference.category)}
            preventSwipe={['up', 'down']}
          >
            <div className='card-content'>
              <APIProvider apiKey={process.env.REACT_APP_GOOGLE_MAPS_API_KEY}>
                <Map
                  style={{width: '700px', height: '700px', direction: 'absolute', left: '50%', transform: 'translate(-50%, -10%)'}}
                  center={coordinates}
                  defaultZoom={15}
                  gestureHandling={'none'}
                  zoomControl={false}
                  disableDefaultUI={true}
                >
                  <Marker position={coordinates} />
                </Map>
              </APIProvider>
              {preference.coord.lat === null || preference.coord.lng === null ? (
                <div className="card-title">
                  <h3>{preference.category}</h3>
                  <h4>Address not available</h4>
                </div>
              ) : (
                <h3 className="card-title">{preference.category}</h3>
              )}
            </div>
          </TinderCard>
        )
      })}
      </div> 
    </div>
  );
};

export default PreferencesPage;