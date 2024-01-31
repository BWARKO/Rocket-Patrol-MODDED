class Play extends Phaser.Scene {
    constructor() {
        super("playScene")
         // display score/time
         this.textConfig = {
            fontFamily: 'Courier',
            fontSize: '28px',
            backgroundColor: '#F3B141',
            color: '#843605',
            align: 'right',
            padding: {
                top: 5,
                bottom: 5,
            },
            fixedWidth: 100
        }
    }

    create() {
        // place tile sprite
        this.starfield = this.add.tileSprite(0, 0, 640, 480, 'starfield').setOrigin(0, 0)
        this.planet = this.add.tileSprite(320, 0, 640, 480, 'planet').setOrigin(0.5, 0).setScale(10)
        this.moon = this.add.tileSprite(320, 40, 640, 480, 'moon').setOrigin(0.5).setScale(8)
        
        // green UI background
        this.add.rectangle(0, borderUISize + borderPadding, game.config.width, borderUISize * 2, 0x00FF00).setOrigin(0, 0)
        // white borders
        this.add.rectangle(0, 0, game.config.width, borderUISize, 0xFFFFFF).setOrigin(0, 0)
        this.add.rectangle(0, game.config.height - borderUISize, game.config.width, borderUISize, 0xFFFFFF).setOrigin(0, 0)
        this.add.rectangle(0, 0, borderUISize, game.config.height, 0xFFFFFF).setOrigin(0, 0)
        this.add.rectangle(game.config.width - borderUISize, 0, borderUISize, game.config.height, 0xFFFFFF).setOrigin(0, 0)

        // add rocket (p1)
        this.p1Rocket = new Rocket (this, game.config.width/2, game.config.height - borderUISize - borderPadding, 'rocket').setOrigin(0.5, 0)
        // add spaceships (x3)
        this.ship01 = new Spaceship(this, game.config.width + borderUISize*6, borderUISize*4, 'spaceship', 0, 30, 5).setOrigin(0, 0)
        this.ship02 = new Spaceship(this, game.config.width + borderUISize*3, borderUISize*5 + borderPadding*2, 'spaceship', 0, 20, 3).setOrigin(0, 0)
        this.ship03 = new Spaceship(this, game.config.width, borderUISize*6 + borderPadding*4, 'spaceship', 0, 10, 1).setOrigin(0, 0)
        //add UFO
        this.ufo = new Ufo(this, game.config.width, borderUISize*7 + borderPadding*6, 'ufo', 0, 100, 10).setOrigin(0, 0)

        // define keys
        keyFIRE = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.F)
        keyRESET = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.R)
        keyLEFT = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.LEFT)
        keyRIGHT = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.RIGHT)

        // initialize score/earned time
        this.p1Score = 0
        this.gameTime = game.settings.gameTimer

        this.scoreLeft = this.add.text(borderUISize + borderPadding, borderUISize + borderPadding*2, this.p1Score, this.textConfig)
        this.timeRight = this.add.text(game.config.width - (borderUISize + borderPadding), borderUISize + borderPadding*2, this.gameTime, this.textConfig).setOrigin(1,0)


        // Flags
        this.gameOver = false
        this.timerTick = false

        this.textConfig.fixedWidth = 0

       

    }

    update() {
        // scroll backgrounds
        this.starfield.tilePositionX -= 1
        this.planet.tilePositionX -= 0.5
        this.moon.tilePositionX -= 1


        if(this.gameTime <= 0) {
            this.add.text(game.config.width/2, game.config.height/2, 'GAME OVER', this.textConfig).setOrigin(0.5)
            this.add.text(game.config.width/2, game.config.height/2 + 64, 'Press (R) to Restart or ← for Menu', this.textConfig).setOrigin(0.5)
            this.gameOver = true
        }

        if(!this.timerTick && !this.gameOver) {
            this.clock = this.time.delayedCall(1000, this.secondTick, null, this)
            this.timerTick = true
        }

        // game over key options
        if(this.gameOver && Phaser.Input.Keyboard.JustDown(keyRESET)) {
            this.scene.restart()
        }
        if(this.gameOver && Phaser.Input.Keyboard.JustDown(keyLEFT)) {
            this.scene.start('menuScene')
        }

        // make sure game isnt over
        if(!this.gameOver) {
            // update rocket
            this.p1Rocket.update()

            // update spaceships (x3)
            this.ship01.update()
            this.ship02.update()
            this.ship03.update()
            // update ufo
            this.ufo.update()
        }

        // check collisions
        if(this.checkCollision(this.p1Rocket, this.ship01)) {
            this.p1Rocket.reset()
            this.shipExplode(this.ship01)
        }
        if(this.checkCollision(this.p1Rocket, this.ship02)) {
            this.p1Rocket.reset()
            this.shipExplode(this.ship02)
        }
        if(this.checkCollision(this.p1Rocket, this.ship03)) {
            this.p1Rocket.reset()
            this.shipExplode(this.ship03)
        }
        // ufo collision check
        if(this.checkCollision(this.p1Rocket, this.ufo)) {
            this.p1Rocket.reset()
            this.shipExplode(this.ufo)
        }

        // check if rocket missed for time penalty
        if(this.p1Rocket.missed){
            // subtract and update time and unflag
            this.gameTime -= 3
            this.p1Rocket.missed = false
            this.timeRight.text = this.gameTime
        }
    }

    checkCollision(rocket, ship) {
        // AABB checking
        if (rocket.x < ship.x +ship.width && 
            rocket.x + rocket.width > ship.x &&
            rocket.y < ship.y + ship.height &&
            rocket.height + rocket.y > ship.y) {
            return true
        } else {
            false
        }
    }

    shipExplode(ship) {
        // temporarily hide ship
        ship.alpha = 0
        // create explosion sprite at ship's position
        let boom = this.add.sprite(ship.x, ship.y, 'explode').setOrigin(0, 0);
        boom.anims.play('explode')            // play explode animation
        boom.on('animationcomplete', () => {    // callback when anim complete
            ship.reset()                        // reset ship pos
            ship.alpha = 1                      // make ship visibile
            boom.destroy()                      // remove explosion sprite
        })
        // add to score and update
        this.p1Score += ship.points
        this.scoreLeft.text = this.p1Score
        // add to time and update
        this.gameTime += ship.time
        this.timeRight.text = this.gameTime


        // play explosion audio
        this.sound.play('sfx-explosion')
    }

    secondTick() {
        this.gameTime -= 1
        this.timerTick = false

        // update game timer
        this.timeRight.text = this.gameTime
    }
}


