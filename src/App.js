// =================================================================
// FINAL DASHBOARD CODE - src/App.js
// This code builds the full user interface with a map and a
// real-time list of incidents.
// =================================================================

import { useState, useEffect } from 'react';
import { db } from './firebase'; // Assumes you have your src/firebase.js file configured
import { collection, addDoc, query, onSnapshot, orderBy } from 'firebase/firestore';
import { APIProvider, Map, AdvancedMarker } from '@vis.gl/react-google-maps';
import './App.css';

function App() {
  const [report, setReport] = useState('');
  const [incidents, setIncidents] = useState([]);

  // This special hook listens for real-time updates from our Firestore database
  useEffect(() => {
    // Create a query to get all documents from the "incidents" collection,
    // ordered by the most recent first.
    const q = query(collection(db, "incidents"), orderBy("timestamp", "desc"));

    // onSnapshot is the real-time listener. This function will run
    // every time the data changes in the database.
    const unsubscribe = onSnapshot(q, (querySnapshot) => {
      const incidentsData = [];
      querySnapshot.forEach((doc) => {
        incidentsData.push({
          id: doc.id,
          ...doc.data(),
          // NOTE: For this demo, we create random map coordinates near Bengaluru.
          // A real app would use the device's GPS location.
          position: {
              lat: 12.9716 + (Math.random() - 0.5) * 0.2,
              lng: 77.5946 + (Math.random() - 0.5) * 0.2
          }
        });
      });
      setIncidents(incidentsData);
      console.log("Live incident data updated.");
    });

    // Cleanup function: stop listening when the component is removed
    return () => unsubscribe();
  }, []); // The empty array [] means this effect runs only once on startup

  // Function to handle the form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (report === '') return;
    try {
      await addDoc(collection(db, "incidents"), {
        text: report,
        timestamp: new Date()
      });
      setReport('');
      alert('Incident reported! It will appear below after AI analysis (approx. 30s).');
    } catch (error) {
      console.error("Error adding document: ", error);
      alert('Failed to report incident.');
    }
  };

  return (
    // IMPORTANT: Replace "YOUR_GOOGLE_MAPS_API_KEY" with the key you created.
    <APIProvider apiKey="AIzaSyA99GK1TI1XQeSksEcOL_clCST8wetDmG8">
        <div className="App">
            {/* Left Panel for Controls and Incident List */}
            <div className="form-container">
                <h1>PulseAI Dashboard</h1>
                <p>Bengaluru's Live Nervous System</p>
                <form onSubmit={handleSubmit}>
                  <input
                    type="text"
                    value={report}
                    onChange={(e) => setReport(e.target.value)}
                    placeholder="Describe a new incident..."
                  />
                  <button type="submit">Submit Report</button>
                </form>
                <div className="incident-list">
                    <h2>Live Incidents</h2>
                    {incidents.map(inc => (
                        <div key={inc.id} className="incident-card">
                            {/* Use optional chaining (?.) for safety in case aiAnalysis doesn't exist yet */}
                            <h3>{inc.aiAnalysis?.category || 'Analyzing...'} (Severity: {inc.aiAnalysis?.severity || 'N/A'})</h3>
                            <p><strong>Summary:</strong> {inc.aiAnalysis?.summary || 'Waiting for AI analysis...'}</p>
                            <p className="original-report"><strong>Original Report:</strong> "{inc.text}"</p>
                        </div>
                    ))}
                </div>
            </div>
            {/* Right Panel for the Map */}
            <div className="map-container">
                <Map
                    defaultCenter={{ lat: 12.9716, lng: 77.5946 }} // Center of Bengaluru
                    defaultZoom={11}
                    mapId="PULSE_AI_MAP" // A custom map ID for potential styling
                >
                    {incidents.map(inc => (
                         <AdvancedMarker key={inc.id} position={inc.position} />
                    ))}
                </Map>
            </div>
        </div>
    </APIProvider>
  );
}

export default App;