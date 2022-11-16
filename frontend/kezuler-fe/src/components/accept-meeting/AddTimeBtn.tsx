import React from 'react';
import { Add } from '@mui/icons-material';

interface Props {
  onClick: () => void;
}

function AddTimeBtn({ onClick }: Props) {
  return (
    <div className="time-select-card-grid" onClick={onClick}>
      <div className="time-select-time-card">
        <div className="time-select-time-add">
          <Add />
          <span>시간 항목 추가하기</span>
        </div>
      </div>
    </div>
  );
}

export default AddTimeBtn;
