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
var platforms;
var cursors;
var score = 0;
var scoreText;
var scaler;
var oldScore = 0;
var water;
var oldY = 4450

var game = new Phaser.Game(config);

function preload ()
{
    this.load.image('sky', 'assets/sky.png');
    this.load.image('ground', 'assets/platform.png');
    this.load.spritesheet('dude', 'assets/dude.png', { frameWidth: 32, frameHeight: 48 });
}

function create ()
{
    this.jumps = 2;
    this.jump = true;

    this.physics.world.setBounds(0, 0, 800, 5000)


    platforms = this.physics.add.staticGroup();
    water = this.physics.add.sprite(400, 5000, 'sky');
    player = this.physics.add.sprite(400, 4450, 'dude');
    scaler = this.physics.add.sprite(400, 4450, 'dude');
    scaler.alpha = 0;
    scaler.body.allowGravity = false;
    water.body.allowGravity = false;
    water.setVelocityY(-75);
    water.depth =  10

    this.cameras.main.startFollow(scaler, true, .1, .1, 0, 0);
    let a = 4400;
    let c = 4280;
    let x = 50;
    let y = 650
    for(let i=0; i < 100; i++){
        platforms.create(x, a, 'ground');
        platforms.create(y, c, 'ground');
        a -= Math.ceil(120 + Math.random() * 90);
        x = Math.ceil(50 + Math.random() * 140)
        y = x + 620
        c -= Math.ceil(130 + Math.random() * 90);
    }
    platforms.create(400, 4568, 'ground').setScale(2).refreshBody();
    platforms.create(400, 4620, 'ground').setScale(2).refreshBody();
    platforms.create(400, 4680, 'ground').setScale(2).refreshBody();

    player.setCollideWorldBounds(true);


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
    this.physics.add.collider(player, water, gameOver, null, this);

    scoreText = this.add.text(16, 16, 'score: 0', { fontSize: '32px', fill: '#fff' }).setScrollFactor(0);
}

function fade(){
 setInterval(function(){

 }, 100)
}

function update ()
{
    oldScore = score;
    score = 0 - (Math.ceil(player.y) - 4500);
    if(score > oldScore){
        scoreText.setText('Score: ' + score);
    }
    if(player.y < oldY){
        scaler.y = player.y;
    }

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
                    player.setVelocity(-450);
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

    this.add.text(250, 200, 'Game Over', { fontSize: '64px', fill: '#fff'}).setScrollFactor(0);

    gameOver = true;
}
