import React, { useEffect, useRef, useTransition } from "react";
import mountApp from "./lib/mountApp";
import { tearingLog, transitionLog } from "./lib/log";
import { Screen, getStrategy, useRenderLog, useStrategyModule } from "./lib/ui";

const getNextColor = (color: "red" | "blue") =>
  color === "red" ? "blue" : "red";

const useLogTransition = (pendingTransition: boolean) => {
  const previous = useRef(null);
  useEffect(() => {
    if (pendingTransition && String(previous.current) !== "null") {
      transitionLog("transition started");
      previous.current = pendingTransition;
    } else if (previous.current === true) {
      transitionLog("transition ended");
      previous.current = false;
    } else {
      previous.current = pendingTransition;
    }
  }, [pendingTransition]);
};

const App = () => {
  const { useColor, useChangeHandler, useUnsafeChangeHandler } =
    useStrategyModule();

  const isSyncMode =
    getStrategy(document.location.search).params.mode === "sync";
  const [pendingTransition, startTransition] = useTransition();

  const color = useColor();

  const handleChange = useChangeHandler();

  const handleUnsafeChange = useUnsafeChangeHandler();

  const setupNextColor = () => {
    const nextColor = getNextColor(color);
    return nextColor;
  };

  const handleConcurrentUpdate = async () => {
    const nextColor = setupNextColor();
    startTransition(() => {
      handleChange(nextColor);
    });
    setTimeout(() => {
      const tearingColor = nextColor === "red" ? "blue" : "red";
      handleUnsafeChange(tearingColor);
      tearingLog(
        "TEARING ATTEMPT",
        `changing color to {<span style="color: ${color};">${color}</span>}`
      );
    }, 50);
  };

  const handleSyncUpdate = async () => {
    const nextColor = setupNextColor();
    handleChange(nextColor);
    setTimeout(() => {
      const tearingColor = nextColor === "red" ? "blue" : "red";
      handleUnsafeChange(tearingColor);
      tearingLog(
        "TEARING ATTEMPT",
        `changing color to {<span style="color: ${color};">${color}</span>}`
      );
    }, 50);
  };

  const handleUpdate = async () => {
    if (isSyncMode) {
      handleSyncUpdate();
    } else {
      handleConcurrentUpdate();
    }
  };

  useRenderLog("app");
  useLogTransition(pendingTransition);

  return (
    <Screen onUpdate={handleUpdate} pendingTransition={pendingTransition} />
  );
};

mountApp(App);
