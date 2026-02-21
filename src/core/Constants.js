// Movement physics constants
export const MOVEMENT = {
  walkSpeed: 5,          // units per second
  jumpForce: 8,          // Y-axis jump impulse
  gravity: -20,          // gravity applied per second
  groundY: 0,            // Y position of the ground
  arenaMinX: -9,         // left arena boundary
  arenaMaxX: 9,          // right arena boundary
  pushbackOnOverlap: 0.1 // pushback when fighters overlap
};

// Camera positioning and behavior
export const CAMERA = {
  height: 3,
  baseDistance: 8,
  distanceMultiplier: 0.8,
  minDistance: 6,
  maxDistance: 14,
  smoothing: 0.05,
  lookAtHeight: 1.2
};

// Arena dimensions
export const ARENA = {
  width: 20,
  depth: 10,
  groundColor: 0x1a1a2e,
  lineColor: 0x16213e
};

// Player color palettes
export const PLAYER_COLORS = {
  player1: {
    body: 0x0a1628,
    head: 0x1565c0,
    headEmissive: 0x42a5f5,
    arms: 0x0d47a1,
    hips: 0x1a237e,
    legs: 0x0d47a1
  },
  player2: {
    body: 0x2a0a0a,
    head: 0xc62828,
    headEmissive: 0xef5350,
    arms: 0xb71c1c,
    hips: 0x4a0000,
    legs: 0xb71c1c
  }
};

// Fighter model dimensions (world units)
export const FIGHTER_BODY = {
  head: { width: 0.5, height: 0.5, depth: 0.5 },
  body: { width: 0.7, height: 0.8, depth: 0.4 },
  arms: { width: 0.2, height: 0.6, depth: 0.2 },
  hips: { width: 0.6, height: 0.2, depth: 0.35 },
  legs: { width: 0.2, height: 0.7, depth: 0.2 }
};

// Input key mappings (event.code values)
export const PLAYER1_KEYS = {
  left: 'KeyA',
  right: 'KeyD',
  jump: 'KeyW',
  crouch: 'KeyS'
};

export const PLAYER2_KEYS = {
  left: 'ArrowLeft',
  right: 'ArrowRight',
  jump: 'ArrowUp',
  crouch: 'ArrowDown'
};
