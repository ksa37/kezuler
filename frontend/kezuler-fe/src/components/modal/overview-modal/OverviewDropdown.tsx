import React, { useState } from 'react';

import { REMINDER_OPTIONS } from 'src/constants/Main';

import KezulerDropdown from 'src/components/common/KezulerDropdown';

import { ReactComponent as ClockIcon } from 'src/assets/clock_icon.svg';

function OverviewDropdown() {
  const [selectedIdx, setSelectedIdx] = useState(1);

  return (
    <KezulerDropdown
      title={'리마인더 설정'}
      paperClassName={'overview-dropdown-paper'}
      titleClassName={'overview-dropdown-title'}
      buttonClassName={'overview-dropdown-button'}
      menuClassName={'overview-dropdown-menu'}
      selectedMenuClassName={'selected'}
      menuListClassName={'overview-dropdown-menu-list'}
      menuData={REMINDER_OPTIONS}
      displayKey={'display'}
      selectedIdx={selectedIdx}
      setSelectedIdx={setSelectedIdx}
      endIcon={<ClockIcon className={'overview-dropdown-icon'} />}
    />
  );
}

export default OverviewDropdown;
