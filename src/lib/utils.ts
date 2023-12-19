export const syncBlock = (blockTime: number) => {
  const start = performance.now();
  while (performance.now() - start < blockTime) {
    // empty
  }
};
