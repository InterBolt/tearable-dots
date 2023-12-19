import React from "react";
import { createRoot } from "react-dom/client";
import ReactDOM from "react-dom";
import { mainLog } from "./log";
import { getStrategy, getStrategyModule } from "./ui";

const renderDOM = (App: any) => {
  window.onload = () => {
    const strategy = getStrategy(document.location.search);

    mainLog(`running React in ${strategy.params.mode} mode`);
    mainLog(`with strategy: ${strategy.state}`);

    const { Root } = getStrategyModule(strategy.params.state);

    if (strategy.mode === "concurrent") {
      const root = createRoot(document.getElementById("app"));
      root.render(
        <Root>
          <App />
        </Root>
      );
    } else {
      ReactDOM.render(
        <Root>
          <App />
        </Root>,
        document.getElementById("app")
      );
    }
  };
};

export default renderDOM;
