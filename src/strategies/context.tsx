import React, { createContext, useCallback, useContext, useState } from "react";

const ctx = createContext<any>({});

export const useChangeHandler = () => {
  const { updateColor } = useContext(ctx);
  return (redOrBlue: "red" | "blue") => {
    updateColor(redOrBlue);
  };
};

export const useColor = () => {
  const { color } = useContext(ctx);
  return color;
};

export const useUnsafeChangeHandler = () => {
  const { updateColor } = useContext(ctx);
  return (redOrBlue: "red" | "blue") => {
    updateColor(redOrBlue);
  };
};

export const Root = ({ children }: any) => {
  const [color, setColor] = useState("red");
  const updateColor = useCallback(
    (color: "red" | "blue") => setColor(color),
    []
  );

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
