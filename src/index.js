import 'phaser';

var config = {
    type: Phaser.AUTO,
    width: 800,
    height: 600,
    physics: {
        default: 'arcade',
        arcade: {
            gravity: { y: 1000 },
            debug: false
        }
    },
    scene: {
        preload: preload,
        create: create,
        update: update
    }
};

var player;
var enemy;
var platforms;
var cursors;
var score = 0;
var scoreText;
var scaler;
var bombs;
var oldScore = 0;

var game = new Phaser.Game(config);

function preload ()
{
    this.load.image('sky', 'assets/sky.png');
    this.load.image('ground', 'assets/platform.png');
    this.load.image('star', 'assets/star.png');
    this.load.spritesheet('dude', 'assets/dude.png', { frameWidth: 32, frameHeight: 48 });
    this.load.spritesheet('dude', 'assets/dude.png', { frameWidth: 32, frameHeight: 48 });
}

function create ()
{
    this.add.image(400, 300, 'sky');
    this.jumps = 2;
    this.jump = true;


    platforms = this.physics.add.staticGroup();
    bombs = this.physics.add.group();
    player = this.physics.add.sprite(400, 450, 'dude');
    enemy = this.physics.add.sprite(600, 450, 'dude');
    scaler = this.physics.add.sprite(400, 450, 'dude');
    scaler.alpha = 0;
    scaler.body.allowGravity = false;

    this.cameras.main.startFollow(scaler, true, .1, .1, 0, 150);

    platforms.create(400, 568, 'ground').setScale(2).refreshBody();
    platforms.create(400, 620, 'ground').setScale(2).refreshBody();
    platforms.create(400, 680, 'ground').setScale(2).refreshBody();

    platforms.create(600, 400, 'ground');
    platforms.create(50, 250, 'ground');
    platforms.create(750, 220, 'ground');

    player.setBounce(0.1);
    player.setCollideWorldBounds(true);

    enemy.setBounce(0.1);
    enemy.setCollideWorldBounds(true);

    this.anims.create({
        key: 'left',
        frames: this.anims.generateFrameNumbers('dude', { start: 0, end: 3 }),
        frameRate: 10,
        repeat: -1
    });

    this.anims.create({
        key: 'turn',
        frames: [ { key: 'dude', frame: 4 } ],
        frameRate: 20
    });

    this.anims.create({
        key: 'right',
        frames: this.anims.generateFrameNumbers('dude', { start: 5, end: 8 }),
        frameRate: 10,
        repeat: -1
    });

    cursors = this.input.keyboard.createCursorKeys();

    this.physics.add.collider(player, platforms);
    this.physics.add.collider(enemy, platforms);
    this.physics.add.collider(bombs, platforms);
    this.physics.add.collider(player, bombs, gameOver, null, this);
    this.physics.add.collider(player, enemy, gameOver, null, this);

    scoreText = this.add.text(16, 16, 'score: 0', { fontSize: '32px', fill: '#000' });
}

function goal(){
    var x = (player.x < 400) ? Phaser.Math.Between(400, 800) : Phaser.Math.Between(0, 400);
    var bomb = bombs.create(x, 16, 'bomb');
    bomb.setBounce(1);
    bomb.setCollideWorldBounds(true);
    bomb.setVelocity(Phaser.Math.Between(-200, 200), 30);
    bomb.allowGravity = false;
}

function update ()
{
    oldScore = score;
    score = 0 - (Math.ceil(player.y) - 512);
    if(score > oldScore){
        scoreText.setText('Score: ' + score);
    }

    scaler.y = player.y;
    if(player.body.touching.down){
        this.jumps = 2;
        if(cursors.up.isDown){
            player.setVelocityY(-500);
            this.jump = false;
            this.jumps -= 1;
        }
    }
    if(cursors.up.isDown && this.jumps > 0){
        if(this.jump){
            if(this.jumps > 0){
                    player.setVelocity(-400);
                    this.jumps -= 1;
                    this.jump = false;
            }
        }

    }
    if(cursors.up.isUp){
        this.jump = true;
    }
    if (cursors.left.isDown)
    {
        player.setVelocityX(-240);

        player.anims.play('left', true);
    }
    else if (cursors.right.isDown)
    {
        player.setVelocityX(240);

        player.anims.play('right', true);
    }
    else
    {
        player.setVelocityX(0);

        player.anims.play('turn');
    }
}

function gameOver (player)
{
    this.physics.pause();

    player.setTint(0xff0000);

    player.anims.play('turn');

    this.add.text(300, 200, 'Game Over', { fontSize: '64px', fill: '#000'});

    gameOver = true;
}
