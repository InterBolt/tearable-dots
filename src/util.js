import React, { useCallback, useEffect, useRef, useState } from "react";

export const useForceRerender = () => {
  const [, updateState] = useState();
  const forceRerender = useCallback(() => updateState({}), []);

  return forceRerender;
};

export const blockThread = () => {
  const start = performance.now();
  const blockTime = Math.floor(Math.random() * 100);
  if (blockTime < 20) {
    return;
  }
  while (performance.now() - start < blockTime) {
    // empty
  }
};

export const useTearingAlert = (pendingTransition) => {
  const [show, setShow] = useState(false);
  const [torn, setTorn] = useState(false);

  useEffect(() => {
    if (pendingTransition) {
      return;
    }
    if (torn) {
      return;
    }

    try {
      const info = {
        colors: [...Array(10).keys()].map(
          (i) =>
            document.querySelector(`.color-dot:nth-of-type(${i + 1})`).innerHTML
        ),
        expected: document.getElementById("expected-color").innerHTML,
      };
      if (!info.colors.every((c) => c === info.expected)) {
        if (document.title.endsWith(" TEARED")) {
          return;
        }
        setTorn(true);
        setShow(true);
      }
    } catch (e) {
      // ignored
    }
  });

  return {
    isAlertOpen: show && torn,
    onClearAlert: () => {
      setShow(false);
      setTorn(false);
    },
    onHideAlert: () => setShow(false),
  };
};

export const TearingAlert = ({ isOpened, onClose }) => {
  const ref = useRef();

  const dialogClickHandler = (e) => {
    if (e.target.tagName !== "DIALOG")
      //This prevents issues with forms
      return;

    const rect = e.target.getBoundingClientRect();

    const clickedInDialog =
      rect.top <= e.clientY &&
      e.clientY <= rect.top + rect.height &&
      rect.left <= e.clientX &&
      e.clientX <= rect.left + rect.width;

    if (clickedInDialog === false) {
      e.target.close();
      onClose();
    }
  };

  useEffect(() => {
    if (isOpened) {
      ref.current?.showModal();
    } else {
      ref.current?.close();
      onClose();
    }
  }, [isOpened]);

  return (
    <dialog
      style={{
        padding: 0,
        margin: "auto",
        paddingBottom: 0,
        border: "none",
        overflow: "hidden",
        borderRadius: "20px",
      }}
      onClick={dialogClickHandler}
      ref={ref}
    >
      <div style={styleDialogue}>
        <img
          src="https://media1.tenor.com/m/8gnVs88HeMEAAAAd/spongebob-sandy-cheeks.gif"
          style={{
            minWidth: "100%",
            minHeight: "100%",
          }}
        />
      </div>
    </dialog>
  );
};

export const DemoUI = ({
  pendingTransition,
  ExpensiveDot,
  onUpdate,
  isAlertOpen,
  onHideAlert,
  color,
}) => {
  return (
    <div
      style={{
        padding: "80px",
      }}
    >
      <h1
        style={{
          marginBottom: "30px",
          fontFamily: "monospace",
        }}
      >
        React Concurrent Mode Tearing Demo
      </h1>
      <button
        style={styleButton}
        type="button"
        id="transitionIncrement"
        onClick={onUpdate}
      >
        Toggle color from {color} to {color === "blue" ? "red" : "blue"}
      </button>
      <h2
        style={{
          marginTop: "30px",
          fontFamily: "monospace",
        }}
      >
        The Tearable Dots {pendingTransition ? "pending transition..." : ""}
      </h2>
      <p
        style={{
          fontFamily: "monospace",
          marginBottom: "30px",
        }}
      >
        See the visuals in{" "}
        <a href="https://github.com/reactwg/react-18/discussions/69">
          https://github.com/reactwg/react-18/discussions/69
        </a>{" "}
        for why I use blue and red dots here.
      </p>
      <div
        style={{
          display: "flex",
          gap: "15px",
          marginBottom: "30px",
        }}
      >
        {[...Array(10).keys()].map((id) => (
          <ExpensiveDot key={id} />
        ))}
      </div>
      <h2
        style={{
          fontFamily: "monospace",
        }}
      >
        Expected color:
      </h2>
      <div
        style={{
          display: "flex",
        }}
      >
        <div
          id="expected-color"
          style={{
            ...styleExpected,
            backgroundColor: color === "red" ? colorRed : colorBlue,
          }}
        >
          {color}
        </div>
      </div>
      <TearingAlert isOpened={isAlertOpen} onClose={() => onHideAlert()} />
    </div>
  );
};

const colorRed = "#A25772";
const colorBlue = "#7C93C3";

export const styleExpected = {
  display: "flex",
  flexDirection: "column",
  justifyContent: "center",
  alignItems: "center",
  height: "60px",
  paddingLeft: "80px",
  paddingRight: "80px",
  color: "white",
  fontWeight: "bold",
  fontFamily: "arial",
  borderRadius: "10px",
};

export const styleDialogue = {
  borderRadius: "20px",
  overflow: "hidden",
};

export const styleRedDot = {
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
};

export const styleBlueDot = {
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
};

export const styleButton = {
  fontFamily: "monospace",
  backgroundColor: colorBlue,
  border: "none",
  color: "white",
  paddingTop: "10px",
  paddingBottom: "10px",
  paddingLeft: "20px",
  paddingRight: "20px",
  borderRadius: "5px",
  cursor: "pointer",
  boxShadow:
    "0 10px 15px -3px rgb(0 0 0 / 0.1), 0 4px 6px -4px rgb(0 0 0 / 0.1);",
};
