//=============================================================================
// TMVplugin - くるくるスタースプライツ
// 作者: tomoaky (http://hikimoki.sakura.ne.jp/)
// Version: 1.1
// 最終更新日: 2016/05/07
//=============================================================================

/*:
 * @plugindesc クリック（タップ）操作に合わせて星がはじけます、
 * プラグインコマンドで好きな場所に星を表示することもできます。
 *
 * @author tomoaky (http://hikimoki.sakura.ne.jp/)
 *
 * @param maxStars
 * @desc 同時に表示するスターの最大数
 * 初期値: 32
 * @default 32
 *
 * @param leftClickStars
 * @desc 左クリック（シングルタップ）で表示するスターの数
 * 初期値: 8
 * @default 8
 *
 * @param rightClickStars
 * @desc 右クリック（マルチタップ）で表示するスターの数
 * 初期値: 2
 * @default 2
 *
 * @help
 * 動作条件:
 *   このプラグインの動作にはプラグイン素材『ビットマップ拡張(TMBitmapEx.js)』が
 *   必要です、プラグイン管理ではビットマップ拡張よりも下にこのプラグインを導入
 *   してください。
 *   ビットマップ拡張は最新のものを導入してください。
 *
 * プラグインコマンド:
 *   addStar 300 200 4      # 座標(300,200)に４個のスターを表示します
 *
 *   addStarEvent 1 8       # イベント１番に８個のスターを表示します
 *                            イベント番号が -1 ならプレイヤー、0 ならコマンドを
 *                            実行したイベント自体が対象になります。
 */

var Imported = Imported || {};
Imported.TMStarSprites = true;

(function() {

  var parameters = PluginManager.parameters('TMStarSprites');
  var maxStars        = +parameters['maxStars'];
  var leftClickStars  = +parameters['leftClickStars'];
  var rightClickStars = +parameters['rightClickStars'];
  
  //-----------------------------------------------------------------------------
  // TouchInput
  //

  var _TouchInput_onTrigger = TouchInput._onTrigger;
  TouchInput._onTrigger = function(x, y) {
    _TouchInput_onTrigger.call(this, x, y);
    SceneManager.addStar(this._x, this._y, leftClickStars);
  };

  var _TouchInput_onCancel = TouchInput._onCancel;
  TouchInput._onCancel = function(x, y) {
    _TouchInput_onCancel.call(this, x, y);
    SceneManager.addStar(this._x, this._y, rightClickStars);
  };

  //-----------------------------------------------------------------------------
  // SceneManager
  //

  var _SceneManager_initialize = SceneManager.initialize;
  SceneManager.initialize = function() {
    _SceneManager_initialize.call(this);
    this.initStarSprites();
  };

  SceneManager.initStarSprites = function() {
    this._starBitmap = new Bitmap(288, 48);
    this._starBitmap.gradientFillStar(0,   0, 48, 48, '#FF0000', '#FFFFFF', true);
    this._starBitmap.gradientFillStar(48,  0, 48, 48, '#00FF00', '#FFFFFF', true);
    this._starBitmap.gradientFillStar(96,  0, 48, 48, '#0000FF', '#FFFFFF', true);
    this._starBitmap.gradientFillStar(144, 0, 48, 48, '#FFFF00', '#FFFFFF', true);
    this._starBitmap.gradientFillStar(192, 0, 48, 48, '#FF00FF', '#FFFFFF', true);
    this._starBitmap.gradientFillStar(240, 0, 48, 48, '#00FFFF', '#FFFFFF', true);
    this._starSprites = [];
    for (var i = 0; i < maxStars; i++) {
      this._starSprites.push(new Sprite_Star());
    }
  };

  var _SceneManager_onSceneStart = SceneManager.onSceneStart;
  SceneManager.onSceneStart = function() {
    _SceneManager_onSceneStart.call(this);
    this.refreshStarsZ();
  };
  
  SceneManager.refreshStarsZ = function() {
    for (var i = 0, len = this._starSprites.length; i < len; i++) {
      this._scene.addChild(this._starSprites[i]);
    }
  };
  
  SceneManager.addStar = function(x, y, num) {
    var n = 0;
    for (var i = 0, len = this._starSprites.length; i < len; i++) {
      if (n === num) break;
      if (!this._starSprites[i].isActive()) {
        this._starSprites[i].setup(x, y);
        n++;
      }
    }
  };
  
  var _SceneManager_snapForBackground = SceneManager.snapForBackground;
  SceneManager.snapForBackground = function() {
    var len = this._starSprites.length;
    for (var i = 0; i < len; i++) {
      this._starSprites[i].visible = false;
    }
    _SceneManager_snapForBackground.call(this);
    for (var i = 0; i < len; i++) {
      this._starSprites[i].visible = this._starSprites[i].isActive();
    }
  };
  
  //-----------------------------------------------------------------------------
  // Game_Interpreter
  //

  var _Game_Interpreter_pluginCommand = Game_Interpreter.prototype.pluginCommand;
  Game_Interpreter.prototype.pluginCommand = function(command, args) {
    _Game_Interpreter_pluginCommand.call(this, command, args);
    if (command === 'addStar') {
      var n = args[2] === undefined ? 1 : +args[2];
      SceneManager.addStar(+args[0], +args[1], n);
    } else if (command === 'addStarEvent') {
      var character = this.character(+args[0]);
      if (character) {
        var n = args[1] === undefined ? 1 : +args[1];
        SceneManager.addStar(character.screenX(),
                             character.screenY() - $gameMap.tileHeight() / 2, n);
      }
    }
  };
  
  //-----------------------------------------------------------------------------
  // Sprite_Star
  //

  function Sprite_Star() {
      this.initialize.apply(this, arguments);
  }

  Sprite_Star.prototype = Object.create(Sprite.prototype);
  Sprite_Star.prototype.constructor = Sprite_Star;

  Sprite_Star.prototype.initialize = function() {
    Sprite.prototype.initialize.call(this);
    this.bitmap = SceneManager._starBitmap;
    this.anchor.x = 0.5;
    this.anchor.y = 0.5;
    this.blendMode = 1;
    this._count = 0;
    this.visible = false;
  };
  
  Sprite_Star.prototype.isActive = function() {
    return this._count > 0;
  };

  Sprite_Star.prototype.setup = function(x, y) {
    this.x = x;
    this.y = y;
    this.visible = true;
    this.scale.x = Math.random() / 4 + 0.25;
    this.scale.y = this.scale.x;
    this.opacity = 255;
    this.setFrame(Math.randomInt(6) * 48, 0, 48, 48);
    this._count = 30;
    this._vx = Math.random() * 4 - 2;
    this._vy = Math.random() * 4 - 2;
  };

  Sprite_Star.prototype.update = function() {
    Sprite.prototype.update.call(this);
    if (this._count > 0) {
      this._count--;
      if (this._count === 0) {
        this.visible = false;
      } else {
        if (this._vy < 2) this._vy += 0.05;
        this.rotation += this._vx / 10;
        this.x += this._vx;
        this.y += this._vy;
        this.opacity -= 8;
      }
    }
  };
  
})();
