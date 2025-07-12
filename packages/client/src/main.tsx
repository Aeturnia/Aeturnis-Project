// @aeturnis/client - Main client entry point
import React from 'react';
import ReactDOM from 'react-dom/client';
import { GAME_VERSION } from '@aeturnis/shared';

console.log(`Aeturnis Online Client v${GAME_VERSION}`);

// TODO(replit): Set up React app structure
// TODO(replit): Configure Redux store
// TODO(replit): Set up React Query for API calls
// TODO(replit): Configure routing
// TODO(replit): Create main App component

const App: React.FC = () => {
  return <div>Aeturnis Online - Client Setup</div>;
};

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);