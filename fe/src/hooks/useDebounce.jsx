import { useEffect, useState } from "react";

export default function useDebounce(initializeValue = "", delay = 1000) {
  const [debouncedValue, setDebouncedValue] = useState(initializeValue);
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedValue(initializeValue);
    }, delay);
    return () => {
      clearTimeout(timer);
    };
  }, [delay, initializeValue]);
  return debouncedValue;
}
