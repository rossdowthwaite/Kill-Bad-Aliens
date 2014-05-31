var game = new Phaser.Game(1024, 700, Phaser.CANVAS, "game", { preload: preload, create: create, update: update, render: render  });

// Timers
var missileTime = 0
var moveTimer
var blastTime = 0
var shotTime = 0;
var badShotTime = 0;
var spawnTime = 10000
var hurtTime = 0

// counters
var missileCount = 0
var nukeCount = 0
var count = 0
var powerLevel = 0
var level = 0
var gameLevel = 0
var gameMode = 1
var bossHealth = 0;
var score = 0

//groups
var powerUp4Group
var powerUp3Group
var blastGroup
var enemies
var shots
var powerGpoup
var missileGroup
var bossShots
var nukes
var lives

// Sounds
var ground
var player;
var speed = 5;
var missileSound
var bossMusic

//Text
var start
var instructions
var menu
var logo
var replayText
var yesOrNo
var loading
var scoreText
var scoreBar
var levelText

//Sprites
var panel
var enemy1
var enemy2
var health
var blasterHealth
var powerUp1
var powerUp2
var powerUp3
var powerUp4
var shield
var cover1
var direction
var missile
var blastRadius
var nuke
var nukeBlast
var boss
var showPowerUp
var background
var filter

//booleans
var regain = true
var gameOver = false;
var bossMove = false;
var bossDir = "left"

//animations
var flameAnim
var explosionAnim
var explosionBigAnim
var video = document.getElementById("attackVid");


// Preloads all the assets for the game 
// displays a loading screen prior to the start screen.
function preload() {

    video.style.display = 'none'; // make video invisible to start 

    // loading txt
    loading = game.add.text(game.world.centerX, game.world.centerY, "LOADING!!!", {
            font: "35px Arial",
            fill: "#00eaff",
            align: "left",
        });
    loading.anchor.x = 0.5;
    loading.anchor.y = 0.5;

    // scene assets
    game.load.image('ground', 'assets/pics/ground.jpg');
    game.load.image('life', 'assets/pics/life.png');
    game.load.image('panel1', 'assets/pics/panel1.png');
    game.load.image('panel2', 'assets/pics/panel2.png');
    game.load.image('health', 'assets/pics/Health.png'); 
    game.load.image('shield', 'assets/pics/shield.png'); 
    game.load.image('blasterH', 'assets/pics/blastHealth.png'); 
    game.load.image('blasterH2', 'assets/pics/blastHealth2.png'); 
    game.load.image('blasterBG', 'assets/pics/blastHealthBG.png'); 

    // player assets
    game.load.image('ship', 'assets/pics/ship.png');
    game.load.image('ship2', 'assets/pics/ship2.png');
    game.load.image('ship3', 'assets/pics/ship3.png');
    game.load.image('shipHurt1', 'assets/pics/shipHurt1.png');
    game.load.image('shipHurt2', 'assets/pics/shipHurt2.png');
    game.load.image('shipHurt3', 'assets/pics/shipHurt3.png');

    // weaopons
    game.load.image('missile', 'assets/pics/missile.png');
    game.load.image('bomb', 'assets/pics/atomic.png'); 
    game.load.image('shot', 'assets/pics/shot.png'); 
    game.load.image('bossShot', 'assets/pics/badShot.png');  


    game.load.image('enemy1', 'assets/pics/enemy1.png');
    game.load.image('boss', 'assets/pics/meh.png');

    // powerups
    game.load.image('power1', 'assets/pics/power1.png');
    game.load.image('power2', 'assets/pics/power2.png');
    game.load.image('power4', 'assets/pics/power4.png'); 
    game.load.image('power3', 'assets/pics/nukePu.png');   

    // extras
    game.load.image('explosion', 'assets/pics/explosion.png'); 
    game.load.image('nukeBlast', 'assets/pics/nukeBlast.png');    
    game.load.spritesheet('debris', 'assets/pics/debris.png', 15, 47);
    game.load.image('flame', 'assets/pics/flame.png'); 
    game.load.image('smoke', 'assets/pics/smoke.png');  
    game.load.spritesheet("jetFlame", 'assets/pics/flame_anim2.png', 75, 75)  
    game.load.atlas("explosionAnimation", 'assets/pics/SmallExplosion.png', null, explosionData); 
    game.load.atlas("explosionBigAnimation", 'assets/pics/BigExplosion.png', null, bigExplosionData); 

    // menu assets
    game.load.image('instructions', 'assets/pics/instructions.png'); 
    game.load.image('instButton', 'assets/pics/instButton.png'); 
    game.load.image('start', 'assets/pics/start.png');
    game.load.image('logo', 'assets/pics/logo.png');
    game.load.image('gameOverImage', 'assets/pics/gameOver.png' )


    // Audio files
    game.load.audio('laser', ['assets/sounds/laser2.wav', 'assets/sounds/laser2.wav']);  
    game.load.audio('blast', ['assets/sounds/blast.wav', 'assets/sounds/blast.wav']);
    game.load.audio('enemyDie', ['assets/sounds/missile.wav', 'assets/sounds/missile.wav']);
    game.load.audio('missile', ['assets/sounds/launch.wav', 'assets/sounds/launch.wav']);
    game.load.audio('hurt', ['assets/sounds/fart.wav', 'assets/sounds/fart.wav']);
    game.load.audio('hurt2', ['assets/sounds/fart2.wav', 'assets/sounds/fart.wav']);
    game.load.audio('death', ['assets/sounds/death.wav', 'assets/sounds/death.wav']);
    game.load.audio('power_up', ['assets/sounds/powerup.wav', 'assets/sounds/powerup.wav']);
    game.load.audio('guncock', ['assets/sounds/guncock.wav', 'assets/sounds/guncock.wav']);
    game.load.audio('levelup', ['assets/sounds/levelup.wav', 'assets/sounds/levelup.wav']);
    game.load.audio('gameover', ['assets/sounds/gameover.wav', 'assets/sounds/gameover.wav']);
    game.load.audio('intro', ['assets/sounds/intro.mp3', 'assets/sounds/intro.mp3']);
    game.load.audio('gameMusic', ['assets/sounds/gameMusic.wav', 'assets/sounds/gameMusic.wav']);
    game.load.audio('siren', ['assets/sounds/siren.wav', 'assets/sounds/siren.wav']);
    game.load.audio('boss', ['assets/sounds/boss.wav', 'assets/sounds/boss.wav']);
}

function create() {
    // game mode 0 = playing mode
    if(gameMode == 0){

        // creates the ground tilimg
        ground = game.add.tileSprite(0, 0, 1024, 1024, 'ground');

        makePlayer()        // set up the player sprite
 
        intro.stop()        // stop the intro music

        // start the game musio
        gameMusic = game.add.audio('gameMusic',1,true); // make it loop
        gameMusic.play('',0,1,true); 


        // Create the group to hold the player shots
    	shots = game.add.group();              // create the group
    	shots.createMultiple(30, 'shot');      // create multiple shots
    	shots.setAll('anchor.x', 0.5);         // set the achor for all shots to the center of the sprite
        shots.setAll('anchor.y', 1); 
        shots.forEach(function(shot) {
    		shot.events.onOutOfBounds.add(shotOut, this)  // set the function to call once they are out of bounds
        });

        // Create the group to hold the player shots
        // same process as above
        bossShots = game.add.group();
        bossShots.createMultiple(30, 'bossShot');
        bossShots.setAll('anchor.x', 0.5);
        bossShots.setAll('anchor.y', 1);
        bossShots.forEach(function(bossShot) {
            bossShot.events.onOutOfBounds.add(shotOut, this)
        });

        // creat other groups to store weopon sprites
        missileGroup = game.add.group();
        nukes = game.add.group();
        blastGroup = game.add.group();

        // returns a random direction for each enemy sprite every 0.3 seconds
        game.time.events.loop(Phaser.Timer.SECOND *0.3, randomDirection, this);

        //health bar
        health = game.add.sprite(290, 665, 'health')
        shield = game.add.sprite(290, 665, 'shield')

        // blasterHealth
        blasterHealthBg = game.add.sprite(30, 531, 'blasterBG')         // bottom
        overheatBG = game.add.sprite(30, 531, 'blasterH2')              // middle - red 
        blasterHealth = game.add.sprite(30, 531, 'blasterH')            // top - green

        // set scene elements
        panel = game.add.sprite(0, 645, 'panel1')       // bottom panel
        panel2 = game.add.sprite(20, 522, 'panel2')     // side panel
        panel.body.immovable = true;                    // set bot to imovable
        panel2.body.immovable = true;
        panel.bringToTop()                              // and bring both to the top
        panel2.bringToTop()

        // Lives
        makeLives()                                     // set up the life system for the player

        //scoreBar 
        scoreText = game.add.text(30, 30, " " + score + " ", {
            font: "45px Arial",
            fill: "#00eaff",
            align: "left",
        });


        // SET UP GAME OVER SCREEN
        // create and hide Game Over image
        gameOverText = game.add.sprite(game.world.centerX, game.world.centerY, 'gameOverImage')
        gameOverText.alpha = 0
        gameOverText.anchor.setTo(0.5, 0.5);

        // create and hide replay text
        replayText = game.add.text(game.world.centerX, game.world.centerY + 130, "play again?", {
            font: "35px Arial",
            fill: "#00eaff",
            align: "left",
        });
        replayText.alpha = 0
        replayText.anchor.setTo(0.5, 0.5);

        // create and hide yes no text
        yesOrNo = game.add.text(game.world.centerX, game.world.centerY + 170, "Y or N", {
            font: "35px Arial",
            fill: "#00eaff",
            align: "left",
        });
        yesOrNo.alpha = 0
        yesOrNo.anchor.setTo(0.5, 0.5);

        //powerUps groups
        powerGpoup = game.add.group();
        powerUp3Group = game.add.group();
        powerUp4Group = game.add.group();

        //ANIMATIONS

        // initialise the flame animation
        // uses a png file diveided into frames of set size
        flameAnim = game.add.sprite(200, 200, 'jetFlame');
        flameAnim.animations.add('jet', [5,4,3,2,1,0], 30, true)    // choose order and frames to use
        flameAnim.animations.play('jet')                            // play the animation

        // EMITTERS

        // emitter for the flying plarticles - effect taken and addapted from the Phaser.js examples
        // found here - http://examples.phaser.io/_site/view_full.html?d=particles&f=rain.js&t=rain 
        var emitter = game.add.emitter(game.world.centerX, 0, 400);
        emitter.width = game.world.width;  
        emitter.makeParticles('debris');
        emitter.maxParticleScale = 0.4;
        emitter.minParticleScale = 0.1;
        emitter.setYSpeed(350, 500);
        emitter.setXSpeed(-5, 5);
        emitter.minRotation = 0;
        emitter.maxRotation = 0;

        emitter.start(false, 1600, 5, 0); // start the emitter

        // explosion emitter - not currently in use - replaced with animations
        explosion = game.add.emitter(0, 0, 100);
        explosion.makeParticles('smoke');
        explosion.minParticleSpeed.setTo(-40, -40);
        explosion.maxParticleSpeed.setTo(40, 40);
        explosion.gravity = 0;
        explosion.minParticleScale = 0.5;
        explosion.maxParticleScale = 0.9;

        // fireExplosion emitter - not currently in use - replaced with animations
        fireExplosion = game.add.emitter(0, 0, 200);
        fireExplosion.makeParticles('flame');
        fireExplosion.minParticleSpeed.setTo(-100, -100);
        fireExplosion.maxParticleSpeed.setTo(100, 100);
        fireExplosion.gravity = 0;
        fireExplosion.minParticleScale = 0.5;
        fireExplosion.maxParticleScale = 0.9;

        // playerExplosion emitter - not currently in use - replaced with animations
        playerExplosion = game.add.emitter(0, 0, 200);
        playerExplosion.makeParticles('flame');
        playerExplosion.gravity = 200;


        // build first wave of enemies
        addEnemyGroup()
    }

    if(gameMode == 1){
        //Game Mode 1 = menu screen

        loading.destroy(); // once preload is complete remove the loading text

        // create the buttons
        start = game.add.button(game.world.centerX, game.world.centerY + 150, 'start', startButtonClick, this, 2, 1, 0);
        start.anchor.setTo(0.5, 0.5);
        start.alpha = 0

        instructionsButton = game.add.button(game.world.centerX, game.world.centerY + 200, 'instButton', instructionButtonClick, this, 2, 1, 0);
        instructionsButton.anchor.setTo(0.5, 0.5);
        instructionsButton.alpha = 0

        instructions = game.add.sprite(game.world.centerX, game.world.centerY, 'instructions');
        instructions.anchor.setTo(0.5, 0.5);
        instructions.alpha = 0

        // add the logo
        logo = game.add.sprite(game.world.centerX, game.world.centerY, "logo")
        logo.anchor.setTo(0.5, 0.5);
        logo.alpha = 0

        // tweening between menu screen for a smooth finish
        game.add.tween(logo).to( { alpha:1 }, 500, Phaser.Easing.Linear.None, true);                // fades in the logo
        game.add.tween(instructionsButton).to( { alpha:1 }, 500, Phaser.Easing.Linear.None, true);  // fades in the menus buttons
        game.add.tween(start).to( { alpha:1 }, 500, Phaser.Easing.Linear.None, true);

        intro = game.sound.play('intro');  // play the intro music
    }
}


// kill all the menu screens
// set the game mode to 0 = playing
// call create to start the game 
function startButtonClick(){
    start.kill()
    logo.kill()
    instructionsButton.kill()
    instructions.kill()
    gameMode = 0
    create()
}

// brings uo the instructions screen
function instructionButtonClick(){
    game.add.tween(start).to( { alpha:0 }, 500, Phaser.Easing.Linear.None, true);                           // fade out start button
    game.add.tween(instructionsButton).to( { alpha:0 }, 500, Phaser.Easing.Linear.None, true);              // fade out instructions button
    game.add.tween(logo).to( { alpha:0 }, 500, Phaser.Easing.Linear.None, true);                            // fade out logo
    game.add.tween(instructions).to( { alpha:1 }, 500, Phaser.Easing.Linear.None, true);                    // fade in instructions
    menu = game.add.button(game.world.centerX, game.world.centerY + 250, 'ship', menuButtonClick, this, 2, 1, 0); // add back button
    start.anchor.setTo(0.5, 0.5);
}

// Set up actions of menu button on the instructions page
function menuButtonClick() {
    game.add.tween(menu).to( { alpha:0 }, 500, Phaser.Easing.Linear.None, true);
    game.add.tween(instructions).to( { alpha: 0}, 500, Phaser.Easing.Linear.None, true);
    game.add.tween(logo).to( { alpha:1 }, 500, Phaser.Easing.Linear.None, true);
    game.add.tween(start).to( { alpha:1 }, 500, Phaser.Easing.Linear.None, true);
    game.add.tween(instructionsButton).to( { alpha:1 }, 500, Phaser.Easing.Linear.None, true);
}

// function to play video
// called on level++ 
function playVideo(){
    video.style.display = 'block';
    video.play();
}

// hides the video
function hideVideo(){
    video.style.display = 'none';
}


// mainly used to debug to screen
function render () {
    if(gameMode == 0){
        //game.debug.renderText(game.time.fps, 100, 100)
    }
    if(gameMode == 1){

    }
}

// This method is called recursively
// it handles all key presses and checks for state changes to call other methods
function update() {

    if(gameMode == 0){

        // create the ground/background motion
        // Adapted Phaser example - http://examples.phaser.io/_site/view_full.html?d=tile%20sprites&f=animated+tiling+sprite.js&t=animated%20tiling%20sprite
    	count += 0.005
        ground.tileScale.y = 2 + Math.cos(count); // create the weird 3d effect.
    	ground.tilePosition.y += 2; 

        // GAME INPUT
    	if (game.input.keyboard.isDown(Phaser.Keyboard.LEFT))               // if left is pressed - move player left
        {
            player.x -= speed;
            player.scale.x = 0.9        // reduce scale to give illusion of banking
        }
        else if (game.input.keyboard.isDown(Phaser.Keyboard.RIGHT))         // if Right is pressed - move player Right
        {
            player.x += speed;
            player.scale.x = 0.9        // reduce scale to give illusion of banking
        }
        else                            // bring back to normal
        {
            player.rotation = 0;
            player.scale.x = 1
        }


        if (game.input.keyboard.isDown(Phaser.Keyboard.UP))                 // if up is pressed - move player up
        {
            player.y -= speed;
        }

        if (game.input.keyboard.isDown(Phaser.Keyboard.DOWN))               // if down is pressed - move player down
        {
            player.y += speed;
        }

        if (game.input.keyboard.isDown(Phaser.Keyboard.SHIFT))              // if shift is pressed - fire missile if some exist
        {
            if(missileCount > 0){
                if(missileGroup.getFirstAlive() == null){                   // if no missile is launched
                    if (game.time.now > missileTime) {                      // shot time ensures only one missile is fired.
                        fireMissile()                                       // fire missile
                        missileSound = game.sound.play('missile');
                    }
                } else  {
                    if (game.time.now > missileTime) {                      // if missile is fired - press shift to explode it
                        explodeMissile()
                        missileSound.stop()
                        music = game.sound.play('blast');
                    }
                }
            } else if(missileCount == 0){                                   // if no missiles left
                if (game.time.now > missileTime) {
                    if(missileGroup.getFirstAlive() != null){               // check if one is launched
                        explodeMissile()                                    // and explode it
                        missileSound.stop()
                        music = game.sound.play('blast');
                    }
                }
            }
        }

        if (game.input.keyboard.isDown(Phaser.Keyboard.ALT))            // if Alt is pressed - fire Nuke if some exist
        {                                                               // exact same process as the missile above
            if(nukeCount > 0){
                if(nukes.getFirstAlive() == null){
                    if (game.time.now > missileTime) {
                        fireNuke()
                        missileSound = game.sound.play('missile');
                    }
                } else  {
                    if (game.time.now > missileTime) {
                        explodeNuke()
                        missileSound.stop()
                        music = game.sound.play('blast');
                    }
                }
            } else if(nukeCount == 0){
                if (game.time.now > missileTime) {
                    if(nukes.getFirstAlive() != null){
                        explodeNuke()
                        missileSound.stop()
                        music = game.sound.play('blast');
                    }
                }
            }
        }

        // SHOOTING

        if (game.input.keyboard.isDown(Phaser.Keyboard.SPACEBAR))       // if SPACEBA, then fire a shot
        {
            if(blasterHealth.height > 0){                               // only allow firing if blast health is OK
                if(powerLevel == 0){                                    // check powerUp level to determine fire power   
                    fire()
                }
                else if(powerLevel == 1){
                    fireSpecial()
                } else {
                    fireSuperSpecial()
                }
    		      
            }
            heatBlaster()                                               // always heat blaster upon firing
        } else {
            coolBlaster()                                               // cool otherwise
        }


        // Game over screen inputs
        if(gameOver == true){
            if (game.input.keyboard.isDown(Phaser.Keyboard.Y))
            {
                resetGame()                             // reset the game and start again if "Y"
            }
            if (game.input.keyboard.isDown(Phaser.Keyboard.N))
            {
                window.location.reload()                // if you decide not to retry then the screen is reloaded
            }
        }

        // test fuction to help test the health/life system work as they should 
        if (game.input.keyboard.isDown(Phaser.Keyboard.T))
            {
               enemyCollision()    // reduces the health bar 
            }

    // GAME PHYSICS DETECTORS
        // take for important parameters
        // - 1 and 2 = the objects reacting to each other
        // - 3 = the collision handler
        // - 4 = the callback once the thing is finished 

        
    	game.physics.overlap(shots, enemies, enemyShotCollision, null, this);                  // enemy and player shot
    	game.physics.collide(player, panel, panelCollision, null, this);                       // panel colission
        game.physics.overlap(player, panel2, panelCollision, null, this);
        game.physics.overlap(player, enemies, enemyCollision, gainShield(), this);              // enemy and player collision
        game.physics.overlap(shots, boss, bossShotCollision, null, this);                       // Boss collisions
        game.physics.overlap(blastGroup, boss, bossBlastCollision, null, this);
        game.physics.overlap(shots, powerUp1, power1Collision, null, this);                     // powerUp1 colission - 2 guns
        game.physics.overlap(shots, powerUp2, power2Collision, null, this);                     // powerUp2 colission - 4 guns
        game.physics.overlap(shots, powerUp4Group, power4Collision, null, this);                // powerUp4 colission - missiles        
        game.physics.overlap(shots, powerUp3Group, nukeCollision, null, this);                  // powerUp4 colission - nuke
        game.physics.overlap(blastRadius, enemies, blastCollision, null, this);                 // nuke and missile blast radius colissions
        game.physics.overlap(blastRadius, enemies, nukeBlastCollision, null, this);
        game.physics.overlap(player, bossShots, playerBossShotCollision, gainShield(), this);   // player hit by boss bullets

        // check spawn time to spawn some powerups
        if (game.time.now > spawnTime){
            spawnPowerUps() 
        }

        // creates some missile trails once a missile is fires
        missileSmoke()

        // Set up the game over screen
        // fades in menu if game over
        if(gameOver == true){
            game.add.tween(gameOverText).to({alpha: 1}, 1000, Phaser.Easing.Linear.None, true);
            game.add.tween(replayText).to({alpha: 1}, 1000, Phaser.Easing.Linear.None, true);
            game.add.tween(yesOrNo).to({alpha: 1}, 1000, Phaser.Easing.Linear.None, true);
        } else {
            gameOverText.alpha = 0
            replayText.alpha = 0
            yesOrNo.alpha = 0
        }

        // Checks power level of player and add the flame animation the to back of the ship at the correct position
        if(powerLevel == 0){
            flameAnim.x = player.x -36;
            flameAnim.y = player.y +5
            player.bringToTop()
        } else {
            flameAnim.x = player.x -36;
            flameAnim.y = player.y +17
            player.bringToTop()
        }

        // Set the index for the scene elements - bottom to top
        health.bringToTop()             
        shield.bringToTop()

        // blasterHealth
        blasterHealthBg.bringToTop()
        overheatBG.bringToTop()
        blasterHealth.bringToTop()

        // finally the panels fit on top
        panel.bringToTop()
        panel2.bringToTop()

        // move the boss - if boss is active
        moveBoss()

    }
    if(gameMode == 1){
        // filter.update();

        // //  Uncomment for coolness :)
        // filter.origin = filter.origin + 0.001;
    }

 }

// Called by pressing "Y" in game over mode
function resetGame(){
    score = 0                       // reset the score to zero
    gameMode = 0                    // reset game mode to 0
    level = 0                       // reset level to 0
    gameOver = false                
    enemies.removeAll()             // clear all groups to start again
    powerGpoup.removeAll()
    powerUp4Group.removeAll()
    addEnemyGroup()
    makePlayer()                    // make player again and
    makeLives()                     // setup life system
}

// set up the player sprite
function makePlayer() {
    player = game.add.sprite(400, 500, 'ship');
    player.anchor.setTo(0.5, 0.5);
    player.body.collideWorldBounds=true; // ensure the player is kept with the bounds of the screen
}

// setup life system
function makeLives(){
    lives = game.add.group();               // create group
    lives.createMultiple(3, 'life');        // create 3 lifes
    var lifePos = 0                         
    lives.forEach(function(life) {
        life.reset(850+lifePos, 570);       // place in the scene 
        lifePos += 50                       // increase x pos for next life
     });
}

// Starts each level
function startLevel(){
    console.log(gameLevel);
    if(gameLevel % 5 != 0){                                  // check if its time for boss 
        playVideo()                                          // play video at start of level
        game.time.events.add(Phaser.Timer.SECOND * 2.3, hideVideo, this);   // hide video after its played 
        levelText = game.add.text(400, 300, "LEVEL " + (gameLevel + 1) + " ", { // pop up level text 
            font: "70px Arial",
            fill: "#00eaff",
            align: "left"
        });
        game.add.tween(levelText).to( {  alpha: 0 }, 3000, Phaser.Easing.Linear.None, true); // and fade it out 
        game.time.events.add(Phaser.Timer.SECOND * 3, addEnemyGroup, this); // after is is done - add the add the enemies
    } else { // its boss time
        createBoss();        // build the boss cat
        gameMusic.stop();    // stop game music and start the boss music
        bossMusic = game.add.audio('boss',1,true);
        bossMusic.play('',0,1,true);
    }
}

// ** COLLISION HANDLING **


// handles the enemy being shot by the player
function enemyShotCollision (shot, enemy){  
    updateScore()                                  // update the score
    exploded(enemy)                                // play the explosion animation at the current enemy position
    enemy.destroy();                               // destroy the enemy
    shot.kill();                                   // kill the shot - kill only removes from the scene - does not destroy totally
    music = game.sound.play('enemyDie');
    if(enemies.length == 0){                       // check if all enemies are dead for this level
        gameLevel++                                              // game difficulty is incremented 
        startLevel();                              // start the next level
        music = game.sound.play('levelup');
    }
 }

 // ensure the player cannot go througt the bottom panel
 function panelCollision (player, panel){
    panel.body.immovable = true;
 }

 // handles the enemy being hit the blast radiu of the rocket
 function blastCollision(blast, enemy){
    enemy.destroy()                                 // destroys the enemy
    exploded(enemy)                                 // play the explosion animation at the current enemy position 
    updateScore()                                   // update the score
    music = game.sound.play('enemyDie');
    if(enemies.length == 0){                        // check if all enemies are dead for this level
        gameLevel++                                              // game difficulty is incremented 
        startLevel();                               // start the next level
        music = game.sound.play('levelup');
    }  
 }

// hadnles the Boss collision with the blast radius
function bossBlastCollision(blast, boss){
    if (game.time.now > blastTime)                  // this check ensures that the boss can only be hit once per missile
    {
        updateScore()
        bossHealth -= 2;                            // reduce boss health by 2 
        bossAlive();                                // check if boss is alive
        blastTime = game.time.now + 1000;           // update the blastTime 
    }
 }

 // // handles the collision between the boss and the player shots
function bossShotCollision(boss, shot){
    if(bossMove == true) {
        updateScore();
        shotExplosion(shot);            // animate explosion at point of impact
        shot.kill()                     // check if boss is alive
        bossHealth -= 1;                // reduce boss health by 1
        bossAlive()
    } 
}

// powr up 1 shot collision
function power1Collision (power1, shot){
    powerLevel = 1                  // increase the power level
    shot.kill()                     // remove the shots
    power1.kill()                   // remove the powerup
    displayWeapon()                 // display the poweruo
    music = game.sound.play('guncock');
 } 

// powr up w shot collision
// same as above
function power2Collision (power2, shot){
    powerLevel = 2
    shot.kill()
    power2.kill()
    displayWeapon()
    music = game.sound.play('guncock');
 } 

// missile shot collision
function power4Collision (shot, power4){
    // if powerup is not in the dislplay position
    if(power4.x != 55 && power4.y != 475){
        missileCount += 5           // increaser number of missiles
        shot.kill()                 // remove the shot 
        displayMissiles(power4)     // display the powerup
        music = game.sound.play('power_up');
    }
 } 

// nuke shot collision
 function nukeCollision (shot, power3) {
    // if powerup is not in the dislplay position
    if(power3.x != 148 && power3.y != 530){
        nukeCount += 1           // increaser number of missiles
        shot.kill()              // remove the shot 
        displayNuke(power3)     // display the powerup
        music = game.sound.play('power_up');
    }
 }

 // ** END OF COLLISION STUFF **

// check if boss is alive
function bossAlive(){
    if(bossHealth <= 0){
        game.add.tween(boss).to({y:-200}, 1000, Phaser.Easing.Linear.None, true);    // boss runs away if health is zero
        game.time.events.add(Phaser.Timer.SECOND * 1, killBoss, this);            // timer that removes boss from scene once its of the screen
        bossMove = false;                                                           // set move to false 
        bossMusic.stop()                                                            // stop game music
        gameMusic.play('',0,1,true);                                                // and play boss music
    }
}

// removes the boss from the scene
function killBoss() { 
    boss.destroy();
    gameLevel++                                              // game difficulty is incremented 
    startLevel();
 }

// handles the collision between player and boss shot
function playerBossShotCollision(shot, player){
    if(shield.width > 0){
        loseShield()                // if shield left - reduce shield
    } else {
        loseHealth()                // else reduce health
    }
    textureChange()                 // if hit change the texture of the ship to indicate collision
    hurtSound()                     // play hurt sound :)
 }

// handles the collision between the enemy and the nuke blast - whoch covers the whole screen 
function nukeBlastCollision(blast, enemy){
    enemy.destroy()
    exploded(enemy)
    updateScore()
    music = game.sound.play('enemyDie');
    if(enemies.length == 0){
        gameLevel++                                              // game difficulty is incremented 
        startLevel();
        music = game.sound.play('levelup');
    } 
 }

// handles the collision between the enemy and the player
// reudces he players health  
 function enemyCollision (player, enemy){
    if(shield.width > 0){
        loseShield()                // if shield left - reduce shield
    } else {
        loseHealth()                // else reduce health
    }
    textureChange()                 // if hit change the texture of the ship to indicate collision
    hurtSound()                     // play hurt sound :)
 } 

// Changes the skin of the player sprite depending of if the are being hurt or not 
function textureChange() {
            if(powerLevel == 0){ // check power level to determine what the current skin is 
                player.loadTexture('shipHurt1', 0); // change the texture to its twin skin
                game.time.events.add(Phaser.Timer.SECOND * 0.3, changeTextureBack, this); // tween back to the original 
            }
            if(powerLevel == 1){
                player.loadTexture('shipHurt2', 0);
                game.time.events.add(Phaser.Timer.SECOND * 0.3, changeTextureBack, this);
            }
            if(powerLevel == 2){
                player.loadTexture('shipHurt3', 0);
                game.time.events.add(Phaser.Timer.SECOND * 0.3, changeTextureBack, this);
            }
 }

// changes skin back after being hurt
// is called via a callback after the player is hurt
function changeTextureBack(){
            if(powerLevel == 0){
                player.loadTexture('ship', 0);
            }
            if(powerLevel == 1){
                player.loadTexture('ship2', 0);
            }
            if(powerLevel == 2){
                player.loadTexture('ship3', 0);
            }
}

// plays the hurting sound 
// needs own function to allow a delay between each time the sound is played. 
function hurtSound(){
    if (game.time.now > hurtTime)
    {
        music = game.sound.play('hurt2');
        hurtTime = game.time.now + 400;
    }

 }

// creates the boss sprite
function createBoss(){
    boss = game.add.sprite(game.world.centerX, - 200, 'boss')
    boss.anchor.x = 0.5;
    boss.anchor.y = 0.5;
    bossHealth = gameLevel * 20;            // both health is dependent on game level difficulty
    game.add.tween(boss).to( { y: 150 }, 300, Phaser.Easing.Linear.None, true); // introduce boss 
    game.time.events.add(Phaser.Timer.SECOND * 0.5, activateBoss, this); // then activate boss
}

// activate boss - allows boss to move when true
function activateBoss(){
    bossMove = true;
}

// move the boss left and right
// set the initail direction
// if it hits the edge - go the other way.
function moveBoss() {
    if (bossMove == true){
        if(bossDir == "right"){
            boss.x += 7
            if(boss.x > 1000){
                bossDir = "left"
            }
        }
        if(bossDir == "left"){
            boss.x -= 7
            if(boss.x < 0 ){
                bossDir = "right"
            }
        }
        bossfire() // boss shooting
    }
}

// ** FIRING **


// fires missile
function fireMissile() {
        missile = game.add.sprite(player.x, player.y, 'missile')    // create a missile 
        missile.anchor.x = 0.5;                                     // set the achor points
        missile.anchor.y = 1;
        missile.events.onOutOfBounds.add(shotOut, this)             // set method to call upon out of bounds to remove from scene
        player.bringToTop()                                         // bring player to to so missile come from the bottom
        missile.body.velocity.y = -50;                              // set the missile veloity
        missile.body.acceleration.y = -300                          // set the accelaration
        missileGroup.add(missile)                                   // add to the missile group
        missileTime = game.time.now + 700;                          // set the time until next missile
        missileCount -= 1;                                          // reduce the missile count 
        if(missileCount == 0){                                      
            powerUp4Group.forEach(function(rocket) {                    
                rocket.kill()                                       // if none left - kill the powerUp display 
            });
        }
}

// fires a nuke
// function follws same prinicples as above - fireMissile()
function fireNuke() {
        nuke = game.add.sprite(player.x, player.y, 'bomb')    // create a Nuke
        nuke.anchor.x = 0.5;
        nuke.anchor.y = 1;
        nuke.events.onOutOfBounds.add(shotOut, this)
        player.bringToTop()
        nuke.body.velocity.y = -50;
        nuke.body.acceleration.y = -300
        nukes.add(nuke)
        missileTime = game.time.now + 700;
        nukeCount -= 1;
        if(nukeCount == 0){
            powerUp3Group.forEach(function(nukey) {
                nukey.kill()
            });
        }
}

// Handle the explosion or the missile
// once a missile is launched it needs to be exploded
function explodeMissile(){
        m = missileGroup.getFirstAlive()                                // get the missile to explode
        blastRadius = game.add.sprite(m.x, m.y, 'explosion')            // create a blast radius at the position of current missile                                      
        blastRadius.alpha = 0;                                          // make it invisible 
        blastGroup.add(blastRadius)                                     // add to group
        bigExplosion(m)                                                 // play big explosion animation at position of missile
        blastRadius.anchor.x = 0.5                                      // set the anchor to 
        blastRadius.anchor.y = 0.5
        game.add.tween(blastRadius.scale).to( { x: 3, y: 3 }, 300, Phaser.Easing.Linear.None, true); // scale up over time 
        game.time.events.add(Phaser.Timer.SECOND * 0.5, killRadius, this); // kill the radius after a half a second
        missileTime = game.time.now + 700;                              // set the missile time until next missle 
        m.kill()                                                        // kill the missile 
}

// Handke the nuke explosion
// once a Nuke is launched it needs to be exploded
// follows same principles as explodeMissile()
function explodeNuke(){
        n = nukes.getFirstAlive()                                       
        blastRadius = game.add.sprite(0, 0, 'nukeBlast')
        blastRadius.bringToTop()
        blastRadius.alpha = 1;
        blastGroup.add(blastRadius)
        game.add.tween(blastRadius).to({alpha: 0}, 300, Phaser.Easing.Linear.None, true);
        game.time.events.add(Phaser.Timer.SECOND * 0.5, killRadius, this);
        enemies.forEach(function(deadEnemy){                             
            exploded(deadEnemy);                                        // play explosion animation for each existing enemy
        })
        missileTime = game.time.now + 700;
        n.kill()
}

// remove the blast radius to avoid weird behaviour
function killRadius(){
    blastGroup.forEach(function(blast) {
        blast.kill()
    });
}



// single shooting
function fire() {
    if (game.time.now > shotTime)
    {
        // get the first bullet from the group
        shot = shots.getFirstExists(false);
        music = game.sound.play('laser');
        if (shot) // if there is one
        {
            shot.reset(player.x, player.y - 45);    // set it to the players loaction 
            player.bringToTop()                     // set the player to be on top of the laser
            shot.body.velocity.y = -500;            // fire it
            shotTime = game.time.now + 210;         // update shot time 
        }
    }
}

// Double shooting
// same as above but twice
// reset postions are adjusted to shoot from blasters on wings 
function fireSpecial() {
    if (game.time.now > shotTime)
    {
    	var count = 2 
        music = game.sound.play('laser');
        shot = shots.getFirstExists(false);
        if (shot && count == 2)
        {
            shot.reset(player.x -27 , player.y - 10);
            player.bringToTop()
            shot.body.velocity.y = -500;
            shotTime = game.time.now + 200;
            count -= 1;
        }
		shot = shots.getFirstExists(false);
        if (shot && count == 1)
        {
            shot.reset(player.x +27 , player.y - 10);
            player.bringToTop()
            shot.body.velocity.y = -500;
            shotTime = game.time.now + 200;
        }
    }
}

// Quadruple shooting
// same as above 
// inlcudes a call to fireSpecial() 
function fireSuperSpecial() {
    if (game.time.now > shotTime)
    {
    	fireSpecial()
    	var count = 2
        music = game.sound.play('laser');
        shot = shots.getFirstExists(false);
        if (shot && count == 2)
        {
            shot.reset(player.x -45 , player.y +10);
            player.bringToTop()
            shot.body.velocity.y = -500;
            shotTime = game.time.now + 150;
            count -= 1;
        }

		shot = shots.getFirstExists(false);
        if (shot && count == 1)
        {
            shot.reset(player.x +45 , player.y +10);
            player.bringToTop()
            shot.body.velocity.y = -500;
            shotTime = game.time.now + 150;
        }
    }
}

// handles the boss shooting 
function bossfire() {
        if (game.time.now > badShotTime)
        {
            badShot = bossShots.getFirstExists(false);
            music = game.sound.play('laser');
            if (badShot)
            {
                badShot.reset(boss.x, boss.y - 45);
                player.bringToTop()
                badShot.body.velocity.y = +500;
                badShotTime = game.time.now + 210;
            }
        }
}


// remove ths shot from the scene
// called by the out of bounds handler
function shotOut(shot){
	shot.kill()
}

// reduce the health bar 
function loseHealth(){
    if(health.width > 0){
        health.width -= 4.4
    }else{
        removeLife()   // if health is < 0 remove a life
        health.width = 444 // reset the health bar to original size
    }
}

// reduce the shield bar
function loseShield(){
    if(shield.width > 0 ){
        shield.width -= 4
    }else{                      // if shield is < 0 remove
        shield.width = 444      // reset the health bar to original size
    }
}

// grow the shield very slowly
// called after enemy player collision
function gainShield(){
    if(regain){
        if(shield.width < 444 ){
            shield.width += 0.01
        }
    }
}

// removes a life from the group
function removeLife() {
    if(lives.getFirstAlive() != null){                                                  // if there are lives left
                        
        life = lives.getFirstAlive(false);                                              // get the first one 
        shield.width = 444                                                              // set the shield to 100% 
        life.kill()                                                                     // remove a life 
        if(showPowerUp){                                                                // kill powerups
            showPowerUp.kill()                      
        }                       
        playerDie();                                                                    // killplayer
        music = game.sound.play('death');                                               // playe death rattle 
        powerLevel = 0;                                                                 // reset power lever to zero
        flameAnim.alpha = 0;                                                            // kill flame anim    
        game.add.tween(player).to({alpha: 0}, 10, Phaser.Easing.Linear.None, true);     //fade out
        game.time.events.add(Phaser.Timer.SECOND * 0.5, fadeInPlayer, this);            // fade back in
    
    } else {                                    // no lives left

        flameAnim.alpha = 0;                    // kill flame anim
        playerDie();                            // kill player 
        player.kill()                           // remove player from the scene 
        if(showPowerUp){
            showPowerUp.kill()                  // kill powerups    
        }   
        gameOver = true;                        // set gameover to true
        music = game.sound.play('gameover');    // play game over sound
        enemies.forEach(function(baddie){
            baddie.kill();              
        })
    }
}

// After death, fade in player
function fadeInPlayer(){
    game.add.tween(player).to({alpha: 1}, 1000, Phaser.Easing.Linear.None, true);
    game.add.tween(flameAnim).to({alpha: 1}, 1000, Phaser.Easing.Linear.None, true);
}

// updates the score 
function updateScore(){
    score += 100
    scoreText.setText(score) // set the score text
}

// heat the blaster
// if blaster overheats then overHeat() is called 
function heatBlaster(){
    if(blasterHealth.height > 0){
        blasterHealth.height -= 5 
    } 
    if(blasterHealth.height <= 0){
        overheat()    
    }

}

// when gun is not in use - it cools 
function coolBlaster(){
    if(blasterHealth.height < 160){
        cool()
        if(overheatBG.height > 75 ){
            blasterHealth.height += 4
        }
    }
}

// if gun over heats - powerup level is reduced by one
function overheat(){
    if(overheatBG.height > 0 ){
        overheatBG.height -= 5
    } else {
        if(powerLevel == 1){                                // check power level
            powerLevel = 0
            showPowerUp.kill()
            player.loadTexture('ship', 0);                  // change the texture back the previous powerup state 
        }
        if(powerLevel == 2){                                // check power level
            powerLevel = 1
            showPowerUp.kill()
            powerUp1 = game.add.sprite(110, 580, 'power1')  // set display powerup 
            resetBlastCooler()
            player.loadTexture('ship2', 0);
        }
        game.sound.play('siren');
    }
}

// increase the overheat bar to safer levels
function cool(){
    if(overheatBG.height < 160){
        overheatBG.height += 1
    }
}

// displays the power up in the panel to indicate the playes power level
function displayWeapon(){
    if(powerLevel == 1){
        player.loadTexture('ship2', 0);
        showPowerUp = game.add.sprite(110, 580, 'power1')   // postion in bottom left corner
    }
    if(powerLevel == 2){                                    // if 2 then 1 muts be present so...
        player.loadTexture('ship3', 0);
        showPowerUp.kill()                                  // kill it
        showPowerUp = game.add.sprite(110, 580, 'power2')   // postion in bottom left corner
    }
}

// postion in bottom left corner
function displayMissiles(power2){
    power2.x = 55;
    power2.y = 475;
}

// postion in bottom left corner
function displayNuke(power3){
    power3.x = 148;
    power3.y = 530;
}

//resets the blast cooler
function resetBlastCooler(){
    overheatBG.height = 160
    blasterHealth.height =160
}

// genenraties a random number used to determine the next move for an enemy
function randomDirection(){
    enemies.forEach(function(enemy) {
        direction = game.rnd.integerInRange(1, 5)
        enemyMove(enemy)                    // move the enemy based on the number given
    });
}

 // moves the enemy in a direction based on the number given from the method above
function enemyMove(enemy){

    // wrap the enemy round the scene 
    // so they go out one end - come in the other
    if(enemy.x >= 1040){
        enemy.x = -30
    }
    if(enemy.x <= -50){
        enemy.x = 1030
    }
    if(enemy.y < -40){
        enemy.y = 730
    }
    if(enemy.y >= 710){
        enemy.y = -30
    }

    // set direction
    switch(direction)
        {
        case 1:
          game.add.tween(enemy).to( { x: '+170' }, 300, Phaser.Easing.Linear.None, true);
          break;
        case 2:
          game.add.tween(enemy).to( { x: '-170' }, 300, Phaser.Easing.Linear.None, true);
          break;
        case 3:
          game.add.tween(enemy).to( { y: '+170' }, 300, Phaser.Easing.Linear.None, true);
          break;
        case 4:
          game.add.tween(enemy).to( { y: '-170' }, 300, Phaser.Easing.Linear.None, true);
          break;
        }
}

// creates a wave of chaos 
function addEnemyGroup(){
    level += 10 // level adds ten every time its called
    enemies = game.add.group();
    enemies.createMultiple(level, 'enemy1');
    enemies.forEach(function(enemy) {
        enemy.reset(game.rnd.integerInRange(20, 1000), -100); // places them randomly across the x axis
    });
}

// plays an explosion animaton that the coordinats of the argument 
function exploded(thing) {
    explosionAnim = game.add.sprite(thing.x - 20, thing.y - 20, 'explosionAnimation');
    explosionAnim.animations.add('run')
    explosionAnim.animations.play('run', 30, false)
}

// plays an explosion animaton that the coordinats of the argument - shot has a different start point so needed another function 
function shotExplosion(shot) {
    explosionAnim = game.add.sprite(shot.x - 60, shot.y - 130, 'explosionAnimation');
    explosionAnim.animations.add('run')
    explosionAnim.animations.play('run', 30, false)
}

// plays an big explosion animaton that the coordinats of the argument 
function bigExplosion(thing){
    explosionBigAnim = game.add.sprite(thing.x - 100, thing.y - 130, 'explosionBigAnimation');
    explosionBigAnim.animations.add('runBig')
    explosionBigAnim.animations.play('runBig', 30, false)
}

// plays an explosion animaton that the coordinats of the player 
function playerDie() {
    explosionAnim = game.add.sprite(player.x - 60, player.y - 60, 'explosionAnimation');
    explosionAnim.animations.add('run')
    explosionAnim.animations.play('run', 30, false)
}

// spawns powerup to the scene
function spawnPowerUps(){
    var choice = game.rnd.integerInRange(1, 4) // rando,ly generates a number between 1 an 4
    switch(direction) // used to determine which one is spawned
        {
        case 1:
            if(powerLevel == 0){
                powerUp1 = game.add.sprite(game.rnd.integerInRange(20, 1000), game.rnd.integerInRange(20, 400),'power1')
                powerUp1.anchor.setTo(0.5, 0.5);
                powerGpoup.add(powerUp1)
                game.time.events.add(Phaser.Timer.SECOND * 5, killPowerUp, this); // powerup only lasts 5 seconds
            }
            if(powerLevel == 1){
                powerUp2 = game.add.sprite(game.rnd.integerInRange(20, 1000), game.rnd.integerInRange(20, 400),'power2')
                powerUp2.anchor.setTo(0.5, 0.5);
                powerGpoup.add(powerUp2)
                game.time.events.add(Phaser.Timer.SECOND * 5, killPowerUp, this); // powerup only lasts 5 seconds
            }
          break;
        case 2:  // missile
            powerUp4 = game.add.sprite(game.rnd.integerInRange(20, 1000), game.rnd.integerInRange(20, 400),'power4')
            powerUp4.anchor.setTo(0.5, 0.5);
            powerUp4Group.add(powerUp4)
          break;
        case 3:  // nuke 
            powerUp3 = game.add.sprite(game.rnd.integerInRange(20, 1000), game.rnd.integerInRange(20, 400),'power3')
            powerUp3.anchor.setTo(0.5, 0.5);
            powerUp3Group.add(powerUp3)
        break;
        }
    spawnTime = game.time.now + game.rnd.integerInRange(10000, 15000); // timer set to spawn more powerup between every 10 to 15 seconds
}

// creates missile smoke trails once a missile is fires
function missileSmoke(){
    if(missileGroup.getFirstAlive() != null){       // checks if a missile is launched
        explosion.x = missile.x;                    // sets the emitter position to follow missile
        explosion.y = missile.y; 
        explosion.start(true, 1000, null, 5);       // starts the emitter
    }
}

// removes the powerup from the scene
function killPowerUp(){
    powerGpoup.forEach(function(powerUP){
        powerUP.kill()
    });
}

