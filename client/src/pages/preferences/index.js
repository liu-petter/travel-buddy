import React, {useState} from "react"
import TinderCard from 'react-tinder-card'
import "./index.css"

function PreferencesPage() {
    const preferences = [
        {
            category: "Beach",
            url: "client\assets\image.png"
        },
        {
            category: "Concert",
            url: "client\assets\person.png"
        }
    ];
    const [lastDirection, setLastDirection] = useState()
    const swiped = (direction, nameToDelete) => {
        console.log('removing: ' + nameToDelete)
        setLastDirection(direction)
    }
    const outOfFrame = (name) => {
        console.log(name + ' left the screen!')
    }

    return (
        <div className="card-container">
            <div className="card-stack">
                {preferences.map((preference) =>
                <TinderCard className='card' key={preference.category} onSwipe={(dir) => swiped(dir, preference.category)} onCardLeftScreen={() => outOfFrame(preference.category)}>
                    <div style={{ backgroundImage: 'url(' + preference.url + ')' }} className='card-content'>
                    <h3 className="card-title">{preference.category}</h3>
                    </div>
                </TinderCard>
                )}
             </div> 
        </div>
    );
};

export default PreferencesPage;