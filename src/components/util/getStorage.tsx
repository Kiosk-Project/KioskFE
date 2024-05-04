import { setStorage } from './setStorage';
export function getStorage<T>(KEY: string, DefaultData: T) {
  const storedData = localStorage.getItem(KEY);

  if (storedData == 'undefined') {
    return DefaultData;
  }

  if (storedData) {
    return JSON.parse(storedData) as T;
  }

  setStorage<T>(KEY, DefaultData);
  return DefaultData;
}
