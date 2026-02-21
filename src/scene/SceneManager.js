import * as THREE from 'three';
import { CAMERA } from '../core/Constants.js';

/**
 * SceneManager creates and manages the Three.js rendering pipeline:
 * renderer, camera, lights, and window resize handling.
 *
 * Sprint 2: added dynamic camera that tracks both fighters.
 */
export class SceneManager {
  constructor(canvas) {
    // Scene
    this.scene = new THREE.Scene();
    this.scene.background = new THREE.Color(0x0a0a1a);

    // Renderer
    this.renderer = new THREE.WebGLRenderer({ canvas, antialias: true });
    this.renderer.setSize(window.innerWidth, window.innerHeight);
    this.renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    this.renderer.shadowMap.enabled = true;
    this.renderer.shadowMap.type = THREE.PCFSoftShadowMap;

    // Camera — lateral view on Z axis
    this.camera = new THREE.PerspectiveCamera(
      60,
      window.innerWidth / window.innerHeight,
      0.1,
      100
    );
    this.camera.position.set(0, CAMERA.height, CAMERA.baseDistance);
    this.camera.lookAt(0, CAMERA.lookAtHeight, 0);

    this._setupLights();

    window.addEventListener('resize', () => this._onResize());
  }

  _setupLights() {
    // Directional light (sun)
    const dirLight = new THREE.DirectionalLight(0xffffff, 1.2);
    dirLight.position.set(5, 10, 7);
    dirLight.castShadow = true;
    dirLight.shadow.mapSize.width = 2048;
    dirLight.shadow.mapSize.height = 2048;
    dirLight.shadow.camera.near = 0.5;
    dirLight.shadow.camera.far = 50;
    dirLight.shadow.camera.left = -15;
    dirLight.shadow.camera.right = 15;
    dirLight.shadow.camera.top = 10;
    dirLight.shadow.camera.bottom = -5;
    this.scene.add(dirLight);

    // Ambient fill light
    const ambientLight = new THREE.AmbientLight(0x404060, 0.6);
    this.scene.add(ambientLight);
  }

  /**
   * Dynamic camera that follows the midpoint between two fighters.
   * Zooms out as they separate, zooms in as they approach.
   * Uses lerp smoothing for fluid motion.
   */
  updateCamera(pos1, pos2) {
    // Midpoint between fighters on X axis
    const midX = (pos1.x + pos2.x) / 2;

    // Distance between fighters determines zoom level
    const fighterDistance = Math.abs(pos2.x - pos1.x);
    const targetZ = Math.max(
      CAMERA.minDistance,
      Math.min(
        CAMERA.maxDistance,
        CAMERA.baseDistance + fighterDistance * CAMERA.distanceMultiplier
      )
    );

    // Smooth camera movement via lerp
    this.camera.position.x += (midX - this.camera.position.x) * CAMERA.smoothing;
    this.camera.position.z += (targetZ - this.camera.position.z) * CAMERA.smoothing;

    // Always look at the midpoint at torso height
    this.camera.lookAt(this.camera.position.x, CAMERA.lookAtHeight, 0);
  }

  _onResize() {
    this.camera.aspect = window.innerWidth / window.innerHeight;
    this.camera.updateProjectionMatrix();
    this.renderer.setSize(window.innerWidth, window.innerHeight);
  }

  render() {
    this.renderer.render(this.scene, this.camera);
  }
}
