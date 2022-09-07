import React, { ChangeEvent, RefObject, useRef, useState } from 'react';
import ReactDOM from 'react-dom';
import Button from '@mui/material/Button';
import ClickAwayListener from '@mui/material/ClickAwayListener';
import MenuItem from '@mui/material/MenuItem';
import MenuList from '@mui/material/MenuList';
import Paper from '@mui/material/Paper';
import classNames from 'classnames';
import { format } from 'date-fns';
import { utcToZonedTime } from 'date-fns-tz';

import { getTimezoneGroupIdx, TIME_ZONE_GROUPS } from 'src/constants/TimeZones';
import { useInterval } from 'src/hooks/useInterval';
import { ReactJSXElement } from '@emotion/react/types/jsx-namespace';

import { ReactComponent as ArrowDownIcon } from 'src/assets/icn_dn_outline.svg';
import 'src/styles/dropdown.scss';

interface BtnProps {
  disabled?: boolean;
  selectedGroup: string;
  selectedIdx: number;
  setSelectedZone: (newGroup: string, newIdx: number) => void;
}

interface DropDownProps {
  selectedGroup: string;
  selectedIdx: number;
  menuOpen: boolean;
  buttonRef?: RefObject<HTMLButtonElement>;
  handleMenuClose: () => void;
  handleMenuItemClick: (newGroup: string, newIndex: number) => void;
}

function TimezoneButton({
  disabled,
  setSelectedZone,
  selectedGroup,
  selectedIdx,
}: BtnProps): React.ReactElement {
  const buttonRef = useRef<HTMLButtonElement>(null);
  const [menuOpen, setMenuOpen] = useState(false);

  const handleButtonClick = () => {
    setMenuOpen((prev) => !prev);
  };

  const handleMenuClose = () => {
    console.log('hello');
    setMenuOpen(false);
  };

  const handleMenuItemClick = (newGroup: string, newIndex: number) => {
    setSelectedZone(newGroup, newIndex);
    setMenuOpen(false);
  };

  return (
    <>
      <Button
        endIcon={<ArrowDownIcon />}
        ref={buttonRef}
        onClick={handleButtonClick}
        className={classNames('timezone-dropdown', {
          'kezuler-dropdown-disabled': disabled,
        })}
        classes={{
          startIcon: 'kezuler-dropdown-icon',
          endIcon: 'kezuler-dropdown-icon',
        }}
      >
        {
          TIME_ZONE_GROUPS[getTimezoneGroupIdx(selectedGroup)].zones[
            selectedIdx
          ]['value']
        }
      </Button>
      <TimezoneDropdown
        selectedGroup={selectedGroup}
        selectedIdx={selectedIdx}
        menuOpen={menuOpen}
        handleMenuClose={handleMenuClose}
        handleMenuItemClick={handleMenuItemClick}
      />
    </>
  );
}

function TimezoneDropdown({
  selectedGroup,
  selectedIdx,
  menuOpen,
  handleMenuClose,
  handleMenuItemClick,
}: DropDownProps) {
  const selectedMenuClassName = 'selected';
  const filteredMenuClassName = 'filtered';
  const displayKey = 'value';

  const [nowTime, setNowTime] = useState(new Date().getTime());
  const [searchValue, setSearchValue] = useState('');
  useInterval(() => setNowTime(new Date().getTime()), 1000);

  if (!menuOpen) {
    return null;
  }

  const handleSearch = (event: ChangeEvent<HTMLInputElement>) => {
    setSearchValue(event.target.value);
  };

  return ReactDOM.createPortal(
    menuOpen ? (
      <Paper className={classNames('timezone-dropdown-wrapper')}>
        <ClickAwayListener onClickAway={handleMenuClose}>
          <div>
            <input
              className={'timezone-search-bar'}
              value={searchValue}
              placeholder={'검색'}
              onChange={handleSearch}
            />

            <Paper className={classNames('timezone-dropdown-paper')}>
              <MenuList
                className={'timezone-menulist'}
                autoFocusItem={menuOpen}
                variant="selectedMenu"
              >
                {TIME_ZONE_GROUPS.reduce<ReactJSXElement[]>(
                  (prev, group_item) => {
                    prev.push(
                      <MenuItem
                        className={classNames(
                          'timezone-dropdown-group',
                          filteredMenuClassName && {
                            [filteredMenuClassName]: searchValue !== '',
                          }
                        )}
                      >
                        {group_item.group}
                      </MenuItem>
                    );
                    return prev.concat(
                      group_item.zones.map((el, i) => (
                        <MenuItem
                          key={String(el[displayKey])}
                          className={classNames(
                            'timezone-dropdown-item',
                            selectedMenuClassName && {
                              [selectedMenuClassName]:
                                selectedGroup == group_item.group &&
                                selectedIdx === i,
                            },
                            filteredMenuClassName && {
                              [filteredMenuClassName]: !String(el[displayKey])
                                .toLowerCase()
                                .includes(searchValue),
                            }
                          )}
                          selected={
                            selectedGroup == group_item.group &&
                            selectedIdx === i
                          }
                          onClick={() =>
                            handleMenuItemClick(group_item.group, i)
                          }
                        >
                          <div>
                            <span>{el[displayKey]}</span>
                            <span>
                              {format(
                                utcToZonedTime(nowTime, el[displayKey]),
                                'MM/dd HH:mm'
                              )}
                            </span>
                          </div>
                        </MenuItem>
                      ))
                    );
                  },
                  []
                )}
              </MenuList>
            </Paper>
          </div>
        </ClickAwayListener>
      </Paper>
    ) : (
      <></>
    ),
    // document.getElementsByClassName('.app-inner')[0] ||
    document.querySelector('main') ||
      document.getElementById('App') ||
      document.body
  );
}

export default TimezoneButton;
