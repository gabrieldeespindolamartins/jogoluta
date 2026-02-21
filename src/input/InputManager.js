/**
 * InputManager tracks which keyboard keys are currently pressed.
 * Provides both continuous (isKeyDown) and one-shot (isKeyJustPressed) queries.
 * Uses event.code for layout-independent key detection.
 */
export class InputManager {
  constructor() {
    this._keysDown = new Set();
    this._keysJustPressed = new Set();
    this._keysProcessedThisFrame = new Set();

    this._onKeyDown = this._onKeyDown.bind(this);
    this._onKeyUp = this._onKeyUp.bind(this);
  }

  attach() {
    window.addEventListener('keydown', this._onKeyDown);
    window.addEventListener('keyup', this._onKeyUp);
  }

  detach() {
    window.removeEventListener('keydown', this._onKeyDown);
    window.removeEventListener('keyup', this._onKeyUp);
    this._keysDown.clear();
    this._keysJustPressed.clear();
  }

  _onKeyDown(event) {
    event.preventDefault();
    if (!this._keysDown.has(event.code)) {
      this._keysJustPressed.add(event.code);
    }
    this._keysDown.add(event.code);
  }

  _onKeyUp(event) {
    this._keysDown.delete(event.code);
    this._keysJustPressed.delete(event.code);
  }

  /** Returns true every frame the key is held down */
  isKeyDown(code) {
    return this._keysDown.has(code);
  }

  /** Returns true only on the first frame the key is pressed */
  isKeyJustPressed(code) {
    if (this._keysJustPressed.has(code) && !this._keysProcessedThisFrame.has(code)) {
      this._keysProcessedThisFrame.add(code);
      return true;
    }
    return false;
  }

  /** Called at the end of each frame to reset one-shot state */
  endFrame() {
    this._keysJustPressed.clear();
    this._keysProcessedThisFrame.clear();
  }
}
