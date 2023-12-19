import React, { memo, useEffect, useMemo, useState } from "react";
import log, { containerId } from "./log";
import copy from "../copy";
import * as ContextStrategy from "../strategies/context";
import * as UseSyncExternalStoreStrategy from "../strategies/use-sync-external-store";
import * as ExternalStrategy from "../strategies/external";
import {
  Banner,
  MainAbout,
  StrategySection,
  UiImportantNote,
  DotsAndButton,
  LifecycleEventLog,
  ScreenContainer,
} from "./sections";
import styles from "./styles";

export const getStrategyModule = (state: string) => {
  const {
    Root = ({ children }) => children,
    useColor,
    useChangeHandler,
    useUnsafeChangeHandler,
  } = {
    context: ContextStrategy,
    external_managed: ExternalStrategy,
    external_usesyncexternalstore: UseSyncExternalStoreStrategy,
  }[state] as typeof ContextStrategy &
    typeof ExternalStrategy &
    typeof UseSyncExternalStoreStrategy;

  return {
    Root,
    useColor,
    useChangeHandler,
    useUnsafeChangeHandler,
  };
};

export const getStrategy = (search: string) => {
  const params = new URLSearchParams(search);
  const state = params.get("state") || "external_managed";
  const mode = params.get("mode") || "concurrent";
  return {
    headline: copy.headlines[state],
    state: copy.names[state],
    mode: mode.toLowerCase(),
    expectations: copy.strategies[state][mode.toLowerCase()],
    params: {
      state,
      mode,
    },
  };
};

export const useStrategy = () => {
  const currentStrategy = useMemo(
    () => getStrategy(document.location.search),
    []
  );

  const memoizedStrategy = useMemo(
    () => getStrategyModule(currentStrategy.params.state),
    [currentStrategy.params.state]
  );

  return memoizedStrategy;
};

const Dot = memo(
  ({ color }: { color: "red" | "blue" | "gray"; index: number }) => {
    return (
      <div
        style={
          color === "red"
            ? styles.redDot
            : color === "blue"
            ? styles.blueDot
            : styles.ghostDot
        }
        className="color-dot"
      >
        {color === "gray" ? "" : color}
      </div>
    );
  }
);

export const useRenderLog = (name: string, blockTime?: number) => {
  const start = performance.now();
  log(
    `<span style="color: black;">${name}<span style="color: gray;"> render started</span>`
  );

  if (blockTime) {
    const start = performance.now();
    const blockTime = 300;
    while (performance.now() - start < blockTime) {
      // empty
    }
  }

  useEffect(() => {
    log(
      `<span style="color: gray;"><span style="color: black;">${name}</span> render completed</span>`
    );
  });
};

const ExpensiveDot = memo(({ index }: any) => {
  const { useColor } = useStrategy();

  const color = useColor();

  useRenderLog("dot #" + index, 300);

  useEffect(() => {
    return () =>
      log(
        `<span style="color: black;">dot #${index}<span style="color: purple;"> unmounting</span></span>`
      );
  }, []);

  return <Dot color={color} index={index} />;
});

const dots: any = [1, 2, 3, 4, 5];

export const Screen = ({
  pendingTransition,
  onUpdate,
  onUnsafeUpdate,
  expectedColor,
  color,
}: {
  pendingTransition: boolean;
  onUpdate: () => void;
  onUnsafeUpdate: () => void;
  expectedColor: "red" | "blue";
  color: "red" | "blue";
}) => {
  const [showDots, setShowDots] = useState(false);
  const [init, setInit] = useState(false);
  const [showGif, setShowGif] = useState(false);
  const [hideFirstDot, setHideFirstDot] = useState(false);
  const currentStrategy = useMemo(() => {
    return getStrategy(document.location.search);
  }, []);

  useEffect(() => {
    setTimeout(() => {
      setShowDots(true);
    }, 50);
  }, []);

  useEffect(() => {
    if (pendingTransition) {
      setShowGif(false);
      setHideFirstDot(true);
      setTimeout(() => {
        onUnsafeUpdate();
        log(
          `<span style="color: gray;"><span style="color: red;">TEARING ATTEMPT</span>: set color to {<span style="color: ${color};">${color}</span>}</span>`
        );
      }, 200);
      setTimeout(() => {
        setHideFirstDot(false);
      }, 700);
    } else {
      if (init && currentStrategy.params.state === "external_managed") {
        setShowGif(true);
      }
      setInit(true);
      log(
        `<span style="color: gray;"><span style="color: green;">transition</span> complete</span>`
      );
    }
  }, [pendingTransition]);

  const renderedDots = showDots
    ? dots.map((key: number) =>
        hideFirstDot && key === 1 ? (
          <Dot color="gray" index={key} />
        ) : (
          <ExpensiveDot key={key} index={key} />
        )
      )
    : null;

  return (
    <ScreenContainer>
      <>
        <Banner currentStrategy={currentStrategy} />
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            width: "100%",
            gap: "30px",
            maxWidth: styles.maxWidth,
          }}
        >
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              boxSizing: "border-box",
              padding: 20,
            }}
          >
            <MainAbout />
            <StrategySection />
            <UiImportantNote />
            <DotsAndButton
              currentStrategy={currentStrategy}
              pendingTransition={pendingTransition}
              onUpdate={onUpdate}
              expectedColor={expectedColor}
              renderedDots={renderedDots}
              showGif={showGif}
            />
            <LifecycleEventLog currentStrategy={currentStrategy} />
          </div>
        </div>
      </>
    </ScreenContainer>
  );
};
