import { useEffect, useState } from "react";

const store = {
  color: "red",
};

const listeners = new Set();

const subscribe = (listener: any) => {
  listeners.add(listener);
  return () => {
    listeners.delete(listener);
  };
};

export const useChangeHandler = () => {
  return (redOrBlue: "red" | "blue") => {
    store.color = redOrBlue;
    Array.from(listeners).forEach((listener: any) => listener(store));
  };
};

export const useColor = () => {
  const [color, setColor] = useState(store.color);

  useEffect(() => {
    return subscribe((store: any) => {
      setColor(store.color);
    });
  }, []);

  return color;
};

export const useUnsafeChangeHandler = () => {
  return (redOrBlue: "red" | "blue") => {
    store.color = redOrBlue;
  };
};
