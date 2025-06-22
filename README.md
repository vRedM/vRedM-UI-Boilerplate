
---

<div align="center">
<h1 align="center">RedM React and Lua Boilerplate</h1>
</div>

<div align="center">
A simple and extendable React (TypeScript) boilerplate designed for the RedM Lua runtime.
</div>

<br>

This repository is a basic boilerplate for getting started with React in NUI. It contains several helpful utilities and is bootstrapped using `create-react-app`. It is designed for both browser-based and in-game development workflows.

Utilizing `craco` to override Create React App's default configuration, we can have hot builds that only require a resource restart instead of a full production build, streamlining in-game development.

This version of the boilerplate is intended for use with the RedM (CfxLua) runtime.

## Requirements
* [Node > v10.6](https://nodejs.org/en/)
* [Yarn](https://yarnpkg.com/getting-started/install) (Preferred but not required)

*A basic understanding of the modern web development workflow is recommended. If you are new to this, React may have a steep learning curve.*

## Getting Started

First, clone this repository or use the "Use this template" option on GitHub, and place the resulting folder within your server's `resources` directory.

### Installation

*This boilerplate was developed using `yarn` but is fully compatible with `npm`.*

To install the necessary dependencies, navigate to the `web` folder within a terminal and run `npm install` or `yarn install`.

```bash
# Navigate to the web directory
cd your-resource-name/web

# Install dependencies using Yarn (recommended)
yarn install

# Or with NPM
npm install
```

## Features

This boilerplate includes several utilities and examples to accelerate your development.

### Lua Utilities

**SendReactMessage**

A small wrapper for dispatching NUI messages from Lua to the React front-end. This is designed to be used with the `useNuiEvent` React hook.

**Signature**
```lua
---@param action string The action you wish to target in your React app.
---@param data any The data you wish to send along with this action.
SendReactMessage(action, data)
```

**Usage**
```lua
-- This will trigger the 'setVisible' event listener in React
SendReactMessage('setVisible', true)
```

**debugPrint**

A debug printing utility that only prints to the console if a specific convar is enabled.

The convar is dependent on the name of your resource, following the format `YOUR_RESOURCE_NAME-debugMode`.

To enable debug mode, add `setr YOUR_RESOURCE_NAME-debugMode 1` to your `server.cfg` or execute it directly in the server console.

**Signature** (Replicates the standard `print` function)
```lua
---@param ... any[] The arguments you wish to print.
debugPrint(...)
```

**Usage**
```lua
local someVariable = { key = 'value' }
debugPrint('This is a debug message', true, someVariable)
```

### React Utilities

**useNuiEvent**

A custom React hook designed to intercept and handle messages dispatched from the Lua scripts. This is the primary method for creating passive listeners for game events.

*Note: For simplicity, handlers can only be registered once per action. A cascading event system is not implemented by default.*

**Usage**
```jsx
import { useNuiEvent } from './hooks/useNuiEvent';
import { useState } from 'react';

const MyComponent: React.FC = () => {
  const [someText, setSomeText] = useState('Default Text');
  
  // Listens for 'myAction' from Lua
  useNuiEvent<string>('myAction', (data) => {
    // The 'data' argument is what was sent with SendReactMessage
    console.log(`Received data: ${data}`);
    setSomeText(data);
  });
  
  return (
    <div>
      <h1>Some Component</h1>
      <p>{someText}</p>
    </div>
  );
};
```

**fetchNui**

A simple, NUI-focused wrapper around the standard `fetch` API. This is the primary way to request data from the game scripts or trigger NUI callbacks that return data.

**Important:** When using `fetchNui`, you must always send a callback from the Lua script, even if it's just an empty table (`{}`).

**Usage (React)**
```ts
import { fetchNui } from './utils/fetchNui';

// The first argument is the NUI callback name registered in Lua.
fetchNui<MyReturnData>('getClientData').then(characterData => {
  console.log('Received data from client script:', characterData);
  setClientData(characterData);
}).catch(error => {
  console.error('An error occurred:', error);
  // Set mock data or handle the error
});
```

**Usage (Lua - corresponding callback)**
```lua
RegisterNUICallback('getClientData', function(data, cb)
  local clientData = {
    name = "John Doe",
    health = 100
  }
  -- The cb function sends the data back to the fetchNui promise
  cb(clientData)
end)
```

**debugData**

A function for mocking dispatched game script actions in a browser environment. It will trigger `useNuiEvent` handlers as if they were dispatched from Lua. **This function only executes if the current environment is a regular browser, not the in-game CEF client.**

**Usage**
```ts
import { debugData } from './utils/debugData';

// This will trigger any useNuiEvent hook listening for 'setVisible'
// and pass `true` as the data.
debugData([
  {
    action: 'setVisible',
    data: true,
  }
]);
```

### Misc Utilities

*   `isEnvBrowser()`: Returns a boolean indicating if the current environment is a standard web browser. This is useful for writing development-only logic that shouldn't run in-game.

## Creating and Handling Multiple Windows

You can easily manage multiple, independent UI windows from a single React application.

**1. Create a New Window Component**

In your `web/src/components` folder, create a new file for your window (e.g., `Window1.tsx`). This will be a standard React component.

**2. Conditionally Render it in `App.tsx`**

In `App.tsx`, you will need a state to track which window is visible. You can then import your components and render them based on this state.

```tsx
// In web/src/App.tsx

import React, { useState } from 'react';
import { useNuiEvent } from './hooks/useNuiEvent';
import Window1 from './components/Window1';
import Window2 from './components/Window2';

const App: React.FC = () => {
  // This state will determine which window component to show
  const [windowId, setWindowId] = useState<string | null>(null);

  // This event is triggered by toggleNuiFrame in Lua
  useNuiEvent<string>('setWindow', (newWindowId) => {
    setWindowId(newWindowId);
  });

  return (
    <div className="nui-wrapper">
      {/* Conditionally render your windows based on the windowId state */}
      {windowId === "window1" && <Window1 />}
      {windowId === "window2" && <Window2 />}
    </div>
  );
};

export default App;
```

**3. Trigger Windows from Lua**

In your client-side Lua script, create commands or events to open your windows. The `toggleNuiFrame` function is used for this, where the second argument is the `windowId` you will check for in React.

```lua
-- In your client.lua file

-- The custom toggleNuiFrame function that tells React which window to open
function toggleNuiFrame(visible, windowId)
  SetNuiFocus(visible, visible)
  SendReactMessage('setVisible', visible)
  
  if visible then
    -- When opening, tell React which window to display
    SendReactMessage('setWindow', windowId)
  else
    -- When closing, clear the window ID
    SendReactMessage('setWindow', nil)
  end
end

-- Command to open the first window
RegisterCommand('show-nui1', function()
  toggleNuiFrame(true, "window1")
  debugPrint('Show NUI frame 1')
end, false)

-- Command to open the second window
RegisterCommand('show-nui2', function()
  toggleNuiFrame(true, "window2")
  debugPrint('Show NUI frame 2')
end, false)
```

## Development Workflow

This boilerplate is designed to make development as smooth as possible.

### Hot Builds In-Game

To develop in-game without needing to create a full production build after every change, you can use the hot-build system. This script watches for file changes and rebuilds them to disk automatically. After a rebuild, all you need to do is restart the resource in-game to see the changes.

**Usage**
```sh
# Using yarn
yarn start:game

# Using npm
npm run start:game
```

### Production Builds

When you are ready to deploy your resource, you must create an optimized and minified production build. This will ensure the best performance.

**Usage**
```sh
# Using yarn
yarn build

# Using npm
npm run build
```
