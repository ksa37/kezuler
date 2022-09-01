function preventIOSScroll() {
  const focusedInput = document.activeElement as
    | HTMLInputElement
    | HTMLTextAreaElement;
  focusedInput?.blur();
}
function focusDisable() {
  document
    .querySelector('.App')
    ?.addEventListener('touchmove', preventIOSScroll);
}

function focusEnable() {
  document
    .querySelector('.App')
    ?.removeEventListener('touchmove', preventIOSScroll);
}

export { focusDisable, focusEnable };
