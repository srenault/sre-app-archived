const LOADING_TIME = 2000;

export function delay(response) {
  return new Promise((resolve) => {
    setTimeout(() => resolve(response), LOADING_TIME);
  });
}

export default {
  delay,
};
