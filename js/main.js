
var game = new Phaser.Game(800, 600, Phaser.CANVAS, 'phaser-example', { preload: preload, create: create, update: update, render: render });

function preload() {

    //menu
    game.load.image('bg','assets/startmenu.png');
    game.load.image('bk','assets/Black.jpg');
    game.load.image('logo', 'assets/logo.png');

    //map
    game.load.tilemap('stage1', 'assets/tilemap/map.json', null, Phaser.Tilemap.TILED_JSON);
    game.load.tilemap('stage2', 'assets/tilemap/map2.json', null, Phaser.Tilemap.TILED_JSON);
    game.load.tilemap('stage2t', 'assets/tilemap/map2t.json', null, Phaser.Tilemap.TILED_JSON);
    game.load.tilemap('stage3', 'assets/tilemap/map3.json', null, Phaser.Tilemap.TILED_JSON);
    game.load.tilemap('stage4', 'assets/tilemap/map4.json', null, Phaser.Tilemap.TILED_JSON);
    game.load.tilemap('stage5', 'assets/tilemap/map5.json', null, Phaser.Tilemap.TILED_JSON);
    game.load.tilemap('stage6', 'assets/tilemap/map6.json', null, Phaser.Tilemap.TILED_JSON);
    game.load.image('tiles','assets/tileset/map_spritesheet.png');

    //moving object
    game.load.image('player', 'assets/player/stealer_stand_right.png');
    game.load.image('guard', 'assets/player/guard_stand_left.png');
    game.load.atlas('animation', 'assets/player/spritesheet.png', 'assets/player/spritesheet.json');
    game.load.atlas('keyGuard', 'assets/player/keyguard/spritesheet2.png', 'assets/player/keyguard/spritesheet2.json');

    //tower
    game.load.image('towerLeft','assets/item/tower_left.png');
    game.load.image('towerRight','assets/item/tower_right.png');
    game.load.image('towerDown','assets/item/tower_down.png');
    game.load.image('towerUp','assets/item/tower_up.png');

    //teleporter
    game.load.atlas('tp','assets/item/teleporter.png','assets/item/teleporter.json');

    //map item
    game.load.image('gem', 'assets/item/gem.png');
    game.load.image('alarm', 'assets/item/alarm.png');
    game.load.image('gate', 'assets/item/door.png');
    game.load.image('switch', 'assets/item/switch.png');
    game.load.image('bone', 'assets/item/bone.png');
    game.load.image('key', 'assets/item/key.png');
    game.load.image('heart', 'assets/item/heart.png');

    game.load.atlas('rose', 'assets/item/flower.png', 'assets/item/flower.json');

}

var hp = 3;
var heart3, heart2=null, heart1=null;

var map = null;
var layer;
var cursors;
var player;
var guard, guard2;
var guard_status = 'patrol';
var guard2_status = 'patrol';
var dogs = [];
var dogPos;
var bone;
var dogNum = 6;
var stage = 0;
var tp;
var creation = false;
var floorLayer;
var wallLayer;
var stageLoaded = false;
var index = 0;

var key1;
var key5;
var key;

var laser1, laser2, laser3, laser4, laser5;
lasers = [laser1, laser2, laser3, laser4, laser5];

var swt;
var gate1, gate2;
var gem;
var finalGem;

var keyman=null;

var bgm=new Audio("assets/sound/bgm.mp3");

var waypoints;


function create() {         // will be recalled when stage level increase
    
    bgm.play();
    bgm.loop = true;
    
    cursors = game.input.keyboard.createCursorKeys();
    key1 = game.input.keyboard.addKey(Phaser.Keyboard.ONE);
    key1.onDown.add(nextStage, this);

    /*key5 = game.input.keyboard.addKey(Phaser.Keyboard.FIVE);
    key5.onDown.add(reStart, this);*/

    //  to reset the map
    if(map != null){
        map.destroy();
        floorLayer.destroy();
        wallLayer.destroy();
        tp.kill();
        player.kill();

            /*laser1.destroy();
            laser2.destroy();
            laser3.destroy();
            laser4.destroy();*/

        game.world.removeAll(true);
    }


    if(stage == 0){
        var menu = game.add.sprite(0,0,'bg');
        var logo = game.add.sprite(500,50,'logo');
        var startText = game.add.text(400, 400,' ', {
            font:'50px Arial',
            fill:'#fff',
            boundsAlignH: "center",
            boundsAlignV: "middle"
        });
        startText.text = "Press '1' to start";
        startText.fixedToCamera = true;
    }

    if(stage == 1) {                    //Stage 1

        var bg = game.add.sprite(0,0,'bk');
        // create map
        map = game.add.tilemap('stage1');
        map.addTilesetImage('map_spritesheet','tiles');
        floorLayer = map.createLayer('floor');
        wallLayer = map.createLayer('wall');
        map.setCollisionBetween(1, 50, true, 'wall');
        floorLayer.resizeWorld();

    //  Un-comment this on to see the collision tiles
    //  layer1.debug = true;

    //  Player
    player = game.add.sprite(60, 70, 'animation', 'characters/stealer/stealer_stand/stealer_stand_right.png');
    player.animations.add('left', Phaser.Animation.generateFrameNames('characters/stealer/stealer_walk_left/', 0, 7, '', 4), 10, true, false);
    player.animations.add('right', Phaser.Animation.generateFrameNames('characters/stealer/stealer_walk_right/', 0, 7, '', 4), 10, true, false);
    game.physics.enable(player, Phaser.Physics.ARCADE);
    game.camera.follow(player);
    player.anchor.setTo(0.5, 0.5);
    player.body.setSize(40, 61, 2, 1);
    player.maxHealth = hp;
    console.log("Initial hp = "+hp);

    var help = game.add.text(16, 40, 'Use arrows to move the character', { font: '14px Arial', fill: '#ffffff' });
    help.fixedToCamera = true;

        switch (hp){
            case 3:
                console.log("health bar loaded");
                heart1 = game.add.sprite(10, 10, 'heart');
                heart2 = game.add.sprite(40, 10, 'heart');
                heart3 = game.add.sprite(70, 10, 'heart');
                heart1.fixedToCamera = true;
                heart2.fixedToCamera = true;
                heart3.fixedToCamera = true;
                break;
            case 2:
                console.log("health bar loaded");
                heart1 = game.add.sprite(10, 10, 'heart');
                heart2 = game.add.sprite(40, 10, 'heart');
                heart1.fixedToCamera = true;
                heart2.fixedToCamera = true;
                break;
            case 1:
                console.log("health bar loaded");
                heart1 = game.add.sprite(10, 10, 'heart');
                heart1.fixedToCamera = true;
                break;
        }

    //laser tower
    var tower1 = game.add.sprite(290, 385, 'towerLeft');
    var tower2 = game.add.sprite(30, 480, 'towerRight');
    var tower3 = game.add.sprite(30, 290, 'towerRight');
    var tower4 = game.add.sprite(510, 30, 'towerDown');

    var tower5 = game.add.sprite(480,225, 'towerLeft');
    var tower6 = game.add.sprite(350,225, 'towerRight');

    //laser
        laser1 = game.add.sprite(60, 290, 'animation', 'items/lightning/lightning_horizontal/0000');
        laser1.animations.add('spark', Phaser.Animation.generateFrameNames('items/lightning/lightning_horizontal/', 0, 6, '', 4), 10, true, false);
        laser2 = game.add.sprite(180, 385, 'animation', 'items/lightning/lightning_horizontal/0000');
        laser2.animations.add('spark', Phaser.Animation.generateFrameNames('items/lightning/lightning_horizontal/', 0, 6, '', 4), 10, true, false);
        laser3 = game.add.sprite(60, 480, 'animation', 'items/lightning/lightning_horizontal/0000');
        laser3.animations.add('spark', Phaser.Animation.generateFrameNames('items/lightning/lightning_horizontal/', 0, 6, '', 4), 10, true, false);
        laser4 = game.add.sprite(510, 60, 'animation', 'items/lightning/lightning_vertical/0000');
        laser4.scale.setTo(1,0.6);
        laser4.animations.add('spark', Phaser.Animation.generateFrameNames('items/lightning/lightning_vertical/', 0, 6, '', 4), 10, true, false);
        laser5 = game.add.sprite(380, 225, 'animation', 'items/lightning/lightning_horizontal/0000');
        laser5.animations.add('spark', Phaser.Animation.generateFrameNames('items/lightning/lightning_horizontal/', 0, 6, '', 4), 10, true, false);
        laser5.scale.setTo(0.9,1);
        lasers = [laser1,laser2,laser3,laser4, laser5];


        game.physics.enable(lasers, Phaser.Physics.ARCADE);
        var i = 0;

        lasers.forEach(function (laser) {
            laser.kill();
            game.time.events.add(1000 + (i * 500), this.createLaser, this, laser);
            i++;
        });

        //telepoter
        tp = game.add.sprite(580, 430, 'tp', '0000');
        tp.animations.add('tpp', Phaser.Animation.generateFrameNames('', 0, 4, '', 4), 10, true, false);
        tp.animations.play('tpp');
        game.physics.enable(tp, Phaser.Physics.ARCADE);
        tp.body.immovable = true;
        tp.body.collideWorldBounds = true;
    }
    else if(stage == 2){               //Stage 2

        //  create map
        map = game.add.tilemap('stage2');
        map.addTilesetImage('map_spritesheet','tiles');
        floorLayer = map.createLayer('floor');
        wallLayer = map.createLayer('wall');
        map.setCollisionBetween(1, 50, true, 'wall');
        floorLayer.resizeWorld();

        //  create player
        player = game.add.sprite(60, 70, 'animation', 'characters/stealer/stealer_stand/stealer_stand_right.png');
        player.animations.add('left', Phaser.Animation.generateFrameNames('characters/stealer/stealer_walk_left/', 0, 7, '', 4), 10, true, false);
        player.animations.add('right', Phaser.Animation.generateFrameNames('characters/stealer/stealer_walk_right/', 0, 7, '', 4), 10, true, false);
        game.physics.enable(player, Phaser.Physics.ARCADE);
        player.anchor.setTo(0.5, 0.5);
        game.camera.follow(player);
        player.body.setSize(40, 61, 2, 1);

        switch (hp){
            case 3:
                console.log("health bar loaded3");
                heart1 = game.add.sprite(10, 10, 'heart');
                heart2 = game.add.sprite(40, 10, 'heart');
                heart3 = game.add.sprite(70, 10, 'heart');
                heart1.fixedToCamera = true;
                heart2.fixedToCamera = true;
                heart3.fixedToCamera = true;
                break;
            case 2:
                console.log("health bar loaded2");
                heart1 = game.add.sprite(10, 10, 'heart');
                heart2 = game.add.sprite(40, 10, 'heart');
                heart1.fixedToCamera = true;
                heart2.fixedToCamera = true;
                break;
            case 1:
                console.log("health bar loaded1");
                heart1 = game.add.sprite(10, 10, 'heart');
                heart1.fixedToCamera = true;
                break;
        }

        // create guard
        guard = game.add.sprite(420, 460, 'animation', 'characters/guard/guard_stand/guard_stand_left.png');
        guard.animations.add('left', Phaser.Animation.generateFrameNames('characters/guard/guard_walk_left/', 0, 5, '', 4), 10, true, false);
        guard.animations.add('right', Phaser.Animation.generateFrameNames('characters/guard/guard_walk_right/', 0, 5, '', 4), 10, true, false);
        game.physics.enable(guard, Phaser.Physics.ARCADE);
        guard.enableBody = true;
        guard.body.collideWorldBounds = true;
        guard.anchor.setTo(0.5, 0.5);
        guard.body.setSize(40, 61, 2, 1);
        
        p1 = new Phaser.Point(420,460);
        p2 = new Phaser.Point(72,460);
        p3 = new Phaser.Point(72,72);
        p4 = new Phaser.Point(420,72);
        
        waypoints = [p1, p2, p3, p4];

        // create teleporter
        tp = game.add.sprite(550, 40, 'tp', '0000');
        tp.animations.add('tpp', Phaser.Animation.generateFrameNames('', 0, 4, '', 4), 10, true, false);
        tp.animations.play('tpp');
        game.physics.enable(tp, Phaser.Physics.ARCADE);
        tp.body.immovable = true;
        tp.body.collideWorldBounds = true;
    }
    else if(stage == 3){               //Stage 2
        //  create map
        map = game.add.tilemap('stage2t');
        map.addTilesetImage('map_spritesheet','tiles');
        floorLayer = map.createLayer('floor');
        wallLayer = map.createLayer('wall');
        map.setCollisionBetween(1, 50, true, 'wall');
        floorLayer.resizeWorld();

        //  create player
        player = game.add.sprite(60, 70, 'animation', 'characters/stealer/stealer_stand/stealer_stand_right.png');
        player.animations.add('left', Phaser.Animation.generateFrameNames('characters/stealer/stealer_walk_left/', 0, 7, '', 4), 10, true, false);
        player.animations.add('right', Phaser.Animation.generateFrameNames('characters/stealer/stealer_walk_right/', 0, 7, '', 4), 10, true, false);
        game.physics.enable(player, Phaser.Physics.ARCADE);
        player.anchor.setTo(0.5, 0.5);
        game.camera.follow(player);
        player.body.setSize(40, 61, 2, 1);
        player.health = hp;

        switch (hp){
            case 3:
                console.log("health bar loaded3");
                heart1 = game.add.sprite(10, 10, 'heart');
                heart2 = game.add.sprite(40, 10, 'heart');
                heart3 = game.add.sprite(70, 10, 'heart');
                heart1.fixedToCamera = true;
                heart2.fixedToCamera = true;
                heart3.fixedToCamera = true;
                break;
            case 2:
                console.log("health bar loaded2");
                heart1 = game.add.sprite(10, 10, 'heart');
                heart2 = game.add.sprite(40, 10, 'heart');
                heart1.fixedToCamera = true;
                heart2.fixedToCamera = true;
                break;
            case 1:
                console.log("health bar loaded1");
                heart1 = game.add.sprite(10, 10, 'heart');
                heart1.fixedToCamera = true;
                break;
        }

        // create guard 1
        guard = game.add.sprite(420, 460, 'animation', 'characters/guard/guard_stand/guard_stand_left.png');
        guard.animations.add('left', Phaser.Animation.generateFrameNames('characters/guard/guard_walk_left/', 0, 5, '', 4), 10, true, false);
        guard.animations.add('right', Phaser.Animation.generateFrameNames('characters/guard/guard_walk_right/', 0, 5, '', 4), 10, true, false);
        game.physics.enable(guard, Phaser.Physics.ARCADE);
        guard.enableBody = true;
        guard.body.collideWorldBounds = true;
        guard.anchor.setTo(0.5, 0.5);
        guard.body.setSize(40, 61, 2, 1);

        // create guard 2
        guard2 = game.add.sprite(120, 460, 'animation', 'characters/guard/guard_stand/guard_stand_left.png');
        guard2.animations.add('left', Phaser.Animation.generateFrameNames('characters/guard/guard_walk_left/', 0, 5, '', 4), 10, true, false);
        guard2.animations.add('right', Phaser.Animation.generateFrameNames('characters/guard/guard_walk_right/', 0, 5, '', 4), 10, true, false);
        game.physics.enable(guard2, Phaser.Physics.ARCADE);
        guard2.enableBody = true;
        guard2.body.collideWorldBounds = true;
        guard2.anchor.setTo(0.5, 0.5);
        guard2.body.setSize(40, 61, 2, 1);

        //create gate
        gate1 = game.add.sprite(80,240,'gate');
        gate2 = game.add.sprite(400,300,'gate');
        swt = game.add.sprite(280,300,'switch');
        game.world.swap(swt, player);
        game.physics.enable(swt, Phaser.Physics.ARCADE);

        game.physics.enable(gate1, Phaser.Physics.ARCADE);
        game.physics.enable(gate2, Phaser.Physics.ARCADE);
        gate1.body.immovable = true;
        //gate1.body.collideWorldBounds = true;
        gate2.body.immovable = true;
        //gate2.body.collideWorldBounds = true;

        // create teleporter
        tp = game.add.sprite(550, 40, 'tp', '0000');
        tp.animations.add('tpp', Phaser.Animation.generateFrameNames('', 0, 4, '', 4), 10, true, false);
        tp.animations.play('tpp');
        game.physics.enable(tp, Phaser.Physics.ARCADE);
        tp.body.immovable = true;
        tp.body.collideWorldBounds = true;
    }
    else if(stage == 4){            //Stage 3
        guard.destroy();
        guard2.destroy();

        map = game.add.tilemap('stage3');
        map.addTilesetImage('map_spritesheet','tiles');
        floorLayer = map.createLayer('floor');
        wallLayer = map.createLayer('wall');
        map.setCollisionBetween(1, 50, true, 'wall');

        floorLayer.resizeWorld();

        player = game.add.sprite(60, 70, 'animation', 'characters/stealer/stealer_stand/stealer_stand_right.png');
        player.animations.add('left', Phaser.Animation.generateFrameNames('characters/stealer/stealer_walk_left/', 0, 7, '', 4), 10, true, false);
        player.animations.add('right', Phaser.Animation.generateFrameNames('characters/stealer/stealer_walk_right/', 0, 7, '', 4), 10, true, false);
        game.physics.enable(player, Phaser.Physics.ARCADE);
        player.anchor.setTo(0.5, 0.5);
        game.camera.follow(player);
        player.body.setSize(40, 61, 2, 1);
        player.health = hp;

        switch (hp){
            case 3:
                console.log("health bar loaded3");
                heart1 = game.add.sprite(10, 10, 'heart');
                heart2 = game.add.sprite(40, 10, 'heart');
                heart3 = game.add.sprite(70, 10, 'heart');
                heart1.fixedToCamera = true;
                heart2.fixedToCamera = true;
                heart3.fixedToCamera = true;
                break;
            case 2:
                console.log("health bar loaded2");
                heart1 = game.add.sprite(10, 10, 'heart');
                heart2 = game.add.sprite(40, 10, 'heart');
                heart1.fixedToCamera = true;
                heart2.fixedToCamera = true;
                break;
            case 1:
                console.log("health bar loaded1");
                heart1 = game.add.sprite(10, 10, 'heart');
                heart1.fixedToCamera = true;
                break;
        }

        gem = game.add.sprite(90, 320, 'animation','items/gem/0000');
        gem.animations.add('shine', Phaser.Animation.generateFrameNames('items/gem/', 0, 7, '', 4), 10, true, false);
        gem.animations.play('shine');

        gem.scale.setTo(0.8,0.8);
        game.physics.enable(gem, Phaser.Physics.ARCADE);
        swt = game.add.sprite(280,40,'switch');
        game.physics.enable(swt, Phaser.Physics.ARCADE);
        game.world.swap(swt, player);

        //gate system
        gate1 = game.add.sprite(220,240,'gate');
        gate2 = game.add.sprite(350,300,'gate');

        game.physics.enable(gate1, Phaser.Physics.ARCADE);
        game.physics.enable(gate2, Phaser.Physics.ARCADE);
        gate1.body.immovable = true;
        //gate1.body.collideWorldBounds = true;
        gate2.body.immovable = true;
        //gate2.body.collideWorldBounds = true;



        // create teleporter
        tp = game.add.sprite(550, 400, 'tp', '0000');
        tp.animations.add('tpp', Phaser.Animation.generateFrameNames('', 0, 4, '', 4), 10, true, false);
        tp.animations.play('tpp');
        game.physics.enable(tp, Phaser.Physics.ARCADE);
        tp.body.immovable = true;
        tp.body.collideWorldBounds = true;

    }
    else if(stage == 5){

        map = game.add.tilemap('stage4');
        map.addTilesetImage('map_spritesheet','tiles');
        floorLayer = map.createLayer('floor');
        wallLayer = map.createLayer('wall');
        map.setCollisionBetween(1, 50, true, 'wall');

        floorLayer.resizeWorld();

        player = game.add.sprite(60, 70, 'animation', 'characters/stealer/stealer_stand/stealer_stand_right.png');
        player.animations.add('left', Phaser.Animation.generateFrameNames('characters/stealer/stealer_walk_left/', 0, 7, '', 4), 10, true, false);
        player.animations.add('right', Phaser.Animation.generateFrameNames('characters/stealer/stealer_walk_right/', 0, 7, '', 4), 10, true, false);
        game.physics.enable(player, Phaser.Physics.ARCADE);
        player.anchor.setTo(0.5, 0.5);
        game.camera.follow(player);
        player.body.setSize(40, 61, 2, 1);
        player.health = hp;

        switch (hp){
            case 3:
                console.log("health bar loaded3");
                heart1 = game.add.sprite(10, 10, 'heart');
                heart2 = game.add.sprite(40, 10, 'heart');
                heart3 = game.add.sprite(70, 10, 'heart');
                heart1.fixedToCamera = true;
                heart2.fixedToCamera = true;
                heart3.fixedToCamera = true;
                break;
            case 2:
                console.log("health bar loaded2");
                heart1 = game.add.sprite(10, 10, 'heart');
                heart2 = game.add.sprite(40, 10, 'heart');
                heart1.fixedToCamera = true;
                heart2.fixedToCamera = true;
                break;
            case 1:
                console.log("health bar loaded1");
                heart1 = game.add.sprite(10, 10, 'heart');
                heart1.fixedToCamera = true;
                break;
        }
        
        keyman = game.add.sprite(383, 425, 'keyGuard', 'keyguard_stand_right.png');
        keyman.animations.add('kmleft', Phaser.Animation.generateFrameNames('keyguard_walk_left/', 0, 3, '', 4), 10, true, false);
        keyman.animations.add('kmright', Phaser.Animation.generateFrameNames('keyguard_walk_right/', 0, 3, '', 4), 10, true, false);
        game.physics.enable(keyman, Phaser.Physics.ARCADE);
        keyman.enableBody = true;
        keyman.body.collideWorldBounds = true;
        keyman.anchor.setTo(0.5, 0.5);
        keyman.body.setSize(40, 61, 2, 1);

        function callAlert() {
            alert("Catch the Key Guard to go to the next stage!");
        }

        game.time.events.add(100, callAlert);


    }
    else if(stage == 6) {

        map = game.add.tilemap('stage5');
        map.addTilesetImage('map_spritesheet','tiles');
        floorLayer = map.createLayer('floor');
        wallLayer = map.createLayer('wall');
        map.setCollisionBetween(1, 50, true, 'wall');
        
        floorLayer.resizeWorld();
        
        player = game.add.sprite(383, 425, 'animation', 'characters/stealer/stealer_stand/stealer_stand_right.png');
        player.animations.add('left', Phaser.Animation.generateFrameNames('characters/stealer/stealer_walk_left/', 0, 7, '', 4), 10, true, false);
        player.animations.add('right', Phaser.Animation.generateFrameNames('characters/stealer/stealer_walk_right/', 0, 7, '', 4), 10, true, false);
        game.physics.enable(player, Phaser.Physics.ARCADE);
        player.anchor.setTo(0.5, 0.5);
        game.camera.follow(player);
        player.body.setSize(40, 61, 2, 1);
        player.health = hp;

        switch (hp){
            case 3:
                console.log("health bar loaded3");
                heart1 = game.add.sprite(10, 10, 'heart');
                heart2 = game.add.sprite(40, 10, 'heart');
                heart3 = game.add.sprite(70, 10, 'heart');
                heart1.fixedToCamera = true;
                heart2.fixedToCamera = true;
                heart3.fixedToCamera = true;
                break;
            case 2:
                console.log("health bar loaded2");
                heart1 = game.add.sprite(10, 10, 'heart');
                heart2 = game.add.sprite(40, 10, 'heart');
                heart1.fixedToCamera = true;
                heart2.fixedToCamera = true;
                break;
            case 1:
                console.log("health bar loaded1");
                heart1 = game.add.sprite(10, 10, 'heart');
                heart1.fixedToCamera = true;
                break;
        }
        
        dog1Pos = new Phaser.Point(120, 702);
        dog2Pos = new Phaser.Point(383, 702);
        dog3Pos = new Phaser.Point(678, 702);
        dog4Pos = new Phaser.Point(678, 107);
        dog5Pos = new Phaser.Point(383, 107);
        dog6Pos = new Phaser.Point(120, 107);
        
        dogPos = [dog1Pos, dog2Pos, dog3Pos, dog4Pos, dog5Pos, dog6Pos];
        
        for(var i = 0; i < dogNum; i++){
            dogs[i] = game.add.sprite(dogPos[i].x, dogPos[i].y, 'animation','characters/dog/dog_stand/0000');
            dogs[i].animations.add('dogChaseLeft', Phaser.Animation.generateFrameNames('characters/dog/dog_walk_left/', 0, 3, '',4),10, true, false);
            dogs[i].animations.add('dogChaseRight', Phaser.Animation.generateFrameNames('characters/dog/dog_walk_right/', 0, 3, '',4),10, true, false);
            dogs[i].anchor.set(0.5);
            dogs[i].speed = game.rnd.between(50, 150);
            game.physics.enable(dogs[i], Phaser.Physics.ARCADE);
            dogs[i].body.allowRotation = false;
        }
        
        bone = game.add.sprite(383, 425, 'bone');
        game.physics.enable(bone, Phaser.Physics.ARCADE);
        bone.body.immovable = true;
        bone.body.collideWorldBounds = true;
        for(var i = 0; i < dogNum; i++) {
            game.world.swap(dogs[i],bone);
        }
        bone.kill();
        game.input.onDown.add(playerThrowBone, this);

        function callAlert() {
            alert("Click left mouse button to throw bone, survive 30 second to next stage.");
        }

        game.time.events.add(100, callAlert);
        
        game.time.events.add(Phaser.Timer.SECOND * 30, checkPlayerAlive, this);


    }

    else if(stage == 7){
        map = game.add.tilemap('stage6');
        map.addTilesetImage('map_spritesheet','tiles');
        floorLayer = map.createLayer('floor');
        wallLayer = map.createLayer('wall');
        map.setCollisionBetween(1, 50, true, 'wall');

        floorLayer.resizeWorld();

        player = game.add.sprite(120, 730, 'animation', 'characters/stealer/stealer_stand/stealer_stand_right.png');
        player.animations.add('left', Phaser.Animation.generateFrameNames('characters/stealer/stealer_walk_left/', 0, 7, '', 4), 10, true, false);
        player.animations.add('right', Phaser.Animation.generateFrameNames('characters/stealer/stealer_walk_right/', 0, 7, '', 4), 10, true, false);
        game.physics.enable(player, Phaser.Physics.ARCADE);
        player.anchor.setTo(0.5, 0.5);
        game.camera.follow(player);
        player.body.setSize(40, 61, 2, 1);
        player.health = hp;

        switch (hp){
            case 3:
                console.log("health bar loaded3");
                heart1 = game.add.sprite(10, 10, 'heart');
                heart2 = game.add.sprite(40, 10, 'heart');
                heart3 = game.add.sprite(70, 10, 'heart');
                heart1.fixedToCamera = true;
                heart2.fixedToCamera = true;
                heart3.fixedToCamera = true;
                break;
            case 2:
                console.log("health bar loaded2");
                heart1 = game.add.sprite(10, 10, 'heart');
                heart2 = game.add.sprite(40, 10, 'heart');
                heart1.fixedToCamera = true;
                heart2.fixedToCamera = true;
                break;
            case 1:
                console.log("health bar loaded1");
                heart1 = game.add.sprite(10, 10, 'heart');
                heart1.fixedToCamera = true;
                break;
        }

        finalGem = game.add.sprite(125, 120, 'rose','0000');
        finalGem.animations.add('shine', Phaser.Animation.generateFrameNames('', 0, 5, '', 4), 10, true, false);
        finalGem.animations.play('shine');
        finalGem.anchor.setTo(0.5, 0.5);

        game.physics.enable(finalGem, Phaser.Physics.ARCADE);
    }
}


var creationMutex = false;

function update() {
    if (creation==false) {
        create();
        creation = true;
        creationMutex = false;
    }

    if(stage!=0) {

        if(heart3!=null) {

            if (hp == 2) {
                heart3.kill();
            }
            if ((hp == 1) && (heart2 !== null)) {
                heart2.kill();
            }
        }
        //  set event when overlap or set which two object cannot pass through each other
        game.physics.arcade.collide(player, wallLayer);
        game.physics.arcade.collide(guard, wallLayer);
        game.physics.arcade.collide(guard2, wallLayer);
        game.physics.arcade.overlap(player, lasers, die);
        game.physics.arcade.overlap(player, guard, die);
        game.physics.arcade.overlap(player, guard2, die);
        game.physics.arcade.collide(player, tp, nextStage);

        //  allow user keyboard input controll
        playerControll();

        if (stage == 2) {
            if (guard != null) {
                guardPatrol();
                if(guard.body.velocity.x < 0)
                    guard.animations.play('left',10,false);
                else if (guard.body.velocity.x > 0)
                    guard.animations.play('right',10,false);
                else 
                    guard.animations.stop();
            }
        }


        else if (stage == 3) {
            if (guard != null) {
                guardLineOfSight();
                game.physics.arcade.overlap(player, swt,s2Gate);
                game.physics.arcade.collide(guard, gate1);
                game.physics.arcade.collide(player, gate1);
                game.physics.arcade.collide(player, gate2);
                game.physics.arcade.collide(guard, gate2);
                if (guard_status == 'patrol') {
                    guardPatrol();
                }
                else if (guard_status == 'chase') {
                    guardChase(player);
                }
            }
            if (guard != null) {
                if(guard.body.velocity.x < 0)
                    guard.animations.play('left',10,false);
                else if (guard.body.velocity.x > 0)
                    guard.animations.play('right',10,false);
                else 
                    guard.animations.stop();
            }
            if (guard2 != null) {
                guard2LineOfSight();
                game.physics.arcade.collide(guard2, gate1);
                game.physics.arcade.collide(guard2, gate2);
                if (guard2_status == 'patrol') {
                    guard2Patrol();
                }
                else if (guard2_status == 'chase') {
                    guard2Chase(player);
                }
            }
            if (guard2 != null) {
                if(guard2.body.velocity.x < 0)
                    guard2.animations.play('left',10,false);
                else if (guard2.body.velocity.x > 0)
                    guard2.animations.play('right',10,false);
                else
                    guard2.animations.stop();
            }
        }
        
        else if (stage == 4) {
            game.physics.arcade.overlap(player, swt, deleteWall);
            game.physics.arcade.collide(player, gate1);
            game.physics.arcade.collide(player, gate2);
            game.physics.arcade.overlap(player, gem, getGem);
        }

        else if (stage == 5) {
            game.physics.arcade.overlap(player, keyman, dropKey);
            game.physics.arcade.collide(keyman, wallLayer);
            if(keyman!=null) {
                keymanEvade();
            }
            game.physics.arcade.overlap(player, key, nextStage);
        }
        
        else if (stage == 6) {
            game.physics.arcade.collide(dogs, wallLayer);
            game.physics.arcade.overlap(player, dogs, die);
            game.physics.arcade.overlap(dogs, bone, dogEatBone);
            game.physics.arcade.collide(wallLayer, bone);
            dogFlockUpdate();
            for (var i = 0; i < dogNum; i++) {
                if (dogs[i].body.velocity.x < 0)
                    dogs[i].animations.play('dogChaseLeft', 10, false);
                else if (dogs[i].body.velocity.x > 0)
                    dogs[i].animations.play('dogChaseRight', 10, false);
                else
                    dogs[i].animations.stop();
            }
        }
        
        else if(stage == 7){
            game.physics.arcade.overlap(player, finalGem, GG);
        }
    }


        
}

var stageText
function render() {
    game.debug.text("You are in stage "+stage,120,20);
    /*if(stage==1) {
        game.debug.spriteBounds(player);
        game.debug.spriteBounds(laser1);
        game.debug.spriteBounds(laser2);
        game.debug.spriteBounds(laser3);
        game.debug.spriteBounds(laser4);
    }*/
}
function countDown() {
    game.time.events.add(Phaser.Timer.SECOND * 4, fadePicture, this);
}

function dropKey(){
    keyman.kill();
    key = game.add.sprite(keyman.x,keyman.y,'key');
    game.physics.enable(key, Phaser.Physics.ARCADE);
    key.body.immovable = true;
    key.body.collideWorldBounds = true;
}

function createLaser(laser) {
    laser.revive();
    laser.animations.play('spark',false);
    game.time.events.add(2000, this.deleteLaser, this, laser);
}

function deleteLaser(laser){
    laser.kill();
    game.time.events.add(2000, this.createLaser, this, laser);
}


var playerIsLeftDirection=false;
var guardIsLeftDirection=false;
var guard2IsLeftDirection=false;
var dogIsLeftDirection=false;

var moverSpeed = 150;
var guardSpeed = 150;
var restart;

function keymanEvade() {
    var d= keyman.position.distance(player);
    keymanSpeed = 500;
    var rotation = this.game.math.angleBetween(keyman.x, keyman.y, player.x, player.y);
    rotation += 3;
    
    // Calculate velocity vector based on rotation
    keyman.body.velocity.x = Math.cos(rotation) * keymanSpeed;
    keyman.body.velocity.y = Math.sin(rotation) * keymanSpeed;
    
    if(keyman.body.velocity.x < 0)
        keyman.animations.play('kmleft',10,false);
    else if (keyman.body.velocity.x > 0)
        keyman.animations.play('kmright',10,false);
    else 
        keyman.animations.stop();
}

function guardChase(target) {
    var d = guard.position.distance(target);
    guardSpeed = 200;
    if (d > 10){
        var rotation = this.game.math.angleBetween(guard.x, guard.y, target.x, target.y);
        
        // Calculate velocity vector based on rotation
        guard.body.velocity.x = Math.cos(rotation) * guardSpeed;
        guard.body.velocity.y = Math.sin(rotation) * guardSpeed;
    }
    else {
        guard.body.velocity.setTo(0, 0);
    }
}

function guardPatrol() {
    var nextwp = waypoints[index];
    var d = guard.position.distance(nextwp);
    guardSpeed = 150;
    if (d > 10){
        var rotation = this.game.math.angleBetween(guard.x, guard.y, nextwp.x, nextwp.y);
        
        // Calculate velocity vector based on rotation
        guard.body.velocity.x = Math.cos(rotation) * guardSpeed;
        guard.body.velocity.y = Math.sin(rotation) * guardSpeed;
    }
    else {
        guard.body.velocity.setTo(0, 0);
        if(index == 3) {
            index = 0;
        }
        else {
            index++;
        }
    }
}


var ray;
function guardLineOfSight() {
    ray = new Phaser.Line(guard.x, guard.y, player.x, player.y);
    ray.debug = true;
    var tileHits = this.wallLayer.getRayCastTiles(ray, 4, true, false);
    var distanceToPlayer = guard.position.distance(player);
    if (tileHits.length > 0) {
        guard_status = 'patrol';
    }
    else {
        guard_status = 'chase';
    }
}

function guard2Chase(target) {
    var d = guard2.position.distance(target);
    guard2Speed = 200;
    if (d > 10){
        var rotation = this.game.math.angleBetween(guard2.x, guard2.y, target.x, target.y);

        // Calculate velocity vector based on rotation
        guard2.body.velocity.x = Math.cos(rotation) * guard2Speed;
        guard2.body.velocity.y = Math.sin(rotation) * guard2Speed;
    }
    else {
        guard2.body.velocity.setTo(0, 0);
    }
}

function guard2Patrol() {
    var nextwp = waypoints[index];
    var d = guard2.position.distance(nextwp);
    guard2Speed = 150;
    if (d > 10){
        var rotation = this.game.math.angleBetween(guard2.x, guard2.y, nextwp.x, nextwp.y);

        // Calculate velocity vector based on rotation
        guard2.body.velocity.x = Math.cos(rotation) * guard2Speed;
        guard2.body.velocity.y = Math.sin(rotation) * guard2Speed;
    }
    else {
        guard2.body.velocity.setTo(0, 0);
        if(index == 3) {
            index = 0;
        }
        else {
            index++;
        }
    }
}


var ray2;
function guard2LineOfSight() {
    ray2 = new Phaser.Line(guard2.x, guard2.y, player.x, player.y);
    ray2.debug = true;
    var tileHits = this.wallLayer.getRayCastTiles(ray2, 4, true, false);
    var distanceToPlayer = guard2.position.distance(player);
    if (tileHits.length > 0) {
        guard2_status = 'patrol';
    }
    else {
        guard2_status = 'chase';
    }
}

function playerThrowBone() {
    if(stage == 6){
        if(!bone.alive) {
            bone.reset(game.input.x, game.input.y);
        }
    }
}

function dogChase(dog, target) {
    /*
    var d = dog.position.distance(target);
    guardSpeed = 150;
    if (d > 10){
        var rotation = this.game.math.angleBetween(dog.x, dog.y, target.x, target.y);
        
        // Calculate velocity vector based on rotation
        dog.body.velocity.x = Math.cos(rotation) * guardSpeed;
        dog.body.velocity.y = Math.sin(rotation) * guardSpeed;
    }
    else {
        dog.body.velocity.setTo(0, 0);
    }
    */
    var targetVelocity;
    var dogSpeed = 150;
    var dogSpeedSq = dogSpeed * dogSpeed
    var dogSteer = 6;
    var dogSteerSq = dogSteer * dogSteer
    targetVelocity = Phaser.Point.subtract(target.position, dog.position);
    targetVelocity.normalize();
    targetVelocity.multiply(dogSpeed, dogSpeed);
    var vecSteer = Phaser.Point.subtract(targetVelocity, dog.body.velocity);
    if (vecSteer.getMagnitudeSq() > dogSpeedSq){
        vecSteer.setMagnitude(dogSteer);
    }
    dog.body.velocity.add(vecSteer.x, vecSteer.y);
    if (dog.body.velocity.getMagnitudeSq() > dogSpeedSq){
        dog.body.velocity.setMagnitude(dogSpeed);
    }
}

var boneEaten = false;
function dogEatBone() {
    if(!boneEaten) {
        game.time.events.add(Phaser.Timer.SECOND * 3, killBone, this);
        boneEaten = true;
    }
}

function killBone() {
    bone.kill();
    boneEaten = false;
}

var radius = 100;
function dogFlockUpdate() {
    for (var i = 0; i < dogNum; i++) {
        if(bone.alive) {
            var d = dogs[i].position.distance(bone.position);
            if(d > 5) {
                var p1 = flockAttraction(i);
                var p2 = flockRepulsion(i);
                var p3 = flockCohesion(i);
                var p4 = flockMoveTo(i);
                //apply velocities
                dogs[i].body.velocity.add(p1.x, p1.y);
                dogs[i].body.velocity.add(p2.x, p2.y);
                dogs[i].body.velocity.add(p3.x, p3.y);
                dogs[i].body.velocity.add(p4.x, p4.y);
                
                dogs[i].body.velocity.normalize();
                dogs[i].body.velocity.multiply(dogs[i].speed, dogs[i].speed);
            }
            else {
                dogs[i].body.velocity.setTo(0, 0);
            }
        }
        else {
            dogChase(dogs[i], player);
        }
    }
}

function flockAttraction(i) {
    var tmpArray = [];
    for (var j = 0; j < dogNum; j++) {
        if (j !== i && dogs[i].position.distance(dogs[j].position) < radius) {
            tmpArray.push(dogs[j].position);
        }
    }
    if (tmpArray.length > 0) {
        var averagePosition = Phaser.Point.centroid(tmpArray);
        return Phaser.Point.subtract(averagePosition, dogs[i].position).divide(100, 100);
    }
    else {
        var randomPosition = new Phaser.Point(game.rnd.between(0, game.width - 1), game.rnd.between(0, game.height - 1));
        return Phaser.Point.subtract(randomPosition, dogs[i].position).divide(100, 100);
    }
}

function flockRepulsion(i) {
    var repulsion = new Phaser.Point(0, 0);
    for (var j=0; j < dogNum; j++) {
        if (j !== i && dogs[i].position.distance(dogs[j].position) < 30) {
            var sub = Phaser.Point.subtract(dogs[j].position, dogs[i].position);
            repulsion.subtract(sub.x, sub.y);
        }
    }
    return repulsion;
}

function flockCohesion(i) {
    var tmpArray = [];
    for (var j = 0; j < dogNum; j++) {
        if (j !== i && dogs[i].position.distance(dogs[j].position) < radius) {
            tmpArray.push(dogs[j].body.velocity);
        }
    }
    if (tmpArray.length > 0) {
        var averageVelocity = Phaser.Point.centroid(tmpArray);
        return Phaser.Point.subtract(averageVelocity, dogs[i].body.velocity).divide(180, 180);
    }
    else {
        return new Phaser.Point(0, 0);
    }
}

function flockMoveTo(i) {
//  target = new Phaser.Point(game.input.x, game.input.y);
    target = new Phaser.Point(bone.x, bone.y);
    target.subtract(dogs[i].x, dogs[i].y).divide(40, 40);
    return target;
}

var playerIsLeftDirection=false;
function playerControll(){

    player.body.velocity.x = 0;
    player.body.velocity.y = 0;

    if(cursors.up.isDown&&cursors.left.isDown){
        player.body.velocity.x = -moverSpeed;
        player.body.velocity.y = -moverSpeed;
        playerIsLeftDirection = true;
        player.animations.play('left',false);

    }else if(cursors.down.isDown&&cursors.left.isDown){
        player.body.velocity.x = -moverSpeed;
        player.body.velocity.y = moverSpeed;
        playerIsLeftDirection = true;
        player.animations.play('left',false);
    }else if(cursors.up.isDown&&cursors.right.isDown){
        player.body.velocity.x = moverSpeed;
        player.body.velocity.y = -moverSpeed;
        playerIsLeftDirection = false;
        player.animations.play('right',false);
    }else if(cursors.down.isDown&&cursors.right.isDown){
        player.body.velocity.x = moverSpeed;
        player.body.velocity.y = moverSpeed;
        playerIsLeftDirection = false;
        player.animations.play('right',false);
    }else if(cursors.up.isDown){
        player.body.velocity.y = -moverSpeed;
        if(playerIsLeftDirection)
            player.animations.play('left',false);
        else
            player.animations.play('right',false);

    }
    else if(cursors.down.isDown){
        player.body.velocity.y = moverSpeed;
        if(playerIsLeftDirection)
            player.animations.play('left',false);
        else
            player.animations.play('right',false);

    }
    else if (cursors.left.isDown)
    {
        player.body.velocity.x = -moverSpeed;
        playerIsLeftDirection = true;
        player.animations.play('left',false);

    }
    else if (cursors.right.isDown)
    {
        player.body.velocity.x = moverSpeed;
        playerIsLeftDirection = false;
        player.animations.play('right',false);

    }
    else {
        player.animations.stop();
    }
}

function deleteWall() {
    gate1.kill();
}

function s2Gate() {
    gate1.kill();
    gate2.kill();
}

function heal(){
    hp++;
    switch (hp){
        case 3:
            console.log("health bar loaded3");
            heart1 = game.add.sprite(10, 10, 'heart');
            heart2 = game.add.sprite(40, 10, 'heart');
            heart3 = game.add.sprite(70, 10, 'heart');
            heart1.fixedToCamera = true;
            heart2.fixedToCamera = true;
            heart3.fixedToCamera = true;
            break;
        case 2:
            console.log("health bar loaded2");
            heart1 = game.add.sprite(10, 10, 'heart');
            heart2 = game.add.sprite(40, 10, 'heart');
            heart1.fixedToCamera = true;
            heart2.fixedToCamera = true;
            break;
        case 1:
            console.log("health bar loaded1");
            heart1 = game.add.sprite(10, 10, 'heart');
            heart1.fixedToCamera = true;
            break;
    }
}

function getGem() {
    var ranNum;
    gem.kill();

    ranNum = Math.random();
    if(ranNum>0.5) {
        alert("GEM Obtained!");
        if(hp==3) {
            alert("Bonus Movement Speed!");
            moverSpeed += 50;
        }
        if(hp==2){
            ranNum = Math.random();
            if(ranNum>0.5) {
                alert("Heal 1HP!");
                heal();
            }
            else{
                alert("Bonus Movement Speed!");
                moverSpeed += 50;
            }
        }
        if(hp==1){
            alert("Heal 1HP!");
            heal();
        }
    }
    else {
        alert("Nothing special");
    }
    gate2.kill();
    gate1.revive();
}

function nextStage() {
    if(!creationMutex) {
        creationMutex = true;
        if(stage<7)
            stage++;
        creation = false;
    }
}

function checkPlayerAlive() {
    if(moverSpeed > 0) {
        nextStage();
    }
}

function reStart() {
    if(!creationMutex) {
        creationMutex = true;
        stage = 1;
        creation = false;
        moverSpeed = 150;
        guardSpeed = 150;
        hp = 3;
    }
}
function reStartat0() {
    if(!creationMutex) {
        creationMutex = true;
        stage = 0;
        creation = false;
        moverSpeed = 150;
        guardSpeed = 150;
        hp = 3;
    }
}


function GG() {
    alert('You Won!\nYou stole the Golden Rose!');
    reStartat0();
}

function back() {
    hp--;
    console.log("Current HP = "+hp);
    if(stage==1){
        alert(hp+' Life left');
        player.x = 60;
        player.y = 70;
    }
}

function die() {
    if(hp == 1){
        heart1.kill();
        moverSpeed = 0;
        guardSpeed = 0;
        alert("Game Over, You are dead!\n Press 'OK' to restart\nお前はもう死んでいる!");
        /*var stateText = game.add.text(80, 150, ' ', {
            font: '50px Arial',
            fill: '#fff',
            boundsAlignH: "center",
            boundsAlignV: "middle"
        });
        stateText.text = "Game Over\nPress '5' to restart";
        stateText.fixedToCamera = true;*/
        reStartat0();
    }
    else{
        back();
    }
}
