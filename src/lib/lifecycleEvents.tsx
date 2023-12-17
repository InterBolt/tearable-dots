const failed: Array<{ message: string; description?: string; time: number }> =
  [];
const retrySuccesses: any = [];

export const containerId = "log-container";

const buildMessage = (
  time: number,
  message: string,
  description?: string
): string =>
  `<i>${String(time).padEnd(8, " ")}</i> - <strong>${message}</strong>${
    description ? ` - ${description}` : ``
  }`;

export const log = (message: string, description?: string) => {
  try {
    failed.forEach((item, i) => {
      if (retrySuccesses.includes(i)) return;
      const div = document.createElement("div");
      div.innerHTML = buildMessage(item.time, item.message, item.description);
      div.style.marginBottom = "15px";
      div.style.fontSize = ".9rem";
      document.getElementById(containerId).appendChild(div);
      retrySuccesses.push(i);
    });
    const div = document.createElement("div");
    div.innerHTML = buildMessage(performance.now(), message, description);
    div.style.marginBottom = "15px";
    div.style.fontSize = ".9rem";
    document.getElementById(containerId).appendChild(div);
  } catch (err) {
    failed.push({ message, description, time: performance.now() });
  }
};
