import Phaser from "phaser";
import GhostBusterScene from "./Scenes/GhostBusterScene";

const config = {
  type: Phaser.AUTO,
  width: 1000,
  height: 1000,
  scale: {
    autoCenter: Phaser.Scale.CENTER_BOTH,
  },
  physics: {
    default: "arcade",
    arcade: {
      gravity: { y: 200 },
    },
  },
  scene: [GhostBusterScene],
};

const game = new Phaser.Game(config);
