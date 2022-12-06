import React from 'react';

type StorageChildProps = {
  setTextAppBarTitle: React.Dispatch<React.SetStateAction<string>>;
  setData: React.Dispatch<React.SetStateAction<any>>;
  data: any;
  open: boolean;
  bottomSheetRef: React.MutableRefObject<any>;
};

export type { StorageChildProps };
