import React, { memo, useMemo, useTransition } from "react";
import * as ContextStrategy from "./strategies/context";
import * as UseSyncExternalStoreStrategy from "./strategies/use-sync-external-store";
import * as ExternalStrategy from "./strategies/external";
import mountApp from "./lib/mountApp";
import * as UI from "./lib/ui";
import * as lifecycleEvents from "./lib/lifecycleEvents";

const useStrategy = () => {
  const currentStrategy = useMemo(
    () => UI.getStrategy(document.location.search),
    []
  );

  const {
    Root = ({ children }) => children,
    useColor,
    useChangeHandler,
    useUnsafeChangeHandler,
  } = {
    context: ContextStrategy,
    external_managed: ExternalStrategy,
    external_usesyncexternalstore: UseSyncExternalStoreStrategy,
  }[currentStrategy.params.state] as typeof ContextStrategy &
    typeof ExternalStrategy &
    typeof UseSyncExternalStoreStrategy;

  const strategy = useMemo(
    () => ({
      Root,
      useColor,
      useChangeHandler,
      useUnsafeChangeHandler,
    }),
    [Root, useColor, useChangeHandler, useUnsafeChangeHandler]
  );

  return strategy;
};

const ExpensiveDot = memo(({ index }: any) => {
  const { useColor } = useStrategy();

  lifecycleEvents.log(
    `<span style="color: gray;"><span style="color: orange;">blocking</span> begin -</span> dot #${index}`
  );
  const color = useColor();

  const start = performance.now();
  const blockTime = 100 * index;
  while (performance.now() - start < blockTime) {
    // empty
  }

  lifecycleEvents.log(
    `<span style="color: gray;"><span style="color: orange;">blocking</span> over (rendering immediately after this) -</span> dot #${index}`
  );

  return <UI.Dot color={color} index={index} />;
});

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

    lifecycleEvents.log(
      `<span style="color: green;">transition began to {<span style="color: ${nextColor};">${nextColor}</span>}</span>`
    );
    // This will start a transition and begin work on a render
    // of 10 dots that each simulate blocking work.
    startTransition(() => {
      handleChange(nextColor);
    });
  };

  return (
    <UI.App
      pendingTransition={pendingTransition}
      ExpensiveDot={ExpensiveDot}
      onUpdate={handleUpdate}
      onUnsafeUpdate={() => handleUnsafeChange(color)}
      expectedColor={expectedColor}
      color={color}
    />
  );
};

mountApp(App);
