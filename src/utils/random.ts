export function getRandomInt(min, max) {
  return Math.floor(Math.random() * (max + 1 - min)) + min;
}

export function getRandomElementFromArray(array) {
  return array[Math.floor(Math.random() * array.length)];
}
