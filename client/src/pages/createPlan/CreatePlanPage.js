import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./CreatePlanPage.css";

const CreatePlanPage = () => {
  const [city, setCity] = useState("");
  const [days, setDays] = useState(3);
  const [loading, setLoading] = useState(false);
  const [swipeReady, setSwipeReady] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!city || !days) {
      alert("please enter both city and number of days");
      return;
    }

    setLoading(true);
    const cityKey = city.toLowerCase();

    try {
      const response = await fetch("http://localhost:5000/generate-plan", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ city, days }),
      });

      const result = await response.json();

      // filter only valid locations with coordinates
      const validPlaces = Array.isArray(result)
        ? result.filter(p => p.latitude && p.longitude)
        : [];

      // save trip metadata
      const tripMeta = {
        city,
        title: city,
        days: parseInt(days),
        createdAt: Date.now(),
      };

      // handle case where no valid geolocation was found
      if (validPlaces.length === 0) {
        localStorage.setItem(`raw_${cityKey}`, JSON.stringify(result));
        localStorage.setItem("selectedTrip", JSON.stringify(tripMeta));
        alert("Most locations couldn't be mapped, but we'll still show what we can.");
        setSwipeReady(true);
        return;
      }

      // store data and reset previous trip
      localStorage.setItem(`raw_${cityKey}`, JSON.stringify(validPlaces));
      localStorage.setItem("selectedTrip", JSON.stringify(tripMeta));
      localStorage.removeItem(`trip_${cityKey}`);
      localStorage.setItem(`currentSwipeIndex_${cityKey}`, "0");

      setSwipeReady(true);
    } catch (err) {
      console.error("Error generating trip plan:", err);
      alert("Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="create-plan-page">
      <h2>Create a New Trip Plan</h2>

      {/* form for city and number of days */}
      <form onSubmit={handleSubmit} className="plan-form">
        <label>
          City:
          <input
            type="text"
            value={city}
            onChange={(e) => setCity(e.target.value)}
            placeholder="Enter city name"
          />
        </label>

        <label>
          Number of Days:
          <input
            type="number"
            value={days}
            min={1}
            max={30}
            onChange={(e) => setDays(e.target.value)}
          />
        </label>

        <button type="submit" className="btn" disabled={loading}>
          {loading ? "Generating..." : "Create Plan"}
        </button>
      </form>

      {/* show navigation to Swipe page if plan is ready */}
      {swipeReady && (
        <div className="swipe-confirmation" style={{ marginTop: "2rem", textAlign: "center" }}>
          <h3>Your trip to {city} is ready</h3>
          <p>We found places for your {days}-day plan.</p>
          <button className="btn" style={{ marginTop: "1rem" }} onClick={() => navigate("/swipe")}>
            Start Swiping
          </button>
        </div>
      )}
    </div>
  );
};

export default CreatePlanPage;
