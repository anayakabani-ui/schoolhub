import { useState, useEffect } from 'react';

function isPlainObject(value: any): boolean {
  return value !== null && typeof value === 'object' && !Array.isArray(value);
}

function deepMerge<T extends Record<string, any>>(target: T, source: T): T {
  const result = { ...target };
  
  for (const key in source) {
    if (isPlainObject(target[key]) && isPlainObject(source[key])) {
      result[key] = deepMerge(target[key], source[key]);
    } else {
      result[key] = source[key];
    }
  }
  
  return result;
}

export function useLocalStorage<T>(key: string, initialValue: T) {
  const [storedValue, setStoredValue] = useState<T>(() => {
    try {
      const item = window.localStorage.getItem(key);
      if (item === null) {
        return initialValue;
      }
      
      const parsedItem = JSON.parse(item);
      
      // If initialValue is a primitive or array, use parsedItem directly if types match
      if (!isPlainObject(initialValue)) {
        return typeof parsedItem === typeof initialValue ? parsedItem : initialValue;
      }
      
      // If initialValue is an object, deep merge
      if (isPlainObject(parsedItem)) {
        return deepMerge(initialValue, parsedItem);
      }
      
      return initialValue;
    } catch (error) {
      console.error(`Error reading localStorage key "${key}":`, error);
      return initialValue;
    }
  });

  const setValue = (value: T | ((val: T) => T)) => {
    try {
      const valueToStore = value instanceof Function ? value(storedValue) : value;
      setStoredValue(valueToStore);
      window.localStorage.setItem(key, JSON.stringify(valueToStore));
    } catch (error) {
      console.error(`Error setting localStorage key "${key}":`, error);
    }
  };

  return [storedValue, setValue] as const;
}