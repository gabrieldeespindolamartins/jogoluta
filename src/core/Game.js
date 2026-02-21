import { Clock } from './Clock.js';
import { SceneManager } from '../scene/SceneManager.js';
import { Arena } from '../scene/Arena.js';
import { Fighter } from '../fighters/Fighter.js';
import { InputManager } from '../input/InputManager.js';
import { PLAYER1_KEYS, PLAYER2_KEYS, SPAWN_POSITIONS } from './Constants.js';

/**
 * Game is the top-level orchestrator.
 * Owns the game loop and delegates to subsystems each frame:
 *   input → update → camera → render → endFrame
 *
 * Sprint 2: two fighters with dynamic camera.
 */
export class Game {
  constructor(canvas) {
    this.clock = new Clock();
    this.sceneManager = new SceneManager(canvas);
    this.arena = new Arena(this.sceneManager.scene);
    this.inputManager = new InputManager();

    // Create both fighters at their spawn positions
    this.player1 = new Fighter(
      this.sceneManager.scene, PLAYER1_KEYS, 'player1', SPAWN_POSITIONS.player1.x
    );
    this.player2 = new Fighter(
      this.sceneManager.scene, PLAYER2_KEYS, 'player2', SPAWN_POSITIONS.player2.x
    );

    this.isRunning = false;
  }

  start() {
    this.inputManager.attach();
    this.clock.start();
    this.isRunning = true;
    this._gameLoop();
  }

  _gameLoop() {
    if (!this.isRunning) return;

    requestAnimationFrame(() => this._gameLoop());

    const dt = this.clock.tick();

    // Update both fighters with opponent reference
    this.player1.update(dt, this.inputManager, this.player2);
    this.player2.update(dt, this.inputManager, this.player1);

    // Dynamic camera follows both fighters
    this.sceneManager.updateCamera(this.player1.position, this.player2.position);

    // Render
    this.sceneManager.render();

    // Clear one-shot input state
    this.inputManager.endFrame();
  }

  stop() {
    this.isRunning = false;
    this.inputManager.detach();
  }
}
