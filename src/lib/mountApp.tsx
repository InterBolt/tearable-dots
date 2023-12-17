import React from "react";
import { createRoot } from "react-dom/client";
import ReactDOM from "react-dom";
import * as lifecycleEvents from "./lifecycleEvents";
import { getStrategy } from "./ui";

import * as ContextStrategy from "../strategies/context";
import * as UseSyncExternalStoreStrategy from "../strategies/use-sync-external-store";
import * as ExternalStrategy from "../strategies/external";

const renderDOM = (App: any) => {
  window.onload = () => {
    const strategy = getStrategy(document.location.search);

    lifecycleEvents.log(`running React in ${strategy.params.mode} mode`);
    lifecycleEvents.log(`with strategy: ${strategy.state}`);

    const { Root = ({ children }: any) => children } = {
      context: ContextStrategy,
      external_managed: ExternalStrategy,
      external_usesyncexternalstore: UseSyncExternalStoreStrategy,
    }[strategy.params.state] as typeof ContextStrategy &
      typeof ExternalStrategy &
      typeof UseSyncExternalStoreStrategy;

    // We can change `process.env.CONCURRENT_MODE` to "true" to see the difference
    // between concurrent mode and sync mode.
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
