//=============================================================================
// TMVplugin - ジャンプアクション
// 作者: tomoaky (http://hikimoki.sakura.ne.jp/)
// Version: 0.3b
// 最終更新日: 2016/01/19
//=============================================================================

/*:
 * @plugindesc マップシーンをそれっぽいアクションゲームにします。
 * 細かい仕様などは配布サイトを参照してください。
 * @author tomoaky (http://hikimoki.sakura.ne.jp/)
 *
 * @param Gravity
 * @desc 重力の強さ。
 * 初期値: 0.004
 * @default 0.004
 *
 * @param Friction
 * @desc 通常の地形とイベントの摩擦の強さ。
 * 初期値: 0.001
 * @default 0.001
 *
 * @param Tile Margin Top
 * @desc 地形との接触判定に使う座標をどれだけ上へずらすか。
 * 初期値: 0.5
 * @default 0.5
 *
 * @param Steps For Turn
 * @desc 何マスの移動で１ターン経過するか。
 * 初期値: 20
 * @default 20
 *
 * @param All Dead Event
 * @desc 全滅時に起動するコモンイベント番号。
 * 初期値: 1
 * @default 1
 *
 * @param Event Collapse
 * @desc イベント戦闘不能時に崩壊エフェクトを使う。
 * 初期値: true（ false でエフェクトなし）
 * @default true
 *
 * @param Floor Damage
 * @desc ダメージ床から受けるダメージ。
 * 初期値: 10
 * @default 10
 *
 * @param Flick Weight
 * @desc はじき飛ばせる重さの差。
 * 初期値: 1（ 0 なら同じ重さではじき飛ばせる）
 * @default 1
 *
 * @param Flick Skill
 * @desc はじき飛ばしのダメージ計算に使うスキル番号。
 * 初期値: 1（ 0 ならダメージなし）
 * @default 1
 *
 * @param Stage Region
 * @desc 足場として扱うリージョン番号。
 * 初期値: 60
 * @default 60
 *
 * @param Wall Region
 * @desc 壁として扱うリージョン番号。
 * 初期値: 61
 * @default 61
 *
 * @param Slip Wall Region
 * @desc 壁ジャンプができない壁として扱うリージョン番号。
 * 初期値: 62
 * @default 62
 *
 * @param Slip Floor Region
 * @desc すべる床として扱うリージョン番号。
 * 初期値: 63
 * @default 63
 *
 * @param Rough Floor Region
 * @desc 移動速度半減の床として扱うリージョン番号。
 * 初期値: 64
 * @default 64
 *
 * @param Marsh Floor Region
 * @desc 移動できない床として扱うリージョン番号。
 * 初期値: 65
 * @default 65
 *
 * @param Water Terrain Tag
 * @desc 水中として扱う地形タグ番号。
 * 初期値: 1
 * @default 1
 *
 * @param levelupPopup
 * @desc レベルアップ時に表示するポップアップ。
 * 初期値: LEVEL UP!!
 * @default LEVEL UP!!
 *
 * @param levelupAnimationId
 * @desc レベルアップ時に表示するアニメーション番号。
 * 初期値: 46
 * @default 46
 *
 * @param Use Event Se Swim
 * @desc 水に入ったときの効果音をイベントに適用する。
 * 初期値: true（ false で適用しない）
 * @default true
 *
 * @param Se Jump
 * @desc ジャンプしたときに鳴らす効果音。
 * 初期値: {name: "Crossbow", volume: 90, pitch: 100, pan: 0}
 * @default {name: "Crossbow", volume: 90, pitch: 100, pan: 0}
 *
 * @param Se Dash
 * @desc ダッシュしたときに鳴らす効果音。
 * 初期値: {name: "Wind4", volume: 90, pitch: 50, pan: 0}
 * @default {name: "Wind4", volume: 90, pitch: 50, pan: 0}
 *
 * @param Se Flick
 * @desc ダッシュで相手をはじき飛ばしたときに鳴らす効果音。
 * 初期値: {name: "Damage1", volume: 90, pitch: 100, pan: 0}
 * @default {name: "Damage1", volume: 90, pitch: 100, pan: 0}
 *
 * @param Se Swim
 * @desc 水に入ったときと出たときに鳴らす効果音。
 * 初期値: {name: "Water1", volume: 90, pitch: 100, pan: 0}
 * @default {name: "Water1", volume: 90, pitch: 100, pan: 0}
 *
 * @param Se Change
 * @desc 操作キャラ切り替えのときに鳴らす効果音。
 * 初期値: {name: "Sword1", volume: 90, pitch: 100, pan: 0}
 * @default {name: "Sword1", volume: 90, pitch: 100, pan: 0}
 *
 * @help 横方向、縦方向ともにループマップには対応していません。
 *
 * アクション用のパラメータ（ジャンプ力など）はメモ欄を使って設定します。
 * アクター、装備、ステートのメモ欄に書かれたタグがパラメータになります。
 * ただし、アクターにタグがなかった場合は自動的に初期値が設定されます。
 *
 * メモ欄（アクター、装備、ステート）タグ:
 *   <move_speed:0.05>        # 歩行速度
 *   <jump_speed:0.14>        # ジャンプ力
 *   <swim_speed:0.02>        # 泳ぐ速度
 *   <ladder_speed:0.04>      # はしご移動速度
 *   <accele:0.003>           # 歩行加速度
 *   <ladder_accele:0.003>    # はしご移動加速度
 *   <jump_input:0>           # ジャンプ追加入力時間
 *   <swim_jump:0.1>          # 水中ジャンプ力
 *   <mulch_jump:1>           # 連続ジャンプ回数
 *   <weigth:2>               # 重さ
 *   <gravity:0.0045>         # 重力
 *   <friction:0>             # 摩擦
 *   <wall_jump>              # 壁ジャンプ
 *   <dash_speed_x:0.14>      # ダッシュ速度（横方向）
 *   <dash_speed_y:0.03>      # ダッシュ速度（縦方向）
 *   <dash_count:15>          # ダッシュ時間
 *   <dash_delay:30>          # ダッシュ後硬直時間
 *
 * メモ欄（イベント）タグ:
 *   <w:0.375>                # 当たり判定（中心から左右の端までのサイズ）
 *   <h:0.75>                 # 当たり判定（足元から頭までのサイズ）
 *   <enemy:1>                # バトラー（敵番号）
 *   <dead:A>                 # バトラー戦闘不能時セルフスイッチ
 *   <lift>                   # リフト属性
 *   <weigth:1>               # 重さ
 *   <gravity:0.004>          # 重力
 *
 * プラグインコマンド:
 *   JumpAction hp_damage -1 5     # プレイヤーに５ダメージを与える。
 *   JumpAction hp_damage 1 100    # イベント１番に１００ダメージを与える。
 *   JumpAction hp 1 2             # イベント１番のＨＰをゲーム変数２番に代入。
 *   JumpAction force_x -1 0.1     # プレイヤーの X 速度を 0.1 に強制変更。
 *   JumpAction force_y 1 -0.15    # イベント１番の Y 速度を -0.15 に強制変更。
 *   JumpAction change_actor 2     # 操作キャラクターをアクター２番に変更。
 *   JumpAction addPopup -1 テキスト #ff0000
 *                                 # プレイヤーに赤色のテキストをポップアップ
 *
 */

var Imported = Imported || {};
Imported.TMJumpAction = true;

var Tomoaky = Tomoaky || {};
Tomoaky.JA = Tomoaky.JA || {};

Tomoaky.Parameters = PluginManager.parameters('TMJumpAction');
Tomoaky.Param = Tomoaky.Param || {};

Tomoaky.Param.JAGravity = Number(Tomoaky.Parameters['Gravity']);
Tomoaky.Param.JAFriction = Number(Tomoaky.Parameters['Friction']);
Tomoaky.Param.JATileMarginTop = Number(Tomoaky.Parameters['Tile Margin Top']);
Tomoaky.Param.JAStepsForTurn = Number(Tomoaky.Parameters['Steps For Turn']);
Tomoaky.Param.JAAllDeadEvent = Number(Tomoaky.Parameters['All Dead Event']);
Tomoaky.Param.JAEventCollapse = (Tomoaky.Parameters['Event Collapse']) === 'true' ? true : false;
Tomoaky.Param.JAFloorDamage = Number(Tomoaky.Parameters['Floor Damage']);
Tomoaky.Param.JAFlickWeight = Number(Tomoaky.Parameters['Flick Weight']);
Tomoaky.Param.JAFlickSkill = Number(Tomoaky.Parameters['Flick Skill']);
Tomoaky.Param.JAStageRegion = Number(Tomoaky.Parameters['Stage Region']);
Tomoaky.Param.JAWallRegion = Number(Tomoaky.Parameters['Wall Region']);
Tomoaky.Param.JASlipWallRegion = Number(Tomoaky.Parameters['Slip Wall Region']);
Tomoaky.Param.JASlipFloorRegion = Number(Tomoaky.Parameters['Slip Floor Region']);
Tomoaky.Param.JARoughFloorRegion = Number(Tomoaky.Parameters['Rough Floor Region']);
Tomoaky.Param.JAMarshFloorRegion = Number(Tomoaky.Parameters['Marsh Floor Region']);
Tomoaky.Param.JAWaterTerrainTag = Number(Tomoaky.Parameters['Water Terrain Tag']);
Tomoaky.Param.JALevelupPopup = Tomoaky.Parameters['levelupPopup'];
Tomoaky.Param.JALevelupAnimationId = Number(Tomoaky.Parameters['levelupAnimationId']);
Tomoaky.Param.JAUseEventSeSwim = (Tomoaky.Parameters['Use Event Se Swim']) === 'true' ? true : false;
Tomoaky.Param.JASeJump = (new Function("return " + Tomoaky.Parameters['Se Jump']))();
Tomoaky.Param.JASeDash = (new Function("return " + Tomoaky.Parameters['Se Dash']))();
Tomoaky.Param.JASeFlick = (new Function("return " + Tomoaky.Parameters['Se Flick']))();
Tomoaky.Param.JASeSwim = (new Function("return " + Tomoaky.Parameters['Se Swim']))();
Tomoaky.Param.JASeChange = (new Function("return " + Tomoaky.Parameters['Se Change']))();

if (!Imported.TMEventBase) {
  Imported.TMEventBase = true;
  (function() {
  
    //-----------------------------------------------------------------------------
    // Game_Event
    //
  
    var _Game_Event_setupPage = Game_Event.prototype.setupPage;
    Game_Event.prototype.setupPage = function() {
      _Game_Event_setupPage.call(this);
      if (this._pageIndex >= 0) {
        this.loadCommentParams();
      }
    };

    Game_Event.prototype.loadCommentParams = function() {
      this._commentParams = {};
      var re = /<([^<>:]+)(:?)([^>]*)>/g;
      var list = this.list();
      for (var i = 0; i < list.length; i++) {
        var command = list[i];
        if (command && command.code == 108 || command.code == 408) {
          for (;;) {
            var match = re.exec(command.parameters[0]);
            if (match) {
              if (match[2] === ':') {
                this._commentParams[match[1]] = match[3];
              } else {
                this._commentParams[match[1]] = true;
              }
            } else {
              break;
            }
          }
        } else {
          break;
        }
      }
    };

    Game_Event.prototype.loadTagParam = function(paramName) {
      if (this._commentParams[paramName]) {
        return this._commentParams[paramName];
      } else if (this.event().meta[paramName]) {
        return this.event().meta[paramName];
      } else {
        return null;
      }
    };

  })();
}

(function() {

  //-----------------------------------------------------------------------------
  // Input
  //

  Input.keyMapper[65] = 'attack';
  Input.keyMapper[83] = 'jump';
  Input.keyMapper[68] = 'dash';

  Input.gamepadMapper = {
    0: 'ok',        // A
    1: 'cancel',    // B
    2: 'dash',      // X
    3: 'jump',      // Y
    4: 'pageup',    // LB
    5: 'pagedown',  // RB
    6: 'menu',      // LT
    7: 'attack',    // RT
    12: 'up',       // D-pad up
    13: 'down',     // D-pad down
    14: 'left',     // D-pad left
    15: 'right',    // D-pad right
  };

  //-----------------------------------------------------------------------------
  // Game_Battler
  //

  // メンバ変数の初期化
  var _Game_Battler_initMembers = Game_Battler.prototype.initMembers;
  Game_Battler.prototype.initMembers = function() {
    _Game_Battler_initMembers.call(this);
    this._actionResult = new Game_ActionResult();
  };

  // リザルトのクリア
  var _Game_Battler_clearResult = Game_Battler.prototype.clearResult;
  Game_Battler.prototype.clearResult = function() {
    this._actionResult.hpDamage += this._result.hpDamage;
    this._actionResult.missed |= this._result.missed;
    this._actionResult.evaded |= this._result.evaded;
    this._actionResult.critical |= this._result.critical;
    this._actionResult.addedStates = this._actionResult.addedStates.concat(this._result.addedStates);
    this._actionResult.removedStates = this._actionResult.removedStates.concat(this._result.removedStates);
    _Game_Battler_clearResult.call(this);
  };

  // バトル終了処理
  var _Game_Battler_onBattleEnd = Game_Battler.prototype.onBattleEnd;
  Game_Battler.prototype.onBattleEnd = function() {
    _Game_Battler_onBattleEnd.call(this);
    this.clearActionResult();
  };

  // ジャンプアクションリザルトのクリア
  Game_Battler.prototype.clearActionResult = function() {
    this._actionResult.clear();
  };
  
  //-----------------------------------------------------------------------------
  // Game_Actor
  //

  // ダメージ床から受けるダメージ
  Game_Actor.prototype.basicFloorDamage = function() {
    return Tomoaky.Param.JAFloorDamage;
  };

  // 何マスの移動で１ターン経過するか
  Game_Actor.prototype.stepsForTurn = function() {
    return Tomoaky.Param.JAStepsForTurn;
  };

  // 付加されたステートの表示
  var _Game_Actor_showAddedStates = Game_Actor.prototype.showAddedStates;
  Game_Actor.prototype.showAddedStates = function() {
    if ($gameParty.inBattle()) {
      _Game_Actor_showAddedStates.call(this);
    }
  };

  // レベルアップの表示
  var _Game_Actor_displayLevelUp = Game_Actor.prototype.displayLevelUp;
  Game_Actor.prototype.displayLevelUp = function(newSkills) {
    if ($gameParty.inBattle()) {
      _Game_Actor_displayLevelUp.call(this, newSkills);
    } else {
      $gamePlayer.setMapPopup(Tomoaky.Param.JALevelupPopup, '#ffffff');
      $gamePlayer.requestAnimation(Tomoaky.Param.JALevelupAnimationId);
    }
  };

  // 解除されたステートの表示
  var _Game_Actor_showRemovedStates = Game_Actor.prototype.showRemovedStates;
  Game_Actor.prototype.showRemovedStates = function() {
    if ($gameParty.inBattle()) {
      _Game_Actor_showRemovedStates.call(this);
    }
  };

  // アクター（＋装備、ステート）のタグからパラメータ（数値）をロード
  Game_Actor.prototype.loadTagParam = function(param_name, default_value) {
    var result = this.actor().meta[param_name];
    result = result ? Number(result) : default_value;
    var equips = this.equips().concat(this.states());
    for (var i = 0; i < equips.length; i++) {
      var item = equips[i];
      if (item && item.meta[param_name]) {
        result += Number(item.meta[param_name]);
      }
    }
    return result;
  };

  // アクター（＋装備、ステート）のタグからパラメータ（真偽値）をロード
  Game_Actor.prototype.loadTagBool = function(param_name) {
    var equips = this.equips().concat(this.states(), this.actor());
    for (var i = 0; i < equips.length; i++) {
      var item = equips[i];
      if (item && item.meta[param_name]) {
        return true;
      }
    }
    return false;
  };

  // アクター（＋装備、ステート）のタグからパラメータ（文字列）をロード
  Game_Actor.prototype.loadTagString = function(param_name, default_value) {
    var equips = this.states().concat(this.equips(), this.actor());
    for (var i = equips.length - 1; i >= 0; i--) {
      var item = equips[i];
      if (item && item.meta[param_name]) {
        return item.meta[param_name];
      }
    }
    return default_value;
  };

  //-----------------------------------------------------------------------------
  // Game_Map
  //

  // 乗り物は作らない
  Game_Map.prototype.createVehicles = function() {
      this._vehicles = [];
  };

  // 壁ジャンプが可能か判定する
  Game_Map.prototype.canWallJump = function(x, y, d) {
    if (!this.isValid(x, y)) {
      return false;
    }
    if (this.tileId(x, y, 5) == Tomoaky.Param.JASlipWallRegion) {
      return false;
    }
    return !this.isPassable(x, y, d);
  };

  // 通行チェック
  Game_Map.prototype.checkPassage = function(x, y, bit) {
    if (!this.isValid(x, y)) {
      return false;
    }
    var rg = this.tileId(x, y, 5);
    if (rg == Tomoaky.Param.JAWallRegion) {
      return false;
    }
    var flags = this.tilesetFlags();
    var tiles = this.allTiles(x, y);
    for (var i = 0; i < tiles.length; i++) {
      var flag = flags[tiles[i]];
      if (rg == Tomoaky.Param.JAStageRegion) {
        flag |= 1;
      }
      if ((flag & 0x10) !== 0)  // [*] No effect on passage
        continue;
      if ((flag & bit) === 0)   // [o] Passable
        return true;
      if ((flag & bit) === bit) // [x] Impassable
        return false;
    }
    return false;
  };

  //-----------------------------------------------------------------------------
  // Game_CharacterBase
  //

  // メンバ変数の初期化
  var _Game_CharacterBase_initMembers = Game_CharacterBase.prototype.initMembers;
  Game_CharacterBase.prototype.initMembers = function() {
    _Game_CharacterBase_initMembers.call(this);
    this._needsRefresh = false;
    this._mapPopups = [];
    this._vx = 0;
    this._vy = 0;
    this._vxPlus = 0;
    this._lastY = 0;
    this._lastSwim = false;
    this._collideW = 0.375;
    this._collideH = 0.75;
    this._collideIds = [];
    this._landingObject = null;
    this._landingRegion = 0;
    this._ladder = false;
    this._lift = false;
    this._lockCount = 0;
    this._moveCount = 0;
    this._jumpInput = 0;
    this._dashCount = 0;
    this._friction = 0;
    this._moveSpeed = 0.05;
    this._jumpSpeed = 0.14;
    this._swimSpeed = 0.02;
    this._dashSpeedX = 0.1;
    this._dashSpeedY = 0.03;
    this._ladderSpeed = 0.04;
    this._accele = 0.003
    this._ladderAccele = 0.003;
    this._jumpInputTime = 0;
    this._dashCountTime = 30;
    this._swimJump = 0.1;
    this._mulchJump = 1;
    this._weight = 0;
    this._gravity = Tomoaky.Param.JAGravity;
  };

  // バトラーの取得
  Game_CharacterBase.prototype.battler = function() {
    return null;
  };

  // バトラーが設定されているか
  Game_CharacterBase.prototype.isBattler = function() {
    return this.battler() !== null;
  };

  // 移動状態判定
  Game_CharacterBase.prototype.isMoving = function() {
    return this._moveCount > 0;
  };

  // ダッシュ状態判定
  Game_CharacterBase.prototype.isDashing = function() {
    return this._dashCount > 0;
  };

  // 地面に立っているか
  Game_CharacterBase.prototype.isLanding = function() {
    return this._landingObject !== null;
  };

  // およぎ状態判定
  Game_CharacterBase.prototype.isSwimming = function() {
    return this.terrainTag() == Tomoaky.Param.JAWaterTerrainTag;
  };

  // ロック状態判定
  Game_CharacterBase.prototype.isLocking = function() {
    return this._lockCount > 0;
  };

  // 自分の重さで相手をはじき飛ばせるかチェック
  Game_CharacterBase.prototype.checkFlickWeight = function(weight) {
    return this._weight >= weight + Tomoaky.Param.JAFlickWeight;
  };

  // リフレッシュフラグを立てる
  Game_CharacterBase.prototype.requestRefresh = function() {
    this._needsRefresh = true;
  };

  // 移動速度のセット
  Game_CharacterBase.prototype.setMoveSpeed = function(moveSpeed) {
    this._moveSpeed = moveSpeed / 100 + 0.02;
  };

  // フレーム更新
  Game_CharacterBase.prototype.update = function() {
    this.updateMove();
    this.updateAnimation();
    this.updateCollideIds();
    if (this.isDashing()) {
      this.updateDashCount();
    }
    if (this.isMoving()) {
      this.updateMoveCount();
    } else {
      this.updateStop();
    }
    if (this.isSwimming() != this._lastSwim) {
      this.updateSwiming();
    }
    if (this._needsRefresh) {
      this.refresh();
    }
  };

  // 画面 X 座標の取得
  Game_CharacterBase.prototype.screenX = function() {
    var tw = $gameMap.tileWidth();
    return Math.round(this.scrolledX() * tw);
  };

  // 画面 Y 座標の取得
  Game_CharacterBase.prototype.screenY = function() {
    var th = $gameMap.tileHeight();
    return Math.round(this.scrolledY() * th);
  };

  // 移動の処理
  Game_CharacterBase.prototype.updateMove = function() {
    this.updateGravity();
    this.updateFriction();
    if (this._vx != 0 || this._vxPlus != 0) {
      this._realX += this._vx + this._vxPlus;
      if (this._vx > 0) {
        this.collideMapRight();
        if (!this._through) {
            this.collideCharacterRight();
        }
      } else {
        this.collideMapLeft();
        if (!this._through) {
            this.collideCharacterLeft();
        }
      }
      this._x = Math.floor(this._realX);
    }
    if (this._vy != 0) {
      this._landingObject = null;
      this._realY += this._vy;
      if (this._vy > 0) {
        this.collideMapDown();
        if (!this._through) {
            this.collideCharacterDown();
        }
      } else {
        this.collideMapUp();
        if (!this._through) {
            this.collideCharacterUp();
        }
      }
      this._y = Math.floor(this._realY);
      this._lastY = Math.floor(this._realY + Tomoaky.Param.JATileMarginTop);
    }
  };

  // 重力の処理
  Game_CharacterBase.prototype.updateGravity = function() {
    this._vy = Math.min(this._vy + this._gravity, this.maxFallSpeed());
  };

  // 最大落下速度の取得
  Game_CharacterBase.prototype.maxFallSpeed = function() {
    return this.isSwimming() ? 0.04 : 0.6;
  };

  // 摩擦の処理
  Game_CharacterBase.prototype.updateFriction = function() {
    if (this.isLanding()) {
      if (Object.prototype.toString.call(this._landingObject) !== '[object Array]') {
        if (this._landingObject._lift) {
          this._vxPlus = this._landingObject._vx;
        }
      }
    } else {
      this._vxPlus = 0;
    }
  };

  // 移動カウントの処理
  Game_CharacterBase.prototype.updateMoveCount = function() {
    this._moveCount--;
    if (this._moveCount == 0 && !this.isDashing()) {
      this._vx = 0;
      if (this._gravity == 0) {
        this._vy = 0;
      }
    }
  };

  // ダッシュカウントの処理
  Game_CharacterBase.prototype.updateDashCount = function() {
    this._dashCount--;
  };

  // 衝突しているキャラクターの処理
  Game_CharacterBase.prototype.updateCollideIds = function() {
    for(var i = this._collideIds.length - 1; i >= 0; i--) {
      var id = this._collideIds[i];
      var character = id < 0 ? $gamePlayer : $gameMap.event(id);
      if (!this.isCollide(character)) {
        this._collideIds.splice(i, 1);
      }
    }
  };

  // キャラクターとの直線距離を返す
  Game_CharacterBase.prototype.distFromCharacter = function(character) {
    var x = this._realX - character._realX;
    var y = this._realY - character._realY;
    return Math.sqrt(x * x + y * y);
  };

  // マップとの衝突判定（上方向）
  Game_CharacterBase.prototype.collideMapUp = function() {
    var lx = Math.floor(this._realX - this._collideW);
    var rx = Math.floor(this._realX + this._collideW);
    var y = Math.floor(this._realY - this._collideH);
    for (var x = lx; x <= rx; x++) {
      if (!$gameMap.isPassable(x, y, 8)) {
        this._realY = y + 1.001 + this._collideH;
        this._vy = 0;
        this._jumpInput = 0;
        return;
      }
    }
  };

  // マップとの衝突判定（下方向）
  Game_CharacterBase.prototype.collideMapDown = function() {
    var y = Math.floor(this._realY + Tomoaky.Param.JATileMarginTop);
    if (y == this._lastY) {
      return;
    }
    var lx = Math.floor(this._realX - this._collideW);
    var rx = Math.floor(this._realX + this._collideW);
    var y = Math.floor(this._realY + Tomoaky.Param.JATileMarginTop);
    for (var x = lx; x <= rx; x++) {
      if (!$gameMap.isPassable(x, y, 2)) {
        if (this._ladder && $gameMap.isLadder(x, y)) {
          continue;
        }
        this._landingObject = [x, y];
        this._landingRegion = $gameMap.regionId(x, y);
        this.getLand(y - Tomoaky.Param.JATileMarginTop - 0.001);
        return;
      }
    }
  };

  // マップとの衝突判定（左方向）
  Game_CharacterBase.prototype.collideMapLeft = function() {
    var ty = Math.floor(this._realY - this._collideH);
    var by = Math.floor(this._realY + Tomoaky.Param.JATileMarginTop);
    var x = Math.floor(this._realX - this._collideW);
    for (var y = ty; y <= by; y++) {
      if (!$gameMap.isPassable(x, y, 4)) {
        this._realX = x + 1.001 + this._collideW;
        this._vx = 0;
        return;
      }
    }
  };

  // マップとの衝突判定（右方向）
  Game_CharacterBase.prototype.collideMapRight = function() {
    var ty = Math.floor(this._realY - this._collideH);
    var by = Math.floor(this._realY + Tomoaky.Param.JATileMarginTop);
    var x = Math.floor(this._realX + this._collideW);
    for (var y = ty; y <= by; y++) {
      if (!$gameMap.isPassable(x, y, 6)) {
        this._realX = x - 0.001 - this._collideW;
        this._vx = 0;
        return;
      }
    }
  };

  // キャラクターとの衝突判定（上方向）
  Game_CharacterBase.prototype.collideCharacterUp = function() {
    var targets = this.collideTargets();
    for (var i = 0; i < targets.length; i++) {
      var character = targets[i];
      if (this.isCollide(character)) {
        this.addCollideId(character.eventId());
        if (!character._through) {
          if (this._lift) {
            character._realY = this._realY - this._collideH - 0.001;
            character._vy = this._vy;
            character._landingObject = this;
            character.resetJump();
          } else {
            this._realY = character._realY + this._collideH + 0.001;
            this._vy = 0;
            this._jumpInput = 0;
          }
        }
      }
    }
  };

  // キャラクターとの衝突判定（下方向）
  Game_CharacterBase.prototype.collideCharacterDown = function() {
    var targets = this.collideTargets();
    for (var i = 0; i < targets.length; i++) {
      var character = targets[i];
      if (this.isCollide(character)) {
        this.addCollideId(character.eventId());
        if (!character._through) {
          if (this._lift) {
            character._realY = this._realY + character._collideH + 0.001;
            character._jumpInput = 0;
            character._vy = this._vy;
          } else {
            this._landingObject = character;
            this._landingRegion = -1;
            this.getLand(character._realY - character._collideH - 0.001);
          }
        }
      }
    }
  };

  // キャラクターとの衝突判定（左方向）
  Game_CharacterBase.prototype.collideCharacterLeft = function() {
    var targets = this.collideTargets();
    for (var i = 0; i < targets.length; i++) {
      var character = targets[i];
      if (this.isCollide(character)) {
        this.addCollideId(character.eventId());
        if (!character._through) {
          if (this._lift || this._ladder) {
            character._realX = this._realX - this._collideW - 0.001 - character._collideW;
            character._vx = this._vx;
          } else {
            if (this.isDashing() && this.checkFlickWeight(character._weight)) {
              character.flick(this);
            }
            this._realX = character._realX + character._collideW + 0.001 + this._collideW;
            this._vx = 0;
          }
        }
      }
    }
  };

  // キャラクターとの衝突判定（右方向）
  Game_CharacterBase.prototype.collideCharacterRight = function() {
    var targets = this.collideTargets();
    for (var i = 0; i < targets.length; i++) {
      var character = targets[i];
      if (this.isCollide(character)) {
        this.addCollideId(character.eventId());
        if (!character._through) {
          if (this._lift || this._ladder) {
            character._realX = this._realX + this._collideW + 0.001 + character._collideW;
            character._vx = this._vx;
          } else {
            if (this.isDashing() && this.checkFlickWeight(character._weight)) {
              character.flick(this);
            }
            this._realX = character._realX - character._collideW - 0.001 - this._collideW;
            this._vx = 0;
          }
        }
      }
    }
  };

  // キャラクターとの衝突判定
  Game_CharacterBase.prototype.isCollide = function(character) {
    if (this.eventId() == character.eventId()) {
      return false;
    }
    if (this._realX - this._collideW <= character._realX + character._collideW) {
      if (this._realX + this._collideW >= character._realX - character._collideW) {
        if (this._realY - this._collideH <= character._realY) {
          if (this._realY >= character._realY - character._collideH) {
            return true;
          }
        }
      }
    }
    return false;
  };

  // 衝突判定を行う対象を返す
  Game_CharacterBase.prototype.collideTargets = function() {
    return $gameMap.events().concat($gamePlayer);
  };

  // 衝突している対象を追加する
  Game_CharacterBase.prototype.addCollideId = function(id) {
    if (this._collideIds.indexOf(id) == -1) {
      this._collideIds.push(id);
      this.checkEventTriggerCollide(id);
    }
  };

  // 地面に降りる
  Game_CharacterBase.prototype.getLand = function(y) {
    this._realY = y;
    this._vy = 0;
    this.resetJump();
    if (this._ladder) {
      this.getOffLadder();
    }
  };
  // ジャンプカウントのリセット
  Game_CharacterBase.prototype.resetJump = function() {
    this._jumpCount = this._mulchJump;
    this._jumpInput = 0;
  };

  // 泳ぎ状態の更新
  Game_CharacterBase.prototype.updateSwiming = function() {
    this._lastSwim = !this._lastSwim;
  };

  // まっすぐに移動
  Game_CharacterBase.prototype.moveStraight = function(d) {
    this.setDirection(d);
    this._moveCount = Math.floor(1 / this._moveSpeed);
    switch (d) {
    case 2:
      this._vy = this._moveSpeed;
      return;
    case 4:
      this._vx = -this._moveSpeed;
      return;
    case 6:
      this._vx = this._moveSpeed;
      return;
    default:
      this._vy = -this._moveSpeed;
      return;
    }
  };

  // ジャンプ
  Game_CharacterBase.prototype.jump = function(xPlus, yPlus) {
    if (this._jumpCount <= 0) {
      return;
    }
    this._jumpCount--;
    if (xPlus < 0) {
      this.setDirection(4);
      var speed = this._moveSpeed / 100 + 0.02;
      this._moveCount = Math.floor(1 / speed);
      this._vx = -speed;
    } else if (xPlus > 0) {
      this.setDirection(6);
      var speed = this._moveSpeed / 100 + 0.02;
      this._moveCount = Math.floor(1 / speed);
      this._vx = speed;
    }
    if (yPlus != 0) {
      this._vy = -Math.abs(yPlus) / 100;
    } else {
      this._vy = this.isSwimming() ? -this._swimJump : -this._jumpSpeed;
    }
    this.resetStopCount();
    this.straighten();
  };

  // ダッシュ
  Game_CharacterBase.prototype.dash = function(direction) {
    this._dashCount = this._dashCountTime;
    if (direction == 4) {
      this._vx = -this._dashSpeedX;
    } else {
      this._vx = this._dashSpeedX;
    }
    this._vy = -this._dashSpeedY;
    this._moveCount = this._dashCount / 2;
    this.resetStopCount();
    this.straighten;
  };

  // はじかれ
  Game_CharacterBase.prototype.flick = function(user) {
    if (Tomoaky.Param.JAFlickSkill > 0 && user.isBattler() && this.isBattler()) {
      this.applySkill(user, Tomoaky.Param.JAFlickSkill);
    }
    this._vx = user._vx;
    var n = 1 + (user._weight - this._weight - Tomoaky.Param.JAFlickWeight) / 2;
    this._moveCount = Math.floor(n / Math.abs(this._vx));
    AudioManager.playSe(Tomoaky.Param.JASeFlick);
  };

  // スキルの適用
  Game_CharacterBase.prototype.applySkill = function(user, skillId) {
    user.battler().clearActions();
    var action = new Game_Action(user.battler());
    action.setSkill(skillId);
    user.battler().setAction(0, action);
    user.battler().action(0).apply(this.battler());
  };

  // ダメージの処理
  Game_CharacterBase.prototype.updateDamage = function() {
    this.battler().clearResult();
    if (this.battler()._actionResult.hpDamage != 0) {
      this.battler()._actionResult.hpAffected = true;
      this.battler()._actionResult.missed = false;
      this.battler()._actionResult.evaded = false;
      this.damaged();
      if (this.battler()._actionResult.hpDamage > 0) {
        if (this.battler().isActor()) {
          SoundManager.playActorDamage();
        } else {
          SoundManager.playEnemyDamage();
        }
      } else {
        SoundManager.playRecovery();
      }
    } else if (this.battler()._actionResult.missed ||
               this.battler()._actionResult.evaded) {
      this.damaged();
      SoundManager.playMiss();
    }
    if (this.battler()._actionResult.isStatusAffected()) {
      this.requestRefresh();
    }
  };

  // ダメージ後の処理
  Game_CharacterBase.prototype.damaged = function() {
    if (this.isLocking()) {
      return;
    }
    this.battler().startDamagePopup();
    if (this.battler()._actionResult.isStateAdded(this.battler().deathStateId())) {
      this.battlerDead();
    }
  };

  // 座標のセット
  Game_CharacterBase.prototype.setPosition = function(x, y) {
    this._x = Math.floor(x);
    this._y = Math.floor(y);
    this._realX = x;
    this._realY = y;
  };

  // 指定位置へ移動
  var _Game_CharacterBase_locate = Game_CharacterBase.prototype.locate;
  Game_CharacterBase.prototype.locate = function(x, y) {
    _Game_CharacterBase_locate.call(this, x, y);
    this._vx = 0;
    this._vy = 0;
    this._lastY = -1;
    this._lastSwim = this.isSwimming();
    this._collideIds = [];
  };

  // マップ用ポップアップのセット
  Game_CharacterBase.prototype.setMapPopup = function(text, color, ry, dy, g) {
    var popup = {};
    popup.text = text;
    popup.color = color;
    popup.ry = ry === undefined ? -40 : ry;
    popup.dy = dy === undefined ? -4 : dy;
    popup.g = g === undefined ? 0.5 : g;
    this._mapPopups.push(popup);
  };
  
  // マップ用ポップアップがたまっているかどうかを返す
  Game_CharacterBase.prototype.isMapPopupExist = function() {
    return this._mapPopups.length > 0;
  };

  // マップ用ポップアップをひとつ返す
  Game_CharacterBase.prototype.getMapPopup = function() {
    return this._mapPopups.shift();
  };

  //-----------------------------------------------------------------------------
  // Game_Character
  //

  // ランダムに移動
  Game_Character.prototype.moveRandom = function() {
    if (this._gravity == 0) {
      this.moveStraight(2 + Math.randomInt(4) * 2);
    } else {
      this.moveStraight(4 + Math.randomInt(2) * 2);
    }
  };

  // キャラクターの方を向く
  Game_Character.prototype.turnTowardCharacter = function(character) {
      var sx = this._realX - character._realX;
      var sy = this._realY - character._realY;
      if (Math.abs(sx) > Math.abs(sy)) {
          this.setDirection(sx > 0 ? 4 : 6);
      } else if (sy !== 0) {
          this.setDirection(sy > 0 ? 8 : 2);
      }
  };

  // キャラクターの反対を向く
  Game_Character.prototype.turnAwayFromCharacter = function(character) {
      var sx = this._realX - character._realX;
      var sy = this._realY - character._realY;
      if (Math.abs(sx) > Math.abs(sy)) {
          this.setDirection(sx > 0 ? 6 : 4);
      } else if (sy !== 0) {
          this.setDirection(sy > 0 ? 2 : 8);
      }
  };

  //-----------------------------------------------------------------------------
  // Game_Player
  //

  // メンバ変数の初期化
  var _Game_Player_initMembers = Game_Player.prototype.initMembers;
  Game_Player.prototype.initMembers = function() {
    _Game_Player_initMembers.call(this);
    this._memberIndex = 0;
    this._realSteps = 0;
    this._wallJump = false;
    this._dashDelay = 0;
    this._dashDelayTime = 30;
  };

  // 画面中央の X 座標
  Game_Player.prototype.centerX = function() {
      return (Graphics.width / $gameMap.tileWidth() - 1) / 2.0 + 0.5;
  };

  // 画面中央の Y 座標
  Game_Player.prototype.centerY = function() {
      return (Graphics.height / $gameMap.tileHeight() - 1) / 2.0 + 0.5;
  };

  // イベントIDを返す
  Game_Player.prototype.eventId = function() {
    return -1;
  };

  // アクターの取得
  Game_Player.prototype.actor = function() {
    return $gameParty.allMembers()[this._memberIndex];
  };

  // バトラーを返す
  Game_Player.prototype.battler = function() {
    return this.actor();
  };

  // バトラーが設定されているか
  Game_Player.prototype.isBattler = function() {
    return this.actor() ? true : false;
  };

  // ダッシュ状態判定
  Game_Player.prototype.isDashing = function() {
    return this._dashCount > 0;
  };

  // 衝突判定を行う対象を返す
  Game_Player.prototype.collideTargets = function() {
    return $gameMap.events();
  };

  // はしごにつかまる
  Game_Player.prototype.getOnLadder = function(downFlag) {
    this._ladder = true;
    this._landingObject = null;
    this.setDirection(8);
    var lastRealX = this._realX;
    this._realX = Math.floor(this._realX) + 0.5;
    if (downFlag) {
      this._realY += 0.04;
    }
    this._lastY = Math.floor(this._realY + Tomoaky.Param.JATileMarginTop);
    if (lastRealX < this._realX) {
      this.collideCharacterLeft();
    } else if (lastRealX > this._realX) {
      this.collideCharacterRight();
    }
    this._vx = 0;
    this._vy = 0;
    this.resetJump();
  };

  // はしごから降りる
  Game_Player.prototype.getOffLadder = function() {
    this._ladder = false;
    this.setDirection(Input.isPressed('left') ? 4 : 6);
  };

  // 衝突したイベントの起動
  Game_Player.prototype.checkEventTriggerCollide = function(id) {
    if (!$gameMap.isEventRunning()) {
      var event = $gameMap.event(id);
  //    if (event.isTriggerIn([1, 2]) && event.isNormalPriority() === normal) {
      if (event.isTriggerIn([1, 2])) {
        event.start();
      }
    }
  };

  // フレーム更新
  Game_Player.prototype.update = function(sceneActive) {
    var lastScrolledX = this.scrolledX();
    var lastScrolledY = this.scrolledY();
    if (this.isLocking()) {
      this.updateLock();
    } else {
      if (sceneActive && this.canMove()) {
        this.updateInput();
      }
      var lastRealX = this._realX;
      var lastRealY = this._realY;
      Game_Character.prototype.update.call(this);
      this.updateSteps(lastRealX, lastRealY);
    }
    this.updateScroll(lastScrolledX, lastScrolledY);
    if (this.isBattler()) {
      this.updateDamage();
    }
  //  this._followers.update();
  };

  // 入力の処理
  Game_Player.prototype.updateInput = function() {
    this.changeByInput();
    this.moveByInput();
    this.jumpByInput();
    this.dashByInput();
    this.triggerButtonAction();
  };

  // 重力の処理
  Game_Player.prototype.updateGravity = function() {
    if (!this._ladder) {
      Game_CharacterBase.prototype.updateGravity.call(this);
    }
  };

  // 摩擦の処理
  Game_Player.prototype.updateFriction = function() {
    Game_Character.prototype.updateFriction.call(this);
    this._friction = 0;
    if (this._ladder) {
      var n = this.isMoving() ? 0 : Tomoaky.Param.JAFriction;
      if (this._vy != 0) {
        if (this._vy > 0) {
          this._vy = Math.max(this._vy - n, 0);
        } else {
          this._vy = Math.min(this._vy + n, 0);
        }
      }
    } else {
      // ダッシュ状態でなければ移動速度を超えないように調整する
      if (!this.isDashing()) {
        var n = this.isSwimming() ? this._swimSpeed : this._moveSpeed;
        if (this._vx < -n) {
          this._vx = Math.min(this._vx + 0.005, -n);
        } else if (this._vx > n) {
          this._vx = Math.max(this._vx - 0.005, n);
        }
      }
      if (this.isLanding()) {
        var n = Tomoaky.Param.JAFriction;
        switch (this._landingRegion) {
        case Tomoaky.Param.JASlipFloorRegion:
          this._friction = 0.0025;
          return;
        case Tomoaky.Param.JARoughFloorRegion:
          if (Math.abs(this._vx) > this._moveSpeed / 2) {
            this._vx = this._vx > 0 ? this._moveSpeed / 2 : -this._moveSpeed / 2;
          }
          break;
        case Tomoaky.Param.JAMarshFloorRegion:
          this._vx = 0;
          return;
        }
        if (!this.isMoving()) {
          if (this._vx > 0) {
            this._vx = Math.max(this._vx - n, 0);
          } else if (this._vx < 0) {
            this._vx = Math.min(this._vx + n, 0);
          }
        }
      }
    }
  };

  // 移動カウントの処理
  Game_Player.prototype.updateMoveCount = function() {
    this._moveCount--;
  };

  // ロック状態の処理
  Game_Player.prototype.updateLock = function() {
    this._lockCount--;
    if (this._lockCount == 0) {
      if (this.battler().isDead()) {
        this.changeMember(1);
      }
    }
  };

  // ボタン入力による操作アクター変更
  Game_Player.prototype.changeByInput = function() {
    if (Input.isTriggered('pageup')) {
      this.changeMember(-1);
    } else if (Input.isTriggered('pagedown')) {
      this.changeMember(1);
    }
  };

  // 操作メンバーの切り替え
  Game_Player.prototype.changeMember = function(shift) {
    if ($gameParty.isAllDead()) {
      return;
    }
    this._memberIndex = (this._memberIndex + shift + $gameParty.size()) % $gameParty.size();
    while (this.actor().isDead()) {
      this._memberIndex = (this._memberIndex + shift + $gameParty.size()) % $gameParty.size();
    }
    this.refresh();
    this.battler().requestEffect('appear');
    AudioManager.playSe(Tomoaky.Param.JASeChange);
  };

  // 方向ボタン入力による移動処理
  Game_Player.prototype.moveByInput = function() {
    if (this._ladder) {
      if (Input.isPressed('up')) {
        this.setDirection(8);
        this._vy = Math.max(this._vy - this._ladderAccele, -this._ladderSpeed);
        this._moveCount = 4;
        this.resetStopCount();
      } else if (Input.isPressed('down')) {
        this.setDirection(8);
        this._vy = Math.min(this._vy + this._ladderAccele, this._ladderSpeed);
        this._moveCount = 4;
        this.resetStopCount();
      }
      if (!this.isCollideLadder(false)) {
        this.getOffLadder();
      }
    } else {
      if (!this.isDashing()) {
        if (Input.isPressed('left')) {
          this.setDirection(4);
          if (this._vx > -this._moveSpeed) {
            var accele = Math.max(this._accele - this._friction, 0);
            this._vx = Math.max(this._vx - accele, -this._moveSpeed);
          }
          this._moveCount = 4;
        } else if (Input.isPressed('right')) {
          this.setDirection(6);
          if (this._vx < this._moveSpeed) {
            var accele = Math.max(this._accele - this._friction, 0);
            this._vx = Math.min(this._vx + accele, this._moveSpeed);
          }
          this._moveCount = 4;
        }
      }
      if (Input.isPressed('up')) {
        if (this.isCollideLadder(false)) {
          this.getOnLadder(false);
        }
      } else if (Input.isPressed('down')) {
        if (this.isCollideLadder(true)) {
          this.getOnLadder(true);
        }
      }
    }
  };

  // ボタン入力によるジャンプ処理
  Game_Player.prototype.jumpByInput = function() {
    if (this._jumpInput > 0) {
      this._jumpInput--;
      if (Input.isPressed('jump')) {
        this._vy = -this._jumpSpeed;
      } else {
        this._jumpInput = 0;
      }
    }
    if (Input.isTriggered('jump')) {
      if (this.isSwimming()) {
        this.resetJump();
        this._jumpCount--;
      } else if (this._jumpCount > 0) {
        this._jumpCount--;
      } else {
        if (!this._wallJump) {
          return;
        }
        if (this._direction == 4) {
          var x = Math.floor(this._realX - this._collideW - 0.16);
        } else {
          var x = Math.floor(this._realX + this._collideW + 0.16);
        }
        var y = Math.floor(this._realY);
        if (!$gameMap.canWallJump(x, y, this._direction)) {
          return;
        }
        this.wallJump();
      }
      if (this._ladder) {
        this.getOffLadder();
        if (Input.isPressed('down')) {
          return;
        }
      }
      this._jumpInput = this._jumpInputTime;
      if (this.isDashing()) {
        this._dashCount = this._dashCountTime;
        this._vx = this._direction == 4 ? -this._dashSpeedX : this._dashSpeedX
      }
      this._vy = this.isSwimming() ? -this._swimJump : -this._jumpSpeed;
      this.resetStopCount();
      this.straighten();
      AudioManager.playSe(Tomoaky.Param.JASeJump);
    }
  };

  // 壁ジャンプの X 方向処理
  Game_Player.prototype.wallJump = function() {
    this._vx = this._direction == 4 ? this._moveSpeed : -this._moveSpeed;
    this.setDirection(this.reverseDir(this._direction));
  };

  // ボタン入力によるダッシュ処理
  Game_Player.prototype.dashByInput = function() {
    if (this._dashDelay > 0) {
      this._dashDelay--;
    } else {
      if (Input.isTriggered('dash') && !this.isSwimming()) {
        if (!$gameMap.isDashDisabled()) {
          if (this._ladder) {
            this.getOffLadder()
            if (Input.isPressed('left')) {
              this.setDirection(4);
            } else if (Input.isPressed('right')) {
              this.setDirection(6);
            }
          } else {
            if (!this._direction == 4) {
              this.setDirection(6);
            }
          }
          this.dash(this._direction);
          this._dashDelay = this._dashDelayTime;
          AudioManager.playSe(Tomoaky.Param.JASeDash);
        }
      }
    }
  };

  // 歩数の処理
  Game_Player.prototype.updateSteps = function(lastRealX, lastRealY) {
    this._realSteps += Math.max(Math.abs(this._realX - lastRealX), Math.abs(this._realY - lastRealY));
    if (this._realSteps >= 1) {
      if (this.isNormal()) {
        $gameParty.increaseSteps();
        if (this.actor()) {
          this.actor().onPlayerWalk();
        }
      }
      this._realSteps = 0;
    }
  };

  // 泳ぎ状態の更新
  Game_Player.prototype.updateSwiming = function() {
    Game_Character.prototype.updateSwiming.call(this);
    AudioManager.playSe(Tomoaky.Param.JASeSwim);
  };

  // マップイベントの起動
  Game_Player.prototype.startMapEvent = function(triggers, normal) {
    if (!$gameMap.isEventRunning()) {
      var targets = this.collideTargets();
      for (var i = 0; i < targets.length; i++) {
        var character = targets[i];
        if (this.isCollide(character)) {
          if (character.isTriggerIn(triggers) && character.isNormalPriority() === normal) {
            if (character.isBattler() && character.battler().isDead()) {
              continue;
            }
            character.start();
          }
        }
      }
    }
  };

  // 接触しているイベントの起動判定
  Game_Player.prototype.checkEventTriggerHere = function(triggers) {
      if (this.canStartLocalEvents()) {
          this.startMapEvent(triggers, false);
      }
  };

  // 正面のイベント起動判定
  Game_Player.prototype.checkEventTriggerThere = function(triggers) {
    var lastRealX = this._realX;
    this._realX += this._direction == 4 ? -this._collideW : this._collideW
    this.startMapEvent(triggers, true);
    this._realX += this._direction == 4 ? -0.5 : 0.5;
    if (!$gameMap.isAnyEventStarting() && $gameMap.isCounter(Math.floor(this._realX), this._y)) {
      this._realX += this._direction == 4 ? -0.5 : 0.5;
      this.startMapEvent(triggers, true);
    }
    this._realX = lastRealX;
  };

  // はしごと接触しているか
  Game_Player.prototype.isCollideLadder = function(downFlag) {
    var x = Math.floor(this._realX);
    if (downFlag) {
      if (!this.isLanding()) {
        return false;
      }
      var y = Math.floor(this._realY + Tomoaky.Param.JATileMarginTop + 0.1);
      return $gameMap.isLadder(x, y);
    } else {
      var ty = Math.floor(this._realY - this._collideH);
      var by = Math.floor(this._realY + Tomoaky.Param.JATileMarginTop);
      for (var y = ty; y <= by; y++) {
        if ($gameMap.isLadder(x, y)) {
          return true;
        }
      }
      return false;
    }
  };

  // 場所移動の実行
  Game_Player.prototype.performTransfer = function() {
    if (this.isTransferring()) {
      this.setDirection(this._newDirection);
      if (this._newMapId !== $gameMap.mapId() || this._needsMapReload) {
        $gameMap.setup(this._newMapId);
        this._needsMapReload = false;
      }
      this.locate(this._newX + 0.5, this._newY + 0.99 - Tomoaky.Param.JATileMarginTop);
      this.refresh();
      this.clearTransferInfo();
    }
  };

  // リフレッシュ
  Game_Player.prototype.refresh = function() {
    var actor = this.actor();
    if (actor) {
      var characterName = actor.characterName();
      var characterIndex = actor.characterIndex();
      this._moveSpeed = actor.loadTagParam('move_speed', 0.05);
      this._jumpSpeed = actor.loadTagParam('jump_speed', 0.14);
      this._swimSpeed = actor.loadTagParam('swim_speed', 0.02);
      this._ladderSpeed = actor.loadTagParam('ladder_speed', 0.04);
      this._accele = actor.loadTagParam('accele', 0.003);
      this._ladderAccele = actor.loadTagParam('ladder_accele', 0.003);
      this._jumpInputTime = actor.loadTagParam('jump_input', 0);
      this._swimJump = actor.loadTagParam('swim_jump', 0.1);
      this._mulchJump = actor.loadTagParam('mulch_jump', 1);
      this._weight = actor.loadTagParam('weight', 0);
      this._gravity = actor.loadTagParam('gravity', 0.0045);
      this._wallJump = actor.loadTagBool('wall_jump');
      this._dashSpeedX = actor.loadTagParam('dash_speed_x', 0.14);
      this._dashSpeedY = actor.loadTagParam('dash_speed_y', 0.03);
      this._dashCountTime = actor.loadTagParam('dash_count', 15);
      this._dashDelayTime = actor.loadTagParam('dash_delay', 30);
    } else {
      var characterName = '';
      var characterIndex = 0;
    }
    this.setImage(characterName, characterIndex);
    this._followers.refresh();
    this._needsRefresh = false;
  };

  // 飛行船の乗り降り
  Game_Player.prototype.getOnOffVehicle = function() {
    return false;
  };

  // まっすぐに移動
  Game_Player.prototype.moveStraight = function(d) {
    Game_Character.prototype.moveStraight.call(this, d);
  };

  // バトラーが戦闘不能になったときの処理
  Game_Player.prototype.battlerDead = function() {
    this._lockCount = 32;
    this.battler().requestEffect('collapse');
    SoundManager.playActorCollapse();
    if ($gameParty.isAllDead()) {
      $gameTemp.reserveCommonEvent(Tomoaky.Param.JAAllDeadEvent);
    }
  };

  //-----------------------------------------------------------------------------
  // Game_Event
  //

  // 初期化
  Game_Event.prototype.initialize = function(mapId, eventId) {
      Game_Character.prototype.initialize.call(this);
      this._mapId = mapId;
      this._eventId = eventId;
      this._repopCount = 0;
      this.locate(this.event().x + 0.5, this.event().y + 1);
      this.refresh();
  };

  // メンバ変数の初期化
  var _Game_Event_initMembers = Game_Event.prototype.initMembers;
  Game_Event.prototype.initMembers = function() {
    _Game_Event_initMembers.call(this);
    this._enemyId = 0;
    this._battler = null;
    this._deadSelfSwitch = null;
    this._commentParams = {};
  };

  // バトラーの取得
  Game_Event.prototype.battler = function() {
    return this._battler;
  };

  // 衝突したイベントの起動
  Game_Event.prototype.checkEventTriggerCollide = function(id) {
    if (!$gameMap.isEventRunning() && id < 0) {
      if (this.isTriggerIn([1, 2]) && this.isNormalPriority() === normal) {
        this.start();
      }
    }
  };

  // リフレッシュ
  var _Game_Event_refresh = Game_Event.prototype.refresh;
  Game_Event.prototype.refresh = function() {
    _Game_Event_refresh.call(this);
    this._needsRefresh = false;
  };

  // イベントページのセットアップ
  var _Game_Event_setupPage = Game_Event.prototype.setupPage;
  Game_Event.prototype.setupPage = function() {
    _Game_Event_setupPage.call(this);
    if (this._pageIndex >= 0) {
      this._enemyId  = Number(this.loadTagParam('enemy')) || 0;
      this._deadSelfSwitch = this.loadTagParam('dead');
      this._repopTimer = Number(this.loadTagParam('repop')) || 0;
      if (this._repopTimer > 0) {
        this._repopCount = this._repopTimer;
      }
      this._collideW = Number(this.loadTagParam('w')) || 0.375;
      this._collideH = Number(this.loadTagParam('h')) || 0.75;
      this._weight   = Number(this.loadTagParam('weight')) || 0;
      var param = this.loadTagParam('gravity');
      this._gravity  = param ? Number(param) : Tomoaky.Param.JAGravity;
      this._lift     = this.loadTagParam('lift') || false;
      this.setupBattler();
    }
  };

  // バトラーのセットアップ
  Game_Event.prototype.setupBattler = function() {
    if (this._enemyId > 0) {
      this._battler = new Game_Enemy(this._enemyId, this.eventId(), 0);
    } else {
      this._battler = null;
    }
  };

  // フレーム更新
  var _Game_Event_update = Game_Event.prototype.update;
  Game_Event.prototype.update = function() {
    if (this.isLocking()) {
      this.updateLock();
    } else {
      _Game_Event_update.call(this);
      if (this._repopCount > 0) {
        this.updateRepop();
      }
    }
    if (this.isBattler()) {
      this.updateDamage();
    }
  };

  // 摩擦の処理
  Game_Event.prototype.updateFriction = function() {
    Game_Character.prototype.updateFriction.call(this);
    if (!this.isMoving() && this._vx != 0) {
      if (!this.isDashing()) {
        var n = this.isSwimming() ? this._swimSpeed : this._moveSpeed;
        if (this._vx < -n) {
          this._vx = Math.min(this._vx + 0.005, -n);
        }
        if (this._vx > n) {
          this._vx = Math.max(this._vx - 0.005, n);
        }
      }
      if (this.isLanding()) {
        var n = Tomoaky.Param.JAFriction;
        switch (this._landingRegion) {
        case Tomoaky.Param.JASlipFloorRegion:
          return;
        case Tomoaky.Param.JARoughFloorRegion:
          if (Math.abs(this._vx) > this._moveSpeed / 2) {
            this._vx = this._vx > 0 ? this._moveSpeed / 2 : -this._moveSpeed / 2;
          }
          break;
        case Tomoaky.Param.JAMarshFloorRegion:
          this._vx = 0;
          return;
        }
        if (this._vx > 0) {
          this._vx = Math.max(this._vx - n, 0);
        } else {
          this._vx = Math.min(this._vx + n, 0);
        }
      }
    }
  };

  // リポップカウントの処理
  Game_Event.prototype.updateRepop = function() {
    this._repopCount--;
    if (this._repopCount === 0) {
      var key = [$gameMap.mapId(), this._eventId, this._deadSelfSwitch];
      if ($gameSelfSwitches.value(key)) {
        $gameSelfSwitches.setValue(key, false);
        this.refresh();
        this.requestAppear();
      }
    }
  };

  // 出現エフェクトのリクエスト
  Game_Event.prototype.requestAppear = function() {
    if (this.isBattler()) {
      if (Tomoaky.Param.JAEventCollapse) {
        this.battler().requestEffect('appear');
      }
    } else {
    }
  };
  
  // バトラーが戦闘不能になったときの処理
  Game_Event.prototype.battlerDead = function() {
    if (Tomoaky.Param.JAEventCollapse) {
      this._lockCount = 32;
      this.battler().requestEffect('collapse');
      SoundManager.playEnemyCollapse();
    } else {
      this._lockCount = 1;
    }
  };

  // ロック状態の処理
  Game_Event.prototype.updateLock = function() {
    this._lockCount--;
    if (this._lockCount == 0) {
      if (this.battler().isDead()) {
        this.gainRewards();
        if (this._deadSelfSwitch !== null) {
          var key = [$gameMap.mapId(), this._eventId, this._deadSelfSwitch];
          $gameSelfSwitches.setValue(key, true);
          this.refresh();
          this.requestAppear();
        } else {
          this.erase();
        }
      }
    }
  };
  
  // 撃破報酬の獲得
  Game_Event.prototype.gainRewards = function() {
    var exp = this.battler().exp();
    if (exp > 0) {
      this.gainRewardExp(exp);
    }
    var gold = this.battler().gold();
    if (gold > 0) {
      this.gainRewardGold(gold);
    }
    var items = this.battler().makeDropItems();
    for (var i = 0; i < items.length; i++) {
      this.gainRewardItem(items[i], -16 - (items.length - i) * 24);
    }
  };

  // 撃破報酬（経験値）の獲得
  Game_Event.prototype.gainRewardExp = function(exp) {
    $gameParty.allMembers().forEach(function(actor) {
      actor.gainExp(exp);
    });
    this.setMapPopup('' + exp + TextManager.exp, '#ffe0ff', -40, -0.2, 0);
  };
  
  // 撃破報酬（お金）の獲得
  Game_Event.prototype.gainRewardGold = function(gold) {
    $gameParty.gainGold(gold);
    this.setMapPopup('' + gold + TextManager.currencyUnit, '#ffffe0', -64, -0.2, 0);
  };
  
  // 撃破報酬（アイテム）の獲得
  Game_Event.prototype.gainRewardItem = function(item, y) {
    $gameParty.gainItem(item, 1);
    this.setMapPopup('\\I[' + item.iconIndex + ']', '#000000', y, -4, 0.5);
  };
  
  // 泳ぎ状態の更新
  Game_Event.prototype.updateSwiming = function() {
    Game_Character.prototype.updateSwiming.call(this);
    if (Tomoaky.Param.JAUseEventSeSwim) {
      var origin_volume = Tomoaky.Param.JASeSwim.volume;
      var volume = Math.floor(origin_volume * ((15 - this.distFromCharacter($gamePlayer))) / 15);
      var se = {};
      se.name = Tomoaky.Param.JASeSwim.name;
      se.volume = Math.min(Math.max(volume, 0), 100);
      se.pitch = Tomoaky.Param.JASeSwim.pitch;
      if (this._realX < $gamePlayer._realX) {
        se.pan = Math.max(Math.floor((this._realX - $gamePlayer._realX) * 10, -100));
      } else {
        se.pan = Math.min(Math.floor((this._realX - $gamePlayer._realX) * 10, 100));
      }
      AudioManager.playSe(se);
    }
  };

  //-----------------------------------------------------------------------------
  // Game_Interpreter
  //

  // イベントの位置変更
  Game_Interpreter.prototype.command203 = function() {
      var character = this.character(this._params[0]);
      if (character) {
          if (this._params[1] === 0) {  // Direct designation
              character.locate(this._params[2] + 0.5, this._params[3] + 1);
          } else if (this._params[1] === 1) {  // Designation with variables
              var x = $gameVariables.value(this._params[2] + 0.5);
              var y = $gameVariables.value(this._params[3] + 1);
              character.locate(x, y);
          } else {  // Exchange with another event
              var character2 = this.character(this._params[2]);
              if (character2) {
                  character.swap(character2);
              }
          }
          if (this._params[4] > 0) {
              character.setDirection(this._params[4]);
          }
      }
      return true;
  };

  // 装備の変更
  var _Game_Interpreter_command319 = Game_Interpreter.prototype.command319;
  Game_Interpreter.prototype.command319 = function() {
    _Game_Interpreter_command319.call(this);
    if (!$gameParty.inBattle()) {
      $gamePlayer.requestRefresh();
    }
    return true;
  };

  // プラグインコマンド
  var _Game_Interpreter_pluginCommand = Game_Interpreter.prototype.pluginCommand;
  Game_Interpreter.prototype.pluginCommand = function(command, args) {
    _Game_Interpreter_pluginCommand.call(this, command, args);
    if (command === 'JumpAction') {
      switch (args[0]) {
      case 'hp_damage':
        var character = this.character(args[1]);
        if (character && character.isBattler()) {
          character.battler().clearResult();
          character.battler().gainHp(-Number(args[2]));
        }
        break;
      case 'hp':
        var character = this.character(args[1]);
        if (character && character.isBattler()) {
          $gameVariables.setValue(Number(args[2]), character.battler().hp);
        }
        break;
      case 'force_x':
        var character = this.character(args[1]);
        if (character) {
          character._vx = Number(args[2]);
        }
        break;
      case 'force_y':
        var character = this.character(args[1]);
        if (character) {
          character._vy = Number(args[2]);
        }
        break;
      case 'change_actor':
        var actor = $gameActors.actor(Number(args[1]));
        if (actor && actor.isAlive() && $gameParty.members().contains(actor)) {
          var newIndex = $gameParty.members().indexOf(actor);
          if ($gamePlayer._memberIndex != newIndex) {
            $gamePlayer._memberIndex = newIndex;
            $gamePlayer.refresh();
            $gamePlayer.battler().requestEffect('appear');
          }
        }
        break;
      case 'addPopup':
        var character = this.character(args[1]);
        if (character) {
          character.setMapPopup(args[2], args[3]);
        }
        break;
      }
    }
  };

  //-----------------------------------------------------------------------------
  // Sprite_Character
  //
/*
  // メンバ変数の初期化
  var _Sprite_Character_initMembers = Sprite_Character.prototype.initMembers;
  Sprite_Character.prototype.initMembers = function() {
    _Sprite_Character_initMembers.call(this);
    this._damages = [];
    this._popups = [];
    this._effectType = null;
    this._effectDuration = 0;
    this._shake = 0;
  };

  // フレーム更新
  var _Sprite_Character_update = Sprite_Character.prototype.update;
  Sprite_Character.prototype.update = function() {
    _Sprite_Character_update.call(this);
    this.updateDamagePopup();
    this.updateMapPopup();
    if (this._character.isBattler()) {
      this.updateEffect();
    }
  };

  // その他の更新
  var _Sprite_Character_updateOther = Sprite_Character.prototype.updateOther;
  Sprite_Character.prototype.updateOther = function() {
    if (!this.isEffecting()) {
      _Sprite_Character_updateOther.call(this);
    }
  };

  // ダメージポップアップの更新
  Sprite_Character.prototype.updateDamagePopup = function() {
    if (this._character.isBattler()) {
      this.setupDamagePopup();
    }
    if (this._damages.length > 0) {
      for (var i = 0; i < this._damages.length; i++) {
        this._damages[i].update();
        this._damages[i].x = this.x;
        this._damages[i].y = this.y;
      }
      if (!this._damages[0].isPlaying()) {
        this.parent.removeChild(this._damages[0]);
        this._damages.shift();
      }
    }
  };

  // ダメージポップアップのセット
  Sprite_Character.prototype.setupDamagePopup = function() {
    var battler = this._character.battler();
    if (battler.isDamagePopupRequested()) {
      var sprite = new Sprite_MapDamage();
      sprite.x = this.x;
      sprite.y = this.y;
      sprite.z = this.z + 1;
      sprite.setup(battler);
      this._damages.push(sprite);
      this.parent.addChild(sprite);
      battler.clearDamagePopup();
      battler.clearActionResult();
    }
  };

  // マップ用ポップアップの更新
  Sprite_Character.prototype.updateMapPopup = function() {
    this.setupMapPopup();
    if (this._popups.length > 0) {
      for (var i = this._popups.length - 1; i >= 0; i--) {
        this._popups[i].update();
        this._popups[i].x = this.x;
        this._popups[i].y = this.y;
        if (!this._popups[i].isPlaying()) {
          this.parent.removeChild(this._popups[i]);
          this._popups.splice(i, 1);
        }
      }
    }
  };
  
  // マップ用ポップアップのセット
  Sprite_Character.prototype.setupMapPopup = function() {
    while (this._character.isMapPopupExist()) {
      var sprite = new Sprite_MapPopup();
      sprite.x = this.x;
      sprite.y = this.y;
      var popup = this._character.getMapPopup();
      var re = /\\I\[(\d+)\]/i;
      var match = re.exec(popup.text);
      if (match) {
        sprite.z = this.z + 1;
        sprite.setup(popup, Number(match[1]));
      } else {
        sprite.z = this.z + 2;
        sprite.setup(popup, -1);
      }
      this._popups.push(sprite);
      this.parent.addChild(sprite);
    }
  };

  // エフェクトのセット
  Sprite_Character.prototype.setupEffect = function() {
    if (this._character.battler().isEffectRequested()) {
      this.startEffect(this._character.battler().effectType());
      this._character.battler().clearEffect();
    }
  };

  // エフェクトの開始
  Sprite_Character.prototype.startEffect = function(effectType) {
    this._effectType = effectType;
    switch (this._effectType) {
    case 'appear':
      this.startAppear();
      break;
    case 'whiten':
      this.startWhiten();
      break;
    case 'blink':
      this.startBlink();
      break;
    case 'collapse':
      this.startCollapse();
      break;
    case 'bossCollapse':
      this.startBossCollapse();
      break;
    }
    this.revertToNormal();
  };

  // 出現エフェクトの開始
  Sprite_Character.prototype.startAppear = function() {
    this._effectDuration = 16;
  };

  // 白フラッシュエフェクトの開始
  Sprite_Character.prototype.startWhiten = function() {
    this._effectDuration = 16;
  };

  // 点滅エフェクトの開始
  Sprite_Character.prototype.startBlink = function() {
    this._effectDuration = this._character._invincibleTime;
  };

  // 崩壊エフェクトの開始
  Sprite_Character.prototype.startCollapse = function() {
    this._effectDuration = 32;
    this._appeared = false;
  };

  // ボス崩壊エフェクトの開始
  Sprite_Character.prototype.startBossCollapse = function() {
    this._effectDuration = this.bitmap.height;
    this._appeared = false;
  };

  // エフェクトの更新
  Sprite_Character.prototype.updateEffect = function() {
    this.setupEffect();
    if (this._effectDuration > 0) {
      this._effectDuration--;
      switch (this._effectType) {
      case 'appear':
        this.updateAppear();
        break;
      case 'whiten':
        this.updateWhiten();
        break;
      case 'blink':
        this.updateBlink();
        break;
      case 'collapse':
        this.updateCollapse();
        break;
      case 'bossCollapse':
        this.updateBossCollapse();
        break;
      }
      if (this._effectDuration === 0) {
        this._effectType = null;
        this.setBlendColor([0, 0, 0, 0]);
      }
    }
  };

  // エフェクトが実行中かどうか
  Sprite_Character.prototype.isEffecting = function() {
    return this._effectType !== null;
  };

  // スプライトのエフェクト設定を元に戻す
  Sprite_Character.prototype.revertToNormal = function() {
    this._shake = 0;
    this.blendMode = 0;
    this.opacity = 255;
    this.setBlendColor([0, 0, 0, 0]);
  };

  // 出現エフェクトの更新
  Sprite_Character.prototype.updateAppear = function() {
    this.opacity = (16 - this._effectDuration) * 16;
  };

  // 白フラッシュエフェクトの更新
  Sprite_Character.prototype.updateWhiten = function() {
    var alpha = 128 - (16 - this._effectDuration) * 10;
    this.setBlendColor([255, 255, 255, alpha]);
  };

  // 点滅エフェクトの更新
  Sprite_Character.prototype.updateBlink = function() {
    this.opacity = (this._effectDuration % 10 < 5) ? 255 : 0;
  };

  // 崩壊エフェクトの更新
  Sprite_Character.prototype.updateCollapse = function() {
    this.blendMode = Graphics.BLEND_ADD;
    this.setBlendColor([255, 128, 128, 128]);
    this.opacity *= this._effectDuration / (this._effectDuration + 1);
  };

  // ボス崩壊エフェクトの更新
  Sprite_Character.prototype.updateBossCollapse = function() {
    this._shake = this._effectDuration % 2 * 4 - 2;
    this.blendMode = Graphics.BLEND_ADD;
    this.opacity *= this._effectDuration / (this._effectDuration + 1);
    this.setBlendColor([255, 255, 255, 255 - this.opacity]);
    if (this._effectDuration % 20 === 19) {
      SoundManager.playBossCollapse2();
    }
  };
*/
  //-----------------------------------------------------------------------------
  // Sprite_MapDamage
  //

  function Sprite_MapDamage() {
    this.initialize.apply(this, arguments);
  }

  Sprite_MapDamage.prototype = Object.create(Sprite_Damage.prototype);
  Sprite_MapDamage.prototype.constructor = Sprite_MapDamage;

  // セットアップ
  Sprite_MapDamage.prototype.setup = function(target) {
    var result = target._actionResult;
    if (result.missed || result.evaded) {
      this.createMiss();
    } else if (result.hpAffected) {
      this.createDigits(0, result.hpDamage);
    } else if (target.isAlive() && result.mpDamage !== 0) {
      this.createDigits(2, result.mpDamage);
    }
    if (result.critical) {
      this.setupCriticalEffect();
    }
  };

  //-----------------------------------------------------------------------------
  // Sprite_MapPopup
  //

  function Sprite_MapPopup() {
    this.initialize.apply(this, arguments);
  }

  Sprite_MapPopup.prototype = Object.create(Sprite.prototype);
  Sprite_MapPopup.prototype.constructor = Sprite_MapPopup;

  Sprite_MapPopup.prototype.initialize = function() {
    Sprite.prototype.initialize.call(this);
    this._duration = 150;
  };

  Sprite_MapPopup.prototype.setup = function(popup, iconIndex) {
    var sprite = new Sprite();
    if (iconIndex >= 0) {
      sprite.bitmap = ImageManager.loadSystem('IconSet');
      var pw = Window_Base._iconWidth;
      var ph = Window_Base._iconHeight;
      var sx = iconIndex % 16 * pw;
      var sy = Math.floor(iconIndex / 16) * ph;
      sprite.setFrame(sx, sy, pw, ph);
    } else {
      sprite.bitmap = new Bitmap(160, 32);
      sprite.bitmap.outlineColor = 'black';
      sprite.bitmap.outlineWidth = 5;
      sprite.bitmap.fontSize = 28;
      sprite.bitmap.textColor = popup.color;
      sprite.bitmap.drawText(popup.text, 0, 0, 160, 32, 'center');
    }
    sprite.anchor.x = 0.5;
    sprite.anchor.y = 1;
    sprite.y = popup.ry;
    sprite.ry = sprite.y;
    sprite.by = sprite.y + 40;
    sprite.dy = popup.dy;
    sprite.g = popup.g;
    this.addChild(sprite);
  };

  Sprite_MapPopup.prototype.update = function() {
    Sprite.prototype.update.call(this);
    if (this._duration > 0) {
      this._duration--;
      for (var i = 0; i < this.children.length; i++) {
        var sprite = this.children[i];
        sprite.dy += sprite.g;
        sprite.ry += sprite.dy;
        if (sprite.ry >= sprite.by) {
            sprite.ry = sprite.by;
            sprite.dy *= -0.6;
        }
        sprite.y = Math.round(sprite.ry);
      }
    }
    this.updateOpacity();
  };

  Sprite_MapPopup.prototype.updateOpacity = function() {
    if (this._duration < 10) {
        this.opacity = 255 * this._duration / 10;
    }
  };

  Sprite_MapPopup.prototype.isPlaying = function() {
    return this._duration > 0;
  };

  //-----------------------------------------------------------------------------
  // Spriteset_Map
  //

  // 飛行船の影の作成
  Spriteset_Map.prototype.createShadow = function() {
  };

  // 飛行船の影の更新
  Spriteset_Map.prototype.updateShadow = function() {
  };

  //-----------------------------------------------------------------------------
  // Scene_Map
  //

  var _Scene_Map_start = Scene_Map.prototype.start;
  Scene_Map.prototype.start = function() {
    _Scene_Map_start.call(this);
    $gamePlayer.refresh();
  };

  Scene_Base.prototype.checkGameover = function() {
  };

  Scene_Map.prototype.processMapTouch = function() {
  };

})();
