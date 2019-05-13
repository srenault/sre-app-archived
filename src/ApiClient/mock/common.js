const LOADING_TIME = 1500;

export function delay(response) {
  return new Promise((resolve) => {
    setTimeout(() => resolve(response), LOADING_TIME);
  });
}

export default {
  delay,
};
