import React from 'react';
import { Add } from '@mui/icons-material';

function NewTimeAdd() {
  return (
    <div className="time-select-card-grid">
      <div className="time-select-time-card">
        <div className="time-select-time-add">
          <Add />
          <span>시간 항목 추가하기</span>
        </div>
      </div>
    </div>
  );
}

export default NewTimeAdd;
