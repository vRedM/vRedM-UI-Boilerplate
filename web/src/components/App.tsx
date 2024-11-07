
import React from 'react';
import './App.css';
import { debugData } from "../utils/debugData";
import { useVisibility } from "../providers/VisibilityProvider";
import Window1 from "./Window1";
import Window2 from "./Window2";

debugData([
  {
    action: 'setVisible',
    data: { visible: true, windowId: "window1" },
  }
]);

const App: React.FC = () => {
  const { windowId } = useVisibility();

  return (
    <div className="nui-wrapper">
      <div className="popup-thing">
        {windowId === "window1" && <Window1 />}
        {windowId === "window2" && <Window2 />}
      </div>
    </div>
  );
};

export default App;
