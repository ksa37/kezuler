const isURL = (target: string) => {
  let url;

  try {
    url = new URL(target);
  } catch (e) {
    return false;
  }

  return url.protocol === 'http:' || url.protocol === 'https:';
};

export default isURL;
