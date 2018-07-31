//=============================================================================
// EISPressStart.js                                                             
//=============================================================================

/*:
*
* @author Kino
* @plugindesc Adds a new  'Press Start' button to the title scene.
*
* @param Start Text
* @desc Text to display in the press start window.
* @default Press Start
*
* @param Font Size
* @desc Size of the start text font.
* @default 24
*
* @param Fade Enable
* @desc Disable/Enable 'fade' (T/F).
* @default T
*
* @param Fade Speed
* @desc The speed at which to fade the text.
* @default 1
*
* @param Window Width
* @desc width of the window.
* @default 200
*
* @param Window Height
* @desc height of the window.
* @default 75
*
* @param Window X Position
* @desc The x position of the window on the title scene.
* @default 308
*
* @param Window Y Position 
* @desc The y position of the window on the title scene.
* @default 312
* 
* @help
//=============================================================================
//  Contact Information
//=============================================================================
*
* Contact me via twitter: EISKino, or on the rpg maker forums.
* Username on forums: Kino.
*
* Forum Link: http://forums.rpgmakerweb.com/index.php?/profile/75879-kino/
* Twitter Link: https://twitter.com/EISKino
* Website: http://endlessillusoft.com/
* Patreon Link: https://www.patreon.com/EISKino
*
* Hope this plugin helps, and enjoy!
* --Kino
*/ 


(function() {
  var params = PluginManager.parameters('EISPressStart');
  var PSParams = {
    titleText: String(params['Start Text']),
    fontSize: String(params['Font Size']),
    enableFade: /T/ig.test(params['Fade Enable']),
    fadeSpeed: Number(params['Fade Speed']),
    windowWidth: Number(params['Window Width']),
    windowHeight: Number(params['Window Height']),
    xPosition: Number(params['Window X Position']),
    yPosition: Number(params['Window Y Position'])
  };

  function setup() {
    'use strict';

//=============================================================================
// Scene_Title                                                             
//=============================================================================
    var _SceneTitle_create = Scene_Title.prototype.create;
    Scene_Title.prototype.create = function() {
      _SceneTitle_create.call(this);
      this.createStartWindow();
    };

    Scene_Title.prototype.createStartWindow = function() {
      this._windowStart = new Window_Start(PSParams.xPosition, PSParams.yPosition, PSParams.windowWidth, PSParams.windowHeight);
      this.addWindow(this._windowStart);
    };

    var _SceneTitle_isBusy = Scene_Title.prototype.isBusy;
    Scene_Title.prototype.isBusy = function() {
      return this._windowStart.isOpen() || _SceneTitle_isBusy.call(this);
    };

    var _SceneTitle_update = Scene_Title.prototype.update;
    Scene_Title.prototype.update = function () {
      _SceneTitle_update.call(this);
      this.processStart();
    };
//변경 : 지우면 타이틀픽쳐커맨드 연동
    Scene_Title.prototype.processStart = function () {
      if ( this._windowStart.isOpen() && (TouchInput.isTriggered() || Input.isPressed('ok')) ) {
        this._windowStart.close();
        this._windowStart.deactivate();
        //this.create_picture_commands();
      }
    };

//=============================================================================
// Window_Start                                                             
//=============================================================================

    class Window_Start extends Window_Base {
      constructor(x, y, width, height) {
        super(x, y, width, height);
      }

      initialize(x, y, width, height) {
        super.initialize(x, y, width, height);
        this._visible = true;
        this.setBackgroundType(2);
      }

      update() {
        super.update();
        if(PSParams.enableFade)
          this.processFade();
        this.refresh();
      }

      refresh() {
        if(this.contents) {
          this.contents.clear();
          this.drawStartText();
        }
      }

      drawStartText() {
        this.contents.fontSize = PSParams.fontSize;
        let xpos = (this.contentsWidth() / 2) - (this.textWidth(PSParams.titleText) / 2);
        this.drawText(PSParams.titleText, 0, 0, this.contentsWidth(), this.lineHeight(), 'center');
        this.resetFontSettings();
      }

      processFade() {
        if(this.isVisible()) {
          this.fadeOut(); 
        }
        else if(!this.isVisible()) {
          this.fadeIn();
        }
      }

      isVisible() {
        return this._visible;
      }

      fadeOut() {
        this.contentsOpacity-= PSParams.fadeSpeed;
        if(this.contentsOpacity === 0)
          this._visible = false;
      }

      fadeIn() {
        this.contentsOpacity+= PSParams.fadeSpeed;
        if(this.contentsOpacity === 255)
          this._visible = true;
      }
    }
  }
  setup();
})();