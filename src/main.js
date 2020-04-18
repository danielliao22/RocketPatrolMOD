let config = {
    type: Phaser.CANVAS,
    width: 640,
    height: 480,
    scene: [ Menu, Play ], //Order matters
};



let game = new Phaser.Game(config);

// define game settings
game.settings = {
    spaceshipSpeed: 3,
    gameTimer: 60000    
}

// reserve some keyboard vars
let keyF, keyE, keyH, keyLEFT, keyRIGHT;

let mouseLEFT, mouseRIGHT;
