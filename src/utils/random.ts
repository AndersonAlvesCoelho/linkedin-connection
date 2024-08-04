export function getRandomInt(min, max): number {
  return Math.floor(Math.random() * (max + 1 - min)) + min;
}

export function getRandomElementFromArray(array): Promise<any> {
  return array[Math.floor(Math.random() * array.length)];
}
