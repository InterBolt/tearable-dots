import React, { createContext, useCallback, useContext, useState } from "react";

const ctx = createContext();

export const useChangeHandler = () => {
  const { updateColor } = useContext(ctx);
  return (redOrBlue) => {
    updateColor(redOrBlue);
  };
};

export const useColor = () => {
  const { color } = useContext(ctx);
  return color;
};

export const useUnsafeChangeHandler = () => {
  return (redOrBlue) => {
    ctx.color = redOrBlue;
  };
};

export const Root = ({ children }) => {
  const [color, setColor] = useState("red");
  const updateColor = useCallback((color) => setColor(color), []);

  return (
    <ctx.Provider
      value={{
        color,
        updateColor,
      }}
    >
      {children}
    </ctx.Provider>
  );
};
