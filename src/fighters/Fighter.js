import { FighterModel } from './FighterModel.js';
import { MOVEMENT } from '../core/Constants.js';

/**
 * Fighter represents a playable character.
 * Owns visual model, physics state, and input processing.
 *
 * Sprint 2: added opponent awareness, auto-rotation, and collision.
 * FighterStateMachine will be introduced in Sprint 3.
 */
export class Fighter {
  constructor(scene, keyMap, colorScheme = 'player1', startX = 0) {
    this.keyMap = keyMap;

    // Visual model
    this.model = new FighterModel(colorScheme);
    scene.add(this.model.group);

    // Physics state
    this.position = { x: startX, y: 0, z: 0 };
    this.velocity = { x: 0, y: 0, z: 0 };

    // State flags
    this.isGrounded = true;
    this.isCrouching = false;
    this.facingRight = colorScheme === 'player1';

    this._syncModelPosition();
  }

  update(dt, inputManager, opponent = null) {
    this._handleInput(dt, inputManager);
    this._applyGravity(dt);
    this._applyMovement(dt);
    if (opponent) {
      this._handleCollisionWithOpponent(opponent);
      this._handleAutoRotation(opponent);
    }
    this._enforceArenaBounds();
    this._syncModelPosition();
  }

  _handleInput(dt, inputManager) {
    const keys = this.keyMap;

    // Jump — one-shot, only from ground
    if (inputManager.isKeyJustPressed(keys.jump) && this.isGrounded) {
      this.velocity.y = MOVEMENT.jumpForce;
      this.isGrounded = false;
      this.isCrouching = false;
      this.model.setCrouching(false);
      // Preserve horizontal velocity at jump time (no air control)
      return;
    }

    // Only process ground-based input when grounded
    if (!this.isGrounded) return;

    // Crouch — continuous, only on ground
    const wantsCrouch = inputManager.isKeyDown(keys.crouch);
    if (wantsCrouch !== this.isCrouching) {
      this.isCrouching = wantsCrouch;
      this.model.setCrouching(wantsCrouch);
    }

    // Horizontal movement — not while crouching
    // Controls are relative to the SCREEN, not the fighter's facing direction
    if (!this.isCrouching) {
      if (inputManager.isKeyDown(keys.left)) {
        this.velocity.x = -MOVEMENT.walkSpeed;
      } else if (inputManager.isKeyDown(keys.right)) {
        this.velocity.x = MOVEMENT.walkSpeed;
      } else {
        this.velocity.x = 0;
      }
    } else {
      this.velocity.x = 0;
    }
  }

  /** Rotate fighter to always face the opponent */
  _handleAutoRotation(opponent) {
    const diff = opponent.position.x - this.position.x;
    if (diff > 0.01) {
      this.facingRight = true;
      this.model.group.rotation.y = 0;
    } else if (diff < -0.01) {
      this.facingRight = false;
      this.model.group.rotation.y = Math.PI;
    }
    // If diff is near zero, keep current facing direction
  }

  /** Prevent fighters from overlapping — symmetric pushback */
  _handleCollisionWithOpponent(opponent) {
    const dx = this.position.x - opponent.position.x;
    const distance = Math.abs(dx);
    const minDistance = 0.8; // approximate sum of body half-widths

    if (distance < minDistance && distance > 0.001) {
      const pushDirection = Math.sign(dx);
      const overlap = minDistance - distance;
      // Push both fighters equally (half the overlap each)
      this.position.x += pushDirection * (overlap / 2 + MOVEMENT.pushbackOnOverlap);
    }
  }

  _applyGravity(dt) {
    if (!this.isGrounded) {
      this.velocity.y += MOVEMENT.gravity * dt;
    }
  }

  _applyMovement(dt) {
    this.position.x += this.velocity.x * dt;
    this.position.y += this.velocity.y * dt;

    // Ground collision
    if (this.position.y <= MOVEMENT.groundY) {
      this.position.y = MOVEMENT.groundY;
      this.velocity.y = 0;
      this.velocity.x = 0;
      this.isGrounded = true;
    }
  }

  _enforceArenaBounds() {
    if (this.position.x < MOVEMENT.arenaMinX) {
      this.position.x = MOVEMENT.arenaMinX;
      this.velocity.x = 0;
    }
    if (this.position.x > MOVEMENT.arenaMaxX) {
      this.position.x = MOVEMENT.arenaMaxX;
      this.velocity.x = 0;
    }
  }

  _syncModelPosition() {
    this.model.group.position.x = this.position.x;
    this.model.group.position.z = this.position.z;

    if (this.isGrounded) {
      if (!this.isCrouching) {
        this.model.group.position.y = this.model.groundOffset;
      }
      // When crouching, setCrouching already handles Y
    } else {
      this.model.group.position.y = this.position.y + this.model.groundOffset;
    }
  }
}
