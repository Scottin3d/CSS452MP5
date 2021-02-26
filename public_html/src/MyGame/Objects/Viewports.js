/* 
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */

"use strict";

// <summary> the viewport class stores an array of cameras that act as viewports
// <param numV> the number of viewports in the array
// <param vWidth> the default camera width of the viewports
// <param color> the default camera background color
function Viewports(numV, vWidth, color) {
    
    this.viewports = new Array(numV);
    this.vpObjs = new Array(numV).fill(null);
    this.activeViewports = new Array(numV).fill(false);
    this.vMessages = new Array(numV); 
    this.vMsgBg = new Array(numV); 
    
    //this.viewports = new Array(numV);
    //this.vMessages = new Array(numV);  
    //this.vMsgBg = new Array(numV);
    
    // vars
    var viewportPadding = 10;
    var vSpawnX = 0;
    var docW = document.getElementById("GLCanvas").width;
    var docH = document.getElementById("GLCanvas").width;

    // generate viewports
    for(var i = 0; i < 4; i++){
        
        // viewportWidth = 940 - ( 10 * (4 + 1) / 4)
        //               = (940 - 50) / 4
        //               = 222.5
        var viewportWidth = ((docW - (viewportPadding * (numV + 1))) / numV);
        vSpawnX += viewportPadding;
        
        // viewport
        this.viewports[i] = new Camera(
            vec2.fromValues(0, 0),                                              // position of the viewport
            vWidth,                                                                 // width of viewport
            [vSpawnX, 840 - viewportWidth, viewportWidth, viewportWidth]        // viewport (orgX, orgY, width, height)
        ); // vSpawnX: [10, 242.5, 475, 707.5], 617.5, 222.5, 222.5
        color = hexToRgb("14213d");
        this.viewports[i].setBackgroundColor([color.r, color.g, color.b, color.a]);
        
        // message box
        color = hexToRgb("e5e5e5");
        this.vMsgBg[i] = new Renderable(gEngine.DefaultResources.getConstColorShader());
        this.vMsgBg[i].setColor([color.r, color.g, color.b, color.a]);
        this.vMsgBg[i].getXform().setSize(viewportWidth, vWidth / 10);
        // messgae
         this.vMessages[i] = new FontRenderable("Test Msg " + i);
         color = hexToRgb("14213d");
         this.vMessages[i].setColor([color.r, color.g, color.b, color.a]);
         this.vMessages[i].setTextHeight(vWidth / 14);
        // increment viewport spacing
        vSpawnX += viewportWidth;
    }
};

Viewports.prototype.update = function(){
    // update viewports and message boards
    for (var i = 0; i < this.viewports.length; i++) {
        this.viewports[i].update();                                             // update the camera
        var camPos = this.viewports[i].getWCCenter();
        var camW = this.viewports[i].getWCWidth() / 2;
        var bgS = this.vMsgBg[i].getXform().getHeight() / 2;
        
        this.vMsgBg[i].getXform().setPosition(camPos[0],                        // these should scale with viewport size
                                              camPos[1] - (camW - bgS));        // the banner will always be 10% the height
        this.vMessages[i].getXform().setPosition(camPos[0] - (camW * 0.75), 
                                                 camPos[1] - (camW - bgS));
        
        if(!this.activeViewports[i]){
             this.vMessages[i].setText("Viewport Deactivated");
        }else{
            // temporary
            this.vMessages[i].setText("Viewport activated");
        }
    }
    //**************************************************************************
    
    //update vp centers
    for (var i = 1; i < this.vpObjs.length; i++) {
        if( this.vpObjs[i]){
            if(this.vpObjs[i].isAlive()){
                this.setViewportWC(i, this.vpObjs[i].getXform().getPosition());
            }else{
                this.toggleViewport(i, false, null);
                
            }
        }  
    }
    
    // viewport toggles
    if(gEngine.Input.isKeyClicked(gEngine.Input.keys.One)){
        this.activeViewports[0] = !this.activeViewports[0];
    }
    if(gEngine.Input.isKeyClicked(gEngine.Input.keys.Two)){
        this.activeViewports[1] = !this.activeViewports[1];
    }
    if(gEngine.Input.isKeyClicked(gEngine.Input.keys.Three)){
        this.activeViewports[2] = !this.activeViewports[2];
    }
    if(gEngine.Input.isKeyClicked(gEngine.Input.keys.Four)){
        this.activeViewports[3] = !this.activeViewports[3];
    }
    //**************************************************************************
};

// <summary> get the number of active viewports
Viewports.prototype.getActiveCount = function(){
    var c = 0;
    for (var i = 0; i < this.viewports.length; i++) {
        if(this.activeViewports[i]){
            c++;
        }
    }
    return c;
};

// <summary> set a viewport text
// <param i> the index of the viewport to effect
// <param text> the text of the viewport
Viewports.prototype.setViewportText = function(i, text){
    this.vMessages[i].setText(text);
};

// <summary> set a viewport width
// <param i> the index of the viewport to effect
// <param width> the new width of the viewport
Viewports.prototype.setViewportWidth = function(i, width){
    this.viewports[i].setWCWidth(width);
    this.vMsgBg[i].getXform().setSize(width, width / 10);
    this.vMessages[i].setTextHeight(width / 14);
};

// <summary> set a viewport world center
// <param i> the index of the viewport to effect
// <param newWC> the new world center of the viewport
Viewports.prototype.setViewportWC = function(i, newWC){
    var vp = this.viewports[i];
    vp.setWCCenter(newWC[0], newWC[1]);
};

// <summary> toggle a viewport on or off
// <param i> the index of the viewport to effect
// <param isOn> bool value on or off
Viewports.prototype.toggleViewport = function (i, isOn, obj){
    this.activeViewports[i] = isOn;
    if(isOn){
        this.vpObjs[i] = obj;
    }else{
        this.vpObjs[i] = null;
    }
    
};

// <summary> toggle a viewport on or off
// <param i> the index of the viewport to check
// <return> bool of if viewport is active
Viewports.prototype.isViewportActive = function (i){
    return this.activeViewports[i];
};

// <summary> get the next available viewport to activate
Viewports.prototype.getNextAvailableViewport = function (){                     // make sure to use === when calling
    for (var i = 1; i < this.activeViewports.length; i++) {                     // === does a type check
        if(!this.activeViewports[i]){                                           // starts at 1 because viewport[0]
            //this.toggleViewport(i, true);                                       // is dedicated to the mHero object
            return i;
        }
    }
    return -1;                                                                  // no free? return null
};

// <summary> draw viewport
// <param i> the index of the viewport to draw
Viewports.prototype.draw = function(i){
    this.vMsgBg[i].draw(this.viewports[i]);
    this.vMessages[i].draw(this.viewports[i]);
};

// <summary> setup viewport
// <param i> the index of the viewport to setup
Viewports.prototype.setupCamera = function (i){
        this.viewports[i].setupViewProjection();
};

// <summary> get the viewport camera
// <param i> the index of the viewport requested
// <return> camera if active, else null
Viewports.prototype.getCamera = function(i){            
    if(this.activeViewports[i]){
        return this.viewports[i];                                               // return if active
    }
    return null;
};

