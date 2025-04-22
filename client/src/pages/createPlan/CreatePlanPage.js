
import React, { useState } from "react";
import './CreatePlanPage.css';

const CreatePlanPage = () => {
  const [city, setCity] = useState("");
  const [days, setDays] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage("");

    try {
      const response = await fetch("http://localhost:5000/generate-plan", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ city, days })
      });

      if (response.ok) {
        setMessage(`✅ Plan for ${city} generated!`);
        localStorage.removeItem('likedPlaces'); // 🧼 clear old swipes
        setTimeout(() => {
          window.location.href = "/swipe";
        }, 1000);
      } else {
        setMessage("❌ Failed to generate the plan. Try again.");
      }
    } catch (error) {
      console.error("Error:", error);
      setMessage("❌ Something went wrong."+ error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="create-plan-page">
      <h2>Create Your Travel Plan</h2>
      <form onSubmit={handleSubmit}>
        <label>
          City:
          <input
            type="text"
            value={city}
            onChange={(e) => setCity(e.target.value)}
            required
          />
        </label>
        <label>
          Number of Days:
          <input
            type="number"
            value={days}
            onChange={(e) => setDays(e.target.value)}
            required
          />
        </label>
        <button type="submit" disabled={loading}>
          {loading ? "Generating..." : "Generate Plan"}
        </button>
      </form>
      {message && <p className="status-message">{message}</p>}
    </div>
  );
};

export default CreatePlanPage;
