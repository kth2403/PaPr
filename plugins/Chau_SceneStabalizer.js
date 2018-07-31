/*:
@author Chaucer
@plugindesc | Scene Stabalizer : Version - 1.4.0 | Description.
@help
===============================================================================
 Introduction :
===============================================================================

 This plugin pauses a scene once it starts to render, when the scene is paused
 all update methods are postponed. The scene will only begin to update once
 the scene is at a stable fps to ensure a smoother transition between scenes.

 Normally when changing scenes in MV( especially when entering a new scene for
 the first time ) it takes a bit more processing power to render all elements
 to the screen, this plugins purpose is to make those transitions less laggy
 by slightly prolonging the loading process in order to allow the game enough
 time to render all elements, and stabalize its draw cycles.

===============================================================================
 Requirements :
===============================================================================

---------------------------------------
 None.
---------------------------------------

===============================================================================
 Instructions :
===============================================================================

---------------------------------------
 N/A.
---------------------------------------

===============================================================================
 Terms Of Use :
===============================================================================

  This Plugin may be used commercially, or non commercially so long as credit
 is given, either in the games credit section, or in a text file alongside
 the game. This plugin may NOT be sold, or Plagiarized. This plugin may
 be extended upon, and shared freely.


===============================================================================
 Version History :
===============================================================================

 ● Version : 1.0.0
 ● Date : 13/01/2018
   ★ Release.

 ● Version : 1.4.0
 ● Date : 17/01/2018
   ★ Added the option to attempt to stabalize animations.

===============================================================================
 Contact Me :
===============================================================================

  If you have questions, about this plugin, or commissioning me, or have
 a bug to report, please feel free to contact me by any of the below
 methods.

 rmw : https://forums.rpgmakerweb.com/index.php?members/chaucer.44456
 discord : chaucer#7538
 skypeId : chaucer1991
 gmail : chaucer91
 patreon : TBD

 ()()
 (^.^)
 c(")(")

===============================================================================

 @param stabalize_animations
 @desc should animations should trigger scene stabalizer( true or false in MV-Version 1.4.X or lower ).
 @default false
 @type boolean
 @on Enabled
 @off Disabled

 @param stabalize_pictures
 @desc should show picture commands should trigger scene stabalizer( true or false in MV-Version 1.4.X or lower ).
 @default false
 @type boolean
 @on Enabled
 @off Disabled

*/

//=============================================================================
var Imported = Imported || new Object();
Imported['CHAU_FPSStabalizer'] = true;
//=============================================================================
var Chaucer = Chaucer || new Object();
Chaucer.fpsStabalizer = new Object();
//=============================================================================


( function ( $ ) { //IIFE
  $ = $ || {};

//Create plugin information.
//=============================================================================
  var regxp = /Scene Stabalizer : Version - \d+\.\d+\.\d+/;
  for ( var i = 0; i < $plugins.length; i++ )
  { // setup plugin data.
    var desc = $plugins[i].description.match( regxp );
    if ( !desc ) continue;
    $.alias = new Object();
    $.params = Parse( Object.create( $plugins[i].parameters ) );
    $.name = desc[0].split(":")[0].trim();
    $.version = desc[0].split("-")[1].trim();
    break;
  };

//=============================================================================
  //--------------------------------------------------------------------------
  function Parse( object )
  { // parse all data in an object
  //--------------------------------------------------------------------------
    try {
      object = JSON.parse( object );
     } catch (e) {
      object = object;
     } finally {
      if ( typeof object === 'object' ) {
        if ( Array.isArray( object ) ) {
          for ( var i = 0; i < object.length; i++ ) {
            object[i] = Parse( object[i] );
          };
        } else {
          for ( var key in object ) {
            object[key] = Parse( object[key] );
          }
        }
      }
     }
     return object;
  };

//=============================================================================
  var resetStabalizer, activeScene, stable;
  resetStabalizer = function()
  { // tell our scene it's unstable.
    stable = false;
  };
  resetStabalizer();
//=============================================================================

//=============================================================================
// Graphics :
//=============================================================================

//-----------------------------------------------------------------------------
  $.alias.G_createFPSMeter = Graphics._createFPSMeter;
//-----------------------------------------------------------------------------
  Graphics._createFPSMeter = function ()
  { // Alias of _createFPSMeter
//-----------------------------------------------------------------------------
    // decrease smoothing of fps meter to allow for more accurate reading.
    this._fpsMeter = new FPSMeter( {
      smoothing: 1, graph: 1, decimals: 0,
      theme: 'transparent', toggleOn: null
    } );
    this._fpsMeter.hide();
  };

//=============================================================================
// SceneManager :
//=============================================================================

//-----------------------------------------------------------------------------
  $.alias.SM_p_updateScene = SceneManager.updateScene;
//-----------------------------------------------------------------------------
  SceneManager.updateScene = function ()
  { // Alias of updateScene
//-----------------------------------------------------------------------------
    if ( this._sceneStarted && !stable )
    { // when scene is started but not stable, wait till it stabalizes.
      var meter = Graphics._fpsMeter;
      if ( this._scene.constructor !== Scene_Boot ) {
        return stable = ( Math.round( meter.fps ) >= meter.options.maxFps );
      }
    }
    $.alias.SM_p_updateScene.call( this );
  };

//=============================================================================
// Scene_Base :
//=============================================================================

//-----------------------------------------------------------------------------
  $.alias.SB_p_start = Scene_Base.prototype.start;
//-----------------------------------------------------------------------------
  Scene_Base.prototype.start = function ()
  { // Alias of start
//-----------------------------------------------------------------------------
    if ( activeScene !== this.constructor )
    { // tell the game to check if pausing is required.
      activeScene = this.constructor;
      resetStabalizer();
    }
    $.alias.SB_p_start.call( this );
  };


//=============================================================================
// Sprite_Animation :
//=============================================================================

//-----------------------------------------------------------------------------
  $.alias.SA_p_updateCS = Sprite_Animation.prototype.updateCellSprite;
//-----------------------------------------------------------------------------
  Sprite_Animation.prototype.updateCellSprite = function ( sprite, cell )
  { // Alias of updateCellSprite
//-----------------------------------------------------------------------------
    var reset = !sprite.bitmap;
    $.alias.SA_p_updateCS.call( this, sprite, cell );
    if ( reset && $.params.stabalize_animations ) resetStabalizer();
  };

//=============================================================================
// Sprite_Picture :
//=============================================================================

//-----------------------------------------------------------------------------
  $.alias.SP_p_loadBitmap = Sprite_Animation.prototype.loadBitmap;
//-----------------------------------------------------------------------------
  Sprite_Animation.prototype.loadBitmap = function ()
  { // Alias of loadBitmap
//-----------------------------------------------------------------------------
    $.alias.SP_p_loadBitmap.call( this );
    if ( params.stabalize_pictures ) resetStabalizer();
  };

//=============================================================================
} )( Chaucer.fpsStabalizer );
//=============================================================================
