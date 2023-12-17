import React, { memo, useEffect, useMemo, useState } from "react";
import * as lifecycleEvents from "./lifecycleEvents";
import copy from "../copy";

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
  width: "60px",
  height: "60px",
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
  width: "60px",
  height: "60px",
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
  width: "60px",
  height: "60px",
  color: "white",
  backgroundColor: "rgba(0, 0, 0, .1)",
  fontFamily: "arial",
  borderRadius: "100%",
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
        {color === "gray" ? "" : color}
      </div>
    );
  }
);

const dots: any = [1, 2, 3, 4, 5];

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
        padding: "15px",
        paddingTop: "190px",
        display: "flex",
        alignItems: "center",
        flexDirection: "column",
        width: "calc(100% - 30px)",
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
          // padding: "0px 20px",
          width: "100%",
          height: 160,
          background:
            "linear-gradient(197deg, rgba(93,115,165,1) 0%, rgba(77,95,134,1) 58%, rgba(39,46,63,1) 100%)",
        }}
      >
        <h3
          style={{
            fontSize: 25,
            margin: "0px 20px",
            fontFamily: "monospace",
            color: "white",
            textAlign: "center",
          }}
        >
          {currentStrategy.mode + " mode - " + currentStrategy.headline}
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
              lineHeight: "2.2rem",
            }}
          >
            Tearable Dots - visualize tradeoffs between state management
            strategies in React concurrent mode
          </h1>
          {copy.about}
          <p
            style={{
              fontFamily: "monospace",
              marginBottom: "10px",
              fontWeight: "bold",
              opacity: 0.8,
            }}
          >
            Learn more:{" "}
            <a
              style={{
                fontFamily: "monospace",
                marginBottom: "0px",
              }}
              href="https://interbolt.org/blog/react-ui-tearing/"
            >
              https://interbolt.org/blog/react-ui-tearing/
            </a>
          </p>
          <p
            style={{
              fontFamily: "monospace",
              marginBottom: "10px",
              marginTop: "0px",
              fontWeight: "bold",
              opacity: 0.8,
            }}
          >
            Twitter:{" "}
            <a
              href="https://twitter.com/interbolt_colin"
              style={{
                fontFamily: "monospace",
              }}
            >
              @interbolt_colin
            </a>
          </p>
          <a
            href="https://github.com/interbolt/tearable-dots"
            style={{
              fontFamily: "monospace",
              marginBottom: "10px",
              fontWeight: "bold",
              opacity: 0.8,
            }}
          >
            Source code (I'll clean it if people are interested)
          </a>
          <h2
            style={{
              marginTop: "40px",
              marginBottom: "10px",
              fontFamily: "monospace",
            }}
          >
            <span
              style={{
                color: "darkgreen",
              }}
            >
              Demo below is using:
            </span>
            {" " + currentStrategy.mode + " - " + currentStrategy.state}
          </h2>

          <h2
            style={{
              marginBottom: "20px",
              fontFamily: "monospace",
            }}
          >
            Click a link below to change the strategy:
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
              {copy.strategies.external_managed.sync}
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
              {copy.strategies.external_managed.concurrent}
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
              {copy.strategies.external_usesyncexternalstore.sync}
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
              {copy.strategies.external_usesyncexternalstore.concurrent}
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
              {copy.strategies.context.sync}
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
              {copy.strategies.context.concurrent}
            </p>
          </div>

          <p
            style={{
              fontFamily: "monospace",
              marginBottom: "10px",
              lineHeight: "1.8",
            }}
          >
            <strong>Important: </strong> the lifecycle events below the dots
            section will tell you exactly what is happening with the render
            lifecyle under the hood. When state tearing occurs look out for a
            spongebob GIF.
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
                          width: "150px",
                          borderRadius: "20px",
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
            : {currentStrategy.mode + " mode - " + currentStrategy.headline}
          </span>
          <h2 style={styleEventLogHeader}>Lifecycle Event Log</h2>
        </div>
      </div>
    </div>
  );
};
