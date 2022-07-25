import React, { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';

import RootRoutes from './routes/RootRoutes';

import KezulerDialog from 'src/components/modal/KezulerDialog';
import ParticipantsPopup from 'src/components/participants-popup';

import 'src/styles/index.scss';
import 'src/styles/dialog.scss';

function App() {
  const location = useLocation();
  const [div, setDiv] = useState<HTMLDivElement | null>(null);

  useEffect(() => {
    if (div) {
      div.scrollTop = 0;
    }
  }, [location, div]);

  return (
    <div ref={setDiv} className="App" id="App">
      <RootRoutes />
      <KezulerDialog />
      <ParticipantsPopup />
    </div>
  );
}

export default App;
