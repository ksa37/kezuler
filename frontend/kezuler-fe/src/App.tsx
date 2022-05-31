import React from 'react';

import RootRoutes from './routes/RootRoutes';

import KezulerModal from './components/modal/KezulerModal';
import KezulerDialog from 'src/components/modal/KezulerDialog';

import 'src/styles/index.scss';
import 'src/styles/dialog.scss';

function App() {
  return (
    <div className="App">
      <RootRoutes />
      <KezulerModal />
      <KezulerDialog />
    </div>
  );
}

export default App;
