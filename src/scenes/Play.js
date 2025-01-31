// When creating a scene, Phaser automatically calls init(), preload(), create(), update()
class Play extends Phaser.Scene {
    constructor() {
        super("playScene");
    }

    preload(){
        // load images/title sprite
        this.load.image('rocket', './assets/rocket.png');
        this.load.image('spaceship', './assets/spaceship.png');
        this.load.image('starfield', './assets/starfieldPlanets.png');
        this.load.image('gameUI', './assets/gameUI.png');
        this.load.image('gameOver', './assets/gameOver.png');
        // load spritesheet
        this.load.spritesheet('explosion', './assets/explosion.png', {frameWidth: 64, frameHeight: 32, startFrame: 0, endFrame: 9});

        // load font 
        this.load.bitmapFont('font', './assets/font.png', './assets/font.fnt');
    }

    create(){
        // place tile sprite
        this.starfield = this.add.tileSprite(0, 0, 640, 480, 'starfield').setOrigin(0.0);

        // place game UI
        this.gameUI = this.add.sprite(0, 0, 'gameUI').setOrigin(0.0);

        // add rocket (p1)
        this.p1Rocket = new Rocket(this, game.config.width/2, 435, 'rocket').setScale(0.5, 0.5).setOrigin(0, 0);
    
        // add spaceships (x3)
        this.ship01 = new Spaceship(this, game.config.width + 192, 132, 'spaceship', 0, 30).setOrigin(0,0);
        this.ship02 = new Spaceship(this, game.config.width + 96, 196, 'spaceship', 0, 20).setOrigin(0,0);
        this.ship03 = new Spaceship(this, game.config.width, 260, 'spaceship', 0, 10).setOrigin(0,0);

        // define keyboard keys
        keyM = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.M);
        keySPACE = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.SPACE);

        // animation config
        this.anims.create({
            key: 'explode',
            frames: this.anims.generateFrameNumbers('explosion', { start: 0, end: 9, first: 0}),
            frameRate: 30
        });

        //score
        this.p1Score = 0;
        this.scoreLeft = this.add.bitmapText(25, 65, 'font', this.p1Score, 20).setRightAlign(); 

        //time
        this.timeRemaining = game.settings.gameTimer / 1000;
        this.timeRight = this.add.bitmapText(583, 65, 'font', this.timeRemaining, 20).setLeftAlign(); 
        this.updateTime = this.time.addEvent({ delay: 1000, callback: this.onEvent, callbackScope: this, loop: true });

        // game over flag
        this.gameOver = false;
    }

    onEvent(){
        if(this.timeRemaining > 0){
            this.timeRemaining -= 1; // One second
        }
        console.log(this.timeRemaining);
        this.timeRight.setText(this.timeRemaining); 
    }


    update(){
        if(this.timeRemaining == 0){
            this.gameOverUI = this.add.sprite(0, 0, 'gameOver').setOrigin(0.0);
            this.gameOver = true;
        }

        // check key input for restart
        if (this.gameOver && Phaser.Input.Keyboard.JustDown(keySPACE)) {
            this.scene.restart(this.p1Score);
        }

        if (this.gameOver && Phaser.Input.Keyboard.JustDown(keyM)) {
            this.scene.start("menuScene");
        }

        // scroll starfield
        this.starfield.tilePositionX -= 3;

        if (!this.gameOver) { 
            //update rocket
            this.p1Rocket.update();
            //update spaceship
            this.ship01.update();
            this.ship02.update();
            this.ship03.update();
        }

        

        // check collisions
        if(this.checkCollision(this.p1Rocket, this.ship03)) {
            this.p1Rocket.reset();
            this.shipExplode(this.ship03);   
            this.timeRemaining += 5;
            this.timeRight.setText(this.timeRemaining); 
        }
        if (this.checkCollision(this.p1Rocket, this.ship02)) {
            this.p1Rocket.reset();
            this.shipExplode(this.ship02); 
            this.timeRemaining += 5;  
            this.timeRight.setText(this.timeRemaining); 
        }
        if (this.checkCollision(this.p1Rocket, this.ship01)) {
            this.p1Rocket.reset();
            this.shipExplode(this.ship01);   
            this.timeRemaining += 5;
            this.timeRight.setText(this.timeRemaining); 
        }
    }

    checkCollision(rocket, ship) {
        // simple AABB checking
        if (rocket.x < ship.x + ship.width && 
            rocket.x + rocket.width > ship.x && 
            rocket.y < ship.y + ship.height &&
            rocket.height + rocket.y > ship. y) {
                return true;
        } else {
            return false;
        }
    }

    shipExplode(ship) {
        ship.alpha = 0;                         // temporarily hide ship
        // create explosion sprite at ship's position
        let boom = this.add.sprite(ship.x, ship.y, 'explosion').setOrigin(0, 0);
        boom.anims.play('explode');             // play explode animation
        boom.on('animationcomplete', () => {    // callback after animation completes
            ship.reset();                       // reset ship position
            ship.alpha = 1;                     // make ship visible again
            boom.destroy();                     // remove explosion sprite
        });      
         // score increment and repaint
         this.p1Score += ship.points;
         this.scoreLeft.text = this.p1Score;   
         this.sound.play('sfx_explosion', {volume: 0.3});
    }
}
