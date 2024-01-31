class Ufo extends Phaser.GameObjects.Sprite {
    constructor(scene, x, y, texture, frame, pointValue, timeValue) {
        super(scene, x, y, texture, frame)
        scene.add.existing(this)
        this.points = pointValue
        this.time = timeValue
        this.moveSpeed = game.settings.spaceshipSpeed * 3
    }

    update() {
        // move ufo left
        this.x -= this.moveSpeed

        // wrap from left to right ede
        if(this.x <= 0 - this.width) {
            this.x = game.config.width
        }
    }

    // reset position
    reset() {
        this.x = game.config.width
    }
}