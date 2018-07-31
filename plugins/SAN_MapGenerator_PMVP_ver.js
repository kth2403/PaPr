//=============================================================================
// SAN_MapGenerator.js
//=============================================================================
// Copyright (c) 2015-2017 Sanshiro
// Released under the MIT license
// http://opensource.org/licenses/mit-license.php
//=============================================================================

/*:
 * @plugindesc 자동 맵 생성 ver1.1.8
 * 자동으로 맵을 생성 이벤트를 배치합니다.
 * @author 산시로 https://twitter.com/rev2nym
 * @version 1.1.8 2017/02/24 FillRoom에서 생성되는 방을 큰 방으로 일치하도록 변경.
 * 1.1.7 2017/02/19 분할 가능 판정의 불편을 수정.
 * 1.16 2016/09/21 방 생성 처리를 수정. 입구 이벤트의 불편을 수정. 벽 생성과 큰 방 스크립트 명령을 추가합니다.
 * 1.15 2016/09/13 벽 생성 판정의 불편을 수정. 곡괭이와 바크 댄 스크립트 명령을 추가합니다.
 * 1.14 2016/09/12 좌표에 의한 방 검색 기능의 결함을 수정. 이벤트의 플레이어와 같은 방 판정을 추가.
 * 1.12 2016/09/08 벽 생성 판정의 불편을 수정. 오토 타일이 아닌 타일의 사용을 지원합니다.
 * 1.11 2016/04/05 드물게 벽을 빠져 결함을 수정 통행 판정 기능을 강화.
 * 1.10 2016/03/19 벽의 높이, 방의 크기, 외벽 표시를 지정하는 플러그인 파라미터를 추가 벽을 표시 할 공간을 확보하도록 방과 통로의 생성 규칙을 변경.
 * 1.00a 2015/12/19 도움말 문서 이벤트 메모 란 설정의 오류를 수정했습니다.
 * 1.00 2015/11/29 공개 
 * 
 * @param WallHeight
 * @desc 벽의 높이를 지정합니다. (1 ~ 3)
 * @default 1
 * 
 * @param MinRoomSize
 * @desc 방의 크기의 최소값을 지정합니다. (3 ~)
 * @default 5
 * 
 * @param MaxRoomSize
 * @desc 방의 크기의 최대 값을 지정합니다. (3 ~)
 * MaxRoomSize이 MinRoomSize보다 작은 경우, MinRoomSize와 같은 값으로 보정됩니다.
 * @default 10
 * 
 * @param MinRooms
 * @desc 맵이 충분히 클 때 방의 최소한의 갯수를 설정합니다.
 * @default 2
 * 
 * @param MaxRooms
 * @desc 방의 최대한의 갯수를 설정합니다.
 * @default 5
 * 
 * @param ShowOuterWall
 * @desc 방 외벽을 표시합니다. (ON으로 설정)
 * @default ON
 * 
 * @param FillRoof
 * @desc 외벽사이 빈 공간을 천장으로 채웁니다.
 * @default ON
 * 
 * @help
 * ■ 개요
 * 맵 생성 플러그인 명령을 실행하면 맵이 자동으로 생성됩니다
 * 플레이어가 입구 이벤트 지점으로 이동합니다.
 * 
 * ■ 설정
 * 쯔 꾸르 MV 편집기에서 기본이되는지도 아래 좌표에
 * 타일과 이벤트를 배치하십시오.
 * 
 * ・타일
 * 빈 : {x : 0, y : 0}
 * 방 : {x : 0, y : 1}
 * 통로 : {x : 0, y : 2}
 * 천장 : {x : 0, y : 3}
 * 벽 : {x : 0, y : 4}
 * 파편 : {x : 0, y : 5}
 * 
 * ・이벤트
 * 문 : {x : 1, y : 0}
 * 출구 : {x : 1, y : 1}
 * 
 * ・방 이벤트
 * 몹 소환1 : {x : 2, y : 0}
 * 몹 소환2 : {x : 2, y : 1} 
 * 몹 소환3 : {x : 2, y : 2} 
 * 몹 소환4 : {x : 2, y : 3} 
 * 몹 소환5 : {x : 2, y : 4} 
 * 몹 소환6 : {x : 2, y : 5} 
 * 몹 소환7 : {x : 2, y : 6} 
 * 몹 소환8 : {x : 2, y : 7} 
 * 몹 소환9 : {x : 2, y : 8} 
 *
 * ・함정 이벤트
 * 함정1 : {x : 3, y : 0} 
 * 함정2 : {x : 3, y : 1} 
 * 함정3 : {x : 3, y : 2} 
 * 함정4 : {x : 3, y : 3} 
 * 함정5 : {x : 3, y : 4} 
 *
 * ・그 외 이벤트
 * 보물상자1 : {x : 4, y : 0} 
 * 보물상자2 : {x : 4, y : 1} 
 * 보물상자3 : {x : 4, y : 2} 
 * 보물상자4 : {x : 4, y : 3} 
 * 보물상자5 : {x : 4, y : 4} 
 * 퀘스트npc1 : {x : 4, y : 5} 
 * 퀘스트npc2 : {x : 4, y : 6} 
 * 퀘스트npc3 : {x : 4, y : 7} 
 * 회복동상 : {x : 4, y : 8} 
 * 상점 : {x : 4, y : 9} 
 * 
 * 
 * 
 * 기타 : 상기 이외의 좌표
 * 
 * ・이벤트 출현율
 * 입구와 출구 이외의 이벤트에는 출현율을 설정할 수 있습니다.
 * 이벤트의 메모 란에 다음을 기재하십시오.
 * 출현율 설정이없는 이벤트 생성되지 않습니다.
 * 
 *  맵마다 출현율 : <RateMap : 1.0 이하의 정의 소수>
 * 객실마다 출현율 : <RateRoom : 1.0 이하의 정의 소수>
 * 
 * 이러한 notetags는 시작 / 목표 이벤트가 발생하지 않을 확률을 정의합니다.
 * 지도. x는 0.0에서 1.0까지의 확률을 나타냅니다. 네가 원하면
 * 50 % 확률, 예를 들어 0.5를 사용합니다.
 * 이벤트에는 하나의 Rate notetag 만 사용해야합니다.
 * 
 * <RateRoom : x> 방에 나타날 기회. 이것은 모든 방에서 테스트됩니다.
 * 예를 들어, 0.75를 입력하면 모든 객실에 대해 75 %의 가능성이 생깁니다.
 * 이 이벤트가 있습니다.
 *
 * <RateRoomTile : x> 방 타일에 표시 될 기회입니다.
 *
 * <RateWall : x> 벽 타일에 표시 될 기회입니다.
 *
 * <StartRoomSpawn : x> 시작을 포함하는 방에 나타날 수있는 기회
 * 이벤트.
 * <GoalRoomSpawn : x> 방 이벤트가 포함 된 방에 나타날 수있는 기회입니다.
 *
 * ============================================= ===============
 * 여분의 Notetags
 * ============================================= ===============
 * 이러한 notetags를 사용하면 이벤트 조건을 추가로 정의 할 수 있습니다.
 * 산란.
 *
 * <MinimumStartDistance : x> x는 방에서 최소 거리입니다.
 *이 이벤트가 생성 할 수있는 시작 이벤트를 포함합니다.
 * <MinimumGoalDistance : x> x는 방에서 최소 거리입니다.
 *이 이벤트가 생성 할 수있는 목표 이벤트를 포함합니다.
 *
 * <NoStartRoomSpawn : 1>이 이벤트는 시작과 같은 방에 스폰되지 않을 수 있습니다.
 * 이벤트.
 * <NoGoalRoomSpawn : 1>이 이벤트는 시작과 같은 방에 스폰되지 않을 수 있습니다.
 * 이벤트.
 *
 * <InnerWallOnly : 1>이 이벤트가 벽 타일에 스폰되도록 설정된 경우에만 가능합니다.
 * 내부 벽에 산란.
 * <LowerWallOnly : 1>이 이벤트가 벽 타일 및 벽에 스폰되도록 설정된 경우
 * 높이가 2 이상이면이 이벤트는 바닥 벽 타일에서만 생성됩니다.
 * <UpperWallOnly : 1>이 이벤트가 벽 타일 및 벽에 스폰되도록 설정된 경우
 * 높이가 2 이상이면이 이벤트는 위쪽 벽 타일에서만 생성 될 수 있습니다.
 *
 * <NoPassageBlock : 1>이 이벤트는 다음과 같은 위치에 스폰되지 않을 수 있습니다.
 * 통로를 차단하십시오.
 *
 * <최소값 : x>이 이벤트를 테스트해야하는 최소 횟수
 *지도에. 이벤트 비율이 1.0이면 이벤트가 거의 보장됩니다.
 *이지도를 여러 번 스폰합니다.
 * <Maximum : x>이 이벤트가 테스트 될 수있는 최대 시간
 *지도에. 이 이벤트는 여러 번 이상 스폰 될 수 없습니다.
 * ============================================= ===============
 *
 * 
 * ■플러그인 명령
 * · MapGenerator RoomAndPass
 * 객실과 통로로 구성된 맵을 생성합니다.
 * 
 * ・MapGenerator FillRoom
 *  맵 전체에 대한 하나의 방을 생성합니다.
 * 
 * ■스크립트 명령
 * · Game_Character.prototype.isSameRoomWithPlayer ()
 * 캐릭터의 플레이어와 같은 방 판정합니다.
 * 예 : 조건 분기 이벤트 명령 스크립트 란에
 * "this.character () isSameRoomWithPlayer ()"
 *라고 기술하면 그 이벤트가 플레이어와 같은 방에
 * 존재하는지 확인합니다.
 * 
 * ・Game_Map.prototype.pickel()
 *  곡괭이 명령입니다.
 * 플레이어의 정면이 아닌 바닥 타일을 통로 타일로 변환합니다.
 *이 명령은 자동 생성 맵에서만 유효합니다.
 * 예 : 공통 이벤트 스크립트 명령
 * "$ gameMap.pickel ()"
 * 기술하고 실행하면 정면의 벽을 팔 수 있습니다.
 * 
 * ・Game_Map.prototype.bomb(x, y)
 *  바흐 저런 명령입니다.
 * 지정한 좌표와 주변 9 타일의 비 지상 타일 통로 타일로 변환합니다.
 *이 명령은 자동 생성 맵에서만 유효합니다.
 * 예 : 공통 이벤트 스크립트 명령
 * "$ gameMap.bomb ($ gamePlayer.x, $ gamePlayer.y)"
 * 기술하고 실행하면 플레이어의 주위의 벽을 제거 할 수 있습니다.
 * 
 * ・Game_Map.prototype.makeWall(x, y)
 *  벽 생성 명령입니다.
 * 지정한 좌표의 지상 타일을 벽 (파편) 타일로 변환합니다.
 *이 명령은 자동 생성 맵에서만 유효합니다.
 * 예 : 공통 이벤트 스크립트 명령
 * "var x = $ gamePlayer.x;
 * var y = $ gamePlayer.y;
 * var d = $ gamePlayer.direction ();
 * $ gameMap.makeWall (
 * $ gameMap.xWithDirection (x, d)
 * $ gameMap.yWithDirection (y, d)
 *); "
 * 기술하고 실행하면 플레이어의 정면에 벽을 설치 할 수 있습니다.
 * 
 * ・Game_Map.prototype.bigRoom()
 *  큰 방 명령입니다.
 * 맵 전체에 대한 하나의 방을 생성합니다.
 *이 명령은 자동 생성 맵에서만 유효합니다.
 * 예 : 공통 이벤트 스크립트 명령
 * "$ gameMap.bigRoom ()"
 * 기술하고 실행하면 큰 방을 생성합니다.
 * 
 * ■이용 약관
 * MIT 라이센스하에 상업적 사용, 수정, 재배포가 가능합니다.
 * 그러나 모두의 코멘트는 삭제 또는 변경을하지 마십시오.
 * 괜찮다면 신용에 저자 이름을 기재하십시오.
 *
 *이를 이용하여 발생한 어떠한 손해도 제작자는 책임을지지 않습니다.
 * 지원은 기대하지 마십시오> <.
 * 
 */

var Imported = Imported || {};
Imported.SAN_MapGenerator = true;

var Sanshiro = Sanshiro || {};
Sanshiro.Game_MapGenerator = Sanshiro.Game_MapGenerator || {};

//-----------------------------------------------------------------------------
// Game_MapGenerator
//
// 맵 생성기 (큰 방)

function Game_MapGenerator() {
    this.initialize();
}

// 오토 타일 분석 타일 id 목록
//tileIdsFloor : 바닥
//tileIdsWall : 벽
//candidate : 후보 타일 ID
//connect : 연결 타일 ID
//noConnect : 비 연결 타일 ID
Game_MapGenerator.tileIdsFloor = {};

Game_MapGenerator.tileIdsFloor.candidate =
    [ 0,  1,  2,  3,  4,  5,  6,  7,  8,  9, 10, 11,
     12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23,
     24, 25, 26, 27, 28, 29, 30, 31, 32, 33, 34, 35,
     36, 37, 38, 39, 40, 41, 42, 43, 44, 45, 46, 47];

Game_MapGenerator.tileIdsFloor.connect = {
    1:[ 0,  1,  2,  3,  4,  5,  6,  7, 16, 17, 18, 19,
       20, 21, 24, 26, 28, 29, 30, 31, 32, 33, 34, 35,
       36, 38, 39, 40, 41, 42, 43, 44, 45, 46, 47],         // 1:왼쪽
    2:[ 0,  1,  2,  3,  4,  5,  6,  7,  8,  9, 10, 11,
       12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23,
       24, 25, 26, 27, 32, 34, 35, 36, 37, 42, 47],         // 2:아래
    3:[ 0,  1,  2,  3,  8,  9, 10, 11, 16, 17, 20, 22,
       24, 25, 26, 27, 28, 29, 30, 31, 32, 33, 34, 36,
       37, 38, 39, 40, 41, 42, 43, 44, 45, 46, 47],         // 3:오른쪽
    4:[ 0,  1,  2,  3,  4,  5,  6,  7,  8,  9, 10, 11,
       12, 13, 14, 15, 20, 21, 22, 23, 24, 25, 26, 27,
       28, 29, 30, 31, 33, 36, 37, 38, 39, 45, 47],         // 4:왼쪽
    6:[ 0,  1,  2,  3,  4,  5,  6,  7,  8,  9, 10, 11,
       12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23,
       28, 29, 30, 31, 33, 34, 35, 40, 41, 43, 47],         // 6:오른쪽
    7:[ 0,  2,  4,  6,  8, 10, 12, 14, 16, 17, 18, 19,
       20, 21, 22, 23, 24, 25, 28, 30, 32, 33, 34, 35,
       36, 37, 38, 40, 41, 42, 43, 44, 45, 46, 47],         // 7:왼쪽 위
    8:[ 0,  1,  2,  3,  4,  5,  6,  7,  8,  9, 10, 11,
       12, 13, 14, 15, 16, 17, 18, 19, 24, 25, 26, 27,
       28, 29, 30, 31, 32, 38, 39, 40, 41, 44, 47],         // 8:위
    9:[ 0,  1,  4,  5,  8,  9, 12, 13, 16, 18, 20, 21,
       22, 23, 24, 25, 26, 27, 28, 29, 32, 33, 34, 35,
       36, 37, 38, 39, 40, 42, 43, 44, 45, 46, 47]          // 9:오른쪽 위
};

Game_MapGenerator.tileIdsFloor.noConnect = {
    1:[ 8,  9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19,
       22, 23, 25, 27, 28, 29, 30, 31, 32, 33, 34, 35,
       37, 38, 39, 40, 41, 42, 43, 44, 45, 46, 47],         // 1:左下
    2:[28, 29, 30, 31, 33, 38, 39, 40, 41, 43, 44, 45, 46], // 2:下
    3:[ 4,  5,  6,  7, 12, 13, 14, 15, 18, 19, 21, 23,
       24, 25, 26, 27, 28, 29, 30, 31, 32, 33, 35, 36,
       37, 38, 39, 40, 41, 42, 43, 44, 45, 46, 47],         // 3:右下
    4:[16, 17, 18, 19, 32, 34, 35, 40, 41, 42, 43, 44, 46], // 4:左
    6:[24, 25, 26, 27, 32, 36, 37, 38, 39, 42, 44, 45, 46], // 6:右
    7:[ 1,  3,  5,  7,  9, 11, 13, 15, 16, 17, 18, 19,
       20, 21, 22, 23, 26, 27, 29, 31, 32, 33, 34, 35,
       36, 37, 39, 40, 41, 42, 43, 44, 45, 46, 47],         // 7:左上
    8:[20, 21, 22, 23, 33, 34, 35, 36, 37, 42, 43, 45, 46], // 8:上
    9:[ 2,  3,  6,  7, 10, 11, 14, 15, 17, 19, 20, 21,
       22, 23, 24, 25, 26, 27, 30, 31, 32, 33, 34, 35,
       36, 37, 38, 39, 41, 42, 43, 44, 45, 46, 47]          // 9:右上
};

Game_MapGenerator.tileIdsWall = {};

Game_MapGenerator.tileIdsWall.candidate =
    [ 0,  1,  2,  3,  4,  5,  6,  7,
      8,  9, 10, 11, 12, 13, 14, 15];

Game_MapGenerator.tileIdsWall.connect = {
    2:[ 0,  1,  2,  3,  4,  5,  6,  7],  // 2:下
    4:[ 0,  2,  4,  6,  8, 10, 12, 14],  // 4:左
    6:[ 0,  1,  2,  3,  8,  9, 10, 11],  // 6:右
    8:[ 0,  1,  4,  5,  8,  9, 12, 13]   // 8:上
};

Game_MapGenerator.tileIdsWall.noConnect = {
    2:[ 8,  9, 10, 11, 12, 13, 14, 15],  // 2:下
    4:[ 1,  3,  5,  7,  9, 11, 13, 15],  // 4:左
    6:[ 4,  5,  6,  7, 12, 13, 14, 15],  // 6:右
    8:[ 2,  3,  6,  7, 10, 11, 14, 15]   // 8:上
};

// 초기화
Game_MapGenerator.prototype.initialize = function() {
    this._wallHeight = Number(PluginManager.parameters('SAN_MapGenerator')['WallHeight']);
    this._showOuterWall = (PluginManager.parameters('SAN_MapGenerator')['ShowOuterWall'] === 'ON');
    this._fillRoof = (PluginManager.parameters('SAN_MapGenerator')['FillRoof'] === 'ON');
    this._startXY = {x:0, y:0};
    this._goalXY  = {x:0, y:0};
    this._blocks  = [];
    this._rooms   = [];
    this._passes  = [];
    this._data    = [];
    this._isReady = false;
};

_Game_MapGenerator_initialize = Game_MapGenerator.prototype.initialize;
Game_MapGenerator.prototype.initialize = function () {
    _Game_MapGenerator_initialize.call(this);
    // change: wall height now parameter
    var WallHeight = PluginManager.parameters('SAN_MapGenerator')['WallHeight'] || '1';
    this._wallHeight = eval(WallHeight);
};

// 맵 생성 Dream
Game_MapGenerator.prototype.setup = function() {
    $gameMap._events = [];
    for (key in $gameSelfSwitches._data) {
        if (key.split(",")[0] === String($gameMap.mapId())) {
            delete $gameSelfSwitches._data[key];
        }
    }
    this._isReady = false;
    this._blocks  = [];
    this._rooms   = [];
    this._passes  = [];
    this._startXY = {x:0, y:0};
    this._goalXY  = {x:0, y:0};
    this._data = [];
    this.initSymbolTable();
    this.initSymbolMap();
    this.initPrefabRooms();
    this.generateMap();
    this.refreshWallAndRoof();
        this.closeCavities();
    this.makeData();
    this.setStart();
    this.setGoal();
    //this.setRoomEvents();
    this.setRateEvents();
    SceneManager._scene.createDisplayObjects();
    this._isReady = true;
    this.printMap();
};

Game_MapGenerator.prototype.initPrefabRooms = function () {
    this._prefabRooms = [];
    for (var i = 5; this.isTile(5, i);) {
        var leastRoomH = this.makeHorizontalPrefabRoom(5, i);
        i += leastRoomH + 1;
        console.log("nextY: ", i)
    }
    console.log(this._symbolTable)
    /*tile이 있는지 검사하는 함수*/
    /*5,5에서 시작. 
     * room1이 있는지 검사
     * -> 5,5의 tile이 있는지 검사. 타일이 있다면 width와 height를 구해와서 prefebRooms에 add해줌
     * room은 시작점의 정보와 width, height, 타일들의 정보를 갖고 있음(심볼 형식의 리스트로?) 
     * room: {startPoint:, width:, height:, tilesSymbolTable:[x:,y:,baseTileId:[]] <
     room1의 x축 검사함수
     room1의 시작점의 x + room1의 width + 1의 tile이 있는지 검사. 이하 동일
     roomN의 ~의 tile이 있는지 검사. 없다면 끝
     room2이 있는지 검사
     -> 5,5+room1의 시작점.y의 tile이 있는지 검사 타일1과 동일
     room3이 있는지 검사
     없을때까지*/
}

Game_MapGenerator.prototype.isTile = function (x,y) {
    for (var z = 0; z < 6; z++) {
        if ($gameMap.tileId(x, y, z) > 0) return $gameMap.tileId(x,y,z);
    }
    return false;
}

Game_MapGenerator.prototype.makeHorizontalPrefabRoom = function (x, y) {
    var tileZ = this.isTile(x, y);
    var leastRoom = this._prefabRooms.length;
    for (var i = 5; tileZ;) {
        var roomWidth = 0;
        var roomHeight = 0;
        var roomNumber = this._prefabRooms.length;
        for (var ix = i; this.isTile(ix, y); ix++) roomWidth++;
        for (var iy = y; this.isTile(i, iy); iy++) roomHeight++;
        var room = {
            startX: i,
            startY: y,
            width: roomWidth,
            height: roomHeight,
            passable: ["room", "pass"],
            baseTileId: [0, 0, 0, 0, 0, 0],
            dispChar: roomNumber + ' ',
            tiles: {}
        }

        var tileIndex = 0;
        for (var pointY = y; pointY < y + roomHeight; pointY++) {
            for (var pointX = i; pointX < i + roomWidth; pointX++) {
                room.tiles[tileIndex] = { baseTileId: [] };
                for (var pointZ = 0; pointZ < 6; pointZ++)
                    room.tiles[tileIndex].baseTileId.push($gameMap.tileId(pointX, pointY, pointZ));
                this._symbolTable['room' + '_' + roomNumber] = room;
                tileIndex++;
            }
        }
        this._prefabRooms.push(room);
        i += room.startX + 1;
        tileZ = this.isTile(i, y);
    }
    return this._prefabRooms[leastRoom].height;
}

// 기호 정의 테이블의 초기화
Game_MapGenerator.prototype.initSymbolTable = function() {
    //기호 정의
    //  refXY      : 기호에 대응하는 타일의 지도상의 좌표
    // baseTileId : 기호에 대응하는 타일 ID
    // dispChar : 생성 한 맵을 문자열로 표시 할 때 문자
    this._symbolTable = {
        player: {refXY:{x:0, y:0}, baseTileId:[], dispChar:'＠', passable:['room', 'pass']},
        space:  {refXY:{x:0, y:0}, baseTileId:[], dispChar:'  ', passable:['space']},
        room:   {refXY:{x:0, y:1}, baseTileId:[], dispChar:'. ', passable:['room', 'pass']},
        pass:   {refXY:{x:0, y:2}, baseTileId:[], dispChar:'  ', passable:['room', 'pass']},
        roof:   {refXY:{x:0, y:3}, baseTileId:[], dispChar:'# ', passable:['roof']},
        wall:   {refXY:{x:0, y:4}, baseTileId:[], dispChar:'= ', passable:[]},
        rubble: {refXY:{x:0, y:5}, baseTileId:[], dispChar:'＊', passable:[]}, 
        start:  {refXY:{x:1, y:0}, baseTileId:[], dispChar:'△', passable:['room', 'pass']},
        goal:   {refXY:{x:1, y:1}, baseTileId:[], dispChar:'▽', passable:['room', 'pass']}
        /*enemy1: {refXY:{x:2, y:0}, baseTileId:[], dispChar:'$', passable:['room', 'pass']},
        enemy2: {refXY:{x:2, y:1}, baseTileId:[], dispChar:'$', passable:['room', 'pass']},
        enemy3: {refXY:{x:2, y:2}, baseTileId:[], dispChar:'$', passable:['room', 'pass']},
        enemy4: {refXY:{x:2, y:3}, baseTileId:[], dispChar:'$', passable:['room', 'pass']},
        enemy5: {refXY:{x:2, y:4}, baseTileId:[], dispChar:'$', passable:['room', 'pass']},
        enemy6: {refXY:{x:2, y:5}, baseTileId:[], dispChar:'$', passable:['room', 'pass']},
        enemy7: {refXY:{x:2, y:6}, baseTileId:[], dispChar:'$', passable:['room', 'pass']},
        enemy8: {refXY:{x:2, y:7}, baseTileId:[], dispChar:'$', passable:['room', 'pass']},
        enemy9: {refXY:{x:2, y:8}, baseTileId:[], dispChar:'$', passable:['room', 'pass']},
        trap1:  {refXY:{x:3, y:0}, baseTileId:[], dispChar:'▽', passable:['room', 'pass']},
        trap2:  {refXY:{x:3, y:1}, baseTileId:[], dispChar:'▽', passable:['room', 'pass']},
        trap3:  {refXY:{x:3, y:2}, baseTileId:[], dispChar:'▽', passable:['room', 'pass']},
        trap4:  {refXY:{x:3, y:3}, baseTileId:[], dispChar:'▽', passable:['room', 'pass']},
        trap5:  {refXY:{x:3, y:4}, baseTileId:[], dispChar:'▽', passable:['room', 'pass']},
        chest1: {refXY:{x:4, y:0}, baseTileId:[], dispChar:'▽', passable:['room', 'pass']},
        chest2: {refXY:{x:4, y:1}, baseTileId:[], dispChar:'▽', passable:['room', 'pass']},
        chest3: {refXY:{x:4, y:2}, baseTileId:[], dispChar:'▽', passable:['room', 'pass']},
        chest4: {refXY:{x:4, y:3}, baseTileId:[], dispChar:'▽', passable:['room', 'pass']},
        chest5: {refXY:{x:4, y:4}, baseTileId:[], dispChar:'▽', passable:['room', 'pass']},
        quest1: {refXY:{x:4, y:5}, baseTileId:[], dispChar:'▽', passable:['room', 'pass']},
        quest2: {refXY:{x:4, y:6}, baseTileId:[], dispChar:'▽', passable:['room', 'pass']},
        quest3: {refXY:{x:4, y:7}, baseTileId:[], dispChar:'▽', passable:['room', 'pass']},
        statue: {refXY:{x:4, y:8}, baseTileId:[], dispChar:'▽', passable:['room', 'pass']},
        shop:   {refXY:{x:4, y:9}, baseTileId:[], dispChar:'▽', passable:['room', 'pass']},
    //  fence:  {refXY:{x:0, y:6}, baseTileId:[], dispChar:'只'},
    //  pond:   {refXY:{x:0, y:7}, baseTileId:[], dispChar:'○'},
    //  hole:   {refXY:{x:0, y:8}, baseTileId:[], dispChar:'●'},
    //  brink:  {refXY:{x:0, y:9}, baseTileId:[], dispChar:'＾'},
    //  enemy:  {refXY:{x:1, y:2}, baseTileId:[], dispChar:'＄'},
    //  crawler:{refXY:{x:0, y:1}, baseTileId:[], dispChar:'＆'}*/
    };

    

    for (symbol in this._symbolTable) {
        var x = this._symbolTable[symbol].refXY.x;
        var y = this._symbolTable[symbol].refXY.y;
        for (var z = 0; z < 6; z ++) {
        	// z0 : 타일 A 하층, z1 : 타일 A 상품, z2 : 타일 B 하층, z3 : 타일 B 상품, z4 : 그림자, z5 : 지역
            this._symbolTable[symbol].baseTileId[z] = this.baseAutoTileId(x, y, z);
        }
    }
    console.log(this._symbolTable)
};

// 오토 타일의 기점 타일 ID 
Game_MapGenerator.prototype.baseAutoTileId = function(x, y, z) {
    if ($gameMap.tileId(x, y, z) >= Tilemap.TILE_ID_A1) {
        return (Math.floor(($gameMap.tileId(x, y, z) - Tilemap.TILE_ID_A1) / 48)) * 48 + Tilemap.TILE_ID_A1;
    } else {
        return $gameMap.tileId(x, y, z);
    }
};

// 기호로 표현되는지도 초기화 (초기화시 공백으로 채우기)
Game_MapGenerator.prototype.initSymbolMap = function() {
    this._symbolMap = new Array($gameMap.width());
    for (var x = 0; x < $gameMap.width(); x++) {
        this._symbolMap[x] = new Array($gameMap.height());
        for (var y = 0; y < $gameMap.height(); y++) {
            this._symbolMap[x][y] = 'space';
        }
    }
};

// 기호에 의한 통행 가능 판정
Game_MapGenerator.prototype.isPassable = function(x, y, d) {
    var x2 = $gameMap.roundXWithDirection(x, d);
    var y2 = $gameMap.roundYWithDirection(y, d);
    if (!this._symbolMap[x]  || !this._symbolMap[x][y] ||
        !this._symbolMap[x2] || !this._symbolMap[x2][y2]) {
        return false;
    }
    var symbol  = this._symbolMap[x][y];
    var symbol2 = this._symbolMap[x2][y2];
    return this._symbolTable[symbol].passable.contains(symbol2);
};

// 기호에 의한 지상 판정
Game_MapGenerator.prototype.isGround = function(x, y) {
    if (!this._symbolMap[x] || !this._symbolMap[x][y]) {
        return false;
    }
    return ['room', 'pass', 'start', 'goal'].indexOf(this._symbolMap[x][y]) !== -1;
};

// 기호에 의한 벽 판정
Game_MapGenerator.prototype.isWall = function(x, y) {
    if (!this._symbolMap[x] || !this._symbolMap[x][y]) {
        return false;
    }
    return this._symbolMap[x][y] === 'wall';
};

// 심볼 맵 생성
Game_MapGenerator.prototype.generateMap = function() {
    var block = {
        x:1,
        y:1,
        w:$dataMap.width - 2,
        h:$dataMap.height - 2
    };
    var room = {x: 0, y: 0, w: 0, h: 0, hasStart: false, hasGoal: false, 
            hasPass:{t:false, b:false, l:false, r:false}};
    room.x = 1;
    room.y = 1 + this._wallHeight;
    room.w = $dataMap.width - 2;
    room.h = $dataMap.height - (this._wallHeight + 1) * 2;
    this._blocks = [block];
    this._rooms  = [room];
    this._passes = [];
    this.initSymbolMap();
    for (var y = 0; y < room.h; y++) {
        for (var x = 0 ; x < room.w; x++) {
            this._symbolMap[room.x + x][room.y + y] = 'room';
        }
    }
    this._rooms.push(room);
};

Game_MapGenerator.prototype.canSetInRoom = function (room, event) {
    var dataEvent = $dataMap.events[event._eventId] ? $dataMap.events[event._eventId] : event;
    var NoStartRoomSpawn = dataEvent.meta.NoStartRoomSpawn ? true : false;
    var NoGoalRoomSpawn = dataEvent.meta.NoGoalRoomSpawn ? true : false;
    var StartRoomSpawn = dataEvent.meta.RateSpawn ? true : false;
    var GoalRoomSpawn = dataEvent.meta.RateGoal ? true : false;
    if (NoStartRoomSpawn === true && room.hasStart === true) {
        return false;
    }
    if (NoGoalRoomSpawn === true && room.hasGoal === true) {
        return false;
    }
    if (StartRoomSpawn === true && room.hasStart === false) {
        return false;
    }
    if (GoalRoomSpawn === true && room.hasGoal === false) {
        return false;
    }

    var viableTiles = this.viableTiles(event, 'room', room);


    if (viableTiles.length === 0) {
        for (var i = 1; i < this._prefabRooms.length; i++)
            if (viableTiles.length == 0) {
                viableTiles = this.viableTiles(event, 'room_' + i, room);
            } else break;
        if (viableTiles.length === 0) {
            return false;
        }
    }
    return true;
};

Game_MapGenerator.prototype.chooseRoom = function (event) {
    var areaArray = [];
    
    this._rooms.forEach(function (room) {
        if (this.canSetInRoom(room, event)) {
            areaArray.push(room);
        }
    }, this);

    var randRoomNum = Math.floor(Math.random() * areaArray.length);

    return areaArray[randRoomNum];
};

Game_MapGenerator.prototype.isViableTile = function (event, targetSymbols, x, y) {
    var dataEvent = $dataMap.events[event._eventId]
            ? $dataMap.events[event._eventId] : event;

    var MinimumStartRoomDistance = dataEvent.meta.MinimumStartRoomDistance
            ? parseInt(dataEvent.meta.MinimumStartRoomDistance) : 0;
    var MinimumGoalRoomDistance = dataEvent.meta.MinimumGoalRoomDistance
            ? parseInt(dataEvent.meta.MinimumGoalRoomDistance) : 0;

    var MinimumStartDistance = dataEvent.meta.MinimumStartDistance
            ? parseInt(dataEvent.meta.MinimumStartDistance) : 0;
    var MinimumGoalDistance = dataEvent.meta.MinimumGoalDistance
            ? parseInt(dataEvent.meta.MinimumGoalDistance) : 0;

    var InnerWallOnly = dataEvent.meta.InnerWallOnly
            ? true : false;
    var OuterWallOnly = dataEvent.meta.OuterWallOnly
            ? true : false;
    var LowerWallOnly = dataEvent.meta.LowerWallOnly
            ? true : false;
    var MiddleWallOnly = dataEvent.meta.MiddleWallOnly
            ? true : false;
    var UpperWallOnly = dataEvent.meta.UpperWallOnly
            ? true : false;
    // tile must be a pass tile adjacent to a room
    var DoorWayOnly = dataEvent.meta.DoorWayOnly
            ? true : false;
    // tile may not be block a pass
    var NoPassageBlock = dataEvent.meta.NoPassageBlock
            ? true : false;

    // if tile doesn't match desired type, tile not viable
    if (this._symbolMap[x][y].split('_')[0] !== targetSymbols) {
        return false;
    }
    // if there is already an event here, return false
    if ($gameMap.eventsXy(x, y).length !== 0) {
        return false;
    }
    
    if (NoPassageBlock === true) {
        // check passability to the left
        if (this.isWallRoofOrRubble(x - 1, y) === false && this.isWallRoofOrRubble(x - 1, y + 1) === true
                && this.isWallRoofOrRubble(x - 1, y - 1) === true) {
            return false;
        }
        // check passability to the right
        if (this.isWallRoofOrRubble(x + 1, y) === false && this.isWallRoofOrRubble(x + 1, y + 1) === true
                && this.isWallRoofOrRubble(x + 1, y - 1) === true) {
            return false;
        }
        // check passability up
        if (this.isWallRoofOrRubble(x, y - 1) === false && this.isWallRoofOrRubble(x + 1, y - 1) === true
                && this.isWallRoofOrRubble(x - 1, y - 1) === true) {
            return false;
        }
        // check passability down
        if (this.isWallRoofOrRubble(x, y + 1) === false && this.isWallRoofOrRubble(x + 1, y + 1) === true
                && this.isWallRoofOrRubble(x - 1, y + 1) === true) {
            return false;
        }
    }

//    // if there is a minimum distance from the start room and tile is too
//    // close, tile not viable
//    if (this.startRoom() && MinimumStartRoomDistance >= 1) {
//		console.log("startRoom x: " + this.startRoom().x);
//		console.log("startRoom x + w" + (this.startRoom().x + this.startRoom().w));
//		console.log("startRoom y: " + this.startRoom().y);
//		console.log("startRoom y + h" + (this.startRoom().y + this.startRoom().h));
//        if (Math.abs(x - (this.startRoom().x)) + Math.abs(y - (this.startRoom().y)) < MinimumStartRoomDistance + 1) {
//            return false;
//        }
//        if (Math.abs(x - (this.startRoom().x - this.startRoom().w)) 
//                + Math.abs(y - (this.startRoom().y + this.startRoom().h))
//                < MinimumStartRoomDistance + 1) {
//            return false;
//        }
//    }
//
//    // if there is a minimum distance from the goal room and tile is too
//    // close, tile not viable
//    if (this.goalRoom() && MinimumGoalRoomDistance >= 1) {
//        var distance = Math.abs(x - (this.goalRoom().x))
//                + Math.abs(x - (this.goalRoom().x + this.goalRoom().w)
//                        + Math.abs(y - (this.goalRoom().y))
//                        + Math.abs(y - (this.goalRoom().y + this.goalRoom().h)));
//
//        if (distance < MinimumGoalRoomDistance + 1) {
//            return false;
//        }
//    }

    // if there is a minimum distance from the start event and tile is too
    // close, tile not viable
    if (this._startXY && MinimumStartDistance >= 1) {
        var distance = Math.abs(x - this._startXY.x) + Math.abs(y - this._startXY.y);
        if (distance < MinimumStartDistance + 1) {
            return false;
        }
    }

    // if there is a minimum distance from the goal event and tile is too
    // close, tile not viable
    if (this._goalXY && MinimumGoalDistance >= 1) {
        var distance = Math.abs(x - this._goalXY.x) + Math.abs(y - this._goalXY.y);
        if (distance < MinimumGoalDistance + 1) {
            return false;
        }
    }

    if ((dataEvent.meta.RateWall || dataEvent.meta.SpecialWall) && UpperWallOnly === true) {
        // if the tile above is not roof, then not upper wall
        if (this._symbolMap[x][y - 1] !== 'roof') {
            return false;
        }
        // if the tile below is not wall, then not upper wall
        if (this._symbolMap[x][y + 1] !== 'wall') {
            return false;
        }
    }

    if ((dataEvent.meta.RateWall || dataEvent.meta.SpecialWall) && LowerWallOnly === true) {
        // if the tile above is not wall, then not lower wall
        if (this._symbolMap[x][y - 1] !== 'wall') {
            return false;
        }
        // if the tile below is wall, then not lower wall
        if (this._symbolMap[x][y + 1] === 'wall') {
            return false;
        }
    }

    // if any tile below (for wall height) is space or 
    // any tile above (for wall height) is roof, it is 
    // the outer wall so return false
    if ((dataEvent.meta.RateWall || dataEvent.meta.SpecialWall) && InnerWallOnly === true) {
        // if tile below is roof, don't spawn
        if (this._symbolMap[x][y + 1] === 'roof') {
            return false;
        }

        // find position of tile on wall
        var tilesAboveToRoof = 1;
        if (this._symbolMap[x][y - 1] !== 'roof') {
            for (tilesAboveToRoof = 1; this._symbolMap[x][y - tilesAboveToRoof] !== 'roof'; tilesAboveToRoof++) {
                // nothing
            }
        }

        if (this._symbolMap[x][y - tilesAboveToRoof + this._wallHeight + 1]
                === 'space') {
            return false;
        }
    }

    return true;
};

Game_MapGenerator.prototype.viableTiles = function (event, targetSymbols, targetArea) {
    var coorsArray = [];
    for (var x = targetArea.x; x < targetArea.x + targetArea.w; x++) {
        for (var y = targetArea.y; y < targetArea.y + targetArea.h; y++) {
            if (this.isViableTile(event, targetSymbols, x, y)) {
                var coors = {xCoor: x, yCoor: y};
                coorsArray.push(coors);
            }
        }
    }
    return coorsArray;
};

// 이벤트의 설치
Game_MapGenerator.prototype.setEvent = function(event, targetSymbols, targetArea) {
    targetSymbols = targetSymbols || ['room'];
    targetArea = targetArea || {x:0, y:0, w:$dataMap.width, h:$dataMap.height};
    var canSet = false;
    for (var x = targetArea.x; x < targetArea.x + targetArea.w && !canSet; x++) {
        for (var y = targetArea.y; y < targetArea.y + targetArea.h && !canSet; y ++) {
            canSet = (targetSymbols.indexOf(this._symbolMap[x][y].split('_')[0]) !== -1);
        }
    }
    if (canSet) {
        for (var i = 0; i < Math.pow(targetArea.w * targetArea.h, 2); i++) {
            var x = targetArea.x + Math.randomInt(targetArea.w);
            var y = targetArea.y + Math.randomInt(targetArea.h);
            if ($gameMap.eventsXy(x, y).length === 0 &&
                targetSymbols.indexOf(this._symbolMap[x][y].split('_')[0]) !== -1)
            {
                break;
            }
        }
        $gameMap._events.push(event);
        event._eventId = $gameMap._events.indexOf(event);
        event.setPosition(x, y);
        return {x:x, y:y}
    } else {
        return undefined;
    }
};

//변경 : 특정 위치에 이벤트의 설치
Game_MapGenerator.prototype.setEventAt = function(event, targetSymbols, targetArea) {
    targetSymbols = targetSymbols || ['room'];
    targetArea = targetArea || {x:0, y:0, w:$dataMap.width, h:$dataMap.height};
    var canSet = false;
    for (var x = targetArea.x; x < targetArea.x + targetArea.w && !canSet; x++) {
        for (var y = targetArea.y; y < targetArea.y + targetArea.h && !canSet; y ++) {
            canSet = (targetSymbols.indexOf(this._symbolMap[x][y].split('_')[0]) !== -1);
        }
    }
    if (canSet) {
        for (var i = 0; i < Math.pow(targetArea.w * targetArea.h, 2); i++) {
            var x = targetArea.x;// + Math.randomInt(targetArea.w);
            var y = targetArea.y;// + Math.randomInt(targetArea.h);
            if ($gameMap.eventsXy(x, y).length === 0 &&
                targetSymbols.indexOf(this._symbolMap[x][y].split('_')[0]) !== -1)
            {
                break;
            }
        }
        $gameMap._events.push(event);
        event._eventId = $gameMap._events.indexOf(event);
        event.setPosition(x, y);
        return {x:x, y:y}
    } else {
        return undefined;
    }
};

Game_MapGenerator.prototype.closeCavities = function () {
    for (var x = 0; x < this._symbolMap.length; x++) {
        for (var y = 0; y < this._symbolMap[x].length; y++) {
            if ((this._symbolMap[x][y] === 'space' || this._symbolMap[x][y] === 'wall') && this._symbolMap[x][y + 1] === 'roof') {
                var outerSpace = true;
                var j = 0;
                while (y - j !== 0) {
                    if (this._symbolMap[x][y - j] !== 'space') {
                        outerSpace = false;
                    }
                    j++;
                }
                var i = 0;
                if (outerSpace === false && this._fillRoof) {
                    while (this._symbolMap[x][y - i] === 'space' || this._symbolMap[x][y - i] === 'wall') {
                        this._symbolMap[x][y - i] = 'roof';
                        i++;
                    }
                }

            }
        }
    }
};

// 좌표에 의한 이벤트 데이터 배열
Game_MapGenerator.prototype.dataMapEventsXy = function(x, y) {
    return $dataMap.events.filter(function(event) {
        return (!!event && event.x === x && event.y === y);
    }, this);
};

// 출발점 이벤트의 설치
Game_MapGenerator.prototype.setStart = function () {
    var refXY = this._symbolTable['start'].refXY;
    var event = new Game_Event($gameMap.mapId(), this.dataMapEventsXy(refXY.x, refXY.y)[0].id);
    var dataEvent = $dataMap.events[event._eventId];
    var newPlayerLocationX;
    var newPlayerLocationY;
    if (dataEvent.meta.SpecialWall) {
        this._startXY = this.setEvent(event, 'wall');
        // we want to spawn the player below the wall event so they dont get stuck
        newPlayerLocationY = this._startXY.y + 1;
        // set priority type to 1 (same as characters) so that player can touch event
        // to trigger it
        event.setPriorityType(1);
    }
    else {
        // change: call chooseRoom function
        var room = this.chooseRoom(event);
        // change: mark start room
        console.log(this._rooms, room)
        this._rooms[this._rooms.indexOf(room)].hasStart = true;
        // change: call setEvent with 'room' and room parameters
        this._startXY = this.setEvent(event, 'room', room);
        console.log("startXY :"+ this._startXY)
        newPlayerLocationY = this._startXY.y;
    }
    newPlayerLocationX = this._startXY.x;

    $gamePlayer.locate(newPlayerLocationX, newPlayerLocationY);
    $gamePlayer.reserveTransfer($gameMap.mapId(), newPlayerLocationX, newPlayerLocationY);
    $gameMap._interpreter.setWaitMode('transfer')
};

// 골인 지점 이벤트의 설치
Game_MapGenerator.prototype.setGoal = function () {
    var refXY = this._symbolTable['goal'].refXY;
    var event = new Game_Event($gameMap.mapId(), this.dataMapEventsXy(refXY.x, refXY.y)[0].id);
    var dataEvent = $dataMap.events[event._eventId];

    if (dataEvent.meta.SpecialWall) {
        // change: spawn on wall
        this._goalXY = this.setEvent(event, 'wall');
        // set priority type to 1 (same as characters) so that player can touch event
        // to trigger it
        event.setPriorityType(1);
    }
    else {
        // change: call chooseRoom function
        var room = this.chooseRoom(event);
        // change: mark goal room
        this._rooms[this._rooms.indexOf(room)].hasGoal = true;
        // change: call setEvent with 'room' and room parameters
        this._goalXY = this.setEvent(event, 'room', room);
    }
};

// 방 이벤트의 설치
/*Game_MapGenerator.prototype.setRoomEvents = function() {
    console.log("이벤트 생성");
    var mapDataRateRoomEvents = $dataMap.events.filter(function(event) {
        return !!event && !!event.meta.RateRoom;
    });
        this._rooms.forEach(function(room) {
        	var refXY = this._symbolTable['start'].refXY;
        	var event = new Game_Event($gameMap.mapId(), this.dataMapEventsXy(refXY.x, refXY.y)[0].id);
            event._comments = "<collider:box," + room.w*48 + ", " + room.h*48 + ", 0, 0>";
        	this.setEventAt(event, 'room', room);
        }, this);
};*/

// 확률 이벤트의 설치
Game_MapGenerator.prototype.setRateEvents = function () {
    var mapDataRateMapEvents = $dataMap.events.filter(function (event) {
        return !!event && !!event.meta.RateMap;
    });
    mapDataRateMapEvents.forEach(function (mapDataEvent) {
        // change: check event meta for min/max
        var minimum = mapDataEvent.meta.Minimum
                ? parseInt(mapDataEvent.meta.Minimum) : 1;
        var maximum = mapDataEvent.meta.Maximum
                ? parseInt(mapDataEvent.meta.Maximum) : 1;
        var count = minimum;
        if (maximum - minimum >= 1) {
            count = Math.round((Math.random() * maximum) + minimum);
        }


        for (var i = 0; i < count; i++) {
            if (this.randBool(parseFloat(mapDataEvent.meta.RateMap))) {
                var event = new Game_Event($gameMap.mapId(), mapDataEvent.id);
                // change: select room by calling chooseRoom
                var room = this.chooseRoom(event);
                this.setEvent(event, 'room', room);
            }
        }
    }, this);

    var mapDataRateRoomEvents = $dataMap.events.filter(function (event) {
        return !!event && !!event.meta.RateRoom;
    });
    mapDataRateRoomEvents.forEach(function (mapDataEvent) {
        this._rooms.forEach(function (room) {
            // change: check event meta for min/max
            var minimum = mapDataEvent.meta.Minimum
                    ? parseInt(mapDataEvent.meta.Minimum) : 1;
            var maximum = mapDataEvent.meta.Maximum
                    ? parseInt(mapDataEvent.meta.Maximum) : 1;
            var count = minimum;
            if (maximum - minimum >= 1) {
                count = Math.round((Math.random() * maximum) + minimum);
            }

            // change: make more than one attempt
            for (var i = 0; i < count; i++) {
                // change: check if can set in room
                if (this.canSetInRoom(room, mapDataEvent)) {
                    if (this.randBool(parseFloat(mapDataEvent.meta.RateRoom))) {
                        var event = new Game_Event($gameMap.mapId(), mapDataEvent.id);
                        this.setEvent(event, 'room', room);
                    }
                }
            }
        }, this);
    }, this);

    var mapDataRateRoomTilesEvents = $dataMap.events.filter(function (event) {
        return !!event && !!event.meta.RateRoomTiles;
    });
    mapDataRateRoomTilesEvents.forEach(function (mapDataEvent) {
        // change: check event meta for min/max
        var minimum = mapDataEvent.meta.Minimum
                ? parseInt(mapDataEvent.meta.Minimum) : 1;
        var maximum = mapDataEvent.meta.Maximum
                ? parseInt(mapDataEvent.meta.Maximum) : 1;
        var count = minimum;
        if (maximum - minimum >= 1) {
            count = Math.round((Math.random() * maximum) + minimum);
        }


        for (var i = 0; i < count; i++) {
            if (this.randBool(parseFloat(mapDataEvent.meta.RateRoomTiles))) {
                var event = new Game_Event($gameMap.mapId(), mapDataEvent.id);
                // change: select room by calling chooseRoom
                var room = this.chooseRoom(event);
                this.setEvent(event, 'room', room);
            }
        }
    }, this);

    var mapDataRateWallsEvents = $dataMap.events.filter(function (event) {
        return !!event && !!event.meta.RateWall;
    });
    mapDataRateWallsEvents.forEach(function (mapDataEvent) {
    	this._rooms.forEach(function (room) {
        // change: check event meta for min/max
        var minimum = mapDataEvent.meta.Minimum
                ? parseInt(mapDataEvent.meta.Minimum) : 1;
        var maximum = mapDataEvent.meta.Maximum
                ? parseInt(mapDataEvent.meta.Maximum) : 1;
        var count = minimum;
        if (maximum - minimum >= 1) {
            count = Math.round((Math.random() * maximum) + minimum);
        }

        for (var i = 0; i < count; i++) {
            if (this.randBool(parseFloat(mapDataEvent.meta.RateWall))) {
                var event = new Game_Event($gameMap.mapId(), mapDataEvent.id);
                // change: select room by calling chooseRoom
                var room = this.chooseRoom(event);
                this.setEvent(event, 'wall');
            }
        }
    }, this);
    }, this);
};

Game_MapGenerator.prototype.startRoom = function () {
    var startRoom;
    this._rooms.forEach(function (room) {
        if (room.hasStart === true)
            startRoom = room;
    }, this);
    return startRoom;
};

Game_MapGenerator.prototype.goalRoom = function () {
    return this._rooms.forEach(function (room) {
        if (room.hasGoal === true)
            return room;
    }, this);
};

Game_MapGenerator.prototype.isWallRoofOrRubble = function (x, y) {
    switch (this._symbolMap[x][y]) {
        case 'roof':
        case 'wall':
        case 'rubble':
            return true;
            break;
    }
    return false;
};

//랜덤 부울
//probability : true が返る確立
Game_MapGenerator.prototype.randBool = function(probability) {
    return Math.random() < probability;
};

// 기호 맵의 벽과 천장을 설치 : 맵 전체
// 바닥과 통로 만의 상징 맵에 벽과 천장을 추가
Game_MapGenerator.prototype.refreshWallAndRoof = function() {
    for (var x = 0; x < this._symbolMap.length; x++) {
        for (var y = 0; y < this._symbolMap[x].length; y++) {
            if (!this.isGround(x, y)) {
                continue;
            }
            this.refreshWallAndRoofUpperSide(x - 1, y - 1);  // 左上
            this.refreshWallAndRoofUpper(x, y - 1);          // 上
            this.refreshWallAndRoofUpperSide(x + 1, y - 1);  // 右上
            this.refreshWallAndRoofSide(x - 1, y);           // 左
            this.refreshWallAndRoofSide(x + 1, y);           // 右
            this.refreshWallAndRoofDowner(x - 1, y + 1);     // 左下
            this.refreshWallAndRoofDowner(x, y + 1);         // 下
            this.refreshWallAndRoofDowner(x + 1, y + 1);     // 右下
        }
    }
    for (var x = this._symbolMap.length - 1; x >= 0; x--) {
        for (var y = this._symbolMap[x].length - 1; y >= 0; y--) {
            if (this._symbolMap[x][y] === 'roof' && this._symbolMap[x][y - 1] === 'wall') {
                this._symbolMap[x][y - 1] = 'roof';
            }
        }
    }
};

// 기호 맵의 벽과 천장을 설치 : 위
Game_MapGenerator.prototype.refreshWallAndRoofUpper = function(x, y) {
    if (!this._symbolMap[x] || !this._symbolMap[x][y] || this.isGround(x, y)) {
        return;
    }
    for (var h = 0; h < y && !this.isGround(x, y - h); h++);
    if (h > this._wallHeight) {
        for (var wH = 0; wH < this._wallHeight; wH++) {
            this._symbolMap[x][y - wH] = 'wall';
        }
        this._symbolMap[x][y - this._wallHeight] = 'roof';
    } else {
        for (var wH = 0; wH < h; wH++) {
            if (!this.isGround(x, y - wH)) {
                this._symbolMap[x][y - wH] = 'wall';
            }
        }
    }
};

// 기호 맵의 벽과 천장을 설치 : 아래
Game_MapGenerator.prototype.refreshWallAndRoofDowner = function(x, y) {
    if (!this._symbolMap[x] || !this._symbolMap[x][y] || this.isGround(x, y)) {
        return;
    }
    for (var h = 0; h + y < $gameMap.height() && !this.isGround(x, y + h); h++);
    if (h > this._wallHeight) {
        this._symbolMap[x][y] = 'roof';
        if (this._showOuterWall) {
            for (var wH = 0; wH < this._wallHeight; wH++) {
                if (this._symbolMap[x][y + wH + 1] !== 'roof') {
                    this._symbolMap[x][y + wH + 1] = 'wall';
                }
            }
        }
    } else {
        for (var wH = 0; wH < h; wH++) {
            if (!this.isGround(x, y + wH) && !this.isWall(x, y)) {
                this._symbolMap[x][y + wH] = 'wall';
            }
        }
    }
};

//기호 맵의 벽과 천장을 설치 : 가로
Game_MapGenerator.prototype.refreshWallAndRoofSide = function(x, y) {
    if (!this._symbolMap[x] || !this._symbolMap[x][y] || this.isGround(x, y)) {
        return;
    }
    if (this.isGround(x, y + 1)) {
        this.refreshWallAndRoofUpper(x, y);
    } else {
        this.refreshWallAndRoofDowner(x, y);
    }
};

// 기호 맵의 벽과 천장을 설치 : 대각선
Game_MapGenerator.prototype.refreshWallAndRoofUpperSide = function(x, y) {
    if (!this._symbolMap[x] || !this._symbolMap[x][y] || this.isGround(x, y)) {
        return;
    }
    this.refreshWallAndRoofDowner(x, y - this._wallHeight);
};

// 오토 타일을 고려한 타일 ID
Game_MapGenerator.prototype.autoTileId = function(x, y, z) {
    var isPrefabRoom = this._symbolMap[x][y].split('_');
    if (isPrefabRoom[0] == 'room' && isPrefabRoom[1]) {//isPrefabRoom[0] == 'room' && isPrefabRoom[1] == '/[^0-9]/') {
        var roomNum = isPrefabRoom[1];
        var index = isPrefabRoom[2];
        console.log("is prefab L :", isPrefabRoom);
        var room = this._symbolTable[isPrefabRoom[0] + '_' + isPrefabRoom[1]];
        console.log("tilex,y,roomStartX,Y :", x, room.startX, y, room.startY)
        console.log("room.tile, index :", room, index)
        return room.tiles[index].baseTileId[z];
    }
    else {

        var baseTileId = this._symbolTable[this._symbolMap[x][y]].baseTileId[z];
        if ((x < 0 || x >= $dataMap.width) || (y < 0 || y >= $dataMap.height)) {
            return undefined;
        } else if (z === 4) {
            return this.shadow(x, y);
        } else if (!Tilemap.isAutotile(baseTileId)) {
            return baseTileId;
        }
    }

    var candidateTileIds = [];
    if (!Tilemap.isWallSideTile(baseTileId)) {
        // 벽 이외의 경우
        candidateTileIds = Game_MapGenerator.tileIdsFloor.candidate.concat();
        [1, 2, 3, 4, 6, 7, 8, 9].forEach (function(direction) {
            var dx = x + Math.floor((direction - 1) % 3) - 1;
            var dy = y - Math.floor((direction - 1) / 3) + 1;
            if ((dx < 0 || dx >= $dataMap.width) || (dy < 0 || dy >= $dataMap.height)) {
                return; // 지도 범위를 벗어나면 판정하지 않음동종 오토 타일의 경우 후보 타일 ID를 연결 타일 ID를 선택
            }
            var roundTileId = this._symbolTable[this._symbolMap[dx][dy].split('_')[0]].baseTileId[z];
            if (Tilemap.isSameKindTile(baseTileId, roundTileId)) {
                candidateTileIds = candidateTileIds.filter(function(Id) {
                    return Game_MapGenerator.tileIdsFloor.connect[direction].indexOf(Id) !== -1;
                }); // 동종 오토 타일의 경우 후보 타일 ID를 연결 타일 ID를 선택
            } else {
                candidateTileIds = candidateTileIds.filter(function(Id) {
                    return Game_MapGenerator.tileIdsFloor.noConnect[direction].indexOf(Id) !== -1;
                }); // 이종 오토 타일의 경우 후보 타일 ID에서 비 연결 타일 ID를 선택
            }
        }, this);
    } else {
        // 벽의 경우
        candidateTileIds = Game_MapGenerator.tileIdsWall.candidate.concat();
        for (var by = y; this._symbolMap[x][y].split('_')[0] === this._symbolMap[x][by + 1].split('_')[0]; by++);  // 壁の下端
        for (var ty = y; this._symbolMap[x][y].split('_')[0] === this._symbolMap[x][ty - 1].split('_')[0]; ty--);  // 壁の上端
        // 상하의 처리
        [2, 8].forEach(function(direction) {
            var dx = x + Math.floor((direction - 1) % 3) - 1;
            var dy = y - Math.floor((direction - 1) / 3) + 1;
            if ((dx < 0 || dx >= $dataMap.width) || (dy < 0 || dy >= $dataMap.height)) {
                return; // 지도 범위를 벗어나면 판정하지
            }
            var roundTileId = this._symbolTable[this._symbolMap[dx][dy].split('_')[0]].baseTileId[z];
            if (Tilemap.isSameKindTile(baseTileId, roundTileId)) {
                candidateTileIds = candidateTileIds.filter(function(Id) {
                    return Game_MapGenerator.tileIdsWall.connect[direction].indexOf(Id) !== -1;
                }); // 동종 오토 타일의 경우 후보 타일 ID를 연결 타일 ID를 선택
            } else {
                candidateTileIds = candidateTileIds.filter(function(Id) {
                    return Game_MapGenerator.tileIdsWall.noConnect[direction].indexOf(Id) !== -1;
                }); // 이종 오토 타일의 경우 후보 타일 ID에서 비 연결 타일 ID를 선택
            }
        }, this);
        // 좌우의 처리
        [4, 6].forEach(function(direction) {
            var dx = x + Math.floor((direction - 1) % 3) - 1;
            var dy = y - Math.floor((direction - 1) / 3) + 1;
            if ((dx < 0 || dx >= $dataMap.width) || (dy < 0 || dy >= $dataMap.height)) {
                return; // 지도 범위를 벗어나면 판정하지 않음
            }
            var upperSideTileId = this._symbolTable[this._symbolMap[dx][ty].split('_')[0]].baseTileId[z];
            var downerSideTileId = this._symbolTable[this._symbolMap[dx][by].split('_')[0]].baseTileId[z];
            if ((Tilemap.isWallTile(upperSideTileId)  || Tilemap.isRoofTile(upperSideTileId)) &&
                (Tilemap.isWallTile(downerSideTileId) || Tilemap.isRoofTile(downerSideTileId)))
            {
                candidateTileIds = candidateTileIds.filter(function(Id) {
                    return Game_MapGenerator.tileIdsWall.connect[direction].indexOf(Id) !== -1;
                }); // 벽 하단의 양옆 옆 벽 타일이나 천장 타일이면서 상단의 양 옆 옆 벽 타일이나 천장 타일 않으면 연결 타일 ID를 선택
            } else {
                candidateTileIds = candidateTileIds.filter(function(Id) {
                    return Game_MapGenerator.tileIdsWall.noConnect[direction].indexOf(Id) !== -1;
                }); // 비 연결 타일 ID를 선택
            }
        }, this);
    }
    return this._symbolTable[this._symbolMap[x][y].split('_')[0]].baseTileId[z] + candidateTileIds[0];
};


// 타일 ​​동종 판정
Game_MapGenerator.prototype.isSameKindTileSymbol = function(symbol1, symbol2) {
    return Tilemap.isSameKindTile(symbol1, symbol2);
};

// 그림자의 계산
Game_MapGenerator.prototype.shadow = function(x, y) {
    if (!this._symbolMap[x - 1] ||
        this._symbolMap[x][y] === 'space'||
        this._symbolMap[x][y] === 'roof' ||
        this._symbolMap[x][y] === 'wall')
    {
        return 0;
    } else if (this._symbolMap[x - 1][y] === 'roof') {
        if (this._symbolMap[x - 1][y - 1] === 'roof' ||
            this._symbolMap[x - 1][y - 1] === 'wall')
        {
            return 5;
        }
    }  else if (this._symbolMap[x - 1][y] === 'wall') {
        return 5;
    }
    return 0;
};

// 타일맵 그리는 함수
// 추가 : 레기온 생성
Game_MapGenerator.prototype.makeData = function() {
    var width = $dataMap.width;
    var height = $dataMap.height;
    for (var x = 0; x < this._symbolMap.length; x++) {
        for (var y = 0; y < this._symbolMap[x].length; y++) {
            for (var z = 0; z < 6; z++) {
                this._data[(z * height + y) * width + x] = this.autoTileId(x, y, z);
            }
        }
    }/*
    this._rooms.forEach(function(room) {
        for (var y = 0; y < room.h; y++) {
            for (var x = 0 ; x < room.w; x++) {
            	$gameMap._mapGenerator._data[(5*$dataMap.height + room.y + y) * $dataMap.width + room.x + x] = 1;//room.index;
            }
        }
    }, this);*/
};

// 비 지상 타일 통로 타일로 변환
Game_MapGenerator.prototype.notGroundToPass = function(x, y) {
    var wH = this._wallHeight;
    if (x < 2      || $gameMap.width() - 2       <= x) { return; }
    if (y < wH + 2 || $gameMap.height() - wH - 2 <= y) { return; }
    if (!this.isGround(x, y)) {
        this._symbolMap[x][y] = 'pass';
    }
};

// 곡괭이 (플레이어의 앞으로 1 타일 통로 타일로 변환)
Game_MapGenerator.prototype.pickel = function() {
    this.notGroundToPass(
        $gameMap.xWithDirection($gamePlayer.x, $gamePlayer.direction()),
        $gameMap.yWithDirection($gamePlayer.y, $gamePlayer.direction())
    );
    this.refreshWallAndRoof();
    this.makeData();
    if (Imported.SAN_AnalogMove) {
        Game_CollideMap.setup();
    }
};

// 바크 댄 (지정 좌표와 주변 총 9 타일을 통로 타일로 변환)
Game_MapGenerator.prototype.bomb = function(x, y) {
    for (var x2 = x - 1; x2 <= x + 1; x2++) {
        for (var y2 = y - 1; y2 <= y + 1; y2++) {
            this.notGroundToPass(x2, y2);
        }
    }
    this.refreshWallAndRoof();
    this.makeData();
    if (Imported.SAN_AnalogMove) {
        Game_CollideMap.setup();
    }
};

// 큰 방
Game_MapGenerator.prototype.bigRoom = function() {
    Game_MapGenerator.prototype.generateMap.call(this);
    this.refreshWallAndRoof();
    this.makeData();
    if (Imported.SAN_AnalogMove) {
        Game_CollideMap.setup();
    }
};

// 지정한 타일을 빈 타일로 변환
Game_MapGenerator.prototype.anyToSpace = function(x, y) {
    if (x < 0 || $gameMap.width()  <= x) { return; }
    if (y < 0 || $gameMap.height() <= y) { return; }
    this._symbolMap[x][y] = 'space';
};

// 벽 생성
Game_MapGenerator.prototype.makeWall = function(x, y) {
    this.anyToSpace(x, y);
    this.refreshWallAndRoof();
    this.makeData();
    if (Imported.SAN_AnalogMove) {
        Game_CollideMap.setup();
    }
};

// 맵 데이터
Game_MapGenerator.prototype.data = function() {
    return this._data;
};

// 타일 ​​ID
Game_MapGenerator.prototype.tileId = function(x, y, z) {
    return this._data[(z * $dataMap.height + y) * $dataMap.width + x];
};

// 준비 완료 판정
Game_MapGenerator.prototype.isReady = function() {
    return this._isReady;
};

// 맵의 콘솔 표시 (디버깅)
Game_MapGenerator.prototype.printMap = function() {
    var dispMap = "";
    for (var y = 0; y < this._symbolMap[0].length; y++) {
        for (var x = 0; x < this._symbolMap.length; x++) {
            if (this._symbolMap[x][y].split('_')[0] == 'room' && this._symbolMap[x][y].split('_')[1])
                dispMap += this._symbolTable['room_' + this._symbolMap[x][y].split('_')[1]].dispChar;
            else dispMap += this._symbolTable[this._symbolMap[x][y].split('_')[0]].dispChar;
        }
        dispMap += "\r\n";
    }
    console.log(dispMap);
};

//-----------------------------------------------------------------------------
// Game_MapGeneratorRoomAndPass
//
// 맵 생성기 (방과 통로)

function Game_MapGeneratorRoomAndPass() {
    this.initialize.apply(this, arguments);
}

Game_MapGeneratorRoomAndPass.prototype = Object.create(Game_MapGenerator.prototype);
Game_MapGeneratorRoomAndPass.prototype.constructor = Game_MapGeneratorRoomAndPass;

// 초기화
Game_MapGeneratorRoomAndPass.prototype.initialize = function() {
    Game_MapGenerator.prototype.initialize.call(this);
};

// 맵 (던전) 자동 생성
Game_MapGeneratorRoomAndPass.prototype.generateMap = function() {
    this._minRoomSize = Number(PluginManager.parameters('SAN_MapGenerator')['MinRoomSize']);
    this._maxRoomSize = Number(PluginManager.parameters('SAN_MapGenerator')['MaxRoomSize']);
    if (this._maxRoomSize < this._minRoomSize) {
        this._maxRoomSize = this._minRoomSize;
    }
    this._minRooms = Number(PluginManager.parameters('SAN_MapGenerator')['MinRooms']);
    this._maxRooms = Number(PluginManager.parameters('SAN_MapGenerator')['MaxRooms']);
    this._minBlockSize = this._minRoomSize + 5;
    this._minRooms = 7;
    this._maxRooms = 10;
    this._adjacentBlockIndexList = [];
    var block = {
            x: 1,
            y: 1 + this._wallHeight,
            w: $dataMap.width - 2,
            h: $dataMap.height - (this._wallHeight + 1) * 2,
            t: null
        };
    this._blocks.push(block);
    this.splitBlock(this._blocks[0]);
    this.makeAdjacentBlockIndexList();
    this.makeRooms();
    this.makePasses();
};

// 인접한 블록의 목록 작성
Game_MapGeneratorRoomAndPass.prototype.makeAdjacentBlockIndexList = function() {
    for (var crntIndex = 0; crntIndex < this._blocks.length; crntIndex++) {
    	this._blocks[crntIndex].t = crntIndex
        var crntBlock = this._blocks[crntIndex];
        this._adjacentBlockIndexList[crntIndex] = {t:[], b:[], l:[], r:[]};
        for (var tgetIndex = 0; tgetIndex < this._blocks.length; tgetIndex++) {
            var tgetBlock = this._blocks[tgetIndex];
            if (crntBlock === tgetBlock) {
                continue;
            }
            var adjacentT = (crntBlock.y === tgetBlock.y + tgetBlock.h + 1);
            var adjacentB = (tgetBlock.y === crntBlock.y + crntBlock.h + 1);
            var adjacentL = (crntBlock.x === tgetBlock.x + tgetBlock.w + 1);
            var adjacentR = (tgetBlock.x === crntBlock.x + crntBlock.w + 1);
            if (!adjacentT && !adjacentB && !adjacentL && !adjacentR) {
                continue;
            }
            var matchH =
                (tgetBlock.x <= crntBlock.x + crntBlock.w && tgetBlock.x >= crntBlock.x) ||
                (tgetBlock.x + tgetBlock.w <= crntBlock.x + crntBlock.w && tgetBlock.x + tgetBlock.w >= crntBlock.x) ||
                (crntBlock.x <= tgetBlock.x + tgetBlock.w && crntBlock.x >= tgetBlock.x) ||
                (crntBlock.x + crntBlock.w <= tgetBlock.x + tgetBlock.w && crntBlock.x + crntBlock.w >= tgetBlock.x);
            var matchV =
                (tgetBlock.y <= crntBlock.y + crntBlock.h && tgetBlock.y >= crntBlock.y) ||
                (tgetBlock.y + tgetBlock.h <= crntBlock.y + crntBlock.h && tgetBlock.y + tgetBlock.h >= crntBlock.y) ||
                (crntBlock.y <= tgetBlock.y + tgetBlock.h && crntBlock.y >= tgetBlock.y) ||
                (crntBlock.y + crntBlock.h <= tgetBlock.y + tgetBlock.h && crntBlock.y + crntBlock.h >= tgetBlock.y);
            if (adjacentT && matchH) {
                this._adjacentBlockIndexList[crntIndex].t.push(tgetIndex);
                continue;
            } else if (adjacentB && matchH) {
                this._adjacentBlockIndexList[crntIndex].b.push(tgetIndex);
                continue;
            }
            if (adjacentL && matchV) {
                this._adjacentBlockIndexList[crntIndex].l.push(tgetIndex);
                continue;
            } else if (adjacentR && matchV) {
                this._adjacentBlockIndexList[crntIndex].r.push(tgetIndex);
                continue;
            }
        }
    }
};

// 방 만들기
Game_MapGeneratorRoomAndPass.prototype.makeRooms = function() {
	var roomNum = 0;
    this._blocks.forEach(function(block) {
        roomNum += 1;
        /*
        var roomW = this._minRoomSize + Math.randomInt((block.w - (this._wallHeight + 1) * 2) - this._minRoomSize - 2);
        var roomH = this._minRoomSize + Math.randomInt((block.h - (this._wallHeight + 1) * 2) - this._minRoomSize - 2);
        if (roomW > this._maxRoomSize) {
            roomW = this._maxRoomSize;
        }
        if (roomH > this._maxRoomSize) {
            roomH = this._maxRoomSize;
        }
        var roomX = block.x + (this._wallHeight + 1) + 1 + Math.randomInt(block.w - roomW - (this._wallHeight + 1) * 2 - 1);
        var roomY = block.y + (this._wallHeight + 1) + 1 + Math.randomInt(block.h - roomH - (this._wallHeight + 1) * 2 - 1);
        var room = {x: roomX, y: roomY, w: roomW, h: roomH, hasStart: false, hasGoal: false, hasPass:{t:false, b:false, l:false, r:false}, index:roomNum};
        this._rooms.push(room);
    }, this);
    */
        var roomW = this._symbolTable['room_2'].width;
        var roomH = this._symbolTable['room_2'].height;

        var roomX = block.x + (this._wallHeight + 1) + 1 + Math.randomInt(block.w - roomW - (this._wallHeight + 1) * 2 - 1);
        var roomY = block.y + (this._wallHeight + 1) + 1 + Math.randomInt(block.h - roomH - (this._wallHeight + 1) * 2 - 1);
        var room = { x: roomX, y: roomY, w: roomW, h: roomH, hasStart: false, hasGoal: false, hasPass: { t: false, b: false, l: false, r: false }, index: roomNum };
        this._rooms.push(room);
    }, this);
    this._rooms.forEach(function (room) {
        var index = 0;
        for (var y = 0; y < room.h; y++) {
            for (var x = 0; x < room.w; x++) { 
                this._symbolMap[room.x + x][room.y + y] = 'room_2_' + index;
                index++;
            }
        }
    }, this);
};

// 통로 작성
Game_MapGeneratorRoomAndPass.prototype.makePasses = function() {
    var cache = {};
    for (var crntIndex = 0; crntIndex < this._adjacentBlockIndexList.length; crntIndex++ ) {
        cache[crntIndex] = [];
        var crngBlock = this._blocks[crntIndex];
        for(var direction in this._adjacentBlockIndexList[crntIndex]) {
            var tgetIndexList = this._adjacentBlockIndexList[crntIndex][direction];
            tgetIndexList.forEach(function(tgetIndex) {
                if (cache[tgetIndex] !== undefined && cache[tgetIndex].indexOf(crntIndex) !== -1)
                {
                    return;
                }
                cache[crntIndex].push(tgetIndex);
                var tgetBlock = this._blocks[tgetIndex];
                var crntRoom = this._rooms[crntIndex];
                var tgetRoom = this._rooms[tgetIndex];
                var crntPass = {x:0, y:0, w:0, h:0};
                var tgetPass = {x:0, y:0, w:0, h:0};
                var bordPass = {x:0, y:0, w:0, h:0};
                switch (direction) {
                case 't':
                    if (crntRoom.hasPass.t || tgetRoom.hasPass.b) {
                        return;
                    }
                    crntPass.x = crntRoom.x + 1 + Math.randomInt(crntRoom.w - 2);
                    crntPass.y = crngBlock.y;
                    crntPass.w = 2;
                    crntPass.h = crntRoom.y - crngBlock.y;
                    tgetPass.x = tgetRoom.x + 1 + Math.randomInt(tgetRoom.w - 2);
                    tgetPass.y = tgetRoom.y + tgetRoom.h;
                    tgetPass.w = 2;
                    tgetPass.h = crngBlock.y - tgetPass.y;
                    bordPass.x = Math.min(crntPass.x, tgetPass.x);
                    bordPass.y = crngBlock.y - 1;
                    bordPass.w = Math.max(crntPass.x, tgetPass.x) - bordPass.x + 1;
                    bordPass.h = 1;
                    crntRoom.hasPass.t = true;
                    tgetRoom.hasPass.b = true;
                    //$gameMap.copyEventFrom(1, 163, crntPass.x, bordPass.y + crntPass.h, true);
                    //$gameMap.copyEventFrom(1, 164, tgetPass.x, tgetPass.y + 2, true);
                    break;
                case 'b':
                    if (crntRoom.hasPass.b || tgetRoom.hasPass.t) {
                        return;
                    }
                    crntPass.x = crntRoom.x + 1 + Math.randomInt(crntRoom.w - 2);
                    crntPass.y = crntRoom.y + crntRoom.h;
                    crntPass.w = 2;
                    crntPass.h = tgetBlock.y - crntPass.y;
                    tgetPass.x = tgetRoom.x + 1 + Math.randomInt(tgetRoom.w - 2);
                    tgetPass.y = tgetBlock.y;
                    tgetPass.w = 2;
                    tgetPass.h = tgetRoom.y - tgetBlock.y;
                    bordPass.x = Math.min(crntPass.x, tgetPass.x);
                    bordPass.y = tgetBlock.y - 1;
                    bordPass.w = Math.max(crntPass.x, tgetPass.x) - bordPass.x + 1;
                    bordPass.h = 1;
                    crntRoom.hasPass.b = true;
                    tgetRoom.hasPass.t = true;
                    //$gameMap.copyEventFrom(1, 163, crntPass.x, crntPass.y + 2, true);
                    //$gameMap.copyEventFrom(1, 164, tgetPass.x, tgetPass.y + tgetPass.h - 1, true);
                    //console.log("b", crntPass.y, tgetPass.y, tgetPass.h);
                    break;
                case 'l':
                    if (crntRoom.hasPass.l || tgetRoom.hasPass.r) {
                        return;
                    }
                    crntPass.x = crngBlock.x - 1;
                    crntPass.y = crntRoom.y + 1 + Math.randomInt(crntRoom.h - 2);
                    crntPass.w = crntRoom.x - crntPass.x;
                    crntPass.h = 1;
                    tgetPass.x = tgetRoom.x + tgetRoom.w;
                    tgetPass.y = tgetRoom.y + 1 + Math.randomInt(tgetRoom.h - 2);
                    tgetPass.w = crntPass.x - tgetRoom.x - tgetRoom.w;
                    tgetPass.h = 1;
                    bordPass.x = crngBlock.x - 1;
                    bordPass.y = Math.min(crntPass.y, tgetPass.y);
                    bordPass.w = 1;
                    bordPass.h = Math.max(crntPass.y, tgetPass.y) - bordPass.y + 1;
                    crntRoom.hasPass.l = true;
                    tgetRoom.hasPass.r = true;
                    //$gameMap.copyEventFrom(1, 165, crntPass.w + bordPass.x - 1, crntPass.y, true);
                    //$gameMap.copyEventFrom(1, 165, tgetPass.x, tgetPass.y, true);
                    //console.log("l", crntPass.x, tgetPass.x, bordPass.x, crntPass.w, tgetPass.w, bordPass.w);
                    break;
                case 'r':
                    if (crntRoom.hasPass.r || tgetRoom.hasPass.l) {
                        return;
                    }
                    crntPass.x = crntRoom.x + crntRoom.w
                    crntPass.w = tgetBlock.x - 1 - crntRoom.x - crntRoom.w
                    crntPass.y = crntRoom.y + 1 + Math.randomInt(crntRoom.h - 2);
                    crntPass.h = 1;
                    tgetPass.x = tgetBlock.x - 1;
                    tgetPass.y = tgetRoom.y + 1 + Math.randomInt(tgetRoom.h - 2);
                    tgetPass.w = tgetRoom.x - tgetPass.x;
                    tgetPass.h = 1;
                    bordPass.x = tgetBlock.x - 1;
                    bordPass.y = Math.min(crntPass.y, tgetPass.y);
                    bordPass.w = 1;
                    bordPass.h = Math.max(crntPass.y, tgetPass.y) - bordPass.y + 1;
                    crntRoom.hasPass.r = true;
                    tgetRoom.hasPass.l = true;
                    //$gameMap.copyEventFrom(1, 165, crntPass.x, crntPass.y, true);
                    //$gameMap.copyEventFrom(1, 165, tgetPass.x + tgetPass.w - 1, tgetPass.y, true);
                    //$gameMap.copyEventFrom(1, 163, tgetPass.x, tgetPass.y, true);
                    //$gameMap.copyEventFrom(1, 163, bordPass.x, bordPass.y, true);
                    //console.log("r", crntPass.y, tgetPass.y, tgetPass.h);
                    break;
                }
                this._passes.push(crntPass);
                this._passes.push(tgetPass);
                this._passes.push(bordPass);
            }, this);
        }
    }
    this._passes.forEach(function(pass) {
        for (var y = 0; y < pass.h; y++) {
            for (var x = 0; x < pass.w; x++) {
                this._symbolMap[pass.x + x][pass.y + y] = 'pass';
            }
        }
    }, this);
};

//통로작성 구버전으로(dream 익스텐스 호환)
/*Game_MapGeneratorRoomAndPass.prototype.makePasses = function() {
    var cache = {};
    for (var crntIndex = 0; crntIndex < this._adjacentBlockIndexList.length; crntIndex++ ) {
        cache[crntIndex] = [];
        var crngBlock = this._blocks[crntIndex];
        for(var direction in this._adjacentBlockIndexList[crntIndex]) {
            var tgetIndexList = this._adjacentBlockIndexList[crntIndex][direction];
            tgetIndexList.forEach(function(tgetIndex) {
                if (cache[tgetIndex] !== undefined && cache[tgetIndex].indexOf(crntIndex) !== -1)
                {
                    return;
                }
                cache[crntIndex].push(tgetIndex);
                var tgetBlock = this._blocks[tgetIndex];
                var crntRoom = this._rooms[crntIndex];
                var tgetRoom = this._rooms[tgetIndex];
                var crntPass = {};
                var tgetPass = {};
                var bordPass = {};
                switch (direction) {
                case 't':
                    crntPass.x = crntRoom.x + 1 + Math.randomInt(crntRoom.w - 2);
                    crntPass.y = crngBlock.y;
                    crntPass.w = 1;
                    crntPass.h = crntRoom.y - crngBlock.y;
                    tgetPass.x = tgetRoom.x + 1 + Math.randomInt(tgetRoom.w - 2);
                    tgetPass.y = tgetRoom.y + tgetRoom.h;
                    tgetPass.w = 1;
                    tgetPass.h = crngBlock.y - tgetPass.y;
                    bordPass.x = Math.min(crntPass.x, tgetPass.x);
                    bordPass.y = crngBlock.y - 1;
                    bordPass.w = Math.max(crntPass.x, tgetPass.x) - bordPass.x + 1;
                    bordPass.h = 1;
                    break;
                case 'b':
                    crntPass.x = crntRoom.x + 1 + Math.randomInt(crntRoom.w - 2);
                    crntPass.y = crntRoom.y + crntRoom.h;
                    crntPass.w = 1;
                    crntPass.h = tgetBlock.y - crntPass.y;
                    tgetPass.x = tgetRoom.x + 1 + Math.randomInt(tgetRoom.w - 2);
                    tgetPass.y = tgetBlock.y;
                    tgetPass.w = 1;
                    tgetPass.h = tgetRoom.y - tgetBlock.y;
                    bordPass.x = Math.min(crntPass.x, tgetPass.x);
                    bordPass.y = tgetBlock.y - 1;
                    bordPass.w = Math.max(crntPass.x, tgetPass.x) - bordPass.x + 1;
                    bordPass.h = 1;
                    break;
                case 'l':
                    crntPass.x = crngBlock.x - 1;
                    crntPass.y = crntRoom.y + 1 + Math.randomInt(crntRoom.h - 2);
                    crntPass.w = crntRoom.x - crntPass.x;
                    crntPass.h = 1;
                    tgetPass.x = tgetRoom.x + tgetRoom.w;
                    tgetPass.y = tgetRoom.y + 1 + Math.randomInt(tgetRoom.h - 2);
                    tgetPass.w = crntPass.x - tgetRoom.x - tgetRoom.w;
                    tgetPass.h = 1;
                    bordPass.x = crngBlock.x - 1;
                    bordPass.y = Math.min(crntPass.y, tgetPass.y);
                    bordPass.w = 1;
                    bordPass.h = Math.max(crntPass.y, tgetPass.y) - bordPass.y + 1;
                    break;
                case 'r':
                    crntPass.x = crntRoom.x + crntRoom.w
                    crntPass.w = tgetBlock.x - 1 - crntRoom.x - crntRoom.w
                    crntPass.y = crntRoom.y + 1 + Math.randomInt(crntRoom.h - 2);
                    crntPass.h = 1;
                    tgetPass.x = tgetBlock.x - 1;
                    tgetPass.y = tgetRoom.y + 1 + Math.randomInt(tgetRoom.h - 2);
                    tgetPass.w = tgetRoom.x - tgetPass.x;
                    tgetPass.h = 1;
                    bordPass.x = tgetBlock.x - 1;
                    bordPass.y = Math.min(crntPass.y, tgetPass.y);
                    bordPass.w = 1;
                    bordPass.h = Math.max(crntPass.y, tgetPass.y) - bordPass.y + 1;
                    break;
                }
                this._passes.push(crntPass);
                this._passes.push(tgetPass);
                this._passes.push(bordPass);
            }, this);
        }
    }
    this._passes.forEach(function(pass) {
        for (var y = 0; y < pass.h; y++) {
            for (var x = 0; x < pass.w; x++) {
                this._symbolMap[pass.x + x][pass.y + y] = 'pass';
            }
        }
    }, this);
};*/

// 블록 분할 : 무작위
Game_MapGeneratorRoomAndPass.prototype.splitBlock = function(block) {
    if (this.randBool(0.5)) {
        if (this.isSplitableH(block)) {
            this.splitBlockH(block);
        }
        if (this.isSplitableV(block)) {
            this.splitBlockV(block);
        }
    } else {
        if (this.isSplitableV(block)) {
            this.splitBlockV(block);
        }
        if (this.isSplitableH(block)) {
            this.splitBlockH(block);
        }
    }
};

//블록 분할 : 가로 분할
Game_MapGeneratorRoomAndPass.prototype.splitBlockH = function(block) {
    var orgBlockW = 0;
    var newBlockW = 0;
    while (orgBlockW < this._minBlockSize || newBlockW < this._minBlockSize) {
        orgBlockW = Math.floor(block.w / 4 + block.w * Math.random() / 2);
        newBlockW = block.w - orgBlockW - 1;
    }
    block.w = orgBlockW;
    var newBlock = {x:block.x + orgBlockW + 1, y:block.y, w:newBlockW, h:block.h};
    this._blocks.push(newBlock);
    this.splitBlock(block);
    this.splitBlock(newBlock);
};

// 블록 분할 : 세로 분할
Game_MapGeneratorRoomAndPass.prototype.splitBlockV = function(block) {
    var orgBlockH = 0;
    var newBlockH = 0;
    while (orgBlockH < this._minBlockSize || newBlockH < this._minBlockSize) {
        orgBlockH = Math.floor(block.h / 4 + block.h * Math.random() / 2);
        newBlockH = block.h - orgBlockH - 1;
    }
    block.h = orgBlockH;
    var newBlock = {x:block.x, y:block.y + orgBlockH + 1, w:block.w, h:newBlockH};
    this._blocks.push(newBlock);
    this.splitBlock(block);
    this.splitBlock(newBlock);
};

// 블록 분할 가능 판정 : 객실 수
Game_MapGeneratorRoomAndPass.prototype.isSplitableByRoomNum = function() {
    if (this._blocks.length >= this._maxRooms) {
        return false;
    }
    if (this._blocks.length >= this._minRooms &&
        this.randBool((this._blocks.length - this._minRooms + 1) / (this._maxRooms - this._minRooms + 1)))
    {
        return false;
    }
    return true;
};

// 블록 분할 가능 판정 : 가로 분할
Game_MapGeneratorRoomAndPass.prototype.isSplitableV = function(block) {
    return block.h > (this._minBlockSize * 2 + 1) && this.isSplitableByRoomNum();
};

// 블록 분할 가능 판정 : 세로 분할
Game_MapGeneratorRoomAndPass.prototype.isSplitableH = function(block) {
    return block.w > (this._minBlockSize * 2 + 1) && this.isSplitableByRoomNum();
};

// 좌표로 방을 취득
Game_MapGeneratorRoomAndPass.prototype.roomByXY = function(x, y) {
    for (i = 0; i < this._rooms.length; i++) {
        var room = this._rooms[i];
        if (room.x <= x && x < room.x + room.w &&
            room.y <= y && y < room.y + room.h)
        {
            return room;
        }
    }
    return undefined;
};

//-----------------------------------------------------------------------------
// Game_Map
//
// 맵 클래스

// 맵 클래스의 초기화
Sanshiro.Game_MapGenerator.Game_Map_initialize = Game_Map.prototype.initialize;
Game_Map.prototype.initialize = function() {
    Sanshiro.Game_MapGenerator.Game_Map_initialize.call(this);
};

// 맵 생성기의 취득
Game_Map.prototype.mapGenerator = function() {
    return this._mapGenerator;
};

// 맵 클래스 설정
Sanshiro.Game_MapGenerator.Game_Map_setup = Game_Map.prototype.setup;
Game_Map.prototype.setup = function(mapId) {
    Sanshiro.Game_MapGenerator.Game_Map_setup.call(this, mapId)
    this._mapGenerator = null;
};

// 맵 클래스의 타일 ID
Sanshiro.Game_MapGenerator.Game_Map_tileId = Game_Map.prototype.tileId
Game_Map.prototype.tileId = function(x, y, z) {
    if (this.isGenegratedMap()) {
        return this._mapGenerator.tileId(x, y, z);
    }
    return Sanshiro.Game_MapGenerator.Game_Map_tileId.call(this, x, y, z);
};

// 맵 클래스의 맵 데이터
Sanshiro.Game_MapGenerator.Game_Map_data = Game_Map.prototype.data
Game_Map.prototype.data = function() {
    if (this.isGenegratedMap()) {
        return this._mapGenerator.data();
    }
    return Sanshiro.Game_MapGenerator.Game_Map_data.call(this);
};

// 맵 클래스의 통행 판정
Sanshiro.Game_MapGenerator.Game_Map_isPassable = Game_Map.prototype.isPassable
Game_Map.prototype.isPassable = function(x, y, d) {
    if (this.isGenegratedMap()) {
        return this._mapGenerator.isPassable(x, y, d);
    }
    return Sanshiro.Game_MapGenerator.Game_Map_isPassable.call(this, x, y, d);
};

// 맵 클래스의 맵 자동 생성
Game_Map.prototype.generateMap = function(mapType) {
    mapType = mapType || 'FillRoom';
    switch (mapType) {
    case 'RoomAndPass':
        this._mapGenerator = new Game_MapGeneratorRoomAndPass();
        $gameMap.reloadTileMap();
        break;
    case 'FillRoom':
        this._mapGenerator = new Game_MapGenerator();
        $gameMap.reloadTileMap();
        break;
    }
    this._mapGenerator.setup();
    if (Imported.SAN_AnalogMove) {
        Game_CollideMap.setup();
    }
    $gameMap.setupMapColliders();
};

// 자동 생성 맵 판정
Game_Map.prototype.isGenegratedMap = function() {
    return !!this._mapGenerator && this._mapGenerator.isReady();
};

// ツルハシ
Game_Map.prototype.pickel = function() {
    if (this.isGenegratedMap()) {
        this._mapGenerator.pickel();
    }
};

// バクダン
Game_Map.prototype.bomb = function(x, y) {
    if (this.isGenegratedMap()) {
        this._mapGenerator.bomb(x, y);
    }
};

// 大部屋
Game_Map.prototype.bigRoom = function() {
    if (this.isGenegratedMap()) {
        this._mapGenerator.bigRoom();
    }
};

// 壁生成
Game_Map.prototype.makeWall = function(x, y) {
    if (this.isGenegratedMap()) {
        this._mapGenerator.makeWall(x, y);
    }
};

//-----------------------------------------------------------------------------
// Game_Character
//
// キャラクタークラス

Game_Character.prototype.currentRoom = function () {
    var temp;
	if (!$gameMap.isGenegratedMap ||
        !($gameMap.mapGenerator() instanceof Game_MapGeneratorRoomAndPass))
    {
        return undefined;
    }	
    if ($gameMap.mapGenerator().roomByXY(Math.floor(this.x), Math.floor(this.y)))
    	temp = $gameMap.mapGenerator().roomByXY(Math.floor(this.x), Math.floor(this.y));
    else if ($gameMap.mapGenerator().roomByXY(Math.floor(this.x) + 1, Math.floor(this.y)))
        	temp = $gameMap.mapGenerator().roomByXY(Math.floor(this.x) + 1, Math.floor(this.y));
    else if ($gameMap.mapGenerator().roomByXY(Math.floor(this.x), Math.floor(this.y) + 1))
        	temp = $gameMap.mapGenerator().roomByXY(Math.floor(this.x), Math.floor(this.y) + 1);
    else if ($gameMap.mapGenerator().roomByXY(Math.floor(this.x) + 1, Math.floor(this.y) + 1))
    	temp = $gameMap.mapGenerator().roomByXY(Math.floor(this.x) + 1, Math.floor(this.y) + 1);
    return temp;
};

// 플레이어와 같은 방 판정
Game_Character.prototype.isSameRoomWithPlayer = function() {
    if ($gameMap.mapGenerator().constructor === Game_MapGenerator) { return true; }
    var room1 = this.currentRoom();
    var room2 = $gamePlayer.currentRoom();
    return (!!room1 && !!room2 && room1 === room2);
};

//-----------------------------------------------------------------------------
// Game_Event
//
// 이벤트 클래스

// 이벤트 클래스의 초기화
Sanshiro.Game_MapGenerator.Game_Event_initialize = Game_Event.prototype.initialize;
Game_Event.prototype.initialize = function(mapId, eventId) {
    this._dataEventId = eventId;
    Sanshiro.Game_MapGenerator.Game_Event_initialize.call(this, mapId, eventId);
};

// 이벤트 클래스 데이터베이스의 이벤트 데이터
Game_Event.prototype.event = function() {
    return $dataMap.events[this._dataEventId];
};

//-----------------------------------------------------------------------------
// Game_Interpreter
//
// 인터프리터 클래스

// 플러그인 명령
Sanshiro.Game_MapGenerator.Game_Interpreter_pluginCommand = Game_Interpreter.prototype.pluginCommand;
Game_Interpreter.prototype.pluginCommand = function(command, args) {
    Sanshiro.Game_MapGenerator.Game_Interpreter_pluginCommand.call(this, command, args);
    if (command === 'MapGenerator') {
        switch (args[0]) {
        case 'FillRoom':
            $gameMap.generateMap(args[0]);
            break;
        case 'RoomAndPass':
            $gameMap.generateMap(args[0]);
            break;
        }
    }
};
