import { Game } from './core/Game.js';

const canvas = document.getElementById('game-canvas');

if (!canvas) {
  throw new Error('Canvas element #game-canvas not found');
}

const game = new Game(canvas);
game.start();
