import React, {
  memo,
  useEffect,
  useLayoutEffect,
  useMemo,
  useState,
} from "react";
import { mountLog, infoLog, infoLogBlack } from "./log";
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
import { dotBlockTime } from "./constants";

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

export const useStrategyModule = () => {
  const currentStrategy = useMemo(
    () => getStrategy(document.location.search),
    []
  );

  return getStrategyModule(currentStrategy.params.state);
};

export const useRenderLog = (name: string, blockTime?: number) => {
  if (blockTime) {
    const start = performance.now();
    while (performance.now() - start < blockTime) {
      // empty
    }
  }

  useEffect(() => {
    infoLogBlack(name, "rendered");
  });

  useLayoutEffect(() => {
    mountLog(name, "mounted");
  }, []);

  useEffect(() => {
    return () => {
      mountLog(name, "unmounted");
    };
  }, []);
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

const ExpensiveDot = memo(({ index }: any) => {
  infoLog("dot #" + index, "rendering");
  useRenderLog("dot #" + index, dotBlockTime * index);

  const { useColor } = useStrategyModule();
  const color = useColor();

  return <Dot color={color} index={index} />;
});

const dots: any = [1, 2, 3];

export const Screen = ({
  pendingTransition,
  onUpdate,
}: {
  pendingTransition: boolean;
  onUpdate: () => void;
}) => {
  const [showDots, setShowDots] = useState(false);
  const currentStrategy = useMemo(() => {
    return getStrategy(document.location.search);
  }, []);

  useEffect(() => {
    setTimeout(() => {
      setShowDots(true);
    }, 100);
  }, []);

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
              renderedDots={
                showDots
                  ? dots.map((key: number) => (
                      <ExpensiveDot key={key} index={key} />
                    ))
                  : null
              }
              showGif={false}
            />
            <LifecycleEventLog currentStrategy={currentStrategy} />
          </div>
        </div>
      </>
    </ScreenContainer>
  );
};
