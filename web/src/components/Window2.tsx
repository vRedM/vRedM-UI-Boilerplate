import React from 'react';
import './Window.css';
import { fetchNui } from "../utils/fetchNui";



const TriggerButton2 = async () => {
    fetchNui('TriggerUI2')
};

const Window2: React.FC = () => {
  return (
    <div className="window2-container">
      <div className="window2-content">
        <h1>✨ This is the 2nd UI! ✨</h1>
        <p>Everything is in the same resource.</p>
        <button onClick={TriggerButton2} className="window2-button">Click Me!</button>
      </div>
    </div>
  );
};

export default Window2;
