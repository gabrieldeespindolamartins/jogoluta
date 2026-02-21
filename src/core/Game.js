import { Clock } from './Clock.js';
import { SceneManager } from '../scene/SceneManager.js';
import { Arena } from '../scene/Arena.js';
import { Fighter } from '../fighters/Fighter.js';
import { InputManager } from '../input/InputManager.js';
import { PLAYER1_KEYS } from './Constants.js';

/**
 * Game is the top-level orchestrator.
 * Owns the game loop and delegates to subsystems each frame:
 *   input → update → render → endFrame
 */
export class Game {
  constructor(canvas) {
    this.clock = new Clock();
    this.sceneManager = new SceneManager(canvas);
    this.arena = new Arena(this.sceneManager.scene);
    this.inputManager = new InputManager();

    // Player 1 fighter
    this.player1 = new Fighter(this.sceneManager.scene, PLAYER1_KEYS, 'player1');

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

    // Update fighter
    this.player1.update(dt, this.inputManager);

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
