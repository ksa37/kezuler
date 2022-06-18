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
import classNames from 'classnames';

import 'src/styles/dropdown.scss';

interface BMenu {
  [key: string]: string | number | boolean;
}

interface Props<T extends BMenu> {
  startIcon?: React.ReactNode;
  endIcon: React.ReactNode;
  menuData: T[];
  displayKey: keyof T;
  selectedIdx: number;
  setSelectedIdx: (newIdx: number) => void;
  title?: string;
  titleClassName?: string;
  menuListClassName?: string;
  menuClassName?: string;
  selectedMenuClassName?: string;
  buttonClassName?: string;
  paperClassName?: string;
  fitToButtonWidth?: boolean;
}

function KezulerDropdown<T extends BMenu>({
  startIcon,
  endIcon,
  setSelectedIdx,
  selectedIdx,
  menuData,
  displayKey,
  title,
  titleClassName,
  menuListClassName,
  menuClassName,
  selectedMenuClassName,
  buttonClassName,
  paperClassName,
  fitToButtonWidth,
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
        startIcon={startIcon}
        endIcon={endIcon}
        ref={buttonRef}
        onClick={handleButtonClick}
        className={buttonClassName}
        classes={{
          startIcon: 'kezuler-dropdown-icon',
          endIcon: 'kezuler-dropdown-icon',
        }}
      >
        {menuData[selectedIdx][displayKey]}
      </Button>
      <Popper
        className={'kezuler-dropdown-popper'}
        open={menuOpen}
        anchorEl={buttonRef.current}
        placement="bottom-end"
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
            <Paper
              style={
                fitToButtonWidth
                  ? { width: buttonRef.current?.clientWidth }
                  : {}
              }
              className={paperClassName}
            >
              <ClickAwayListener onClickAway={handleMenuClose}>
                <MenuList
                  classes={{ root: menuListClassName }}
                  autoFocusItem={menuOpen}
                >
                  {title && <div className={titleClassName}>{title}</div>}
                  {menuData.map((el, i) => (
                    <MenuItem
                      key={String(el[displayKey])}
                      className={classNames(
                        menuClassName,
                        selectedMenuClassName && {
                          [selectedMenuClassName]: selectedIdx === i,
                        }
                      )}
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
