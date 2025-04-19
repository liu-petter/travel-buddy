import React, { useState } from 'react';
import './CreatePlanPage.css';

function CreatePlanPage() {
  const [city, setCity] = useState('');
  const [days, setDays] = useState(1);
  const [message, setMessage] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!city || days < 1 || days > 5) {
      setMessage('Please enter a valid city and number of days (1–5)');
      return;
    }

    setMessage('🧠 Generating your travel plan...');

    try {
      const response = await fetch('http://localhost:5000/generate-plan', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ city, days }),
      });

      if (!response.ok) throw new Error('Request failed');

      const data = await response.json();
      console.log('✅ Generated plan:', data);

      setMessage(`✅ Plan for ${city} generated! Go to the map to view it.`);
      setTimeout(() => {
        window.location.href = "/map";
      }, 1500); // delay to show success message before redirect
      
      // Optional auto-redirect to /map
      // window.location.href = "/map";

    } catch (err) {
      console.error(err);
      setMessage('❌ Failed to generate the plan. Try again.');
    }
  };

  return (
    <div className="create-plan-page">
      <h2>Create Your Travel Plan</h2>
      <form onSubmit={handleSubmit}>
        <label>
          Destination City:
          <input
            type="text"
            value={city}
            onChange={(e) => setCity(e.target.value)}
            placeholder="e.g. Berlin"
            required
          />
        </label>

        <label>
          Number of Days:
          <input
            type="number"
            min="1"
            max="5"
            value={days}
            onChange={(e) => setDays(Number(e.target.value))}
            required
          />
        </label>

        <button type="submit">Generate Plan</button>
      </form>

      {message && <p className="status-message">{message}</p>}
    </div>
  );
}

export default CreatePlanPage;
