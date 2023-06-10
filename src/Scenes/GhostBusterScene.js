import Phaser from "phaser";

export default class GhostBusterScene extends Phaser.Scene {
  constructor() {
    super("ghost-buster-scene");
  }
  init() {
    this.listBomb = undefined;
    this.ground = undefined;
    this.player = undefined;
    this.playerSpeed = 150;
    this.cursors = undefined;
    this.listGhost = undefined;
    this.ghostSpeed = 60;
    this.lastFired = 0;
    this.scoreLabel = undefined;
  }

  preload() {
  }

  create() {
  }

  update() {
  }

  createPlayer() {
  }

  movePlayer() {
  }

  spawnGhost() {
  }
  
  hitGhost(bomb, ghost) {
  }

  createScoreLabel(x, y, score) {
  }

  hitPlayer(player, ghost) {
  }
