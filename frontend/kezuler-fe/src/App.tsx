import React, { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';

import RootRoutes from './routes/RootRoutes';

import KezulerAlert from './components/modal/KezulerAlert';
import KezulerNoti from './components/modal/KezulerNoti';
import KezulerDialog from 'src/components/modal/KezulerDialog';

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
      <div className={'app-inner'}>
        <RootRoutes />
      </div>
      <KezulerDialog />
      <KezulerAlert />
      <KezulerNoti />
    </div>
  );
}

export default App;
