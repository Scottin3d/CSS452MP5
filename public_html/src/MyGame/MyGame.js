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
    
    this.testCam = null;
    
    // viewports
    this.viewports = null;
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
    
    this.vBackground = new Renderable(gEngine.DefaultResources.getConstColorShader());
    c = hexToRgb("14213d");
    this.vBackground.setColor([c.r, c.g, c.b, c.a]);
    this.vBackground.getXform().setPosition(10, 10);
    this.vBackground.getXform().setSize(10, 10);

    // main camera
    this.mCamera = new Camera(
        vec2.fromValues(0, 0),                                                  // position of the camera
        250,                                                                    // width of camera
        [0, 0, 940, 640]                                                        // viewport (orgX, orgY, width, height)
    );
    c = hexToRgb("14213d");
    this.mCamera.setBackgroundColor([c.r, c.g, c.b, c.a]);
            
    
    this.viewports = new Array(4);
    this.vCanvas = new Array(5);
    this.vMessages = new Array(5);  
    this.vMsgBg = new Array(5);
    // vars
    var viewportPadding = 10;
    var vSpawnX = 0;
    for(var i = 0; i < 4; i++){
        // view ports
        /* TODO -- Scott
         * - add background renderable for boarded
         * viewports[0] - Hero centered
         * viewports[1] -
         * viewports[2] -
         * viewports[3] - 
         */
        var viewportWidth = ((940 - (viewportPadding * (4 + 1))) / 4);
        vSpawnX += viewportPadding;
        this.viewports[i] = new Camera(
            vec2.fromValues(0, 0),                                              // position of the viewport
            50,                                                                 // width of viewport
            [vSpawnX, 840 - viewportWidth, viewportWidth, viewportWidth]        // viewport (orgX, orgY, width, height)
         );
         // viewport canvas (camera on top)
         this.vCanvas[i] = new Camera(
            vec2.fromValues(0, 0),                                                  // position of the camera
            50,                                                                   // width of camera
            [vSpawnX, 840 - viewportWidth, viewportWidth, 30]
        );
        this.vCanvas[i].setBackgroundColor([c.r, c.g, c.b, c.a]);
         // view port message
         /* This is extra
          * TODO
          */
         this.vMessages[i] = new FontRenderable("Test Msg " + i);
         c = hexToRgb("14213d");
         this.vMessages[i].setColor([c.r, c.g, c.b, c.a]);
         this.vMessages[i].getXform().setPosition(-10,1);
         this.vMessages[i].setTextHeight(5);
         
         /* viewport message background
          * 
          */
        this.vMsgBg[i] = new Renderable(gEngine.DefaultResources.getConstColorShader());
        c = hexToRgb("e5e5e5");
        this.vMsgBg[i].setColor([c.r, c.g, c.b, c.a]);
        this.vMsgBg[i].getXform().setPosition(-10,-22);
        this.vMsgBg[i].getXform().setSize(viewportWidth, 6);
       
        // increment viewport spacing
        vSpawnX += viewportWidth;
    }
    // from spec 
    this.viewports[0].setWCWidth(15);
    
    // mouse pos/ main window canvas
    this.vCanvas[4] = new Camera(
            vec2.fromValues(0, 0),                                                  // position of the camera
            250,                                                                   // width of camera
            [0, 0, 940, 30]
        );
    c = hexToRgb("e5e5e5");
    this.vCanvas[4].setBackgroundColor([c.r, c.g, c.b, c.a]);
    // in message and background [4]
    this.vMessages[4] = new FontRenderable("Mosue Position");
    c = hexToRgb("14213d");
    this.vMessages[4].setColor([c.r, c.g, c.b, c.a]);
    this.vMessages[4].getXform().setPosition(-25,0);
    this.vMessages[4].setTextHeight(5);
    // BG
    this.vMsgBg[4] = new Renderable(gEngine.DefaultResources.getConstColorShader());
    
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
    this.mPortal.draw(camera);
    this.mLMinion.draw(camera);
    this.mRMinion.draw(camera);
};
// This is the draw function, make sure to setup proper drawing environment, and more
// importantly, make sure to _NOT_ change any state.
MyGame.prototype.draw = function () {
    //**Canvas / UI elements must be drawn last**
    var c = hexToRgb("14213d");
    gEngine.Core.clearCanvas([c.r, c.g, c.b, c.a]);
    
    this.drawCamera(this.mCamera);
    //this.mMsg.draw(this.mCamera);       
    // only draw status in the main camera
    
    // viewports
    for(var i = 0; i < this.viewports.length; i++){
        this.drawCamera(this.viewports[i]);
    }
    
    //**Canvas / UI elements must be drawn last**
    for(var i = 0; i < this.vCanvas.length; i++){
        this.vCanvas[i].setupViewProjection();
        this.vMsgBg[i].draw(this.vCanvas[i]);
        this.vMessages[i].draw(this.vCanvas[i]);
    }
};

// The Update function, updates the application state. Make sure to _NOT_ draw
// anything from this function!
MyGame.prototype.update = function () {
    var zoomDelta = 0.05;
    var msg = "L/R: Left or Right Minion; H: Dye; P: Portal]: ";

    
    this.mCamera.update(); 
    for(var i = 0; i < this.viewports.length; i++){
        this.viewports[i].update();
    }
    
    this.mLMinion.update();  // for sprite animation
    this.mRMinion.update();

    this.mHero.update();     // for WASD movement
    
    this.mPortal.update(     // for arrow movement
        gEngine.Input.keys.Up,
        gEngine.Input.keys.Down,
        gEngine.Input.keys.Left,
        gEngine.Input.keys.Right
    );
    // Brain chasing the hero
    var h = [];
    if (!this.mHero.pixelTouches(this.mBrain, h)) {
        this.mBrain.rotateObjPointTo(this.mHero.getXform().getPosition(), 0.01);
        GameObject.prototype.update.call(this.mBrain);
    }

    /* Legacy code
     * TODO
     * - go throguh and see if we can salvage anything
     */
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

    // set the hero and brain cams    
    //this.mHeroCam.panTo(this.mHero.getXform().getXPos(), this.mHero.getXform().getYPos());
    // set v[0] to hero
    //this.viewports[0].panTo(this.mHero.getXform().getXPos(), this.mHero.getXform().getYPos()); // viewport (orgX, orgY, width, height)
    //var vp = this.viewports[0].
    var heroPos = this.mHero.getXform().getPosition();
    this.viewports[0].setWCCenter(heroPos[0], heroPos[1]);

    msg = "";
    // testing the mouse input
    if (gEngine.Input.isButtonPressed(gEngine.Input.mouseButton.Left)) {
        msg += "[L Down]";
        if (this.mCamera.isMouseInViewport()) {
            this.mPortal.getXform().setXPos(this.mCamera.mouseWCX());
            this.mPortal.getXform().setYPos(this.mCamera.mouseWCY());
        }
        
        if(this.vCanvas[1].isMouseInViewport()){
            msg += "    Button Click!         ";
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
    this.vMessages[4].setText(msg);
    
    
};
