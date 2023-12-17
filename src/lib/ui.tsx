import React, { memo, useEffect, useMemo, useState } from "react";
import * as lifecycleEvents from "./lifecycleEvents";

const colorRed = "#A25772";
const colorBlue = "#7C93C3";
const colorGreen = "#539165";

const styleEventLogHeader = {
  textDecoration: "underline",
  whiteSpace: "pre",
} as const;

const styleExpected = {
  display: "flex",
  flexDirection: "column",
  justifyContent: "center",
  alignItems: "center",
  height: "45px",
  paddingLeft: "80px",
  paddingRight: "80px",
  color: "white",
  fontWeight: "bold",
  fontFamily: "arial",
  borderRadius: "10px",
} as const;

const styleRedDot = {
  display: "flex",
  flexDirection: "column",
  justifyContent: "center",
  alignItems: "center",
  width: "45px",
  height: "45px",
  color: "white",
  fontWeight: "bold",
  backgroundColor: colorRed,
  fontFamily: "arial",
  borderRadius: "100%",
} as const;

const styleBlueDot = {
  display: "flex",
  flexDirection: "column",
  justifyContent: "center",
  alignItems: "center",
  width: "45px",
  height: "45px",
  color: "white",
  fontWeight: "bold",
  backgroundColor: colorBlue,
  fontFamily: "arial",
  borderRadius: "100%",
} as const;

const styleGhostDot = {
  display: "flex",
  flexDirection: "column",
  justifyContent: "center",
  alignItems: "center",
  width: "45px",
  height: "45px",
  color: "white",
  backgroundColor: "white",
  fontFamily: "arial",
  borderRadius: "100%",
  border: "1px solid gray",
} as const;

const stylePendingButton = {
  fontFamily: "monospace",
  backgroundColor: "gray",
  border: "none",
  color: "white",
  height: 50,
  width: 300,
  borderRadius: "30px",
  cursor: "not-allowed",
} as const;

const styleButton = {
  fontFamily: "monospace",
  backgroundColor: colorGreen,
  border: "none",
  color: "white",
  height: 50,
  width: 300,
  borderRadius: "30px",
  cursor: "pointer",
} as const;

export const getStrategy = (search: string) => {
  const params = new URLSearchParams(search);
  const state = params.get("state") || "external_managed";
  const mode = params.get("mode") || "sync";
  return {
    state: {
      external_managed: "externally managed by user",
      external_usesyncexternalstore:
        "externally managed by useSyncExternalStore",
      context: "internally managed by context",
    }[state],
    mode: mode.toLowerCase(),
    expectations: strategyExpectations[state][mode.toLowerCase()],
    params: {
      state,
      mode,
    },
  };
};

export const Dot = memo(
  ({ color }: { color: "red" | "blue" | "gray"; index: number }) => {
    return (
      <div
        style={
          color === "red"
            ? styleRedDot
            : color === "blue"
            ? styleBlueDot
            : styleGhostDot
        }
        className="color-dot"
      >
        {color}
      </div>
    );
  }
);

const dots: any = [1, 2, 3, 4, 5];

const strategyExpectations: any = {
  external_managed: {
    concurrent: `In this mode, expect to witness UI tearing. This is because the state is managed externally by the user. When the user updates the state, React will not know about it and will not be able to schedule a render. This is the worst case scenario for UI tearing.`,
    sync: `In this mode, the render happens all at once so we won't witness tearing.`,
  },
  external_usesyncexternalstore: {
    concurrent: `The UI will not tear but the transition fails to show a pending state. useSyncExternalStore() is incompatible with React transitions.`,
    sync: `No different than using external state managed by the user in sync mode. Will never tear.`,
  },
  context: {
    concurrent: `UI tearing will never occur because the state is managed internally by React.`,
    sync: `Also won't tear.`,
  },
};

export const App = ({
  ExpensiveDot,
  pendingTransition,
  onUpdate,
  expectedColor,
}: {
  ExpensiveDot: any;
  pendingTransition: boolean;
  onUpdate: () => void;
  expectedColor: "red" | "blue";
}) => {
  const [previousPending, setPreviousPending] = useState(pendingTransition);
  const [renderKeys, setRenderKeys] = useState(dots);

  useEffect(() => {
    if (pendingTransition) {
      if (!previousPending) {
        setPreviousPending(true);
      }
      const interval = setInterval(() => {
        const randomNum = Math.floor(Math.random() * dots.length);
        lifecycleEvents.log(
          `firing state transition to trigger a render in dot #${randomNum + 1}`
        );
        setRenderKeys((prev: any) => {
          const next = [...prev];
          next[randomNum] = performance.now();
          return next;
        });
      }, 50);
      return () => clearInterval(interval);
    } else if (previousPending) {
      setPreviousPending(false);
    }
  }, [pendingTransition]);

  const currentStrategy = useMemo(() => {
    return getStrategy(document.location.search);
  }, []);

  return (
    <div
      style={{
        padding: "30px",
        display: "flex",
        alignItems: "center",
        flexDirection: "column",
        width: "calc(100% - 60px)",
      }}
    >
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          width: "100%",
          gap: "30px",
          maxWidth: 900,
        }}
      >
        <div
          style={{
            display: "flex",
            flexDirection: "column",
          }}
        >
          <h1
            style={{
              marginBottom: "20px",
              fontFamily: "monospace",
            }}
          >
            The Tale of the Tearable Dots
          </h1>
          <p
            style={{
              fontFamily: "monospace",
              marginBottom: "10px",
            }}
          >
            This demo is the product of the following article:{" "}
            <a href="https://interbolt.org/blog/react-ui-tearing/">
              https://interbolt.org/blog/react-ui-tearing/
            </a>
          </p>

          <h2
            style={{
              marginBottom: "10px",
              fontFamily: "monospace",
            }}
          >
            What is this?
          </h2>
          <p
            style={{
              fontFamily: "monospace",
              marginBottom: "10px",
              lineHeight: "1.8",
            }}
          >
            Simulation of the conditions that lead to UI tearing when using the
            following state management strategies in both sync and concurrent
            mode:{" "}
            <span style={{ fontWeight: "bold", textDecoration: "underline" }}>
              external state managed by by user
            </span>
            ,{" "}
            <span style={{ fontWeight: "bold", textDecoration: "underline" }}>
              external state managed by React's useSyncExternalStore
            </span>
            , and
            <span style={{ fontWeight: "bold", textDecoration: "underline" }}>
              {" "}
              internal state managed by React's context API
            </span>
            .
          </p>

          <h2
            style={{
              marginBottom: "10px",
              fontFamily: "monospace",
            }}
          >
            Current strategy:
            {" " + currentStrategy.mode + " - " + currentStrategy.state}
          </h2>
          <p
            style={{
              fontFamily: "monospace",
              marginBottom: "10px",
              lineHeight: "1.8",
            }}
          >
            {currentStrategy.expectations}
          </p>
          <h2
            style={{
              marginBottom: "20px",
              fontFamily: "monospace",
            }}
          >
            Change strategy to:
          </h2>
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              gap: "20px",
              marginTop: "10px",
              marginBottom: "10px",
            }}
          >
            <a href="/?state=external_managed&mode=sync">
              Externally Managed by User - SYNC
            </a>
            <p
              style={{
                fontFamily: "monospace",
                marginBottom: "20px",
                marginTop: 0,
                lineHeight: "1.8",
              }}
            >
              {strategyExpectations.external_managed.sync}
            </p>
            <a
              style={{
                marginBottom: 0,
              }}
              href="/?state=external_managed&mode=concurrent"
            >
              Externally Managed by User - CONCURRENT
            </a>
            <p
              style={{
                fontFamily: "monospace",
                marginBottom: "20px",
                marginTop: 0,
                lineHeight: "1.8",
              }}
            >
              {strategyExpectations.external_managed.concurrent}
            </p>
            <a href="/?state=external_usesyncexternalstore&mode=sync">
              External but managed by useSyncExternalStore - SYNC
            </a>
            <p
              style={{
                fontFamily: "monospace",
                marginBottom: "20px",
                marginTop: 0,
                lineHeight: "1.8",
              }}
            >
              {strategyExpectations.external_usesyncexternalstore.sync}
            </p>
            <a href="/?state=external_usesyncexternalstore&mode=concurrent">
              External but managed by useSyncExternalStore - CONCURRENT
            </a>
            <p
              style={{
                fontFamily: "monospace",
                marginBottom: "20px",
                marginTop: 0,
                lineHeight: "1.8",
              }}
            >
              {strategyExpectations.external_usesyncexternalstore.concurrent}
            </p>
            <a href="/?state=context&mode=sync">
              Managed with Context API - SYNC
            </a>
            <p
              style={{
                fontFamily: "monospace",
                marginBottom: "20px",
                marginTop: 0,
                lineHeight: "1.8",
              }}
            >
              {strategyExpectations.context.sync}
            </p>
            <a href="/?state=context&mode=concurrent">
              Managed with Context API - CONCURRENT
            </a>
            <p
              style={{
                fontFamily: "monospace",
                marginBottom: "20px",
                marginTop: 0,
                lineHeight: "1.8",
              }}
            >
              {strategyExpectations.context.concurrent}
            </p>
          </div>

          <p
            style={{
              fontFamily: "monospace",
              marginBottom: "10px",
              lineHeight: "1.8",
            }}
          >
            <strong>Important: </strong> the most important part of this demo is
            the event log. Also when a tearing occurs you should see a gif of
            spongebob tearing in half.
          </p>

          <div
            style={{
              display: "flex",
              marginTop: "20px",
            }}
          >
            <div
              style={{
                display: "flex",
                alignItems: "center",
                width: "100%",
                border: "1px solid rgba(0, 0, 0, .1)",
                boxShadow: "0 1px 2px 0 rgb(0 0 0 / 0.05)",
                borderRadius: "10px",
              }}
            >
              <div
                style={{
                  display: "flex",
                  flexDirection: "column",
                  width: "100%",
                  padding: "20px",
                  gap: "20px",
                }}
              >
                {pendingTransition ? (
                  <button
                    style={stylePendingButton}
                    type="button"
                    id="transitionIncrement"
                    disabled={true}
                  >
                    Transition is pending...
                  </button>
                ) : (
                  <button
                    style={styleButton}
                    type="button"
                    id="transitionIncrement"
                    onClick={onUpdate}
                  >
                    Toggle color from {expectedColor} to{" "}
                    {expectedColor === "blue" ? "red" : "blue"}
                  </button>
                )}
                {renderKeys.map((key: boolean, index: number) => (
                  <ExpensiveDot key={key} index={index} />
                ))}
              </div>
            </div>
          </div>
        </div>
        <div
          id={lifecycleEvents.containerId}
          style={{
            display: "flex",
            flexDirection: "column",
            flex: 1,
            fontFamily: "monospace",
            padding: "20px",
            marginBottom: 200,
            border: "1px solid rgba(0, 0, 0, .1)",
            boxShadow: "0 1px 2px 0 rgb(0 0 0 / 0.05)",
            borderRadius: "10px",
          }}
        >
          <span
            style={{
              color: "rgba(0, 0, 0, .5)",
            }}
          >
            Current strategy:
            {" " + currentStrategy.mode + " - " + currentStrategy.state}
          </span>
          <h2 style={styleEventLogHeader}>Lifecycle Event Log</h2>
        </div>
      </div>
    </div>
  );
};
