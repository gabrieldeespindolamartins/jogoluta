import * as THREE from 'three';
import { FIGHTER_BODY, PLAYER_COLORS } from '../core/Constants.js';

/**
 * FighterModel builds the visual cube-based robot.
 *
 * Hierarchy:
 *   group
 *     └─ body (torso, reference center)
 *          ├─ head
 *          ├─ armLeftPivot → armLeft
 *          ├─ armRightPivot → armRight
 *          └─ hips
 *               ├─ legLeftPivot → legLeft
 *               └─ legRightPivot → legRight
 *
 * Pivot groups sit at joint positions so rotations look natural.
 */
export class FighterModel {
  constructor(colorScheme = 'player1') {
    const colors = PLAYER_COLORS[colorScheme];
    this.group = new THREE.Group();
    this.parts = {};

    this._buildBody(colors);
    this._buildHead(colors);
    this._buildArms(colors);
    this._buildHips(colors);
    this._buildLegs(colors);
    this._calculateGroundOffset();

    // Set initial standing position
    this.group.position.y = this.groundOffset;
  }

  _createPart(name, dimensions, color, options = {}) {
    const { width, height, depth } = dimensions;
    const geometry = new THREE.BoxGeometry(width, height, depth);

    const matOpts = {
      color,
      roughness: 0.6,
      metalness: 0.4
    };

    if (options.emissive) {
      matOpts.emissive = options.emissive;
      matOpts.emissiveIntensity = 0.5;
    }

    const material = new THREE.MeshStandardMaterial(matOpts);
    const mesh = new THREE.Mesh(geometry, material);
    mesh.castShadow = true;

    this.parts[name] = mesh;
    return mesh;
  }

  _buildBody(colors) {
    const body = this._createPart('body', FIGHTER_BODY.body, colors.body);
    this.group.add(body);
  }

  _buildHead(colors) {
    const head = this._createPart('head', FIGHTER_BODY.head, colors.head, {
      emissive: colors.headEmissive
    });
    const headY = (FIGHTER_BODY.body.height / 2) + (FIGHTER_BODY.head.height / 2) + 0.05;
    head.position.set(0, headY, 0);
    this.parts.body.add(head);
  }

  _buildArms(colors) {
    const shoulderY = FIGHTER_BODY.body.height / 2 - 0.05;
    const shoulderX = FIGHTER_BODY.body.width / 2 + FIGHTER_BODY.arms.width / 2;

    // Left arm
    const armLeftPivot = new THREE.Group();
    armLeftPivot.position.set(-shoulderX, shoulderY, 0);
    const armLeft = this._createPart('armLeft', FIGHTER_BODY.arms, colors.arms);
    armLeft.position.set(0, -FIGHTER_BODY.arms.height / 2, 0);
    armLeftPivot.add(armLeft);
    this.parts.body.add(armLeftPivot);
    this.parts.armLeftPivot = armLeftPivot;

    // Right arm
    const armRightPivot = new THREE.Group();
    armRightPivot.position.set(shoulderX, shoulderY, 0);
    const armRight = this._createPart('armRight', FIGHTER_BODY.arms, colors.arms);
    armRight.position.set(0, -FIGHTER_BODY.arms.height / 2, 0);
    armRightPivot.add(armRight);
    this.parts.body.add(armRightPivot);
    this.parts.armRightPivot = armRightPivot;
  }

  _buildHips(colors) {
    const hips = this._createPart('hips', FIGHTER_BODY.hips, colors.hips);
    hips.position.set(0, -(FIGHTER_BODY.body.height / 2 + FIGHTER_BODY.hips.height / 2), 0);
    this.parts.body.add(hips);
  }

  _buildLegs(colors) {
    const hips = this.parts.hips;
    const hipY = -FIGHTER_BODY.hips.height / 2;

    // Left leg
    const legLeftPivot = new THREE.Group();
    legLeftPivot.position.set(-0.15, hipY, 0);
    const legLeft = this._createPart('legLeft', FIGHTER_BODY.legs, colors.legs);
    legLeft.position.set(0, -FIGHTER_BODY.legs.height / 2, 0);
    legLeftPivot.add(legLeft);
    hips.add(legLeftPivot);
    this.parts.legLeftPivot = legLeftPivot;

    // Right leg
    const legRightPivot = new THREE.Group();
    legRightPivot.position.set(0.15, hipY, 0);
    const legRight = this._createPart('legRight', FIGHTER_BODY.legs, colors.legs);
    legRight.position.set(0, -FIGHTER_BODY.legs.height / 2, 0);
    legRightPivot.add(legRight);
    hips.add(legRightPivot);
    this.parts.legRightPivot = legRightPivot;
  }

  _calculateGroundOffset() {
    // Distance from body center down to feet bottom
    const bodyToHipsCenter = FIGHTER_BODY.body.height / 2 + FIGHTER_BODY.hips.height / 2;
    const hipsToLegBottom = FIGHTER_BODY.hips.height / 2 + FIGHTER_BODY.legs.height;
    this.groundOffset = bodyToHipsCenter + hipsToLegBottom;
  }

  /** Visually compress the model for crouching */
  setCrouching(isCrouching) {
    if (isCrouching) {
      this.group.scale.y = 0.7;
      this.group.position.y = this.groundOffset * 0.7;
    } else {
      this.group.scale.y = 1.0;
      this.group.position.y = this.groundOffset;
    }
  }
}
