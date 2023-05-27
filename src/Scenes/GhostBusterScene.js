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
    this.load.image("ghost", "images/ghost.png");
    this.load.image("ground", "images/ground.png");
    this.load.spritesheet("player", "images/player.png", {
      frameWidth: 32,
      frameHeight: 32,
    });
  }

  create() {
    //Create Background
    this.add.image(500, 500, "background").setScale(1.8);

    //Create Ground
    this.ground = this.physics.add
      .staticImage(500, 980, "ground")
      .setScale(3)
      .refreshBody();

    //Create Player
    this.player = this.createPlayer();

    //Create Collider So Player Can Stand On Ground
    this.physics.add.collider(this.ground, this.player);

    //Create Keyboard Controller
    this.cursors = this.input.keyboard.createCursorKeys();

    //Create Ghost
    this.listGhost = this.physics.add.group({
      classType: Ghost,
      //banyaknya ghost dalam satu kali grup
      maxSize: 20,
      runChildUpdate: true,
    });

    //Loop Ghost Spwan Delay
    this.time.addEvent({
      delay: 2000,
      callback: this.spawnGhost,
      callbackScope: this,
      loop: true,
    });

    //Create Bombs For Player Weapon
    this.listBomb = this.physics.add.group({
      classType: Bomb,
      maxSize: 10,
      runChildUpdate: true,
    });

    //Function If Ghost Hit Bombs It Will Die
    this.physics.add.overlap(
      this.listBomb,
      this.listGhost,
      this.hitGhost,
      undefined,
      this
    );

    //Create ScoreLabel
    this.scoreLabel = this.createScoreLabel(16, 16, 0);

    //Bonus Point Exam
    this.physics.add.overlap(
      this.player,
      this.listGhost,
      this.hitPlayer,
      null,
      this
    );
  }

  update(time) {
    this.movePlayer(this.player, time);
  }

  createPlayer() {
    const player = this.physics.add.sprite(450, 850, "player").setScale(2);
    player.setCollideWorldBounds(true);
    player.setBounce(0.2);

    this.anims.create({
      key: "turn",
      frames: [{ key: "player", frame: 1 }],
    });

    this.anims.create({
      key: "down",
      frames: this.anims.generateFrameNumbers("player", { start: 0, end: 2 }),
      frameRate: 10,
    });
    this.anims.create({
      key: "left",
      frames: this.anims.generateFrameNumbers("player", { start: 3, end: 5 }),
      frameRate: 10,
    });
    this.anims.create({
      key: "right",
      frames: this.anims.generateFrameNumbers("player", { start: 6, end: 8 }),
      frameRate: 10,
    });
    this.anims.create({
      key: "up",
      frames: this.anims.generateFrameNumbers("player", { start: 9, end: 11 }),
      frameRate: 10,
    });
    return player;
  }

  movePlayer(player, time) {
    if (this.cursors.left.isDown) {
      this.player.setVelocityX(this.playerSpeed * -1);
      this.player.anims.play("left", true);
    } else if (this.cursors.right.isDown) {
      this.player.setVelocityX(this.playerSpeed);
      this.player.anims.play("right", true);
    } else if (this.cursors.up.isDown) {
      this.player.setVelocityY(this.playerSpeed * -1);
      this.player.anims.play("up", true);
    } else if (this.cursors.down.isDown) {
      this.player.setVelocityY(this.playerSpeed);
      this.player.anims.play("down", true);
    } else {
      this.player.setVelocityX(0);
      this.player.anims.play("turn");
    }

    if (this.cursors.space.isDown && time > this.lastFired) {
      const bomb = this.listBomb.get(0, 0, "bomb");
      if (bomb) {
        bomb.fire(this.player.x, this.player.y);
        this.lastFired = time + 150;
      }
    }
  }

  spawnGhost() {
    const config = {
      speed: this.ghostSpeed,
      rotation: 0,
    };

    const ghost = this.listGhost.get(0, 0, "ghost", config);
    const ghostWidth = ghost.displayWidth;
    const positionX = Phaser.Math.Between(
      ghostWidth,
      this.scale.width - ghostWidth
    );
    if (ghost) {
      ghost.spawn(positionX);
    }
  }

  hitGhost(bomb, ghost) {
    bomb.erase(); //destroy bomb yg bersentuhan
    ghost.die(); //destroy ghost yg bersentuhan

    //Score Bertambah
    this.scoreLabel.add(1);
  }

  createScoreLabel(x, y, score) {
    const style = { fontSize: "64px", color: "#FFFFFF" };
    const label = new ScoreLabel(this, x, y, score, style).setDepth(1);
    this.add.existing(label);
    return label;
  }

  hitPlayer(player, ghost) {
    ghost.die();
    this.scene.start("game-over-scene", {
      score: this.scoreLabel.getScore(),
    });
  }
}
