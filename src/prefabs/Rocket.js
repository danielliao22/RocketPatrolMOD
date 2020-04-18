// Rocket Prefab
class Rocket extends Phaser.GameObjects.Sprite {
    constructor(scene, x, y, texture, frame) {
        super(scene, x, y, texture, frame);

        
        scene.add.existing(this); // add object to existing, displayList, updateList
        this.isFiring = false;    // track rocket's firing status
        this.sfxRocket = scene.sound.add('sfx_rocket', {volume: 0.3}); // add rocket sfx
        this.pointer = scene.input.activePointer;
        // Setup firing by right clicking
        // Phaser example: https://github.com/photonstorm/phaser3-examples/blob/master/public/src/input/mouse/right%20mouse%20button.js
        scene.input.on('pointerdown', function (pointer) {
            if (pointer.leftButtonDown() && !this.isFiring) {
                if (pointer.getDuration() > 500) {
                    this.isFiring = true;
                    this.sfxRocket.play();  // play sfx
                }
                else {
                    this.isFiring = true;
                    this.sfxRocket.play();  // play sfx
                }
            }
        }, this);
    }

    update() {
        // left/right movement
        if(!this.isFiring){
            let tmpX = this.pointer.worldX;
            if(tmpX < 47) {
                this.x = 47;
            } 
            else if(tmpX > 578){
                this.x = 578;
            }
            else {
                this.x = tmpX;
            }
        }
        // if fired , move up
        if(this.isFiring && this.y >= 108){
            this.y -= 2;
        }

        // reset on miss
        if(this.y <= 108){
            this.isFiring = false;
            this.y = 431;
        }
    }

    //reset rocket to "ground"
    reset(){
        this.isFiring = false;
        this.y = 431;
    }
}