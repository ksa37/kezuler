import React from 'react';

interface Props {
  icon: JSX.Element;
  onClick: () => void;
  text: string;
}

function RegisterButton({ icon, onClick, text }: Props) {
  return (
    <button className="black-button" onClick={onClick}>
      {icon}
      {text}
    </button>
  );
}

export default RegisterButton;
