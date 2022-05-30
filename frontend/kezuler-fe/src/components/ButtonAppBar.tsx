import * as React from 'react';
import MenuIcon from '@mui/icons-material/Menu';
import IconButton from '@mui/material/IconButton';
import Toolbar from '@mui/material/Toolbar';

import logo from 'src/assets/logo-kezuler.png';

function ButtonAppBar() {
  return (
    <header className={'app-bar'}>
      <Toolbar>
        <img src={logo} alt="logo" height={24} />
        <IconButton
          size="large"
          edge="start"
          color="inherit"
          aria-label="menu"
          sx={{ mr: 2 }}
        >
          <MenuIcon />
        </IconButton>
        {/* <Button color="inherit">Login</Button> */}
      </Toolbar>
    </header>
  );
}

export default ButtonAppBar;
