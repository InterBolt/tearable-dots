import { useEffect } from "react";
import { useForceRerender } from "./util";

const store = {
  color: "red",
};

const listeners = new Set();

export const useChangeHandler = () => {
  return (redOrBlue) => {
    store.color = redOrBlue;
    Array.from(listeners).forEach((listener) => listener());
  };
};

export const useColor = () => {
  const forceRerender = useForceRerender();

  useEffect(() => {
    listeners.add(forceRerender);
    return () => listeners.delete(forceRerender);
  }, []);

  return store.color;
};

export const useUnsafeChangeHandler = () => {
  return (redOrBlue) => {
    store.color = redOrBlue;
  };
};

export const Root = ({ children }) => children;
