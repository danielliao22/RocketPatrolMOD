// When creating a scene, Phaser automatically calls init(), preload(), create(), update()
class Menu extends Phaser.Scene {
    constructor() {
        super("menuScene");
    }


    preload() {
        // load audio
        this.load.audio('sfx_select', './assets/blip_select12.wav');
        this.load.audio('sfx_explosion', './assets/explosion38.wav');
        this.load.audio('sfx_rocket', './assets/rocket_shot.wav');

        this.load.image('titleScreen', './assets/titlescreen.png');
    }

    create(){

        // launch the next scene
        //this.scene.start("playScene");
        this.titleScreen = this.add.tileSprite(0, 0, 640, 480, 'titleScreen').setOrigin(0.0);

        // define keys
        keyE = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.E);
        keyH = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.H);
    }

    update() {
        if (Phaser.Input.Keyboard.JustDown(keyE)) {
          // easy mode
          game.settings = {
            spaceshipSpeed: 3,
            gameTimer: 60000    
          }
          this.sound.play('sfx_select', {volume: 0.3});
          this.scene.start("playScene");    
        }
        if (Phaser.Input.Keyboard.JustDown(keyH)) {
          // hard mode
          game.settings = {
            spaceshipSpeed: 4,
            gameTimer: 45000    
          }
          this.sound.play('sfx_select', {volume: 0.3});
          this.scene.start("playScene");    
        }
      }
}
