import React from 'react';
import { fetchNui } from "../utils/fetchNui";

interface ReturnClientDataCompProps {
  data: any;
}

const ReturnClientDataComp: React.FC<ReturnClientDataCompProps> = ({ data }) => (
  <>
    <h5>Returned Data:</h5>
    <pre>
      <code>
        {JSON.stringify(data, null, 2)}
      </code>
    </pre>
  </>
);

interface ReturnData {
  x: number;
  y: number;
  z: number;
}

const TriggerButton = async () => {
    fetchNui('TriggerUI1')
};

const Window1: React.FC = () => {

  return (
    <div className="window2-container">
        <div className="window2-content">
            <div>
                <h1>This is NUI Popup for Window 1!</h1>
                <button onClick={TriggerButton} className="window2-button">Print UI1</button>
            </div>
        </div>
  </div>
  );
};

export default Window1;
