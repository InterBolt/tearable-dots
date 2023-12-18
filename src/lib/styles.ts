const colorRed = "#A25772";
const colorBlue = "#7C93C3";
const colorGreen = "#539165";

const maxWidth = 800;

const eventLogHeader = {
  textDecoration: "underline",
  whiteSpace: "pre",
} as const;

const redDot = {
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

const blueDot = {
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

const ghostDot = {
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

const pendingButton = {
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

const button = {
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

const styles = {
  colorGreen,
  colorBlue,
  colorRed,
  eventLogHeader,
  redDot,
  blueDot,
  ghostDot,
  pendingButton,
  button,
  maxWidth,
} as const;

export default styles;
