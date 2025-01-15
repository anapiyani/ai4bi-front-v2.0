

export const setCookie = (name: string, value: string) => {
  if (typeof window !== 'undefined') {
    document.cookie = `${name}=${value}; path=/`;
  }
}

export const getCookie = (name: string) => {
  if (typeof window !== 'undefined') {
    const value = document.cookie.split(`${name}=`)[1];
    return value ? value.split(';')[0] : null;
  }
  return null;
}

export const deleteCookie = (name: string) => {
  if (typeof window !== 'undefined') {
    document.cookie = `${name}=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;`;
  }
}