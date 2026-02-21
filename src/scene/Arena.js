import * as THREE from 'three';
import { ARENA } from '../core/Constants.js';

/**
 * Arena creates the playing field: a flat ground plane
 * with edge lines for visual reference.
 */
export class Arena {
  constructor(scene) {
    this.scene = scene;
    this._createGround();
    this._createEdgeLines();
  }

  _createGround() {
    const geometry = new THREE.PlaneGeometry(ARENA.width, ARENA.depth);
    const material = new THREE.MeshStandardMaterial({
      color: ARENA.groundColor,
      roughness: 0.7,
      metalness: 0.3
    });

    this.ground = new THREE.Mesh(geometry, material);
    this.ground.rotation.x = -Math.PI / 2; // Lay flat on XZ plane
    this.ground.position.y = 0;
    this.ground.receiveShadow = true;
    this.scene.add(this.ground);
  }

  _createEdgeLines() {
    const halfW = ARENA.width / 2;
    const halfD = ARENA.depth / 2;

    const points = [
      new THREE.Vector3(-halfW, 0.01, -halfD),
      new THREE.Vector3(-halfW, 0.01, halfD),
      new THREE.Vector3(halfW, 0.01, halfD),
      new THREE.Vector3(halfW, 0.01, -halfD),
      new THREE.Vector3(-halfW, 0.01, -halfD)
    ];

    const geometry = new THREE.BufferGeometry().setFromPoints(points);
    const material = new THREE.LineBasicMaterial({ color: ARENA.lineColor });
    const line = new THREE.Line(geometry, material);
    this.scene.add(line);
  }
}
