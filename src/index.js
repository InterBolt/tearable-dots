import React, { memo, useTransition } from "react";
import { createRoot } from "react-dom/client";
import ReactDOM from "react-dom";

//
// `ContextState` and `ExternalState` are two different implementations of the same
// state management API. `ContextState` uses React context to store the state,
// while `ExternalState` uses a global variable.
//
import * as ContextState from "./context-state";
import * as ExternalState from "./external-state";

//
// `TearingAlert` is a component that shows an alert when the DOM is torn.
// `blockThread` is a function that blocks the thread for a random amount of time.
// `useTearingAlert` is a hook that returns the state of the alert.
//
import {
  DemoUI,
  blockThread,
  styleBlueDot,
  styleRedDot,
  useTearingAlert,
} from "./util";

//
// Each `[...]-state.js` file exports three hooks:
//
// - `useColor`
//      - returns the current color.
// - `useChangeHandler`
//      - returns a function that changes the color.
// - `useUnsafeChangeHandler`
//      - returns a function that changes the color without
//        using the state interface. In `ExternalState`, this function
//        directly modifies a global variable. In `ContextState`,
//        this function directly modifies the context. Both are bad practice,
//        but even so, `ContextState` will not tear in concurrent mode or sync mode.
//
const { useColor, useChangeHandler, useUnsafeChangeHandler } =
  process.env.STATE === "external" ? ExternalState : ContextState;

const ExpensiveDot = memo(() => {
  const color = useColor();

  blockThread();

  return (
    <div
      style={color === "red" ? styleRedDot : styleBlueDot}
      className="color-dot"
    >
      {color}
    </div>
  );
});

const App = () => {
  // React 18 API that allows us to start a transition
  // where state updates within a transition can only trigger
  // a deprioritized render. A deprioritized render is a render
  // that yields to other work.
  const [pendingTransition, startTransition] = useTransition();

  // We use this to show the "expected" value of color
  const color = useColor();

  // Finds out if the DOM is torn and returns the state of the alert.
  const { isAlertOpen, onClearAlert, onHideAlert } =
    useTearingAlert(pendingTransition);

  // Happy path state update
  const handleChange = useChangeHandler();

  // A state update that bypasses the state interface
  const handleUnsafeChange = useUnsafeChangeHandler();

  // This function is called when the user clicks the "Update" button.
  const handleUpdate = async () => {
    onClearAlert();
    startTransition(() => handleChange(color === "blue" ? "red" : "blue"));

    await new Promise((resolve) =>
      setTimeout(resolve, Math.floor(Math.random() * 100))
    );

    handleUnsafeChange(color === "blue" ? "blue" : "red");
  };

  return (
    <DemoUI
      pendingTransition={pendingTransition}
      ExpensiveDot={ExpensiveDot}
      onUpdate={handleUpdate}
      isAlertOpen={isAlertOpen}
      onHideAlert={onHideAlert}
      color={color}
    />
  );
};

// We can change `process.env.CONCURRENT_MODE` to "true" to see the difference
// between concurrent mode and sync mode.
if (process.env.CONCURRENT_MODE === "true") {
  const root = createRoot(document.getElementById("app"));
  root.render(<App />);
} else {
  ReactDOM.render(<App />, document.getElementById("app"));
}
