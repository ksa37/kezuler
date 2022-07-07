import React from 'react';

import RootRoutes from './routes/RootRoutes';

import KezulerDialog from 'src/components/modal/KezulerDialog';
import ParticipantsPopup from 'src/components/participants-popup';

import 'src/styles/index.scss';
import 'src/styles/dialog.scss';

function App() {
  return (
    <div className="App" id="App">
      <RootRoutes />
      <KezulerDialog />
      <ParticipantsPopup />
    </div>
  );
}

export default App;
