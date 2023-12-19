import React from "react";
import { getStrategy } from "./ui";
import copy from "../copy";
import styles from "./styles";
import { containerId } from "./log";

type Strategy = ReturnType<typeof getStrategy>;

export const ScreenContainer = ({ children }: { children: any }) => {
  return (
    <div
      style={{
        display: "flex",
        alignItems: "center",
        flexDirection: "column",
        width: "100%",
      }}
    >
      {children}
    </div>
  );
};

export const Banner = ({ currentStrategy }: { currentStrategy: Strategy }) => {
  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        width: "100%",
        paddingBottom: 30,
        background:
          "linear-gradient(197deg, rgba(93,115,165,1) 0%, rgba(77,95,134,1) 58%, rgba(39,46,63,1) 100%)",
      }}
    >
      <div
        style={{
          width: "100%",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          borderWidth: "0px 0px 1px 0px",
          borderStyle: "solid",
          backgroundColor: "white",
          borderColor: "rgba(255, 255, 255, .2)",
          marginBottom: "30px",
          // ["-webkit-box-sizing"]: "border-box",
          // ["-moz-box-sizing"]: "border-box",
        }}
      >
        <div
          style={{
            width: "100%",
            display: "flex",
            flexDirection: "column",
            maxWidth: styles.maxWidth,
            marginBottom: "10px",
            boxSizing: "border-box",
            padding: 20,
          }}
        >
          <h1
            style={{
              fontSize: 33,
              fontFamily: "monospace",
              color: "rgba(0, 0, 0, .85)",
              margin: "10px 0px 0px 0px",
              padding: "0px 0px 0px 0px",
            }}
          >
            Tearable Dots - Global State in React
          </h1>
          <p
            style={{
              fontSize: 14,
              fontFamily: "monospace",
              color: "rgba(0, 0, 0, .85)",
              margin: "20px 0px 0px 0px",
              padding: "0px 0px 0px 0px",
              lineHeight: "1.7rem",
            }}
          >
            Demo UI at the bottom.
          </p>
          <p
            style={{
              lineHeight: "1.65",
              fontSize: "14px",
              fontFamily: "monospace",
              color: "rgba(0, 0, 0, .85)",
              margin: "10px 0px 0px 0px",
              padding: "0px 0px 0px 0px",
            }}
          >
            <strong>Why:</strong> I wanted to understand everything about state
            tearing in React concurrent mode after reading this{" "}
            <a href="https://github.com/reactwg/react-18/discussions/69">
              github discussion
            </a>
            . This demo was built to help understand tradeoffs between various
            global state management strategies in concurrent and sync mode.
          </p>
        </div>
      </div>
      <div
        style={{
          width: "100%",
          display: "flex",
          flexDirection: "column",
          maxWidth: styles.maxWidth,
          boxSizing: "border-box",
          paddingLeft: 20,
          paddingRight: 20,
        }}
      >
        <h3
          style={{
            fontFamily: "monospace",
            fontSize: 14,
            color: "white",
            margin: "0px 0px 0px 0px",
            padding: "0px 0px 0px 0px",
          }}
        >
          You're using the following React render mode:
        </h3>
        <h3
          style={{
            fontFamily: "monospace",
            color: "white",
            margin: "15px 0px 0px 0px",
            padding: "0px 0px 0px 0px",
          }}
        >
          <span
            style={{
              padding: "4px 8px",
              color: styles.colorGreen,
              borderRadius: "4px",
              fontSize: 18,
              backgroundColor: "rgba(255, 255, 255, 1)",
            }}
          >
            {currentStrategy.mode}
          </span>
        </h3>
        <h3
          style={{
            fontFamily: "monospace",
            color: "white",
            fontSize: 14,
            margin: "30px 0px 0px 0px",
            padding: "0px 0px 0px 0px",
          }}
        >
          You're using the following global state management strategy:
        </h3>
        <h3
          style={{
            fontFamily: "monospace",
            color: "white",
            margin: "15px 0px 0px 0px",
            padding: "0px 0px 0px 0px",
          }}
        >
          <span
            style={{
              padding: "4px 8px",
              color: styles.colorGreen,
              borderRadius: "4px",
              lineHeight: "2",
              fontSize: 18,
              backgroundColor: "rgba(255, 255, 255, 1)",
            }}
          >
            {currentStrategy.headline}
          </span>
        </h3>
      </div>
    </div>
  );
};

export const MainAbout = () => {
  return (
    <div
      style={{
        width: "100%",
        boxSizing: "border-box",
      }}
    >
      <p
        style={{
          fontFamily: "monospace",
          lineHeight: "1.65",
          fontSize: "14px",
          margin: "10px 0px 0px 0px",
          padding: "0px 0px 0px 0px",
          opacity: 0.8,
        }}
      >
        The demo below includes synchronous render-blocking code within the dot
        components, and then shows what happens when the global state store is
        modified while those render functions are yielding.{" "}
        <strong>
          The only time state tearing occurs in the demo below is when an
          external store is used without the `useSyncExternalStore` hook
          provided by React 18
        </strong>
        . Nonetheless, even though the other strategies don't cause tearing,
        their solutions to prevent it introduce other tradeoffs that are worth
        understanding. See the strategy/mode desriptions below for more details
        or read the <a href={copy.blogLink}>blog post I wrote</a> that goes in
        to much more depth.
      </p>
      <p
        style={{
          fontFamily: "monospace",
          margin: "20px 0px 0px 0px",
          padding: "0px 0px 0px 0px",
          fontWeight: "bold",
          opacity: 0.8,
        }}
      >
        <a href={copy.twitterLink}>My twitter</a>
      </p>
      <p
        style={{
          fontFamily: "monospace",
          lineHeight: "1.65",
          fontSize: "14px",
          margin: "20px 0px 0px 0px",
          padding: "0px 0px 0px 0px",
          opacity: 0.8,
        }}
      >
        <a href={copy.githubLink}>Source code</a>
        (I'll clean it if people are interested)
      </p>
    </div>
  );
};

export const StrategySection = () => {
  const modeStrategySection = (state: string, mode: string) => (
    <>
      <p
        style={{
          fontFamily: "monospace",
          margin: "0px 0px 0px 0px",
          padding: "0px 0px 0px 0px",
          lineHeight: "1.8",
        }}
      >
        <a href={`?state=${state}&mode=${mode}`}>
          {"render mode: "}
          <strong>{getStrategy(`?state=${state}&mode=${mode}`).mode}</strong>
          {" - strategy: "}
          <strong>{getStrategy(`?state=${state}&mode=${mode}`).state}</strong>
        </a>
      </p>
      <p
        style={{
          fontFamily: "monospace",
          margin: "0px 0px 0px 0px",
          padding: "0px 0px 0px 0px",
          lineHeight: "1.8",
        }}
      >
        {copy.strategies[state][mode]}
      </p>
    </>
  );
  return (
    <>
      <h2
        style={{
          marginTop: "30px",
          marginBottom: "20px",
          fontFamily: "monospace",
        }}
      >
        Change the strategy/mode by clicking a link below:
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
        {modeStrategySection("external_managed", "concurrent")}
        {modeStrategySection("external_usesyncexternalstore", "concurrent")}
        {modeStrategySection("context", "concurrent")}
        {modeStrategySection("external_managed", "sync")}
        {modeStrategySection("external_usesyncexternalstore", "sync")}
        {modeStrategySection("context", "sync")}
      </div>
    </>
  );
};

export const UiImportantNote = () => {
  return (
    <p
      style={{
        fontFamily: "monospace",
        marginBottom: "10px",
        lineHeight: "1.8",
      }}
    >
      <strong>Important: </strong> the lifecycle events below the dots section
      will tell you exactly what is happening with the render lifecyle under the
      hood. When state tearing occurs look out for a spongebob GIF.
    </p>
  );
};

export const DotsAndButton = ({
  currentStrategy,
  pendingTransition,
  onUpdate,
  expectedColor,
  renderedDots,
  showGif,
}: {
  currentStrategy: Strategy;
  pendingTransition: boolean;
  onUpdate: () => void;
  expectedColor: "blue" | "red";
  renderedDots: any;
  showGif: boolean;
}) => {
  return (
    <div
      style={{
        display: "flex",
        marginTop: "20px",
      }}
    >
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          width: "100%",
          border: "1px solid rgba(0, 0, 0, .1)",
          boxShadow: "0 1px 2px 0 rgb(0 0 0 / 0.05)",
          borderRadius: "10px",
          boxSizing: "border-box",
          padding: "20px",
        }}
      >
        <div
          style={{
            width: "100%",
            display: "flex",
            flexDirection: "column",
            boxSizing: "border-box",
            marginBottom: 20,
          }}
        >
          <p
            style={{
              fontFamily: "monospace",
              margin: "0px 0px 0px 0px",
              padding: "0px 0px 0px 0px",
              lineHeight: "1.8",
            }}
          >
            <strong>Current strategy: </strong>
            {copy.headlines[currentStrategy.params.state]}
          </p>
          {currentStrategy.mode === "concurrent" && (
            <p
              style={{
                fontFamily: "monospace",
                margin: "0px 0px 0px 0px",
                padding: "0px 0px 0px 0px",
                lineHeight: "1.8",
              }}
            >
              <strong>Will tear: </strong>
              {String(copy.will_tear[currentStrategy.params.state])}
            </p>
          )}
          {currentStrategy.mode === "concurrent" && (
            <p
              style={{
                fontFamily: "monospace",
                margin: "0px 0px 0px 0px",
                padding: "0px 0px 0px 0px",
                lineHeight: "1.8",
              }}
            >
              <strong>Supports React transition API: </strong>
              {String(copy.supports_transition[currentStrategy.params.state])}
            </p>
          )}
          <p
            style={{
              fontFamily: "monospace",
              margin: "10px 0px 0px 0px",
              padding: "0px 0px 0px 0px",
              lineHeight: "1.8",
            }}
          >
            {
              copy.strategies[currentStrategy.params.state][
                currentStrategy.params.mode
              ]
            }
          </p>
        </div>
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            width: "100%",
            minHeight: 300,
            gap: "20px",
          }}
        >
          {pendingTransition ? (
            <button
              style={styles.pendingButton}
              type="button"
              id="transitionIncrement"
              disabled={true}
            >
              Transition is pending...
            </button>
          ) : (
            <button
              style={styles.button}
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
                <div
                  style={{
                    display: "flex",
                    flexDirection: "column",
                  }}
                >
                  <p
                    style={{
                      fontFamily: "monospace",
                      fontSize: "14px",
                    }}
                  >
                    <strong>State tearing detected!</strong>
                  </p>
                  <img
                    src={copy.spongebobGif}
                    style={{
                      width: "150px",
                      borderRadius: "20px",
                    }}
                  />
                </div>
              )}
            </div>
            <div
              style={{
                display: "flex",
              }}
            >
              <div />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export const LifecycleEventLog = ({
  currentStrategy,
}: {
  currentStrategy: Strategy;
}) => {
  return (
    <div
      id={containerId}
      style={{
        display: "flex",
        flexDirection: "column",
        flex: 1,
        fontFamily: "monospace",
        marginTop: "30px",
        padding: "20px",
        marginBottom: 200,
        border: "1px solid rgba(0, 0, 0, .1)",
        boxShadow: "0 1px 2px 0 rgb(0 0 0 / 0.05)",
        borderRadius: "10px",
      }}
    >
      <h2 style={styles.eventLogHeader}>Lifecycle Event Log</h2>
    </div>
  );
};
