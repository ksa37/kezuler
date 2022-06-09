const setCookie = (key: string, value: string, expiresInSec: number) => {
  let expireDate = new Date();
  expireDate = new Date(expireDate.getTime() + expiresInSec * 1000);
  const cookie_value = `${value}; expires=${expireDate.toUTCString()}; path=/`;
  document.cookie = `${key}=${cookie_value}`;
};

const getCookie = (key: string) => {
  const regExp = new RegExp(key + '=([^;]*)');
  return document.cookie.match(regExp)?.[1] || '';
};

const deleteCookie = (key: string) => {
  document.cookie = `${key}=; expires=Thu, 01 Jan 1970 00:00:01 GMT;`;
};

export { setCookie, getCookie, deleteCookie };
