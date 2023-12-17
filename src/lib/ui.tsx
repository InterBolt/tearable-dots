import React, { memo, useEffect, useMemo, useState } from "react";
import * as lifecycleEvents from "./lifecycleEvents";

const colorRed = "#A25772";
const colorBlue = "#7C93C3";
const colorGreen = "#539165";

const styleEventLogHeader = {
  textDecoration: "underline",
  whiteSpace: "pre",
} as const;

const styleRedDot = {
  display: "flex",
  flexDirection: "column",
  justifyContent: "center",
  alignItems: "center",
  width: "75px",
  height: "75px",
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
  width: "75px",
  height: "75px",
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
  width: "75px",
  height: "75px",
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
  width: "100%",
  fontWeight: "bold",
  borderRadius: "6px",
  cursor: "not-allowed",
} as const;

const styleButton = {
  fontFamily: "monospace",
  backgroundColor: colorGreen,
  border: "none",
  color: "white",
  height: 50,
  width: "100%",
  fontWeight: "bold",
  borderRadius: "6px",
  cursor: "pointer",
} as const;

export const getStrategy = (search: string) => {
  const params = new URLSearchParams(search);
  const state = params.get("state") || "external_managed";
  const mode = params.get("mode") || "sync";
  return {
    state: {
      external_managed: "external via useEffect + useState",
      external_usesyncexternalstore: "external via useSyncExternalStore",
      context: "context",
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
  onUnsafeUpdate,
  expectedColor,
  color,
}: {
  ExpensiveDot: any;
  pendingTransition: boolean;
  onUpdate: () => void;
  onUnsafeUpdate: () => void;
  expectedColor: "red" | "blue";
  color: "red" | "blue";
}) => {
  const [init, setInit] = useState(false);
  const [showGif, setShowGif] = useState(false);
  const [hideFirstDot, setHideFirstDot] = useState(false);
  const currentStrategy = useMemo(() => {
    return getStrategy(document.location.search);
  }, []);

  useEffect(() => {
    if (pendingTransition) {
      setShowGif(false);
      setHideFirstDot(true);
      lifecycleEvents.log(
        `<span style="color: gray;"><span style="color: purple;">unmounting</span> first dot</span>`
      );
      setTimeout(() => {
        onUnsafeUpdate();
        lifecycleEvents.log(
          `<span style="color: gray;"><span style="color: red;">tearing attempt</span>: set color to {<span style="color: ${color};">${color}</span>}</span>`
        );
      }, 200);
      setTimeout(() => {
        setHideFirstDot(false);
        lifecycleEvents.log(
          `<span style="color: gray;"><span style="color: purple;">remounting</span> first dot</span>`
        );
      }, 700);
    } else {
      if (init && currentStrategy.params.state === "external_managed") {
        setShowGif(true);
      }
      setInit(true);
      lifecycleEvents.log(
        `<span style="color: gray;"><span style="color: green;">transition</span> complete</span>`
      );
    }
  }, [pendingTransition]);

  const renderedDots = dots.map((key: number) =>
    hideFirstDot && key === 1 ? (
      <Dot color="gray" index={key} />
    ) : (
      <ExpensiveDot key={key} index={key} />
    )
  );

  return (
    <div
      style={{
        padding: "30px",
        paddingTop: "190px",
        display: "flex",
        alignItems: "center",
        flexDirection: "column",
        width: "calc(100% - 60px)",
      }}
    >
      <div
        style={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          position: "absolute",
          top: 0,
          left: 0,
          padding: "0px 20px",
          width: "100%",
          height: 160,
          background:
            "linear-gradient(197deg, rgba(93,115,165,1) 0%, rgba(77,95,134,1) 58%, rgba(39,46,63,1) 100%)",
        }}
      >
        <h3
          style={{
            fontSize: 25,
            fontFamily: "monospace",
            color: "white",
            textAlign: "center",
          }}
        >
          <span
            style={
              {
                // color: "",
              }
            }
          >
            Current strategy:
          </span>
          {" " + currentStrategy.mode + " - " + currentStrategy.state}
        </h3>
      </div>
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
              marginBottom: "10px",
              fontFamily: "monospace",
            }}
          >
            The Tale of the Tearable Dots
          </h1>
          <p
            style={{
              fontFamily: "monospace",
              marginBottom: "10px",
              lineHeight: "1.8",
            }}
          >
            A demo simulation of the conditions that lead to UI tearing when
            using the following state management strategies in both sync and
            concurrent mode:{" "}
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
          <p
            style={{
              fontFamily: "monospace",
              marginBottom: "20px",
            }}
          >
            Learn more:{" "}
            <a href="https://interbolt.org/blog/react-ui-tearing/">
              https://interbolt.org/blog/react-ui-tearing/
            </a>
          </p>
          <a
            href="https://twitter.com/interbolt_colin"
            style={{
              fontFamily: "monospace",
              marginBottom: "10px",
            }}
          >
            Follow me twitter
          </a>

          <h2
            style={{
              marginBottom: "10px",
              fontFamily: "monospace",
            }}
          >
            <span
              style={{
                color: "darkgreen",
              }}
            >
              Current strategy:
            </span>
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
            <a
              style={{
                marginBottom: "-10px",
              }}
              href="?state=external_managed&mode=sync"
            >
              {getStrategy("?state=external_managed&mode=sync").mode +
                " mode" +
                " - " +
                getStrategy("?state=external_managed&mode=sync").state}
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
                marginBottom: "-10px",
              }}
              href="?state=external_managed&mode=concurrent"
            >
              {getStrategy("?state=external_managed&mode=concurrent").mode +
                " mode" +
                " - " +
                getStrategy("?state=external_managed&mode=concurrent").state}
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
            <a
              style={{
                marginBottom: "-10px",
              }}
              href="?state=external_usesyncexternalstore&mode=sync"
            >
              {getStrategy("?state=external_usesyncexternalstore&mode=sync")
                .mode +
                " mode" +
                " - " +
                getStrategy("?state=external_usesyncexternalstore&mode=sync")
                  .state}
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
            <a
              style={{
                marginBottom: "-10px",
              }}
              href="?state=external_usesyncexternalstore&mode=concurrent"
            >
              {getStrategy(
                "?state=external_usesyncexternalstore&mode=concurrent"
              ).mode +
                " mode" +
                " - " +
                getStrategy(
                  "?state=external_usesyncexternalstore&mode=concurrent"
                ).state}
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
            <a
              style={{
                marginBottom: "-10px",
              }}
              href="?state=context&mode=sync"
            >
              {getStrategy("?state=context&mode=sync").mode +
                " mode" +
                " - " +
                getStrategy("?state=context&mode=sync").state}
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
            <a
              style={{
                marginBottom: "-10px",
              }}
              href="?state=context&mode=concurrent"
            >
              {getStrategy("?state=context&mode=concurrent").mode +
                " mode" +
                " - " +
                getStrategy("?state=context&mode=concurrent").state}
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
            the lifecycle event log below the dots. It will tell you exactly
            what is happening with the render lifecyle under the hood.
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
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    flexDirection: "row",
                    gap: "15px",
                    justifyContent: "space-between",
                    width: "100%",
                    height: "100%",
                  }}
                >
                  <div
                    style={{
                      display: "flex",
                      height: "100%",
                      gap: "20px",
                      justifyContent: "space-around",
                      flexDirection: "column",
                    }}
                  >
                    {renderedDots}
                  </div>
                  <div
                    style={{
                      display: "flex",
                    }}
                  >
                    {showGif && (
                      <img
                        src="https://media1.tenor.com/m/8gnVs88HeMEAAAAd/spongebob-sandy-cheeks.gif"
                        style={{
                          width: "350px",
                          borderRadius: "20px",
                          marginLeft: "-75px",
                        }}
                      />
                    )}
                  </div>
                  <div
                    style={{
                      display: "flex",
                      marginRight: "20px",
                    }}
                  >
                    <div />
                  </div>
                </div>
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
            <span
              style={{
                color: colorGreen,
              }}
            >
              Current strategy
            </span>
            :{" " + currentStrategy.mode + " - " + currentStrategy.state}
          </span>
          <h2 style={styleEventLogHeader}>Lifecycle Event Log</h2>
        </div>
      </div>
    </div>
  );
};
