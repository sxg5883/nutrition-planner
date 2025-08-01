'use client';
import { useState } from 'react';

export default function Home() {
  const [calories, setCalories] = useState('');
  const [protein, setProtein] = useState('');
  const [restrictions, setRestrictions] = useState('');
  const [cuisine, setCuisine] = useState('');
  const [plan, setPlan] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const fetchPlan = async () => {
    setError('');
    setPlan('');
    if (!calories || !protein) {
      setError('Please provide calories and protein goals.');
      return;
    }
    setLoading(true);
    try {
      const res = await fetch('/api/meal', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ calories, protein, restrictions, cuisine }),
      });
      const json = await res.json();
      if (json.error) {
        setError(json.error);
      } else if (json.mealPlan) {
        setPlan(json.mealPlan);
      } else {
        setError('Unexpected response from server.');
      }
    } catch (e) {
      setError('Failed to fetch plan.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ maxWidth: 900, margin: 'auto', padding: 24, fontFamily: 'system-ui, sans-serif' }}>
      <h1 style={{ fontSize: 32, color: '#1f6e3f', marginBottom: 12 }}>AI Nutrition Planner</h1>

      <div
        style={{
          background: '#f7f9f6',
          borderRadius: 12,
          padding: 20,
          marginBottom: 24,
          boxShadow: '0 4px 12px rgba(0,0,0,0.05)',
        }}
      >
        <div style={{ display: 'flex', gap: 16, flexWrap: 'wrap', marginBottom: 12 }}>
          <div style={{ flex: '1 1 150px' }}>
            <label style={{ display: 'block', marginBottom: 4, fontWeight: 600 }}>Calories</label>
            <input
              type="number"
              value={calories}
              onChange={(e) => setCalories(e.target.value)}
              placeholder="e.g. 2000"
              style={{
                width: '100%',
                padding: 8,
                borderRadius: 6,
                border: '1px solid #c5d0c7',
                color: '#000',
              }}
            />
          </div>

          <div style={{ flex: '1 1 150px' }}>
            <label style={{ display: 'block', marginBottom: 4, fontWeight: 600 }}>Protein (g)</label>
            <input
              type="number"
              value={protein}
              onChange={(e) => setProtein(e.target.value)}
              placeholder="e.g. 150"
              style={{
                width: '100%',
                padding: 8,
                borderRadius: 6,
                border: '1px solid #c5d0c7',
                color: '#000',
              }}
            />
          </div>

          <div style={{ flex: '1 1 200px' }}>
            <label style={{ display: 'block', marginBottom: 4, fontWeight: 600 }}>Dietary Restrictions</label>
            <input
              type="text"
              value={restrictions}
              onChange={(e) => setRestrictions(e.target.value)}
              placeholder="e.g. no dairy, vegetarian"
              style={{
                width: '100%',
                padding: 8,
                borderRadius: 6,
                border: '1px solid #c5d0c7',
                color: '#000',
              }}
            />
          </div>

          <div style={{ flex: '1 1 150px' }}>
            <label style={{ display: 'block', marginBottom: 4, fontWeight: 600 }}>Cuisine</label>
            <input
              type="text"
              value={cuisine}
              onChange={(e) => setCuisine(e.target.value)}
              placeholder="e.g. Mediterranean"
              style={{
                width: '100%',
                padding: 8,
                borderRadius: 6,
                border: '1px solid #c5d0c7',
                color: '#000',
              }}
            />
          </div>
        </div>

        <button
          onClick={fetchPlan}
          disabled={loading}
          style={{
            background: '#276749',
            color: '#fff',
            padding: '12px 24px',
            border: 'none',
            borderRadius: 8,
            cursor: loading ? 'not-allowed' : 'pointer',
            fontWeight: 600,
          }}
        >
          {loading ? 'Generating...' : 'Generate Meal Plan'}
        </button>

        {error && (
          <div style={{ color: '#c0392b', marginTop: 12, fontWeight: 500 }}>{error}</div>
        )}
      </div>

      {plan && (
        <div
          style={{
            background: '#ffffff',
            border: '1px solid #d6e4d1',
            borderRadius: 10,
            padding: 18,
            whiteSpace: 'pre-wrap',
            lineHeight: 1.35,
            fontSize: 14,
          }}
        >
          {plan}
        </div>
      )}
    </div>
  );
}

