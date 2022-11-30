import React from 'react';
import classNames from 'classnames';

import 'src/styles/components.scss';

interface DescriptionText {
  text: string;
  highlight?: boolean;
  break?: boolean;
}

interface Button {
  title: string;
  onClick: () => void;
}

interface Props {
  type?: 'button' | 'submit';
  onClick?: () => void;
  descriptions?: string | DescriptionText[];
  buttons: Button[];
}

function BottomCard({ descriptions, buttons }: Props) {
  const makeDescriptionElement = () => {
    if (!descriptions || typeof descriptions === 'string') {
      return descriptions;
    }
    return descriptions.map(({ text, highlight }) =>
      highlight ? <em>{text}</em> : text
    );
  };

  const descriptionElement = makeDescriptionElement();

  return (
    <div className={'bottom-card'}>
      {descriptions && (
        <div className={'bottom-card-description'}>{descriptionElement}</div>
      )}
      {buttons.map(({ title, onClick }) => (
        <div className={'bottom-card-btn-wrapper'} key={title}>
          <div key={title} className={'bottom-card-btn'} onClick={onClick}>
            {title}
          </div>
        </div>
      ))}
    </div>
  );
}

export default BottomCard;
