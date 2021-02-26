/*
 * File: MyGame.js 
 * This is the logic of our game. 
 */

/*jslint node: true, vars: true */
/*global gEngine, Scene, GameObjectset, TextureObject, Camera, vec2,
  FontRenderable, SpriteRenderable, DyePack, Hero, Minion, Brain, PatrolSet,
  GameObject */
/* find out more about jslint: http://www.jslint.com/help.html */

"use strict";  // Operate in Strict mode such that variables must be declared before used!

function MyGame() {
    this.kMinionSprite = "assets/minion_sprite.png";
    this.kMinionPortal = "assets/minion_portal.png";
    this.kBg = "assets/bg.png";
    this.space = "assets/space.png";

    // The camera to view the scene
    this.mCamera = null;
    this.mBg = null;

    this.mViewports = null;
    // main camera message board
    this.msgBrdSpd = 0.25;
    this.msgOffset = 0;
    this.lastMsgUpdate = 0;
    this.vMessages = null;
    this.vBackground = null;
    
    this.testPack = null;
    this.dyePacksInScene = null;

    // the hero and the support objects
    this.mHero = null;
    this.mPatrolSet = null;
    this.mDyePackSet = null;
    this.mPortal = null;
    this.mLMinion = null;
    this.mRMinion = null;
    this.mFocusObj = null;

    this.mChoice = 'D';
};
gEngine.Core.inheritPrototype(MyGame, Scene);

MyGame.prototype.loadScene = function () {
    gEngine.Textures.loadTexture(this.kMinionSprite);
    gEngine.Textures.loadTexture(this.kMinionPortal);
    gEngine.Textures.loadTexture(this.kBg);
    gEngine.Textures.loadTexture(this.space);
};

MyGame.prototype.unloadScene = function () {
    gEngine.Textures.unloadTexture(this.kMinionSprite);
    gEngine.Textures.unloadTexture(this.kMinionPortal);
    gEngine.Textures.unloadTexture(this.kBg);
    gEngine.Textures.unloadTexture(this.space);
};

MyGame.prototype.initialize = function () { 
    
    // color variable
    // I wrote the hexToRgb utility to help with better colors -- Scott
    var c; 
    // objects
    this.mPatrolSet = new PatrolSet(this.kMinionSprite);
    this.mDyePackSet = new DyePackSet(this.kMinionSprite);
    this.mHero = new Hero(this.kMinionSprite);
    this.mPortal = new TextureObject(this.kMinionPortal, 50, 30, 10, 10);
    
    this.mLMinion = new Minion(this.kMinionSprite, 30, 30);
    this.mRMinion = new Minion(this.kMinionSprite, 70, 30);
    this.mFocusObj = this.mHero;
    
    

    // main camera
    this.mCamera = new Camera(
        vec2.fromValues(0, 0),                                                  // position of the camera
        250,                                                                    // width of camera
        [0, 0, 940, 640]                                                        // viewport (orgX, orgY, width, height)
    );
    c = hexToRgb("14213d");
    this.mCamera.setBackgroundColor([c.r, c.g, c.b, c.a]);
       
    // main camera message board
    this.vBackground = new Renderable(gEngine.DefaultResources.getConstColorShader());
    c = hexToRgb("e5e5e5");
    this.vBackground.setColor([c.r, c.g, c.b, c.a]);
    //this.vBackground.getXform().setPosition(0, this.mCamera.getWCCenter() - ( this.mCamera.getWCHeight() / 2));
    this.vBackground.getXform().setSize(this.mCamera.getWCWidth(), 10);
    // main camera message
    this.vMessages = new FontRenderable("Mouse Position");
    c = hexToRgb("14213d");
    this.vMessages.setColor([c.r, c.g, c.b, c.a]);
    //this.vMessages.getXform().setPosition(-25,0);
    this.vMessages.setTextHeight(5);
    // create viewports
    // number, width, bg color
    this.mViewports = new Viewports(4, 6, c);
    
    // from spec 
    // vp[0] is width 15
    this.mViewports.setViewportWidth(0, 15);
    this.mViewports.toggleViewport(0, true, this.mHero);
    // Large background image
    var bgR = new SpriteRenderable(this.space);
    bgR.setElementPixelPositions(0, 1024, 0, 1024);
    bgR.getXform().setSize(250, 250);
    bgR.getXform().setPosition(0, 0);
    this.mBg = new GameObject(bgR);
    
    // dye pack reference
    this.dyePacksInScene = [];
};




MyGame.prototype.drawCamera = function (camera) {
    camera.setupViewProjection();
    this.mBg.draw(camera);
    this.mHero.draw(camera);
    
    if(this.mDyePackSet.size() > 0){
        this.mDyePackSet.draw(camera);
    }
    this.mPatrolSet.draw(camera);
};

// This is the draw function, make sure to setup proper drawing environment, and more
// importantly, make sure to _NOT_ change any state.
MyGame.prototype.draw = function () {
    //**Canvas / UI elements must be drawn last**
    var c = hexToRgb("ffffff");
    gEngine.Core.clearCanvas([c.r, c.g, c.b, c.a]);
    // draw main camera
    this.drawCamera(this.mCamera);
    this.vBackground.draw(this.mCamera);
    this.vMessages.draw(this.mCamera);
    //**************************************************************************
    
    
    // draw viewports
    for (var i = 0; i < 4; i++) {
        var cam = this.mViewports.getCamera(i);
        if(cam !== null){
            this.drawCamera(cam);
        }else{
            this.mViewports.setupCamera(i);
        }
        this.mViewports.draw(i);
    }
    //**************************************************************************
};

// The Update function, updates the application state. Make sure to _NOT_ draw
// anything from this function!
MyGame.prototype.update = function () {
    // update cameras
    this.mViewports.update();
    this.mCamera.update(); 
    //**************************************************************************
    
    // update dye packs
    for (var i = 0; i < this.mDyePackSet.size(); i++) {
        var dyePack = this.mDyePackSet.getObjectAt(i);
        if(dyePack.getActive()) {
            var checkHit = this.mPatrolSet.checkCollision(dyePack);
            if(dyePack.possibleHit(checkHit)){
                var i = this.mViewports.getNextAvailableViewport();
                if(i > 0){
                    this.mViewports.toggleViewport(i, true, dyePack);
                }
            }
        }
        dyePack.update();
    }
    //**************************************************************************
    
    // variables
    var heroPos = this.mHero.getXform().getPosition();
    var camPos = this.mCamera.getWCCenter();
    var camSize = [this.mCamera.getWCWidth(), this.mCamera.getWCHeight()];
    var msgBrd = "Viewport Size X: " + camSize[0].toFixed(2);
    msgBrd += " Y: " + camSize[1].toFixed(2);
    msgBrd += "   Mouse Pos X:" + this.mCamera.mouseWCX().toFixed(2) + " Y:" + this.mCamera.mouseWCY().toFixed(2);
    msgBrd += "   Hero Pos X:" + heroPos[0].toFixed(2) + " Y: " + heroPos[1].toFixed(2);
    //**************************************************************************
    
    // update mHero
    if(this.mCamera.isMouseInViewport()){                                       // only if the mouse is over the main camera
        var a = heroPos[0] - this.mCamera.mouseWCX();
        var b = heroPos[1] - this.mCamera.mouseWCY();
        var heroMag = Math.sqrt(a*a + b*b);
        var vmsg = "Hero mag: " + heroMag.toFixed(2);

        if(this.mViewports.isViewportActive(0)){                                // checks if the viewport is active
            this.mViewports.setViewportText(0, vmsg);                           // if so, sets text to mag (hero, mouse)
        }
        
        
        if (heroMag > 1) {  
            this.mHero.rotateObjPointTo(vec2.fromValues(this.mCamera.mouseWCX(),  
            this.mCamera.mouseWCY()), 0.05);
            
            this.mHero.updatePostion([this.mCamera.mouseWCX(),this.mCamera.mouseWCY()]);
            GameObject.prototype.update.call(this.mHero);
                     
            this.mViewports.setViewportWC(0, heroPos);                          // update viewport[0] to hero center
            
            // bound hero to main camera
            this.mCamera.clampAtBoundary(this.mHero.getXform(), 0.9);
        }                              
    }
    //**************************************************************************
    
    // user input
    // some of these can be moved to local class
    if (gEngine.Input.isKeyClicked(gEngine.Input.keys.Space)) {
        this.mDyePackSet.createDyePack(heroPos);
    }
    // message board
    if (gEngine.Input.isKeyClicked(gEngine.Input.keys.Left)) {
        this.msgBrdSpd = (this.msgBrdSpd <= 2) ? this.msgBrdSpd += 0.25 : 2;
    }
    if (gEngine.Input.isKeyClicked(gEngine.Input.keys.Right)) {
        this.msgBrdSpd = (this.msgBrdSpd > 0.25) ? this.msgBrdSpd -= 0.25 : 0.25;
    }
    // patrol set
    if (gEngine.Input.isKeyClicked(gEngine.Input.keys.P)) {
        this.mPatrolSet.setautoSpawn();
    }
    if (gEngine.Input.isKeyClicked(gEngine.Input.keys.C)) {
        this.mPatrolSet.spawnNew();
    }
    if (gEngine.Input.isKeyClicked(gEngine.Input.keys.B)) {
        this.mPatrolSet.toggleBound();
    }
    if (gEngine.Input.isKeyClicked(gEngine.Input.keys.J)) {
        this.mPatrolSet.simulateHit(); 
    }
    if (gEngine.Input.isKeyPressed(gEngine.Input.keys.D)) {
        this.mDyePackSet.slowDown();
    }
    if (gEngine.Input.isKeyClicked(gEngine.Input.keys.S)) {
        this.mDyePackSet.hitAllEvent();
    }
    // Pan camera to world center
    if (gEngine.Input.isKeyClicked(gEngine.Input.keys.L)) {
        this.mCamera.panTo( this.mCamera.getWCCenter()[0], this.mCamera.getWCCenter()[l]);
    }
    //**************************************************************************
    
    // update objects
    this.mPatrolSet.update();
    this.mDyePackSet.update(this.mCamera);
    this.mHero.update(this.mPatrolSet);                                         // will look into keeping this clean
    //**************************************************************************
    
    // update counters
    document.getElementById("camCount").innerHTML = this.mViewports.getActiveCount();
    msgBrd += "    Dye Packs In Scene: " + this.mDyePackSet.size();
    document.getElementById("dyeCount").innerHTML = this.mDyePackSet.size();
    msgBrd += "    Patrol Units Spawned: " + this.mPatrolSet.patrolSize();
    document.getElementById("patrolCount").innerHTML = this.mPatrolSet.patrolSize();
    msgBrd += "    Auto Spawn Patrol Units: " + this.mPatrolSet.isAutoSpawnOn();
    var msgBrdLng = this.vMessages.getXform().getWidth() / 2;
    // update main camera message board
    this.vBackground.getXform().setPosition(camPos[0], camPos[1] - 82);         // to make the board always at the bottom of the 
    this.msgOffset+= this.msgBrdSpd;
    this.msgOffset = (this.msgOffset < (msgBrdLng * 2)) ? this.msgOffset : -(msgBrdLng / 2);
    this.vMessages.getXform().setPosition(camPos[0] - this.msgOffset, 
                                          camPos[1] - 80);                      // camera, its position needs to update every frame
    // update text
    if(Date.now() - this.lastMsgUpdate >= 250){
        this.lastMsgUpdate = Date.now();
        this.vMessages.setText(msgBrd);
    }
    //**************************************************************************
};   
