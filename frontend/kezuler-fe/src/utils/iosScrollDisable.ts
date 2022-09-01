function preventIOSScroll() {
  const focusedInput = document.activeElement as
    | HTMLInputElement
    | HTMLTextAreaElement;
  focusedInput?.blur();
}

const onloadHeight = window.innerHeight;
function focusDisable() {
  // const rect = document.body.getBoundingClientRect();
  // const max = Math.max(window.innerHeight, onloadHeight);
  // const btValue = max - window.visualViewport.height + rect.y;
  // const bottomBtn = document.querySelector('.bottom-button') as HTMLElement;
  // bottomBtn?.classList.add('ios-keyboard-focus');
  // bottomBtn!.style.bottom = `${String(btValue)}px`;

  const focusedInput = document.activeElement as
    | HTMLInputElement
    | HTMLTextAreaElement;
  focusedInput.scrollIntoView();

  document
    .querySelector('.App')
    ?.addEventListener('touchmove', preventIOSScroll);

  // document
  //   .querySelector('.App')
  //   ?.addEventListener('touchstart', preventIOSScroll);
}

function focusEnable() {
  // const bottomBtn = document.querySelector('.bottom-button') as HTMLElement;
  // bottomBtn?.classList.remove('ios-keyboard-focus');
  // bottomBtn!.style.bottom = `0px`;
  document
    .querySelector('.App')
    ?.removeEventListener('touchmove', preventIOSScroll);
  // document
  //   .querySelector('.App')
  //   ?.removeEventListener('touchstart', preventIOSScroll);
}

export { focusDisable, focusEnable };
