export const sleepify =
  <T extends object>(fn: (...args: any[]) => Promise<T>, delay: number) =>
  (...args: any[]): Promise<T> =>
    new Promise((res, rej) => {
      setTimeout(async () => {
        try {
          const data = await fn(...args);
          res(data);
        } catch (e) {
          rej(e);
        }
      }, delay);
    });
