import React, { useRef, useState } from 'react';
import {
  Button,
  ClickAwayListener,
  Grow,
  MenuItem,
  MenuList,
  Paper,
  Popper,
} from '@mui/material';

import { ReactComponent as ArrowDownIcon } from 'src/assets/icn_dn_outline.svg';

interface BMenu {
  [key: string]: string | number;
}

interface Props<T extends BMenu> {
  menuData: T[];
  displayKey: keyof T;
  selectedIdx: number;
  setSelectedIdx: (newIdx: number) => void;
  menuListClassName?: string;
  buttonClassName?: string;
}

function KezulerDropdown<T extends BMenu>({
  setSelectedIdx,
  selectedIdx,
  menuData,
  displayKey,
  menuListClassName,
  buttonClassName,
}: Props<T>): React.ReactElement {
  const buttonRef = useRef<HTMLButtonElement>(null);
  const [menuOpen, setMenuOpen] = useState(false);

  const handleButtonClick = () => {
    setMenuOpen(true);
  };
  const handleMenuClose = () => {
    setMenuOpen(false);
  };

  const handleMenuItemClick = (newIndex: number) => {
    setSelectedIdx(newIndex);
    setMenuOpen(false);
  };

  return (
    <>
      <Button
        endIcon={<ArrowDownIcon />}
        ref={buttonRef}
        onClick={handleButtonClick}
        className={buttonClassName}
      >
        {menuData[selectedIdx][displayKey]}
      </Button>
      <Popper
        open={menuOpen}
        anchorEl={buttonRef.current}
        placement="bottom-start"
        transition
      >
        {({ TransitionProps, placement }) => (
          <Grow
            {...TransitionProps}
            style={{
              transformOrigin:
                placement === 'bottom-start' ? 'left top' : 'left bottom',
            }}
          >
            <Paper style={{ width: buttonRef.current?.clientWidth }}>
              <ClickAwayListener onClickAway={handleMenuClose}>
                <MenuList
                  classes={{ root: menuListClassName }}
                  autoFocusItem={menuOpen}
                >
                  {menuData.map((el, i) => (
                    <MenuItem
                      key={String(el[displayKey])}
                      onClick={() => handleMenuItemClick(i)}
                    >
                      {el[displayKey]}
                    </MenuItem>
                  ))}
                </MenuList>
              </ClickAwayListener>
            </Paper>
          </Grow>
        )}
      </Popper>
    </>
  );
}

export default KezulerDropdown;
