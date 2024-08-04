import { getRandomInt } from "./random";

export async function delay(milliseconds: number): Promise<void> {
  new Promise((resolve) => setTimeout(resolve, milliseconds));
}

export async function delayRandom(min: number, max: number): Promise<void> {
  const random = await getRandomInt(min, max);
  return delay(random);
}
