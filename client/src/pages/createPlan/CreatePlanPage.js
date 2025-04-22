import React, { useState } from "react";
import "./CreatePlanPage.css";
import { useNavigate } from "react-router-dom";

const CreatePlanPage = () => {
  const [city, setCity] = useState("");
  const [days, setDays] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!city || !days) return;

    setLoading(true);

    try {
      const response = await fetch("http://127.0.0.1:5000/generate-plan", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ city, days }),
      });

      if (!response.ok) throw new Error("Failed to generate plan");

      const result = await response.json();
console.log(" Generated trip data:", result);

if (!Array.isArray(result) || result.length === 0) {
  throw new Error("No locations were generated. Please try a different city.");
}


      const tripMeta = {
        city,
        title: `${city} Getaway`,
        days: parseInt(days),
        createdAt: Date.now(),
      };

      const cityKey = `trip_${city.toLowerCase()}`;
      localStorage.setItem(cityKey, JSON.stringify(result));

      // update userTrips and remove duplicates
      const existingTrips = JSON.parse(localStorage.getItem("userTrips")) || [];
      const withoutDuplicates = existingTrips.filter(
        (trip) => trip.city.toLowerCase() !== city.toLowerCase()
      );
      const updatedTrips = [...withoutDuplicates, tripMeta];
      localStorage.setItem("userTrips", JSON.stringify(updatedTrips));

      // set as selectedTrip
      localStorage.setItem("selectedTrip", JSON.stringify(tripMeta));

      navigate("/swipe");
    } catch (err) {
      console.error("Error generating plan:", err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="create-plan-page">
      <h2>Create Your Travel Plan</h2>
      <form onSubmit={handleSubmit} className="create-form">
        <input
          type="text"
          placeholder="Enter a city"
          value={city}
          onChange={(e) => setCity(e.target.value)}
        />
        <input
          type="number"
          placeholder="Number of days"
          value={days}
          onChange={(e) => setDays(e.target.value)}
        />
        <button type="submit" disabled={loading}>
          {loading ? "Generating..." : "Create Plan"}
        </button>
      </form>
    </div>
  );
};

export default CreatePlanPage;
