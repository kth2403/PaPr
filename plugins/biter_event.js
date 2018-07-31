//===================================================================================
// biter_event.js
//===================================================================================

/*:
 * @plugindesc v1.00 Copy events from a source map to the current map
 * @author Pixel Hero
 *
 * @help
 * ==================================================================================
 * biter_event by Pixel Hero from http://biterswitch.com
 * ==================================================================================
 * This plugin let you copy events from a source map to the current map
 * ==================================================================================
 * Terms of use
 * ==================================================================================
 * This plugin is free to use in any game made with RPG Maker MV
 * Credits must be given to Pixel Hero, inside the game (like in a credits scene)
 * ==================================================================================
 * Usage
 * ==================================================================================
 * Plugin command:
 * copyevent sourceMapId sourceEventX,sourceEventY destinationX,destinationY
 *
 * Script call:
 * $gameMap.copyEvent(mapId, sourceEventX, sourceEventY, destinationX, destinationY);
 * ==================================================================================
 */

var Imported = Imported || {};
Imported.biter_event = true;

var biterswitch = biterswitch || {};
biterswitch["event"] = {};

(function() {

//==============================================================================
// ** Game_Map
//==============================================================================
Game_Map.prototype.onLoadMapInfo = function(dataMap, sx, sy, dx, dy) {
    if(!$gameMap) {
        return;
    }

    var data = null;

    dataMap.events.filter(function(evt) {
        if(evt && evt.x == sx && evt.y == sy) {
            data = JsonEx.makeDeepCopy(evt);
        }
    });

    if(!data || data.length < 1) {
        return;
    }

    data.mapId = this._mapId;
    data.eventId = this._events.length;
    data.id = data.eventId;
    data.x = dx;
    data.y = dy;
    $dataMap.events[data.eventId] = data;

    var event = new Game_Event(data.mapId, data.eventId);

    this._events[data.eventId] = event;

    if (SceneManager._scene instanceof Scene_Map) {
        var sprite = new Sprite_Character(event);
        SceneManager._scene._spriteset._characterSprites.push(sprite);
        SceneManager._scene._spriteset._tilemap.addChild(sprite);
    }

    return event;
};

Game_Map.prototype.copyEvent = function(mapId, sx, sy, dx, dy) {
    var xhr = new XMLHttpRequest();
    var url = 'data/Map%1.json'.format(mapId.padZero(3));

    xhr.open('GET', url);
    xhr.overrideMimeType('application/json');

    xhr.onload = function() {
        if (xhr.status < 400) {
            $gameMap.onLoadMapInfo(JSON.parse(xhr.responseText), sx, sy, dx, dy);
        }
    };

    xhr.onerror = function() {
        DataManager._errorUrl = DataManager._errorUrl || url;
    };

    xhr.send();
};

//==============================================================================
// ** Game_Interpreter
//==============================================================================
var biter_event_game_interpreter_pluginCommand = Game_Interpreter.prototype.pluginCommand;
Game_Interpreter.prototype.pluginCommand = function(command, args) {
  	biter_event_game_interpreter_pluginCommand.call(this, command, args);

    command = command.toLowerCase();
  	if(command === 'copyevent' && args[0]) {
        var src = args[1].split(",");
        var des = args[2].split(",");

        if(src.length != 2 || des.length != 2) {
            return false;
        }

        $gameMap.copyEvent(args[0], src[0], src[1], des[0], des[1]);
    }
};

})();
