//=============================================================================
// TMVplugin - シューティング
// 作者: tomoaky (http://hikimoki.sakura.ne.jp/)
// Version: 0.11b
// 最終更新日: 2016/06/03
//=============================================================================

/*:
 * @plugindesc プレイヤーとイベントに弾を発射する機能を追加します。
 *
 * @author tomoaky (http://hikimoki.sakura.ne.jp/)
 *
 * @param bulletFileName
 * @desc 弾画像のファイル名（ %1 がインデックスと置き換わります）
 * 初期値: shootingBullet%1
 * @default shootingBullet%1
 *
 * @param shotKey
 * @desc プレイヤーの弾発射に使用するキー
 * 初期値: A
 * @default A
 *
 * @param deadSwitch
 * @desc イベントが戦闘不能になったときにオンになるセルフスイッチ
 * 初期値: A
 * @default A
 *
 * @param resetDeadSwitch
 * @desc マップ移動時に deadSwitch をオフにする
 * 初期値: 1（ 0 = 無効 / 1 = 有効）
 * @default 1
 *
 * @param defaultDeadAnimeId
 * @desc 戦闘不能時に表示するアニメーション番号の初期値
 * 初期値: 67
 * @default 67
 *
 * @param playerDeadEventId
 * @desc 先頭のアクターが戦闘不能時に実行するコモンイベント番号
 * 初期値: 0（ 0 = 無効 / 1以上 = 該当するコモンイベント起動）
 * @default 0
 *
 * @param useGameover
 * @desc 全滅時にゲームオーバーシーンへ移行するかどうか
 * 初期値: 1（ 0 = 移行しない / 1 = 移行する）
 * @default 1
 *
 * @param maxPlayerBullet
 * @desc 同時に存在できるプレイヤー弾の最大数
 * 初期値: 128
 * @default 128
 *
 * @param maxEnemyBullet
 * @desc 同時に存在できるエネミー弾の最大数
 * 初期値: 128
 * @default 128
 *
 * @param bulletSizeTable
 * @desc 弾の当たり判定の大きさ（ドット数）
 * 初期値: 6,6,6,6,6,6,6,6
 * @default 6,6,6,6,6,6,6,6
 *
 * @param bulletBlendTable
 * @desc 弾のブレンドモード
 * 初期値: 0,0,0,0,0,0,0,0
 * @default 0,0,0,0,0,0,0,0
 *
 * @param equipDummyX
 * @desc 装備シーンに表示するダミーのＸ座標
 * 初期値: 408
 * @default 408
 *
 * @param equipDummyY
 * @desc 装備シーンに表示するダミーのＹ座標
 * 初期値: 312
 * @default 312
 *
 * @param useExpPopup
 * @desc 経験値ポップアップを表示するか（要:CommonPopupCore.js）
 * 初期値: 1（ 0 = 表示しない / 1 = 表示する）
 * @default 1
 *
 * @param useGoldPopup
 * @desc お金ポップアップを表示するか（要:CommonPopupCore.js）
 * 初期値: 1（ 0 = 表示しない / 1 = 表示する）
 * @default 1
 *
 * @param padButtons
 * @desc 利用するパッドボタンのコード
 * 初期値: ok,cancel,menu,shift,shot,pageup,pagedown
 * @default ok,cancel,menu,shift,shot,pageup,pagedown
 *
 * @param padButtonNames
 * @desc パッドボタンの名前
 * padButtonsと同じ並び順でボタンの名前を設定してください
 * @default 決定,キャンセル,メニュー,ダッシュ,ショット,キャラ変更(前),キャラ変更(次)

 * @param defaultPadButtons
 * @desc パッドボタンの初期配置
 * 初期値: ボタン 1 ～ 12 に対応するコードを設定してください
 * @default cancel,ok,shift,menu,pageup,pagedown,shot,shot,shot,shot,shot,shot
 *
 * @param padConfigCommand
 * @desc パッドボタン配置のコマンド名
 * 初期値: パッドボタン配置
 * @default パッドボタン配置
 *
 * @help
 * 必要なグラフィック:
 *   弾画像を shootingBullet1.png というファイル名で img/system フォルダに
 *   入れてください。ひとつのファイルには、横に８つ、縦に任意の数の弾画像を
 *   入れることができます。
 *   ファイル名の数字部分を変えて複数のファイルを使用することもできます、
 *   サイズが違う弾、当たり判定が違う弾を作る場合など、必要に応じてファイル
 *   を増やしてください。
 *
 * プラグインパラメータ補足:
 *   bulletFileName
 *   ここで弾画像として使用するファイル名を変更することができます、初期設定
 *   の shootingBullet%1 は %1 の部分がインデックスと置き換わり、
 *   shootingBullet1.png, shootingBullet2.png ～ のような連番ファイルが使用
 *   できるようになります。特に理由がなければ変更する必要のないパラメータで
 *   す。
 *
 *   bulletSizeTable
 *   弾画像ファイルごとに当たり判定を設定します、初期設定の 6,6,6,6,6,6,6,6
 *   は shootingBullet1.png ～ shootingBullet8.png までのすべての弾が、弾の
 *   中心から半径６ドットの当たり判定をもつという設定になります。
 *   shootingBullet9.png 以降を使用する場合はこのパラメータの数も増やして
 *   ください。
 *
 *   bulletBlendTable
 *   弾画像の合成方法を設定します、値と合成方法の対応は下記のとおりです。
 *   （ 0 = 通常 / 1 = 加算 / 2 = 乗算 / 3 = スクリーン ）
 *   bulletSizeTable と同様に必要に応じてパラメータの数を増やしてください。
 *
 * プラグインコマンド:
 *   startAutoShot
 *   このコマンドが実行されるとプレイヤーキャラクターが自動的に弾を撃つよう
 *   になります。この変更はパーティメンバーにも適用されます。
 * 
 *   stopAutoShot
 *   このコマンドが実行されるとプレイヤーキャラクターの自動射撃が止まります、
 *   この変更はパーティメンバーにも適用されます。
 *
 *   nwayShot 3 0.4 0 0.1 60 1 3 1
 *   このコマンドを実行したイベントが弾を発射します、コマンド名に続く数値は
 *   左から 弾数、間隔、角度、速度、寿命、タイプ、インデックス、スキル番号
 *   となります。
 *   タイプが 1 で、インデックスが 3 なら、弾画像として shootingBullet1.png
 *   の最上段、左から４つ目を使用します。（インデックスは 0 が先頭です）
 *
 *   nwayAim 3 0.4 0 0.1 60 1 3 1
 *   このコマンドを実行したイベントが自機狙いの弾を発射します。
 *   角度が 0 以外の場合は、自機がいる方向にその値を加算した角度で発射され
 *   ます。
 *
 *   nallShot 8 0 0.1 60 1 3 1
 *   このコマンドを実行したイベントが全方位に弾を発射します、コマンド名に
 *   続く数値は左から 弾数、角度、速度、寿命、タイプ、インデックス、
 *   スキル番号 となります。
 *   弾の間隔は全方位に発射されるように自動で調整されます。
 *
 *   nallAim 8 0 0.1 60 1 3 1
 *   nallShotの自機狙い版です。
 *
 *   stopPlayerShot
 *   プレイヤー（パーティメンバー含む）の弾発射を手動、自動問わず禁止します。
 *
 *   startPlayerShot
 *   プレイヤー（パーティメンバー含む）の弾発射禁止状態を解除します。
 *
 *   stopEnemyShot
 *   イベントの弾発射を禁止します、並列イベントで弾を発射している場合は
 *   弾発射のコマンドのみが無効化され、そのほかのコマンドは実行されます。
 *
 *   startEnemyShot
 *   イベントの弾発射禁止状態を解除します。
 *
 *   deletePlayerBullets
 *   プレイヤー（パーティメンバー含む）が発射したすべての弾を消去します。
 *
 *   deleteEnemyBullets
 *   イベントが発射したすべての弾を消去します。
 *
 * メモ欄タグ（アクター、装備、ステート）:
 *   <shotWay:3>
 *   一度に発射される弾の数を設定します。
 *
 *   <shotSpace:0.4>
 *   一度に発射される弾同士の間隔（角度）を設定します。
 *
 *   <shotSpeed:0.1>
 *   弾の移動速度を設定します。
 *
 *   <shotCount:60>
 *   弾が消えるまでの時間をフレーム数で設定します。
 *
 *   <shotInterval:20>
 *   再発射までの発射不可時間をフレーム数で設定します。
 *
 * メモ欄タグ（武器）:
 *   <shotType:1>
 *   弾のグラフィックとして使う画像ファイルを設定します。値が 1 なら
 *   shootingBullet1.png を使用します。
 *
 *   <shotIndex:3>
 *   shotTypeタグで選択した画像ファイルの何番目の弾を使用するか設定します。
 *
 *   <shotSkill:1>
 *   弾が相手に当たったときのダメージ計算に使うスキルを設定します。
 *
 * メモ欄タグ（イベント）:
 *   <enemy:1>
 *   イベントのパラメータとして利用する敵キャラ番号を設定します。
 *
 *   <cw:0.375>
 *   イベントと弾の当たり判定サイズ（横幅）をイベントの中心から左（右）端
 *   までの長さで設定します。値は 1.0 でマップのタイル１マス分になります。
 *   このタグがない場合は初期値として 0.375 を使用します。
 *
 *   <ch:0.75>
 *   イベントと弾の当たり判定サイズ（高さ）をイベントの足元から上端までの
 *   長さで設定します。値は 1.0 でマップのタイル１マス分になります。
 *   このタグがない場合は初期値として 0.75 を使用します。
 *
 * メモ欄タグ（アクター）:
 *   <cw:0.375>
 *   イベント用のものと同じです。
 *
 *   <ch:0.75>
 *   イベント用のものと同じです。
 *
 *  <deadCharacter:!Flame,5>
 *  このアクターが戦闘不能になったとき、歩行グラフィックを変更します。
 *  この例では !Flame.png の下段、左から２番目のグラフィックが採用されます。
 *
 * メモ欄タグ（アクター、敵キャラ）:
 *   <deadAnime:67>
 *   戦闘不能ステートが付加されたときに表示するアニメーションを設定します。
 *
 * 併用可能（動作確認済み）プラグイン:
 *   SAN_AnalogMove.js ver1.38
 *   作者: サンシロさん（http://rev2nym.blog.fc2.com/）
 *
 *   CharacterPopupDamage.js Version 1.0.2
 *   作者: トリアコンタンさん（http://triacontane.blogspot.jp/）
 *
 *   CommonPopupCore.js ver1.02
 *   GetInformation.js ver1.09
 *   作者: Yanaさん（https://twitter.com/yanatsuki_）
 *
 *   上記プラグインを併用したことによる不具合の報告は、併用プラグインの
 *   作者様ではなく、必ずtomoakyへお願いします。
 *
 * その他注意点など:
 *   shotWay や shotSpace などのメモ欄タグは、アクター、装備、ステートの
 *   合計値が採用されます。shotWay が 0 の場合、または shotCount が 0 の
 *   場合はは弾が発射されないか、発射後すぐに消滅してしまいます、素手の状態
 *   でも弾を撃ちたい場合はアクターにも shotWay と shotCount タグを設定する
 *   必要があります。
 *
 *   パッドボタン配置は save フォルダ内の config.rpgsave に保存されます、
 *   このファイルが削除されるまでは初期配置の設定を変更しても適用されません。
 */

var Imported = Imported || {};
Imported.TMShooting = true;

(function() {

  var parameters = PluginManager.parameters('TMShooting');
  var bulletFileName     = parameters['bulletFileName'];
  var deadSwitch         = parameters['deadSwitch'];
  var resetDeadSwitch    = parameters['resetDeadSwitch'] === '1' ? true : false;
  var defaultDeadAnimeId = +parameters['defaultDeadAnimeId'];
  var playerDeadEventId  = +parameters['playerDeadEventId'];
  var useGameover        = parameters['useGameover'] === '1' ? true : false;
  var maxPlayerBullet    = parameters['maxPlayerBullet'];
  var maxEnemyBullet     = parameters['maxEnemyBullet'];
  var bulletSizeTable = [0];
  parameters['bulletSizeTable'].split(',').forEach(function(size) {
    bulletSizeTable.push(+size / 48);
  });
  var bulletBlendTable = [0];
  parameters['bulletBlendTable'].split(',').forEach(function(blendMode) {
    bulletBlendTable.push(+blendMode);
  });
  var equipDummyX  = +parameters['equipDummyX'];
  var equipDummyY  = +parameters['equipDummyY'];
  var useExpPopup  = parameters['useExpPopup'] === '1' ? true : false;
  var useGoldPopup = parameters['useGoldPopup'] === '1' ? true : false;
  var padButtons        = parameters['padButtons'].split(',');
  var padButtonNames    = parameters['padButtonNames'].split(',');
  var defaultPadButtons = parameters['defaultPadButtons'].split(',');
  var padConfigCommand  = parameters['padConfigCommand'];
  
  //-----------------------------------------------------------------------------
  // Input
  //

  if (parameters['shotKey']) {
    Input.keyMapper[parameters['shotKey'].charCodeAt()] = 'shot';
  }
  
  //-----------------------------------------------------------------------------
  // ConfigManager
  //

  ConfigManager.getPadButton = function(id) {
    return Input.gamepadMapper[id];
  };
  
  ConfigManager.setPadButton = function(id, code) {
    Input.gamepadMapper[id] = code;
  };

  var _ConfigManager_makeData = ConfigManager.makeData;
  ConfigManager.makeData = function() {
    var config = _ConfigManager_makeData.call(this);
    for (var i = 0; i < 12; i++) {
      var key = 'padButton' + i;
      config[key] = this.getPadButton(i);
    }
    return config;
  };

  var _ConfigManager_applyData = ConfigManager.applyData;
  ConfigManager.applyData = function(config) {
    _ConfigManager_applyData.call(this, config);
    for (var i = 0; i < 12; i++) {
      var key = 'padButton' + i;
      this.setPadButton(i, this.readPadButton(config, i));
    }
  };

  ConfigManager.readPadButton = function(config, id) {
    var key = 'padButton' + id;
    return config[key] || defaultPadButtons[id];
  };

  //-----------------------------------------------------------------------------
  // Game_System
  //
  
  Game_System.prototype.isPlayerShotEnabled = function() {
    if (this._playerShotEnabled === undefined) {
      this._playerShotEnabled = true;
    }
    return this._playerShotEnabled;
  };

  Game_System.prototype.setPlayerShotEnabled = function(value) {
    this._playerShotEnabled = value;
  };
  
  Game_System.prototype.isEnemyShotEnabled = function() {
    if (this._enemyShotEnabled === undefined) {
      this._enemyShotEnabled = true;
    }
    return this._enemyShotEnabled;
  };

  Game_System.prototype.setEnemyShotEnabled = function(value) {
    this._enemyShotEnabled = value;
  };
  
  //-----------------------------------------------------------------------------
  // Game_Action
  //

  var _Game_Action_subject = Game_Action.prototype.subject;
  Game_Action.prototype.subject = function() {
    if (this._subjectActorId === 0 && this._subjectEnemyIndex < 0) {
      return $gameMap.event(-this._subjectEnemyIndex).battler();
    } else {
      return _Game_Action_subject.call(this);
    }
  };

  //-----------------------------------------------------------------------------
  // Game_Actor
  //

  var _Game_Actor_refresh = Game_Actor.prototype.refresh;
  Game_Actor.prototype.refresh = function() {
    _Game_Actor_refresh.call(this);
    this.refreshShotParam();
    this.refreshDeadCharacter();
  };

  Game_Actor.prototype.refreshDeadCharacter = function() {
    var actor = this.actor();
    var deadCharacter = actor.meta.deadCharacter;
    if (deadCharacter) {
      deadCharacter = deadCharacter.split(',');
      this._deadCharacterName = deadCharacter[0];
      this._deadCharacterIndex = +deadCharacter[1];
    } else {
      this._deadCharacterName = null;
      this._deadCharacterIndex = null;
    }
  };
  
  Game_Actor.prototype.refreshShotParam = function() {
    this._shotParams = {};
    var data = this.actor();
    this._shotParams.way      = +(data.meta.shotWay || 0);
    this._shotParams.space    = +(data.meta.shotSpace || 0);
    this._shotParams.speed    = +(data.meta.shotSpeed || 0);
    this._shotParams.count    = +(data.meta.shotCount || 0);
    this._shotParams.interval = +(data.meta.shotInterval || 0);
    var items = this.equips().concat(this.states());
    for (var i = 0; i < items.length; i++) {
      var item = items[i];
      if (item) {
        this._shotParams.way      += +(item.meta.shotWay || 0);
        this._shotParams.space    += +(item.meta.shotSpace || 0);
        this._shotParams.speed    += +(item.meta.shotSpeed || 0);
        this._shotParams.count    += +(item.meta.shotCount || 0);
        this._shotParams.interval += +(item.meta.shotInterval || 0);
      }
    }
    var weapon = this.weapons()[0];
    if (weapon) {
      this._shotParams.type    = +(weapon.meta.shotType || 1);
      this._shotParams.index   = +(weapon.meta.shotIndex || 0);
      this._shotParams.skillId = +(weapon.meta.shotSkill || this.attackSkillId());
    } else {
      this._shotParams.type    = 1;
      this._shotParams.index   = 0;
      this._shotParams.skillId = this.attackSkillId();
    }
  };
  
  Game_Actor.prototype.shotParams = function() {
    return this._shotParams;
  };
  
  Game_Actor.prototype.deadCharacterName = function() {
    return this._deadCharacterName;
  };

  Game_Actor.prototype.deadCharacterIndex = function() {
    return this._deadCharacterIndex;
  };
  
  //-----------------------------------------------------------------------------
  // Game_Map
  //

  // セットアップ
  var _Game_Map_setup = Game_Map.prototype.setup;
  Game_Map.prototype.setup = function(mapId) {
    _Game_Map_setup.call(this, mapId);
    this.setupBullets();
    this.createBulletPassageTable();
    if (resetDeadSwitch) {
      this.events().forEach(function(event) {
        var key = [this._mapId, event.eventId(), deadSwitch];
        $gameSelfSwitches.setValue(key, false);
      });
    }
  };

  // 弾のセットアップ
  Game_Map.prototype.setupBullets = function() {
    this._playerBullets = [];
    this._alivePlayerBullets = [];
    this._blankPlayerBullets = [];
    for (var i = 0; i < maxPlayerBullet; i++) {
      this._playerBullets.push(new Game_PlayerBullet());
      this._blankPlayerBullets.push(i);
    }
    this._enemyBullets = [];
    this._aliveEnemyBullets = [];
    this._blankEnemyBullets = [];
    for (var i = 0; i < maxEnemyBullet; i++) {
      this._enemyBullets.push(new Game_EnemyBullet());
      this._blankEnemyBullets.push(i);
    }
  };

  Game_Map.prototype.playerBullets = function() {
    return this._playerBullets;
  };

  Game_Map.prototype.enemyBullets = function() {
    return this._enemyBullets;
  };
  
  // 弾の通行チェックに利用するテーブルを作成する
  Game_Map.prototype.createBulletPassageTable = function() {
    this._bulletPassageTable = [];
    var flags = this.tilesetFlags();
    for (var x = 0; x < $dataMap.width; x++) {
      this._bulletPassageTable.push([]);
      for (var y = 0; y < $dataMap.height; y++) {
        var tiles = this.layeredTiles(x, y);
        var passage = false;
        for (var i = 0; i < tiles.length; i++) {
          var flag = flags[tiles[i]];
          if ((flag & 0x10) !== 0) {
            continue;
          }
          if ((flag & 0x0f) !== 0x0f) {
            passage = true;
            break;
          }
          if ((flag & 0x0f) !== 0) {
            break;
          }
        }
        this._bulletPassageTable[x][y] = passage;
      }
    }
  };

  // 弾の通行チェック
  Game_Map.prototype.checkPassageBullet = function(x, y) {
    return this.isValid(x, y) && this._bulletPassageTable[x][y];
  };

  // フレーム更新
  var _Game_Map_update = Game_Map.prototype.update;
  Game_Map.prototype.update = function(sceneActive) {
    _Game_Map_update.call(this, sceneActive);
    this.updateBullets();
  };

  // 弾の更新
  Game_Map.prototype.updateBullets = function() {
    for (var i = this._alivePlayerBullets.length - 1; i >= 0; i--) {
      var index = this._alivePlayerBullets[i];
      if (!this._playerBullets[index].update()) {
        this._alivePlayerBullets.splice(i, 1);
        this._blankPlayerBullets.push(index);
      }
    }
    for (var i = this._aliveEnemyBullets.length - 1; i >= 0; i--) {
      var index = this._aliveEnemyBullets[i];
      
      if (!this._enemyBullets[index].update()) {
        this._aliveEnemyBullets.splice(i, 1);
        this._blankEnemyBullets.push(index);
      }
    }
  };

  // 弾の追加
  Game_Map.prototype.addBullet = function(x, y, z, vx, vy, angle, count, type,
                                          index, skillId, ownerId) {
    if (ownerId < 0) {
      if (this._blankPlayerBullets.length > 0) {
        var bulletIndex = this._blankPlayerBullets.shift();
        this._playerBullets[bulletIndex].setup(x, y, z, vx, vy, angle, count,
                                               type, index, skillId, ownerId);
        this._alivePlayerBullets.push(bulletIndex);
      }
    } else {
      if (this._blankEnemyBullets.length > 0) {
        var bulletIndex = this._blankEnemyBullets.shift();
        this._enemyBullets[bulletIndex].setup(x, y, z, vx, vy, angle, count,
                                              type, index, skillId, ownerId);
        this._aliveEnemyBullets.push(bulletIndex);
      }
    }
  };

  // プレイヤー弾の全削除
  Game_Map.prototype.clearPlayerBullets = function() {
    this._alivePlayerBullets.forEach(function(index) {
      this._playerBullets[index].erase();
    }, this);
    this._blankPlayerBullets.concat(this._alivePlayerBullets);
    this._alivePlayerBullets = [];
  };

  // エネミー弾の全削除
  Game_Map.prototype.clearEnemyBullets = function() {
    this._aliveEnemyBullets.forEach(function(index) {
      this._enemyBullets[index].erase();
    }, this);
    this._blankEnemyBullets.concat(this._aliveEnemyBullets);
    this._aliveEnemyBullets = [];
  };

  // すべての弾を削除
  Game_Map.prototype.clearAllBullets = function() {
    this.clearPlayerBullets();
    this.clearEnemyBullets();
  };

  //-----------------------------------------------------------------------------
  // Game_Bullet
  //

  function Game_Bullet() {
    this.initialize.apply(this, arguments);
  }

  // 初期化
  Game_Bullet.prototype.initialize = function() {
    this._opacity = 0;
  };

  // セットアップ
  Game_Bullet.prototype.setup = function(x, y, z, vx, vy, angle, count, type,
                                         index, skillId, ownerId) {
    this._opacity = 255;
    this._x = x;
    this._y = y;
    this._z = z;
    this._vx = vx;
    this._vy = vy;
    this._angle = angle;
    this._count = count;
    if (this._type !== type) {
      this._type = type;
      this._bulletName = bulletFileName.format(type);
      this._collideSize = bulletSizeTable[type];
    }
    this._bulletIndex = index;
    this._skillId = skillId;
    this._ownerId = ownerId;
    this._mapCollide = !$dataSkills[skillId].meta.mapThrough;
  };

  // 存在状態判定
  Game_Bullet.prototype.isExist = function() {
    return this._count > 0;
  };

  // 不透明度の取得
  Game_Bullet.prototype.opacity = function() {
    return this._opacity;
  };

  // 画像ファイル名の取得
  Game_Bullet.prototype.bulletName = function() {
    return this._bulletName;
  };

  // 画像ファイルインデックスの取得
  Game_Bullet.prototype.bulletIndex = function() {
    return this._bulletIndex;
  };

  // 弾タイプの取得
  Game_Bullet.prototype.type = function() {
    return this._type;
  };

  // 角度の取得
  Game_Bullet.prototype.angle = function() {
    return this._angle;
  };

  // 画面 X 座標の取得
  Game_Bullet.prototype.screenX = function() {
    var tw = $gameMap.tileWidth();
    return Math.round($gameMap.adjustX(this._x) * tw);
  };

  // 画面 Y 座標の取得
  Game_Bullet.prototype.screenY = function() {
    var th = $gameMap.tileHeight();
    return Math.round($gameMap.adjustY(this._y) * th);
  };

  // 画面 Z 座標の取得
  Game_Bullet.prototype.screenZ = function() {
    return this._z;
  };

  // キャラクターがいる方向（角度）を取得
  Game_Bullet.prototype.angleToCharacter = function(character) {
    return Math.atan2(character._realY - character.collideH / 2 - this._y,
                      character._realX - this._x);
  };

  // プレイヤーがいる方向（角度）を取得
  Game_Bullet.prototype.angleToPlayer = function() {
    return this.angleToCharacter($gamePlayer);
  };

  // フレーム更新
  Game_Bullet.prototype.update = function() {
    this._x += this._vx;
    this._y += this._vy;
    this._count--;
    if (this._count <= 0 || this.updateCollide()) {
      this.erase();
      return false;
    }
    return true;
  };

  // 削除
  Game_Bullet.prototype.erase = function() {
    this._count = 0;
    this._opacity = 0;
  };

  // 弾によるダメージ処理
  Game_Bullet.prototype.executeDamage = function(character) {
	  //alert($gameMap.event(this._ownerId))//$gameMap._enemyBullets);
	  

    if (this._ownerId < 0) {
      if (this._ownerId === -1) {
        var owner = $gamePlayer;
      } else {
        var index = -this._ownerId - 2;
        var owner = $gamePlayer.followers().follower(index);
      }
    } else if (this._ownerId > 0) {
      var owner = $gameMap.event(this._ownerId);
      var dir = $gameMap._enemyBullets[this._ownerId]._angle;
      //alert(dir);
      //흔들리는 효과
      //Sprite_Character.startEffect(3);
      //this._character.battler().clearEffect();
      //$gameMap.events().concat($gamePlayer);
	  //$gamePlayer.jump(Math.cos(dir), Math.sin(dir));
      SoundManager.playSystemSound(21);
    } else {
      var owner = null;
    }
    var ownerBattler = owner ? owner.battler() : null;
    var target = character.battler();
    if (ownerBattler && target) {
      ownerBattler.clearActions();
      var action = new Game_Action(ownerBattler);
      action.setSkill(this._skillId);
      ownerBattler.setAction(0, action);
      ownerBattler.currentAction().apply(target);
      if (target.result().isStateAdded(target.deathStateId())) {
        character.battlerDead();
      }
      if (Game_CharacterBase.prototype.popupDamage) {
        this.showDamagePopup(character, owner);
      }
    }
  };

  // ダメージポップアップの表示
  Game_Bullet.prototype.showDamagePopup = function(character, owner) {
    var result = character.battler().result();
    if (result.isHit()) {
      var damageType = $dataSkills[this._skillId].damage.type;
      if (damageType > 0 && damageType % 2 === 1) {
        character.popupDamage(result.hpDamage, result.critical);
        if (result.drain) {
          owner.popupDamage(-result.hpDamage, false);
        }
      } else {
        character.popupMpDamage(result.mpDamage, result.critical);
        if (result.drain) {
          owner.popupMpDamage(-result.mpDamage, false);
        }
      }
    } else {
      character.popupMiss();
    }
  };
  
  // キャラクターと接触しているかどうかを返す
  Game_Bullet.prototype.isCollideCharacter = function(character) {
    var x = character._realX + 0.5 - this._x;
    var y = character._realY + 1 - this._y;
    return -this._collideSize <= x + character._collideW - 0.5 &&
           this._collideSize >= x - character._collideW + 0.5&&
           -this._collideSize <= y  - 0.5&&
           this._collideSize >= y - character._collideH + 0.5;
  };
  Game_Bullet.prototype.isCollideCharacter2 = function(character) {
	    var x = character._realX + 0.5 - this._x;
	    var y = character._realY + 1 - this._y;
	    return -this._collideSize <= x + character._collideW&&
	           this._collideSize >= x - character._collideW&&
	           -this._collideSize <= y&&
	           this._collideSize >= y - character._collideH;
	  };

  // マップと接触しているかどうかを返す
  Game_Bullet.prototype.isCollideMap = function() {
    var x = Math.floor(this._x);
    var y = Math.floor(this._y);
    return !$gameMap.checkPassageBullet(x, y);
  }

  //-----------------------------------------------------------------------------
  // Game_PlayerBullet
  //

  function Game_PlayerBullet() {
      this.initialize.apply(this, arguments);
  }

  Game_PlayerBullet.prototype = Object.create(Game_Bullet.prototype);
  Game_PlayerBullet.prototype.constructor = Game_PlayerBullet;

  // 몹이 캐릭터에게 맞았을 때
  Game_PlayerBullet.prototype.updateCollide = function() {
    if (this._mapCollide && this.isCollideMap()) {
      return true;
    } else {
      var events = $gameMap.events();
      for (var i = 0; i < events.length; i++) {
        var event = events[i];
        if (!event._through && this.isCollideCharacter2(event)) {
          this.executeDamage(event);
          SoundManager.playSystemSound(20);
          //alert(this.events);
         var dir = $gamePlayer.shotAngleFromDirection();
          var xPlus = Math.cos(dir);
          var yPlus = Math.sin(dir);
         event._x += xPlus;
         event._y += yPlus;
         var distance = Math.round(Math.sqrt(xPlus * xPlus + yPlus * yPlus));
         event._jumpPeak = 10 + distance - event._moveSpeed;
         event._jumpCount = event._jumpPeak * 2;
         event.resetStopCount();
         event.straighten();
         //event.jump(Math.cos(dir),Math.sin(dir));
          return true;
        }
      }
    }
    return false;
  };

  //-----------------------------------------------------------------------------
  // Game_EnemyBullet
  //

  function Game_EnemyBullet() {
      this.initialize.apply(this, arguments);
  }

  Game_EnemyBullet.prototype = Object.create(Game_Bullet.prototype);
  Game_EnemyBullet.prototype.constructor = Game_EnemyBullet;

  // 接触判定
  Game_EnemyBullet.prototype.updateCollide = function() {
    if (this._mapCollide && this.isCollideMap()) {
      return true;
    } else {
      if (this.isCollideCharacter($gamePlayer)) {
        var battler = $gamePlayer.battler();
        if (battler && battler.isAlive()) {
          this.executeDamage($gamePlayer);
          return true;
        }
      }
      return $gamePlayer.followers().visibleFollowers().some(function(follower) {
        if (this.isCollideCharacter(follower)) {
          if (follower.battler().isAlive()) {
            this.executeDamage(follower);
            return true;
          }
        }
        return false;
      }, this);
    }
  };

  //-----------------------------------------------------------------------------
  // Game_DummyBullet
  //

  function Game_DummyBullet() {
      this.initialize.apply(this, arguments);
  }

  Game_DummyBullet.prototype = Object.create(Game_Bullet.prototype);
  Game_DummyBullet.prototype.constructor = Game_DummyBullet;

  // 画面 X 座標の取得
  Game_DummyBullet.prototype.screenX = function() {
    var tw = $gameMap.tileWidth();
    return Math.round(this._x * tw);
  };

  // 画面 Y 座標の取得
  Game_DummyBullet.prototype.screenY = function() {
    var th = $gameMap.tileHeight();
    return Math.round(this._y * th);
  };

  // 接触判定
  Game_DummyBullet.prototype.updateCollide = function() {
    return false;
  };

  //-----------------------------------------------------------------------------
  // Game_Character
  //

  // メンバ変数の初期化
  var _Game_Character_initMembers = Game_Character.prototype.initMembers;
  Game_Character.prototype.initMembers = function() {
    _Game_Character_initMembers.call(this);
    this._collideW  = 0.375;
    this._collideH  = 0.75;
    this._shotDelay = 0;
  };

  // キャラクターのいる方向（角度）を取得
  Game_Character.prototype.angleToCharacter = function(character) {
    return Math.atan2(character._realY - character._collideH / 2 - (this._realY - this._collideH / 2),
                      character._realX - this._realX);
  };

  // プレイヤーのいる方向（角度）を取得
  Game_Character.prototype.angleToPlayer = function() {
    return this.angleToCharacter($gamePlayer);
  };

  // ｎ方向ショット
  Game_Character.prototype.nwayShot = function(n, space, angle, speed, count,
                                               type, index, skillId) {
    var ownerId = this.ownerId();
    if (ownerId < 0) {
      if (!$gameSystem.isPlayerShotEnabled()) {
        return;
      }
    } else {
      if (!$gameSystem.isEnemyShotEnabled()) {
        return;
      }
    }
    angle = angle - (space * (n - 1) / 2);
    var x = this._realX + 0.5;
    var y = this._realY + 1 - this.shiftY() / $gameMap.tileHeight() - this._collideH / 2;
    for (var i = 0; i < n; i++) {
      $gameMap.addBullet(x, y, 200 + i, Math.cos(angle) * speed,
                         Math.sin(angle) * speed, angle, count, type, index,
                         skillId, ownerId);
      angle += space;
    }
  };

  // 自機狙いｎ方向ショット
  Game_Character.prototype.nwayAim = function(n, space, angle, speed, count,
                                              type, index, skillId) {
    var a = angle + this.angleToPlayer();
    this.nwayShot(n, space, a, speed, count, type, index, skillId);
  };

  // 全方位ショット
  Game_Character.prototype.nallShot = function(n, angle, speed, count, type,
                                               index, skillId) {
    var ownerId = this.ownerId();
    if (ownerId < 0) {
      if (!$gameSystem.isPlayerShotEnabled()) {
        return;
      }
    } else {
      if (!$gameSystem.isEnemyShotEnabled()) {
        return;
      }
    }
    var space = Math.PI * 2 / n;
    var x = this._realX + 0.5;
    var y = this._realY + 1 - this.shiftY() / $gameMap.tileHeight() - this._collideH / 2;
    for (var i = 0; i < n; i++) {
      $gameMap.addBullet(x, y, 200 + i, Math.cos(angle) * speed,
                         Math.sin(angle) * speed, angle, count, type, index,
                         skillId, ownerId);
      angle += space;
    }
  };

  // 自機狙い全方位ショット
  Game_Character.prototype.nallAim = function(n, angle, speed, count, type,
                                              index, skillId) {
    var a = angle + this.angleToPlayer()
    this.nallShot(n, a, speed, count, type, index, skillId);
  };
  
  // 向いている方向から弾発射角度を返す
  Game_Character.prototype.shotAngleFromDirection = function() {
    if (Imported.SAN_AnalogMove) {
      return -this.analogMove()._directionRadian - Math.PI / 2;
    } else {
    	var character = $gamePlayer;
    	var mouse_x = TouchInput.x;
    	var mouse_y = TouchInput.y;
    	//return (Math.asin((mouse_y - character._realY)/Math.sqrt(Math.pow(mouse_x - character._realX,2) + Math.pow(mouse_y - character._realY,2))));
    	return (Math.PI * 0.5 -Math.atan2((mouse_x - character.screenX()),(mouse_y - character.screenY())));
      if (this._direction === 2) {
        return 879789;
      } else if (this._direction === 4) {
        return Math.PI;
      } else if (this._direction === 6) {
        return 0;
      } else {
        return 4.712388;
      }
    }
  };

  // バトラーが戦闘不能になったときの処理
  Game_Character.prototype.battlerDead = function() {
    var animeId = this._deadAnime || defaultDeadAnimeId;
    if (animeId) {
      this.requestAnimation(animeId);
    }
  };

  //-----------------------------------------------------------------------------
  // Game_Player
  //

  // メンバ変数の初期化
  var _Game_Player_initMembers = Game_Player.prototype.initMembers;
  Game_Player.prototype.initMembers = function() {
    _Game_Player_initMembers.call(this);
    this._autoShot = false;
  };
  
  // オート射撃のセット
  Game_Player.prototype.setAutoShot = function(autoShot) {
    this._autoShot = autoShot;
  };

  // バトラーを返す
  Game_Player.prototype.battler = function() {
    return $gameParty.leader();
  };

  // オーナーIDを返す
  Game_Player.prototype.ownerId = function() {
    return -1;
  };

  // フレーム更新
  var _Game_Player_update = Game_Player.prototype.update;
  Game_Player.prototype.update = function(sceneActive) {
    if (sceneActive) {
      this.shotByInput();
    }
    _Game_Player_update.call(this, sceneActive);
  };


  // 플레이어 슛 쏘기
  Game_Player.prototype.shotByInput = function() {
    var shotInput = TouchInput._mousePressed || this._autoShot; //Input.isPressed('shot')
    if (this._shotDelay > 0) {
      this._shotDelay--;
    } else if (shotInput) {
      var battler = this.battler();
      if (battler && battler.canMove()) {
        var shotParams = battler.shotParams();
        if (shotParams.way > 0) {
          var angle = this.shotAngleFromDirection();
          this.nwayShot(shotParams.way, shotParams.space, angle, shotParams.speed,
                        shotParams.count, shotParams.type, shotParams.index,
                        shotParams.skillId);
          SoundManager.playSystemSound(23);
          this._shotDelay = shotParams.interval;
        }
      }
    }
    this._followers.shot(shotInput);
  };

  // リフレッシュ
  var _Game_Player_refresh = Game_Player.prototype.refresh;
  Game_Player.prototype.refresh = function() {
    _Game_Player_refresh.call(this);
    var actor = $gameParty.leader();
    if (actor) {
      var data = actor.actor();
      this._collideW  = +(data.meta.cw || 0.375);
      this._collideH  = +(data.meta.ch || 0.75);
      this._deadAnime = +(data.meta.deadAnime || 0);
    }
  };

  var _Game_Player_characterName = Game_Player.prototype.characterName;
  Game_Player.prototype.characterName = function() {
    var actor = $gameParty.leader();
    if (actor && actor.isDead()) {
      var deadCharacterName = actor.deadCharacterName();
      if (deadCharacterName) {
        return deadCharacterName;
      }
    }
    return _Game_Player_characterName.call(this);
  };

  var _Game_Player_characterIndex = Game_Player.prototype.characterIndex;
  Game_Player.prototype.characterIndex = function() {
    var actor = $gameParty.leader();
    if (actor && actor.isDead()) {
      var deadCharacterIndex = actor.deadCharacterIndex();
      if (deadCharacterIndex !== null) {
        return deadCharacterIndex;
      }
    }
    return _Game_Player_characterIndex.call(this);
  };

  // バトラーが戦闘不能になったときの処理
  Game_Player.prototype.battlerDead = function() {
    Game_Character.prototype.battlerDead.call(this);
    if (playerDeadEventId) {
      $gameTemp.reserveCommonEvent(playerDeadEventId);
    }
  };

  //-----------------------------------------------------------------------------
  // Game_Follower
  //

  // バトラーを返す
  Game_Follower.prototype.battler = function() {
    return this.actor();
  };

  // オーナーIDを返す
  Game_Follower.prototype.ownerId = function() {
    return -this._memberIndex - 1;
  };

  var _Game_Follower_refresh = Game_Follower.prototype.refresh;
  Game_Follower.prototype.refresh = function() {
    _Game_Follower_refresh.call(this);
    var actor = this.actor();
    if (actor) {
      var data = actor.actor();
      this._collideW  = +(data.meta.cw || 0.375);
      this._collideH  = +(data.meta.ch || 0.75);
      this._deadAnime = +(data.meta.deadAnime || 0);
    }
  };

  Game_Follower.prototype.shot = function(shotInput) {
    if (this._shotDelay > 0) {
      this._shotDelay--;
    } else if (shotInput) {
      var actor = this.actor();
      if (actor && actor.canMove()) {
        var shotParams = actor.shotParams();
        if (shotParams.way > 0) {
          var angle = this.shotAngleFromDirection();
          this.nwayShot(shotParams.way, shotParams.space, angle, shotParams.speed,
                        shotParams.count, shotParams.type, shotParams.index,
                        shotParams.skillId);
          this._shotDelay = shotParams.interval;
        }
      }
    }
  };
  
  var _Game_Follower_characterName = Game_Follower.prototype.characterName;
  Game_Follower.prototype.characterName = function() {
    var actor = this.actor();
    if (actor && actor.isDead()) {
      var deadCharacterName = actor.deadCharacterName();
      if (deadCharacterName) {
        return deadCharacterName;
      }
    }
    return _Game_Follower_characterName.call(this);
  };

  var _Game_Follower_characterIndex = Game_Follower.prototype.characterIndex;
  Game_Follower.prototype.characterIndex = function() {
    var actor = this.actor();
    if (actor && actor.isDead()) {
      var deadCharacterIndex = actor.deadCharacterIndex();
      if (deadCharacterIndex !== null) {
        return deadCharacterIndex;
      }
    }
    return _Game_Follower_characterIndex.call(this);
  };

  //-----------------------------------------------------------------------------
  // Game_Followers
  //

  Game_Followers.prototype.shot = function(shotInput) {
    this.forEach(function(follower) {
        follower.shot(shotInput);
    }, this);
  };

  //-----------------------------------------------------------------------------
  // Game_Event
  //

  // メンバ変数の初期化
  var _Game_Event_initMembers = Game_Event.prototype.initMembers;
  Game_Event.prototype.initMembers = function() {
    _Game_Event_initMembers.call(this);
    this._enemyId = 0;
    this._battler = null;
    this._deadSelfSwitch = null;
  };

  // バトラーを返す
  Game_Event.prototype.battler = function() {
    return this._battler;
  };

  // オーナーIDを返す
  Game_Event.prototype.ownerId = function() {
    return this._eventId;
  };

  // イベントページのセットアップ
  var _Game_Event_setupPage = Game_Event.prototype.setupPage;
  Game_Event.prototype.setupPage = function() {
    _Game_Event_setupPage.call(this);
    if (this._pageIndex >= 0) {
      var data = this.event();
      this._enemyId = +(data.meta.enemy || 0);
      if (this._enemyId > 0) {
        this._battler = new Game_Enemy(this._enemyId, -this.eventId(), 0);
        this._collideW = +(data.meta.cw || 0.375);
        this._collideH = +(data.meta.ch || 0.75);
        var enemy = this._battler.enemy();
        this._deadAnime = +(enemy.meta.deadAnime || 0);
      } else {
        this._battler = null;
      }
    }
  };

  // バトラーが戦闘不能になったときの処理
  Game_Event.prototype.battlerDead = function() {
    this.gainRewards();
    if (deadSwitch) {
      var key = [$gameMap.mapId(), this._eventId, deadSwitch];
      $gameSelfSwitches.setValue(key, true);
    }
    Game_Character.prototype.battlerDead.call(this);
  };
  
  Game_Event.prototype.gainRewards = function() {
    this.gainExp();
    this.gainGold();
    this.gainDropItems();
  };
  
  Game_Event.prototype.gainExp = function() {
    var exp = this.battler().exp()
    if (exp > 0) {
      $gameParty.allMembers().forEach(function(actor) {
        actor.gainExp(exp);
      });
      if (useExpPopup) {
        var text = '' + exp + TextManager.expA + ' slideCount:1';
        this.popupReward(text);
      }
    }
  };
  
  Game_Event.prototype.gainGold = function() {
    gold = this.battler().gold();
    if (gold > 0) {
      $gameParty.gainGold(gold * ($gameParty.hasGoldDouble() ? 2 : 1));
      if (useGoldPopup) {
        var text = '' + gold + TextManager.currencyUnit;
        this.popupReward(text);
      }
    }
  };

  Game_Event.prototype.gainDropItems = function() {
    var items = this.battler().makeDropItems();
    items.forEach(function(item) {
      $gameParty.gainItem(item, 1);
      if (Imported['GetInformation']) {
        CommonPopupManager.showInfo(item, 1, 'item')
      }
    });
  };

  Game_Event.prototype.popupReward = function(text) {
    if (Imported['CommonPopupCore']) {
      text = 'add text:' + text + ' count:120 eventId:' + this._eventId;
      var arg = CommonPopupManager.setPopup(text.split(' '), this);
      if (arg.back > 0){
        CommonPopupManager.bltCheck(CommonPopupManager.makeBitmap(arg));
        CommonPopupManager._readyPopup.push(arg);
      } else {
        CommonPopupManager._tempCommonSprites.setNullPos(arg);
      }
    }
  };

  //-----------------------------------------------------------------------------
  // Game_Interpreter
  //

  var _Game_Interpreter_pluginCommand = Game_Interpreter.prototype.pluginCommand;
  Game_Interpreter.prototype.pluginCommand = function(command, args) {
    _Game_Interpreter_pluginCommand.call(this, command, args);
    if (command === 'startAutoShot') {
      $gamePlayer.setAutoShot(true);
    } else if (command === 'stopAutoShot') {
      $gamePlayer.setAutoShot(false);
    } else if (command === 'nwayShot') {
      var character = this.character(0);
      var battler = character.battler();
      if (battler.canMove()) {
        character.nwayShot.apply(character, args.map(Number));
      }
    } else if (command === 'nwayAim') {
      var character = this.character(0);
      var battler = character.battler();
      if (battler.canMove()) {
        character.nwayAim.apply(character, args.map(Number));
      }
    } else if (command === 'nallShot') {
      var character = this.character(0);
      var battler = character.battler();
      if (battler.canMove()) {
        character.nallShot.apply(character, args.map(Number));
      }
    } else if (command === 'nallAim') {
      var character = this.character(0);
      var battler = character.battler();
      if (battler.canMove()) {
        character.nallAim.apply(character, args.map(Number));
      }
    } else if (command === 'stopPlayerShot') {
      $gameSystem.setPlayerShotEnabled(false);
    } else if (command === 'startPlayerShot') {
      $gameSystem.setPlayerShotEnabled(true);
    } else if (command === 'stopEnemyShot') {
      $gameSystem.setEnemyShotEnabled(false);
    } else if (command === 'startEnemyShot') {
      $gameSystem.setEnemyShotEnabled(true);
    } else if (command === 'deletePlayerBullets') {
      $gameMap.clearPlayerBullets();
    } else if (command === 'deleteEnemyBullets') {
      $gameMap.clearEnemyBullets();
    }
  };
  
  //-----------------------------------------------------------------------------
  // Sprite_Bullet
  //

  function Sprite_Bullet() {
    this.initialize.apply(this, arguments);
  }

  Sprite_Bullet.prototype = Object.create(Sprite.prototype);
  Sprite_Bullet.prototype.constructor = Sprite_Bullet;

  // 初期化
  Sprite_Bullet.prototype.initialize = function(bullet) {
    Sprite.prototype.initialize.call(this);
    this.anchor.x = 0.5;
    this.anchor.y = 0.5;
    this._bullet = bullet;
    this._bulletName  = '';
    this._bulletIndex = 0;
  };

  // フレーム更新
  Sprite_Bullet.prototype.update = function() {
    Sprite.prototype.update.call(this);
    this.opacity = this._bullet.opacity();
    if (this.opacity > 0) {
      this.updateBitmap();
      this.x = this._bullet.screenX();
      this.y = this._bullet.screenY();
      this.z = this._bullet.screenZ();
      this.rotation = this._bullet.angle();
    }
  };

  // 転送元ビットマップの更新
  Sprite_Bullet.prototype.updateBitmap = function() {
    if (this._bulletName !== this._bullet.bulletName() ||
        this._bulletIndex !== this._bullet.bulletIndex()) {
      this._bulletName = this._bullet.bulletName();
      this._bulletIndex = this._bullet.bulletIndex();
      this.setBulletBitmap();
    }
  };

  // ビットマップの設定
  Sprite_Bullet.prototype.setBulletBitmap = function() {
    this.bitmap = ImageManager.loadSystem(this._bulletName);
    if (this.bitmap.width === 0) {
      this._bulletName = '';
    } else {
      var pw = Math.floor(this.bitmap.width / 8);
      var sx = this._bulletIndex % 8 * pw;
      var sy = Math.floor(this._bulletIndex / 8) * pw;
      this.setFrame(sx, sy, pw, pw);
      this.blendMode = bulletBlendTable[this._bullet.type()];
    }
  };

  //-----------------------------------------------------------------------------
  // Sprite_EquipDummy
  //

  function Sprite_EquipDummy() {
    this.initialize.apply(this, arguments);
  }

  Sprite_EquipDummy.prototype = Object.create(Sprite.prototype);
  Sprite_EquipDummy.prototype.constructor = Sprite_EquipDummy;

  Sprite_EquipDummy.prototype.initialize = function() {
    Sprite.prototype.initialize.call(this);
    this.anchor.x = 0.5;
    this.anchor.y = 1;
    this.x = equipDummyX;
    this.y = equipDummyY;
    this._actor = null;
    this._animationCount = 0;
    this._pattern = 0;
    this._shotShiftY = 0;
  };
  
  Sprite_EquipDummy.prototype.setActor = function(actor) {
    this._actor = actor;
    this._shotShiftY = (actor.actor().meta.ch || 0.75) / 2;
  };

  Sprite_EquipDummy.prototype.update = function() {
    Sprite.prototype.update.call(this);
    this.updateBitmap();
    this.updateCharacterFrame();
    this.updateAnimation();
  };
  
  Sprite_EquipDummy.prototype.updateBitmap = function() {
    if (this.isImageChanged()) {
      this._characterName = this._actor.characterName();
      this._characterIndex = this._actor.characterIndex();
      this.setCharacterBitmap();
    }
  };
  
  Sprite_EquipDummy.prototype.isImageChanged = function() {
    return (this._characterName !== this._actor.characterName() ||
            this._characterIndex !== this._actor.characterIndex());
  };

  Sprite_EquipDummy.prototype.setCharacterBitmap = function() {
    this.bitmap = ImageManager.loadCharacter(this._characterName);
    this._isBigCharacter = ImageManager.isBigCharacter(this._characterName);
  };
  
  Sprite_EquipDummy.prototype.updateCharacterFrame = function() {
    var pw = this.patternWidth();
    var ph = this.patternHeight();
    var sx = (this.characterBlockX() + this.characterPatternX()) * pw;
    var sy = (this.characterBlockY() + this.characterPatternY()) * ph;
    this.setFrame(sx, sy, pw, ph);
  };

  Sprite_EquipDummy.prototype.characterBlockX = function() {
    if (this._isBigCharacter) {
      return 0;
    } else {
      var index = this._actor.characterIndex();
      return index % 4 * 3;
    }
  };

  Sprite_EquipDummy.prototype.characterBlockY = function() {
    if (this._isBigCharacter) {
      return 0;
    } else {
      var index = this._actor.characterIndex();
      return Math.floor(index / 4) * 4;
    }
  };

  Sprite_EquipDummy.prototype.characterPatternX = function() {
    return this._pattern === 3 ? 1 : this._pattern;
  };

  Sprite_EquipDummy.prototype.characterPatternY = function() {
    return 0;
  };

  Sprite_EquipDummy.prototype.patternWidth = function() {
    if (this._isBigCharacter) {
      return this.bitmap.width / 3;
    } else {
      return this.bitmap.width / 12;
    }
  };

  Sprite_EquipDummy.prototype.patternHeight = function() {
    if (this._isBigCharacter) {
      return this.bitmap.height / 4;
    } else {
      return this.bitmap.height / 8;
    }
  };

  Sprite_EquipDummy.prototype.updateAnimation = function() {
    this.updateAnimationCount();
    if (this._animationCount >= 18) {
      this.updatePattern();
      this._animationCount = 0;
    }
  };
  
  Sprite_EquipDummy.prototype.updateAnimationCount = function() {
    this._animationCount += 1.5;
  };

  Sprite_EquipDummy.prototype.updatePattern = function() {
    this._pattern = (this._pattern + 1) % 4;
  };

  Sprite_EquipDummy.prototype.shotX = function() {
    return this.x / $gameMap.tileWidth();
  };
  
  Sprite_EquipDummy.prototype.shotY = function() {
    return this.y / $gameMap.tileHeight() - this._shotShiftY;
  };
  
  //-----------------------------------------------------------------------------
  // Spriteset_Destination
  //

  var _Sprite_Destination_updatePosition = Sprite_Destination.prototype.updatePosition;
  Sprite_Destination.prototype.updatePosition = function() {
    if (Imported.SAN_AnalogMove) {
      var tileWidth = $gameMap.tileWidth();
      var tileHeight = $gameMap.tileHeight();
      var x = $gamePlayer.analogMove()._targRealX;
      var y = $gamePlayer.analogMove()._targRealY;
      this.x = $gameMap.adjustX(x) * tileWidth;
      this.y = $gameMap.adjustY(y) * tileHeight;
    } else {
      _Sprite_Destination_updatePosition.call(this);
    }
  };

  //-----------------------------------------------------------------------------
  // Spriteset_Map
  //

  var _Spriteset_Map_createLowerLayer = Spriteset_Map.prototype.createLowerLayer;
  Spriteset_Map.prototype.createLowerLayer = function() {
    _Spriteset_Map_createLowerLayer.call(this);
    this.createBullets();
  };

  // 弾スプライトの作成
  Spriteset_Map.prototype.createBullets = function() {
    this._bulletSprites = [];
    $gameMap.playerBullets().forEach(function(bullet) {
      this._bulletSprites.push(new Sprite_Bullet(bullet));
    }, this);
    $gameMap.enemyBullets().forEach(function(bullet) {
      this._bulletSprites.push(new Sprite_Bullet(bullet));
    }, this);
    for (var i = 0; i < this._bulletSprites.length; i++) {
      this._baseSprite.addChild(this._bulletSprites[i]);
    }
  };

  //-----------------------------------------------------------------------------
  // Window_Option
  //

/*  Window_Options.prototype.windowWidth = function() {
    return optionWindowWidth;
  };*/

  var _Window_Option_makeCommandList = Window_Options.prototype.makeCommandList;
  Window_Options.prototype.makeCommandList = function() {
    _Window_Option_makeCommandList.call(this);
    this.addCommand(padConfigCommand, 'padConfig');
  };

/*  Window_Options.prototype.statusWidth = function() {
    return optionWindowStatusWidth;
  };*/

  var _Window_Options_statusText = Window_Options.prototype.statusText;
  Window_Options.prototype.statusText = function(index) {
    var symbol = this.commandSymbol(index);
    if (symbol === 'padConfig') {
      return '';
    } else {
      return _Window_Options_statusText.call(this, index);
    }
  };

  Window_Options.prototype.isPadSymbol = function(symbol) {
    return symbol.contains('padButton');
  };

  Window_Options.prototype.padStatusText = function(value) {
    var index = this._padButtons.indexOf(value);
    return padButtonNames[index];
  };

  var _Window_Options_processOk = Window_Options.prototype.processOk;
  Window_Options.prototype.processOk = function() {
    var index = this.index();
    var symbol = this.commandSymbol(index);
    if (symbol === 'padConfig') {
      this.playOkSound();
      this.updateInputData();
      this.deactivate();
      this.callHandler('padConfig');
    } else {
      _Window_Options_processOk.call(this);
    }
  };

  var _Window_Options_cursorRight = Window_Options.prototype.cursorRight;
  Window_Options.prototype.cursorRight = function(wrap) {
    var index = this.index();
    var symbol = this.commandSymbol(index);
    if (symbol !== 'padConfig') {
      _Window_Options_cursorRight.call(this, wrap);
    }
  };

  var _Window_Options_cursorLeft = Window_Options.prototype.cursorLeft;
  Window_Options.prototype.cursorLeft = function(wrap) {
    var index = this.index();
    var symbol = this.commandSymbol(index);
    if (symbol !== 'padConfig') {
      _Window_Options_cursorLeft.call(this, wrap);
    }
  };

  //-----------------------------------------------------------------------------
  // Window_PadOptions
  //

  function Window_PadOptions() {
    this.initialize.apply(this, arguments);
  }

  Window_PadOptions.prototype = Object.create(Window_Options.prototype);
  Window_PadOptions.prototype.constructor = Window_PadOptions;

  Window_PadOptions.prototype.initialize = function() {
    Window_Options.prototype.initialize.call(this, 0, 0);
    this.hide();
    this.deactivate();
  };

  Window_PadOptions.prototype.makeCommandList = function() {
    for (var i = 1; i <= 12; i++) {
      this.addCommand('パッドボタン' + i, 'padButton' + i);
    }
  };

  Window_PadOptions.prototype.statusWidth = function() {
    return 120;
  };

  Window_PadOptions.prototype.statusText = function(index) {
    var value = this.getConfigValue(index);
    if (value) {
      return padButtonNames[padButtons.indexOf(value)];
    } else {
      return '';
    }
  };

  Window_PadOptions.prototype.processOk = function() {
    var index = this.index();
    var value = this.getConfigValue(index);
    value = padButtons.indexOf(value);
    value += 1;
    if (value >= padButtons.length) {
      value = 0;
    }
    this.changeValue(index, padButtons[value]);
  };

  Window_PadOptions.prototype.cursorRight = function(wrap) {
    var index = this.index();
    var value = this.getConfigValue(index);
    value = padButtons.indexOf(value);
    value = (value + 1).clamp(0, padButtons.length - 1);
    this.changeValue(index, padButtons[value]);
  };

  Window_PadOptions.prototype.cursorLeft = function(wrap) {
    var index = this.index();
    var value = this.getConfigValue(index);
    value = padButtons.indexOf(value);
    value = (value - 1).clamp(0, padButtons.length - 1);
    this.changeValue(index, padButtons[value]);
  };

  Window_PadOptions.prototype.changeValue = function(index, value) {
    var lastValue = this.getConfigValue(index);
    if (lastValue !== value) {
      this.setConfigValue(index, value);
      this.redrawItem(index);
      SoundManager.playCursor();
    }
  };

  Window_PadOptions.prototype.getConfigValue = function(index) {
    return ConfigManager.getPadButton(index);
  };

  Window_PadOptions.prototype.setConfigValue = function(index, value) {
    ConfigManager.setPadButton(index, value);
  };

  //-----------------------------------------------------------------------------
  // Scene_Base
  //

  var _Scene_Base_checkGameover = Scene_Base.prototype.checkGameover;
  Scene_Base.prototype.checkGameover = function() {
    if (useGameover) {
      _Scene_Base_checkGameover.call(this);
    }
  };

  //-----------------------------------------------------------------------------
  // Scene_Equip
  //

  var _Scene_Equip_create = Scene_Equip.prototype.create;
  Scene_Equip.prototype.create = function() {
    this.createDummy();
    this.createBullets();
    _Scene_Equip_create.call(this);
    this.addChild(this._dummySprite);
    for (var i = 0; i < this._bulletSprites.length; i++) {
      this.addChild(this._bulletSprites[i]);
    }
  };
  
  Scene_Equip.prototype.createDummy = function() {
    this._dummySprite = new Sprite_EquipDummy();
    this._shotDelay = 0;
  };
  
  Scene_Equip.prototype.createBullets = function() {
    this._playerBullets = [];
    this._alivePlayerBullets = [];
    this._blankPlayerBullets = [];
    for (var i = 0; i < maxPlayerBullet; i++) {
      this._playerBullets.push(new Game_DummyBullet());
      this._blankPlayerBullets.push(i);
    }
    this._bulletSprites = [];
    this._playerBullets.forEach(function(bullet) {
      this._bulletSprites.push(new Sprite_Bullet(bullet));
    }, this);
  };

  Scene_Equip.prototype.nwayShot = function(n, space, angle, speed, count,
                                            type, index, skillId) {
    angle = angle - (space * (n - 1) / 2);
    var x = this._dummySprite.shotX();
    var y = this._dummySprite.shotY();
    for (var i = 0; i < n; i++) {
      this.addBullet(x, y, 200 + i, Math.cos(angle) * speed,
                         Math.sin(angle) * speed, angle, count, type, index,
                         skillId, -1);
      angle += space;
    }
  };

  Scene_Equip.prototype.addBullet = function(x, y, z, vx, vy, angle, count, type,
                                          index, skillId, ownerId) {
    if (this._blankPlayerBullets.length > 0) {
      var bulletIndex = this._blankPlayerBullets.shift();
      this._playerBullets[bulletIndex].setup(x, y, z, vx, vy, angle, count,
                                             type, index, skillId, ownerId);
      this._alivePlayerBullets.push(bulletIndex);
    }
  };

  var _Scene_Equip_refreshActor = Scene_Equip.prototype.refreshActor;
  Scene_Equip.prototype.refreshActor = function() {
    _Scene_Equip_refreshActor.call(this);
    this._dummySprite.setActor(this.actor());
    this.clearPlayerBullets();
    this._shotDelay = 0;
  };

  var _Scene_Equip_update = Scene_Equip.prototype.update;
  Scene_Equip.prototype.update = function() {
    _Scene_Equip_update.call(this);
    this.updateBullets();
    this.updateShot();
  };

  Scene_Equip.prototype.updateBullets = function() {
    for (var i = this._alivePlayerBullets.length - 1; i >= 0; i--) {
      var index = this._alivePlayerBullets[i];
      if (!this._playerBullets[index].update()) {
        this._alivePlayerBullets.splice(i, 1);
        this._blankPlayerBullets.push(index);
      }
    }
  };
  
  Scene_Equip.prototype.updateShot = function() {
    if (this._shotDelay > 0) {
      this._shotDelay--;
    } else {
      if (this._itemWindow.active && this._statusWindow._tempActor) {
        var shotParams = this._statusWindow._tempActor.shotParams();
      } else {
        var shotParams = this.actor().shotParams();
      }
      if (shotParams.way > 0) {
        var angle = Math.PI / 2;
        this.nwayShot(shotParams.way, shotParams.space, angle, shotParams.speed,
                      shotParams.count, shotParams.type, shotParams.index,
                      shotParams.skillId);
        this._shotDelay = shotParams.interval;
      }
    }
  };
  
  Scene_Equip.prototype.clearPlayerBullets = function() {
    this._alivePlayerBullets.forEach(function(index) {
      this._playerBullets[index].erase();
    }, this);
    this._blankPlayerBullets.concat(this._alivePlayerBullets);
    this._alivePlayerBullets = [];
  };

  //-----------------------------------------------------------------------------
  // Scene_Options
  //

  var _Scene_Options_create = Scene_Options.prototype.create;
  Scene_Options.prototype.create = function() {
    _Scene_Options_create.call(this);
    this.createPadOptionsWindow();
  };
  
  var _Scene_Options_createOptionsWindow = Scene_Options.prototype.createOptionsWindow;
  Scene_Options.prototype.createOptionsWindow = function() {
    _Scene_Options_createOptionsWindow.call(this);
    this._optionsWindow.setHandler('padConfig', this.onPadConfig.bind(this));
  };
  
  Scene_Options.prototype.createPadOptionsWindow = function() {
    this._padOptionsWindow = new Window_PadOptions();
    this._padOptionsWindow.setHandler('cancel', this.cancelPadConfig.bind(this));
    this.addWindow(this._padOptionsWindow);
  };
  
  Scene_Options.prototype.onPadConfig = function() {
    this._optionsWindow.hide();
    this._padOptionsWindow.show();
    this._padOptionsWindow.activate();
  };
  
  Scene_Options.prototype.cancelPadConfig = function() {
    this._padOptionsWindow.hide();
    this._optionsWindow.show();
    this._optionsWindow.activate();
  };

})();
