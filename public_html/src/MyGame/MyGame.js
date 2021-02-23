/*
 * File: MyGame.js 
 * This is the logic of our game. 
 */

/*jslint node: true, vars: true */
/*global gEngine, Scene, GameObjectset, TextureObject, Camera, vec2,
  FontRenderable, SpriteRenderable, DyePack, Hero, Minion, Brain,
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

    //this.mMsg = null;
    this.vCanvas = null;
    this.vMessages = null;
    this.vMsgBg = null;
    
    
    this.tv = null;
    this.vBackground = null;

    // the hero and the support objects
    this.mHero = null;
    this.mBrain = null;
    this.mPortal = null;
    this.mLMinion = null;
    this.mRMinion = null;
    this.mFocusObj = null;

    this.mChoice = 'D';
}
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
    this.mBrain = new Brain(this.kMinionSprite);
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
    this.tv = new Viewports(4, 6, c);
    
    // from spec 
    // vp[0] is width 15
    this.tv.setViewportWidth(0, 15);
    
    
    // BG
    this.vMsgBg = new Renderable(gEngine.DefaultResources.getConstColorShader());
    
   
    // Large background image
    var bgR = new SpriteRenderable(this.space);
    bgR.setElementPixelPositions(0, 1024, 0, 1024);
    bgR.getXform().setSize(250, 250);
    bgR.getXform().setPosition(0, 0);
    this.mBg = new GameObject(bgR);
};


MyGame.prototype.drawCamera = function (camera) {
    camera.setupViewProjection();
    this.mBg.draw(camera);
    this.mHero.draw(camera);
    this.mBrain.draw(camera);
    
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
    // draw viewports
    for (var i = 0; i < 4; i++) {
        var cam = this.tv.getCamera(i);
        if(cam !== null){
            this.drawCamera(cam);
        }else{
            this.tv.setupCamera(i);
        }
        this.tv.draw(i);
    }
};

// The Update function, updates the application state. Make sure to _NOT_ draw
// anything from this function!
MyGame.prototype.update = function () {
    // update cameras
    this.tv.update();
    this.mCamera.update(); 
    //**************************************************************************
    
    // update main camera message board
    var camPos = this.mCamera.getWCCenter();                                    // to make the board always at the bottom of the 
    this.vBackground.getXform().setPosition(camPos[0], camPos[1] - 82);         // camera, its position needs to update every frame
    this.vMessages.getXform().setPosition(camPos[0] - 50, camPos[1] - 80);      // the camera does
    //**************************************************************************
    
    // update mHero
    if(this.mCamera.isMouseInViewport()){                                       // only if the mouse is over the main camera
        var heroPos = this.mHero.getXform().getPosition();
        var a = heroPos[0] - this.mCamera.mouseWCX();
        var b = heroPos[1] - this.mCamera.mouseWCY();
        var heroMag = Math.sqrt(a*a + b*b);
        var vmsg = "Hero mag: " + heroMag.toFixed(2);

        if(this.tv.isViewportActive(0)){                                        // checks if the viewport is active
            this.tv.setViewportText(0, vmsg);                                   // if so, sets text to mag (hero, mouse)
        }

        if (heroMag > 6) {                                                      // 6 is arbitrary, it is the threshold to 
            this.mHero.rotateObjPointTo(vec2.fromValues(this.mCamera.mouseWCX(),// stop moving the hero
                                        this.mCamera.mouseWCY()), 0.1);
            this.mHero.setSpeed(0.1);                                           // speed is arbitrary
            GameObject.prototype.update.call(this.mHero);
        }

        var heroPos = this.mHero.getXform().getPosition();          
        this.tv.setViewportWC(0, heroPos);                                      // update viewport[0] to hero center
    }
    //**************************************************************************
    

    /* Legacy code
     * TODO
     * - go throguh and see if we can salvage anything
     */
    
    var zoomDelta = 0.05;
    //var msg = "L/R: Left or Right Minion; H: Dye; P: Portal]: ";
    var msg = "";
    
    this.mHero.update();     // for WASD movement
    
    this.mPortal.update(     // for arrow movement
        gEngine.Input.keys.Up,
        gEngine.Input.keys.Down,
        gEngine.Input.keys.Left,
        gEngine.Input.keys.Right
    );
    // Pan camera to object
    if (gEngine.Input.isKeyClicked(gEngine.Input.keys.L)) {
        this.mFocusObj = this.mLMinion;
        this.mChoice = 'L';
        this.mCamera.panTo(this.mLMinion.getXform().getXPos(), this.mLMinion.getXform().getYPos());
    }
    if (gEngine.Input.isKeyClicked(gEngine.Input.keys.R)) {
        this.mFocusObj = this.mRMinion;
        this.mChoice = 'R';
        this.mCamera.panTo(this.mRMinion.getXform().getXPos(), this.mRMinion.getXform().getYPos());
    }
    if (gEngine.Input.isKeyClicked(gEngine.Input.keys.P)) {
        this.mFocusObj = this.mPortal;
        this.mChoice = 'P';
    }
    if (gEngine.Input.isKeyClicked(gEngine.Input.keys.H)) {
        this.mFocusObj = this.mHero;
        this.mChoice = 'H';
    }

    // zoom
    if (gEngine.Input.isKeyClicked(gEngine.Input.keys.N)) {
        this.mCamera.zoomBy(1 - zoomDelta);
    }
    if (gEngine.Input.isKeyClicked(gEngine.Input.keys.M)) {
        this.mCamera.zoomBy(1 + zoomDelta);
    }
    if (gEngine.Input.isKeyClicked(gEngine.Input.keys.J)) {
        this.mCamera.zoomTowards(this.mFocusObj.getXform().getPosition(), 1 - zoomDelta);
    }
    if (gEngine.Input.isKeyClicked(gEngine.Input.keys.K)) {
        this.mCamera.zoomTowards(this.mFocusObj.getXform().getPosition(), 1 + zoomDelta);
    }

    // interaction with the WC bound
    this.mCamera.clampAtBoundary(this.mBrain.getXform(), 0.9);
    this.mCamera.clampAtBoundary(this.mPortal.getXform(), 0.8);
    this.mCamera.panWith(this.mHero.getXform(), 0.9);

    if (gEngine.Input.isKeyClicked(gEngine.Input.keys.Q)) {
        this.mCamera.shake(-2, -2, 20, 30);
    }
    
    
    
    msg = "";
    // testing the mouse input
    if (gEngine.Input.isButtonPressed(gEngine.Input.mouseButton.Left)) {
        msg += "[L Down]";
        if (this.mCamera.isMouseInViewport()) {
            this.mPortal.getXform().setXPos(this.mCamera.mouseWCX());
            this.mPortal.getXform().setYPos(this.mCamera.mouseWCY());
        }
    }

    if (gEngine.Input.isButtonPressed(gEngine.Input.mouseButton.Middle)) {
        //if (this.mHeroCam.isMouseInViewport()) {
            //this.mHero.getXform().setXPos(this.mHeroCam.mouseWCX());
            //this.mHero.getXform().setYPos(this.mHeroCam.mouseWCY());
        //as}
    }
    if (gEngine.Input.isButtonClicked(gEngine.Input.mouseButton.Right)) {
        this.mPortal.setVisibility(false);
    }

    if (gEngine.Input.isButtonClicked(gEngine.Input.mouseButton.Middle)) {
        this.mPortal.setVisibility(true);
    }

    msg += " X=" + gEngine.Input.getMousePosX() + " Y=" + gEngine.Input.getMousePosY();
    
    // bottom local
    //this.vMessages[4].setText(msg);
};
