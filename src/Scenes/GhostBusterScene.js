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
    this.load.image("background", "images/background.png");
    this.load.image("bomb", "images/bomb.png");
    this.load.image("gameover", "images/gameover.png");
    this.load.image("ghost", "images/ghost.png");
    this.load.image("ground", "images/ground.png");
    this.load.spritesheet("player", "images/player.png", {
      frameWidth: 32,
      frameHeight: 32,
    });
    this.load.image("replay", "images/replay.png");
  }

  create() {
    const gameWidth = this.scale.width * 0.5;
    const gameHeight = this.scale.height * 0.5;
    this.add.image(gameWidth, gameHeight, "background").setScale(1.8);
    this.ground = this.add
      .image(gameWidth, gameHeight * 1.97, "ground")
      .setScale(4);

    this.player = this.createPlayer();
    this.cursors = this.input.keyboard.createCursorKeys();

    this.listGhost = this.physics.add.group({
      classType: Ghost,
      maxSize: 20,
      runChildUpdate: true,
    });

    this.time.addEvent({
      delay: 200,
      callback: this.spawnGhost,
      callbackScope: this,
      loop: true,
    });

    this.listBomb = this.physics.add.group({
      classType: Bomb,
      maxSize: 10,
      runChildUpdate: true,
    });

    this.physics.add.overlap(
      this.bomb,
      this.ghost,
      this.hitGhost,
      undefined,
      this
    );

    this.scoreLabel = this.createScoreLabel(400, 600, 0);

    this.physics.add.collider(this.ground, this.player);
  }

  update() {
    this.movePlayer(this.player);
  }

  createPlayer() {
    const player = this.physics.add.sprite(400, 500, "player").setScale(2);
    player.setCollideWorldBounds(true);
    this.anims.create({
      key: "turn",
      frames: [{ key: "player", frame: 0 }],
    });

    this.anims.create({
      key: "left",
      frames: this.anims.generateFrameNumbers("player", { start: 1, end: 2 }),
      frameRate: 10,
    });

    this.anims.create({
      key: "right",
      frames: this.anims.generateFrameNumbers("player", { start: 1, end: 2 }),
      frameRate: 10,
    });

    return player;
  }
  movePlayer(player) {
    if (this.cursors.left.isDown) {
      this.player.setVelocityX(this.playerSpeed * -1);
      this.player.anims.play("left", true);
      this.player.setFlipX(false);
    } else if (this.cursors.right.isDown) {
      this.player.setVelocityX(this.playerSpeed);
      this.player.anims.play("right", true);
      this.player.setFlipX(true);
    } else if (this.cursors.up.isDown) {
      this.player.setVelocityY(this.playerSpeed * -1);
      this.player.anims.play("turn", true);
      this.player.setFlipY(false);
    } else if (this.cursors.down.isDown) {
      this.player.setVelocityY(this.playerSpeeds);
      this.player.anims.play("turn", true);
      this.player.setFlipY(true);
    } else {
      this.player.setVelocityY(0);
      this.player.setVelocityX(0);
      this.player.anims.play("turn");
    }
  }

  spawnGhost() {
    const config = {
      speed: this.ghostSpeed,
      rotation: 0.06,
    };
    const Ghost = this.listGhost.get(0, 0, "ghost", config);
    const enemyWidth = Ghost.displayWidth;
    const positionX = Phaser.Math.Between(
      enemyWidth,
      this.scale.width - enemyWidth
    );
    if (enemy) {
      enemy.spawn(positionX);
    }
  }

  hitGhost(bomb, ghost) {
    bomb.erase();
    ghost.die();
    this.scoreLabel.add(100);
  }

  createScoreLabel(x, y, score) {
    const style = { fontSize: "32px", fill: "#000" };
    const label = new ScoreLabel(this, x, y, score, style).setDepth(1);
    this.add.existing(label);
    return label;
  }

  hitPlayer(player, ghost) {
    player.die();
    ghost.die();
  }
}
