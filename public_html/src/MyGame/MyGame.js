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

    this.mMsg = null;
    this.vCanvas = null;
    this.cButton = null;
    this.vMsgBg = null;
    
    this.UI = null;

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

    this.UI = new UIcanvas();
    
    // main camera
    this.mCamera = new Camera(
        vec2.fromValues(0, 0),                                                  // position of the camera
        250,                                                                    // width of camera
        [0, 0, 940, 640]                                                        // viewport (orgX, orgY, width, height)
    );
    c = hexToRgb("14213d");
    this.mCamera.setBackgroundColor([c.r, c.g, c.b, c.a]);
    
    this.vCanvas = new Camera(
        vec2.fromValues(0, 0),                                                  // position of the camera
        250,                                                                    // width of camera
        [0, 0, 940, 640]                                                        // viewport (orgX, orgY, width, height)
    );
    c = hexToRgb("14213d");
    this.vCanvas.setBackgroundColor([c.r, c.g, c.b, 0]);
   
    this.cButton = new Renderable(gEngine.DefaultResources.getConstColorShader());
    this.cButton.setColor([1,1,1,1]);
    this.cButton.getXform().setPosition(20, 60);
    this.cButton.getXform().setSize(50, 20);
    
    this.UI.AddElement(this.cButton);
    //this.UI.AddButton();
    
    // Large background image
    var bgR = new SpriteRenderable(this.space);
    bgR.setElementPixelPositions(0, 1024, 0, 1024);
    bgR.getXform().setSize(250, 250);
    bgR.getXform().setPosition(0, 0);
    this.mBg = new GameObject(bgR);
    
    this.mMsg = new Array(3);
    this.mMsg[0] = new FontRenderable("Status Message");
    this.mMsg[0].setColor([0, 0, 0, 1]);
    this.mMsg[0].getXform().setPosition(0, 60);
    this.mMsg[0].setTextHeight(5);
    
    this.mMsg[1] = new FontRenderable("Status Message");
    this.mMsg[1].setColor([1, 1, 1, 1]);
    this.mMsg[1].getXform().setPosition(0, 40);
    this.mMsg[1].setTextHeight(5);
    
    this.mMsg[2] = new FontRenderable("Status Message");
    this.mMsg[2].setColor([1, 1, 1, 1]);
    this.mMsg[2].getXform().setPosition(0, 20);
    this.mMsg[2].setTextHeight(5);
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
    var c = hexToRgb("14213d");
    gEngine.Core.clearCanvas([c.r, c.g, c.b, c.a]);
    
    this.drawCamera(this.mCamera);
    //this.drawCamera(this.vCanvas);
    
    this.UI.draw();
    /*
    this.vCanvas.setupCanvas();
    //this.vCanvas.setupViewProjection();
    this.cButton.draw(this.vCanvas);
    */
    this.mMsg[0].draw(this.vCanvas);
    this.mMsg[1].draw(this.vCanvas);
    this.mMsg[2].draw(this.vCanvas);
    // dont clear viewport
};

// The Update function, updates the application state. Make sure to _NOT_ draw
// anything from this function!
MyGame.prototype.update = function () {
    this.UI.update();
    
    
    
    
    var zoomDelta = 0.05;
    //this.mCamera.update();
    
    // Brain chasing the hero
    
    var h = [];
    /*
    if (!this.mHero.pixelTouches(this.mBrain, h)) {
        this.mBrain.rotateObjPointTo(this.mHero.getXform().getPosition(), 0.01);
        GameObject.prototype.update.call(this.mBrain);
    }
    */
    
    var heroPos = this.mHero.getXform().getPosition();
    var a = heroPos[0] - this.mCamera.mouseWCX();
    var b = heroPos[1] - this.mCamera.mouseWCY();
    //msg += "hero: x" + heroPos[0].toFixed(2) + ", y" + heroPos.toFixed(2) + "  ";
    var heroMag = Math.sqrt(a*a + b*b);
    
    
    
    this.mMsg[0].setText("Hero mag: " + heroMag.toFixed(2));
    this.mMsg[1].setText("Button X:" + this.cButton.getXform().getPosition()[0] + " Y:" + this.cButton.getXform().getPosition()[1]);
    this.mMsg[2].setText("Mouse Pos X:" + this.mCamera.mouseWCX().toFixed(2) + " Y: " + this.mCamera.mouseWCY().toFixed(2));
    if (heroMag > 6) {
        this.mHero.rotateObjPointTo(vec2.fromValues(this.mCamera.mouseWCX(), 
                                                    this.mCamera.mouseWCY()), 0.1);
        this.mHero.setSpeed(0.1);                                            
        GameObject.prototype.update.call(this.mHero);
        
    }
    
    if (gEngine.Input.isButtonPressed(gEngine.Input.mouseButton.Left)) {
        
        /* this will be a function in the ui like
         * var element = this.vCanvas.isMouseOver(mousePos);
         * if(elememt[0]){
         *      element[1].Invoke();
         * }
         **/
        /*
        var buttonPos = this.cButton.getXform().getPosition(); 
        var buttonH = this.cButton.getXform().getHeight();
        var buttonW = this.cButton.getXform().getWidth();
        
        if(this.mCamera.mouseWCX() >= buttonPos[0] - (buttonW / 2) &&
           this.mCamera.mouseWCX() <= buttonPos[0] + (buttonW / 2) &&    
           this.mCamera.mouseWCY() <= buttonPos[1] + (buttonH / 2) &&
           this.mCamera.mouseWCY() >= buttonPos[1] - (buttonH / 2)){
            
           this.mMsg[0].setText("Click!");
        }
        */
       var mouse = [this.mCamera.mouseWCX(), this.mCamera.mouseWCY()];
       var element = this.UI.IsMouseOverElement(mouse);
       if(element[0]){
          this.UI.TestClick();
       }
        
        
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
    

    // testing the mouse input
    if (gEngine.Input.isButtonPressed(gEngine.Input.mouseButton.Left)) {
        
    }

    if (gEngine.Input.isButtonPressed(gEngine.Input.mouseButton.Middle)) {
       
    }
    if (gEngine.Input.isButtonClicked(gEngine.Input.mouseButton.Right)) {
    }

    if (gEngine.Input.isButtonClicked(gEngine.Input.mouseButton.Middle)) {
    }
    
    
    
    
};
