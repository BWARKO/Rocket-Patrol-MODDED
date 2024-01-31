// Blake Warkenton
// Rocket Patrol CRACKED
// Approx. time: ??
//
//                  MODS CREATED:
//      5 POINT MODS:
//          NEW SPACESHIP TYPE: UFO added to game, 3 times faster, signficantly smaller, worth 100 points
//          +/- TIMER ON HIT: Miss -= 3s, hit on ship1 += 1s, hit on ship2 += 3s, hit on ship3 += 5s, hit on UFO += 10s
//      3 POINT MODS:
//          TIMER: Top right, shows time remaining
//          PARALLAXING: Moon > Planet > Starfield (Faster/Closer -> Slower/Farther)

let config = {
    type: Phaser.AUTO,
    pixelArt: true,
    width: 640,
    height: 480,
    scene: [ Menu, Play ],
}

let game = new Phaser.Game(config)

// reserve keyboard bindings
let keyFIRE, keyRESET, keyLEFT, keyRIGHT

// reserve highscore
let highscore = 0

// set UI sizes
let borderUISize = game.config.height / 15
let borderPadding = borderUISize / 3
