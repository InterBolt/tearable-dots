import React, { useTransition } from "react";
import mountApp from "./lib/mountApp";
import log from "./lib/log";
import { Screen, useStrategy } from "./lib/ui";

const getNextColor = (color: "red" | "blue") =>
  color === "red" ? "blue" : "red";

const App = () => {
  const { useColor, useChangeHandler, useUnsafeChangeHandler } = useStrategy();
  // React 18 API that allows us to start a transition
  // where state updates within a transition can only trigger
  // a deprioritized render. A deprioritized render might yield
  // to other work.
  const [pendingTransition, startTransition] = useTransition();

  // We use this to show the "expected" value of color
  const color = useColor();

  const [expectedColor, setExpectedColor] = React.useState(color);

  // Happy path state update
  const handleChange = useChangeHandler();

  // A state update that bypasses the state interface
  const handleUnsafeChange = useUnsafeChangeHandler();

  const setupNextColor = () => {
    const nextColor = getNextColor(color);
    setExpectedColor(nextColor);
    return nextColor;
  };

  const handleUpdate = async () => {
    // Determine the next color, set expected color, and
    // clear the tearing dialogue alert.
    const nextColor = setupNextColor();

    log(
      `<span style="color: green;">transition began to {<span style="color: ${nextColor};">${nextColor}</span>}</span>`
    );
    // This will start a transition and begin work on a render
    // of 10 dots that each simulate blocking work.
    startTransition(() => {
      handleChange(nextColor);
    });
  };

  return (
    <Screen
      pendingTransition={pendingTransition}
      onUpdate={handleUpdate}
      onUnsafeUpdate={() => handleUnsafeChange(color)}
      expectedColor={expectedColor}
      color={color}
    />
  );
};

mountApp(App);
