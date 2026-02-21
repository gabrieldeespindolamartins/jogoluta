/**
 * Clock provides frame-independent timing.
 * Uses performance.now() with a max delta clamp to prevent
 * physics explosions when the browser tab loses focus.
 */
export class Clock {
  constructor() {
    this.previousTime = 0;
    this.deltaTime = 0;
    this.elapsedTime = 0;
    this.maxDelta = 1 / 30; // Clamp to 30 FPS minimum
  }

  start() {
    this.previousTime = performance.now();
  }

  tick() {
    const currentTime = performance.now();
    const rawDelta = (currentTime - this.previousTime) / 1000;
    this.deltaTime = Math.min(rawDelta, this.maxDelta);
    this.elapsedTime += this.deltaTime;
    this.previousTime = currentTime;
    return this.deltaTime;
  }
}
