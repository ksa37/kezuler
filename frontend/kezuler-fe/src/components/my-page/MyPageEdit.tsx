import React from 'react';

import { User } from 'src/types/user';

interface Props {
  currentUser: User;
  goToMain: () => void;
}

function MyPageEdit({ currentUser, goToMain }: Props) {
  return <>수정</>;
}

export default MyPageEdit;
