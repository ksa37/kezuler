import React from 'react';

import RootRoutes from './routes/RootRoutes';

import KezulerModal from './components/modal/KezulerModal';

import './App.scss';

function App() {
  return (
    <div className="App">
      <RootRoutes />
      <KezulerModal />
    </div>
  );
}

export default App;
