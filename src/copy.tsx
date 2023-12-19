import React from "react";

const copy = {
  spongebobGif:
    "https://media1.tenor.com/m/8gnVs88HeMEAAAAd/spongebob-sandy-cheeks.gif",
  twitterLink: "https://twitter.com/interbolt_colin",
  blogLink: "https://interbolt.org/blog/react-ui-tearing/",
  githubLink: "https://github.com/InterBolt/tearable-dots",
  headlines: {
    external_managed: "external store tracked via `useEffect` and `useState`",
    external_usesyncexternalstore:
      "external store tracked via useSyncExternalStore",
    context: "store managed withing React's context API",
  },
  names: {
    external_managed: "external store tracked via `useEffect` and `useState`",
    external_usesyncexternalstore:
      "external store tracked via useSyncExternalStore",
    context: "store managed withing React's context API",
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
  supports_transition: {
    external_managed: true,
    external_usesyncexternalstore: false,
    context: true,
  },
  will_tear: {
    external_managed: true,
    external_usesyncexternalstore: false,
    context: false,
  },
  strategies: {
    external_managed: {
      concurrent: `This works in sync mode but will cause tearing in concurrent mode. Because it supports the transition API, the tearing attempt will occur mid-render instead of waiting for the the dot renders to complete.`,
      sync: `This works because it does not make use of the transition API and will wait for the dot renders to complete before making the tearing attempt.`,
    },
    external_usesyncexternalstore: {
      concurrent: `This is the new way of managing external global state via \`useSyncExternalStore\` and will NOT cause tearing. The tradeoff is that \`useSyncExternalStore\` will fallback to rendering in sync mode if it detects inconsistencies. It also will not work with React's new transition APIs. This is easy to see because the button never turns grey after the user clicks it.`,
      sync: `This works in synchronous mode but isn't necessary since synchronous renders should result in the consistent state.`,
    },
    context: {
      concurrent: `This uses React's context API to manage state and will NOT cause tearing. It also works with React's new transition APIs. The reason why this approach is not more popular, though, is because React's \`useContext\` does not allow fine-grained reactivity and will cause unnecessary rerenders in components that only need to access a slice of the store.`,
      sync: `This uses React's context API to manage global state and will NOT cause tearing. In sync mode (and probably in concurrent mode too), this is never a recommended way of managing global state due to rerender concerns.`,
    },
  },
} as any;

export default copy;
