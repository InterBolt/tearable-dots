import React from "react";

const copy = {
  headlines: {
    external_managed: "external via useEffect + useState",
    external_usesyncexternalstore: "external via useSyncExternalStore",
    context: "context",
  },
  names: {
    external_managed: "external via useEffect + useState",
    external_usesyncexternalstore: "external via useSyncExternalStore",
    context: "context",
  },
  about: (
    <p
      style={{
        fontFamily: "monospace",
        marginBottom: "10px",
        lineHeight: "1.8",
      }}
    >
      A demo simulation of the conditions that lead to UI tearing when using the
      following state management strategies in both sync and concurrent mode:{" "}
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
  ),
  strategies: {
    external_managed: {
      concurrent: `TODO`,
      sync: `TODO`,
    },
    external_usesyncexternalstore: {
      concurrent: `TODO`,
      sync: `TODO`,
    },
    context: {
      concurrent: `TODO`,
      sync: `TODO`,
    },
  },
} as any;

export default copy;
