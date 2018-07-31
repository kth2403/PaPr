/*=============================================================================
 * CityShrimp's Fog of War System
 * CS_FogOfWar.js
 * Version: 1.1.2
 * Free for commercial and non commercial use.
 *=============================================================================*/

 /*:
 * @plugindesc This plugin provides a complete fog of war system.
 *             
 * @author CityShrimp
 *
 * ===Parameter List===
 *
 * @param Enabled
 * @desc Enable fog by default in any map.
 * @default false
 *
 * @param Fog Opacity
 * @desc Default opacity of the fog sprites, between 0 to 1
 * @default 0.6
 *
 * @param Fade Speed
 * @desc Amount of opacity that changes with each update, between 0 to 1
 * @default 0.1
 *
 * @param Map Hidden
 * @desc Whether the map is hidden and needs to be discovered.  If set to true, then map starts out blacked out (think Starcraft)
 * @default false
 *
 * @param Gradient Vision
 * @desc Vision is gradient (as opposed to completely clear)
 * @default false
 *
 * @param Strict Diagonals
 * @desc If diagonals can be seen more easily or not.  For example, with Strict Diagonals enabled, if a player has blocked vision on top and to the right, then the top-right tile is not visible.  The top-right tile will be visible if Strict Diagonals is disabled.
 * @default false
 *
 * @param Player Vision
 * @desc Player has vision. Can be toggled with plugin command.
 * @default true
 *
 * @param Player Vision Range
 * @desc Player's vision range. Can be modified with plugin command.
 * @default 3
 *
 * @param Player Vision Type
 * @desc Default vision type for Player. 1 - Diamond, 2 - Square, 3 - Circle, 4 - Directional (does not work with 8 or 16 directional movement)
 * @default 1
 *
 * @param Player Flying Vision
 * @desc Whether Player has unobstructed vision or not.
 * @default false
 *
 * @param Player Vision Brightness
 * @desc Default brightness of the player's vision on fog, between 0 to 1.
 * @default 1
 *
 * @param Origin Vision Range
 * @desc This is the default vision range for origin events.
 * @default 3
 *
 * @param Origin Vision Type
 * @desc Default vision type for origin events (except Player). 1 - Diamond, 2 - Square, 3 - Circle, 4 - Directional (does not work with 8 or 16 directional movement)
 * @default 1
 *
 * @param Origin Flying Vision
 * @desc Whether origin events will have unobstructed vision by default or not
 * @default false
 *
 * @param Origin Vision Brightness
 * @desc Default brightness of the origin events' vision on fog, between 0 to 1.
 * @default 1
 *
 * @param Forest RegionId
 * @desc RegionId for forest tiles
 * @default 1
 *
 * @param Hill RegionId
 * @desc RegionId for hill tiles. Origins on Hills can see through everything but Mountain and Blocker tiles
 * @default 2
 *
 * @param Mountain / Wall RegionId
 * @desc RegionId for mountain / wall tiles
 * @default 3
 *
 * @param Blocker RegionId
 * @desc RegionId for blocker tiles (cannot see through or reveal unless origin is flying)
 * @default 4
 *
 * @param Dark RegionId
 * @desc RegionId for dark tiles (can see through, but never revealed)
 * @default 5
 *
 * @param Watchtower RegionId
 * @desc RegionId for watchtower tiles. Origins on Hills can see through everything but Mountain and Blocker tiles
 * @default 6
 *
 * @param Watchtower Modifier
 * @desc Vision range modifier for watchtower tiles.  It will increase the origin's range by n
 * @default 1
 *
 * ===Map Notetag===
 *
 * <fow_enabled>
 * desc: Eanbles fog of war for this map
 *
 * <fow_opacity: (value)>
 * desc: Sets the fog sprite opacity for this map.  (value): between 0 to 1
 *
 * <fow_map_hidden>
 * desc: Eanbles hidden map fog of war
 *
 * <fow_gradient_vision>
 * desc: Eanbles gradient vision
 *
 * <fow_strict_diagonals>
 * desc: Eanbles strict diagonals visibility detection
 *
 * <fow_origin_range: (value)>
 * desc: Origin events' vision range for this map
 *
 * <fow_origin_type: (value)>
 * desc: Sets the fog type for this map.  (value): 1 - Diamond, 2 - Square, 3 - Circle, 4 - Directional 
 *
 * <fow_flying_origins>
 * desc: Origins will have unobstructed vision.
 *
 * <fow_origin_brightness: (value)>
 * desc: Origin events' vision brigthness for this map.  (value): between 0 to 1
 *
 * <fow_player_vision>
 * desc: Player has vision for this map
 *
 * <fow_player_range: (value)>
 * desc: Player's vision range for this map
 *
 * <fow_player_type: (value)>
 * desc: Player's vision type for this map
 *
 * <fow_player_flying>
 * desc: Player has flying vision for this map
 *
 * <fow_player_brightness: (value)>
 * desc: Player's vision brigthness for this map
 *
 * ===Event Notetag / Comment===
 * Note: Comments have precedence over Notetags.
 *
 * <fow_origin>
 * desc: Event will be able to reveal fog. (range) is the vision range of the event.
 *
 * <fow_origin_range: (integer)>
 * desc: Set the origin event's vision range.
 *
 * <fow_origin_type: (integer)>
 * desc: Set the origin event's vision type.
 *
 * <fow_origin_flying: (bool)>
 * desc: Set the origin's flying (unobstructed vision) attribute
 *
 * <fow_origin_brightness: (value)>
 * desc: Set the origin event's brightness.  (value): between 0 to 1
 *
 * <fow_target>
 * desc: Event will be hidden unless on a revealed tile.
 *
 * <fow_blocker: (type)>
 * desc: Event will block vision.  1 - Can see through on elevated terrain (hill), 2 - Can reveal, but not see through (mountain), 0 - not blocker
 *
 * ===Plugin Commands===
 *
 * cs_fow enable
 * desc: Enable fog of war.  Does not persist if map changes.
 *
 * cs_fow disable
 * desc: Disable fog of war. Note: does not reveal target events hidden by fog.  Does not persist if map changes.
 *
 * cs_fow enable_player
 * desc: Enable player vision.
 *
 * cs_fow disable_player
 * desc: if put in the map note tags then scrolling will be back to normal instead of grid scrolling.
 *
 * cs_fow set_player_range <integer>
 * desc: Set the player's vision range.  Does not persist if map changes.
 *
 * cs_fow set_player_type <event id> <type>
 * desc: Set the player's vision type.  Does not persist if map changes.
 *
 * cs_fow set_player_flying <bool>
 * desc: Set the player's flying (unobstructed vision) attribute.  Does not persist if map changes.
 *
 * cs_fow add_origin <event id>
 * desc: Event will be able to reveal fog.  Does not persist if map changes.
 *
 * cs_fow set_origin_range <event id> <integer>
 * desc: Set the origin's vision range.  Does not persist if map changes.
 *
 * cs_fow set_origin_type <event id> <integer>
 * desc: Set the origin's vision type.  Does not persist if map changes.
 *
 * cs_fow set_origin_flying <event id> <bool>
 * desc: Set the origin's flying (unobstructed vision) attribute.  Does not persist if map changes.
 *
 * cs_fow set_origin_brightness <event id> <value>
 * desc: Set the origin's brightness, value: between 0 to 1.  Does not persist if map changes.
 *
 * cs_fow remove_origin <event id>
 * desc: Remove event from origin list. Does not work on events with <fow_origin> notetag.  Does not persist if map changes. 
 *
 * cs_fow remove_all_origins
 * desc: Removes all origins, excluding player and events with <fow_origin> notetag.  Does not persist if map changes.
 *
 * cs_fow add_target <event id>
 * desc: Event will be hidden in fog unless tile is revealed.   Does not persist if map changes.
 *
 * cs_fow remove_target <event id>
 * desc: Remove event from target list. Does not work on events with <fow_target> notetag.  Does not persist if map changes.
 *
 * cs_fow remove_all_targets
 * desc: Remove all targets, excluding events with <fow_target> notetag.  Does not persist if map changes.
 *
 * cs_fow add_blocker <event id> <type>
 * desc: Event will block vision. Does not persist if map changes. 1 - Can see through on elevated terrain (hill), 2 - Can reveal, but not see through (mountain), 0 - not blocker
 *
 * cs_fow_remove_blocker <event id>
 * desc: Remove the event from blocker list.  Does not work on events with <fow_blocker> notetag.  Does not persist if map changes.
 *
 * cs_fow remove_all_blockers
 * desc: Remove all blockers, excluding events with <fow_blocker> notetag.  Does not persist if map changes.
 *
 * ===Limitation and Notes===
 * - Does not work with maps with loop
 * - Targets may not show/hide correctly if they are bigger than 1 tile
 * - Performance may become an issue if 1) map is too large, 2) too many origins, 3) heavy use of circle or directinoal vision type, or 4) origin vision is too large
 * - All calclulations are "tile-based".  E.g., if an blocker event stands between two tiles, it will find which tile it's coordinates are on, and block vision for that tile only.
 * - If a tile is marked as a special region and also contains a blocker event, it will take the more restrictive of the two.  Example, if there's a blocker event (type 2 - mountain) on a hill tile.  It will block vision like a mountain.
 * - If an event initially starts had <fow_blocker> tag in comment, and then move into a page without the tag, it will continue to act as a blocker.  To clear it, make sure to include <fow_blocker: 0> in the new page.  This is done to preserve blockers added via plugin commands.
 * 
 * @help
 * ============================================================================
 * Latest Version
 * ============================================================================
 * 
 * Get the latest version of this script on 
 * https://github.com/cityshrimp/rmmv_fow/blob/master/CS_FogOfWar.js
 * 
 *=============================================================================
*/

var Imported = Imported || {};
Imported['CS_FogOfWar'] = "1.1.2";

var CS_FogOfWar = CS_FogOfWar || {};

// ===MVCommons Module (taken from SuperOrangeMovementEX) ===
if (Imported['MVCommons'] === undefined) {
  var MVC = MVC || {};

  (function($) {
    $.getProp = function(meta, propName) {
        if (meta === undefined)
            return undefined;
        if (meta[propName] !== undefined)
            return meta[propName];
        for (var key in meta) {
            if (key.toLowerCase() == propName.toLowerCase()) {
                return meta[key].trim();
            }
        }
        return undefined;
    };
  })(MVC);

  Number.prototype.fix = function() {return (parseFloat(this.toPrecision(12)));};
  Number.prototype.floor = function() {return Math.floor(this.fix());};
  Number.prototype.ceil = function() {return Math.ceil(this.fix());};
  Number.prototype.abs = function() {return Math.abs(this);};
}
// ===End SuperOrangeMovementEX's MVCommons Module===

(function($) {
    "use strict";
    
    // Load parameters
    $.parameters = PluginManager.parameters("CS_FogOfWar") || {};
    $.enabled = ($.parameters['Enabled'] === 'true') ? true : false;
    $.fog_opacity = Number($.parameters['Fog Opacity'] || 0.6);
    $.fade_speed = (Number($.parameters['Fade Speed'] || 0.1)) * 255;
    $.map_hidden = ($.parameters['Map Hidden'] === 'true') ? true : false;
    $.gradient_vision = ($.parameters['Gradient Vision'] === 'true') ? true : false;
    $.strict_diagonals = ($.parameters['Strict Diagonals'] === 'true') ? true : false;
    $.player_vision = ($.parameters['Player Vision'] === 'false') ? false : true;
    $.player_range = Number($.parameters['Player Vision Range'] || 3);
    $.player_type = Number($.parameters['Player Vision Type'] || 1);
    $.player_flying = Number($.parameters['Player Flying Vision'] === 'true') ? true : false;
    $.player_brightness = Number($.parameters['Player Vision Brightness'] || 1);
    $.default_range = Number($.parameters['Origin Vision Range'] || 3);
    $.vision_type = Number($.parameters['Origin Vision Type'] || 1);
    $.flying_origins = ($.parameters['Origin Flying Vision'] === 'true') ? true : false;
    $.vision_brightness = Number($.parameters['Origin Vision Brightness'] || 1);
    $._forest_region_id = Number($.parameters['Forest RegionId'] || 1); 
    $._hill_region_id = Number($.parameters['Hill RegionId'] || 2);
    $._mountain_region_id = Number($.parameters['Mountain RegionId'] || 3);
    $._blocker_region_id = Number($.parameters['Blocker RegionId'] || 4);
    $._dark_region_id = Number($.parameters['Dark RegionId'] || 5);
    $._watchtower_region_id = Number($.parameters['Watchtower RegionId'] || 6);
    $._watchtower_modifier = Number($.parameters['Watchtower Modifier'] || 1);

    // Fog Bitmap
    $.bitmap = new Bitmap(48, 48);
    $.bitmap.fillAll('black');
    $.visible_sets = new Array();
    
    $.first_update = false;
    $.after_load = false;
    
    // Create fog sprites and sight count map
    $.init = function() {  
        for (var i = 0; i < $dataMap.width; i++) {
            for (var j = 0; j < $dataMap.height; j++) {
                this._fog_tiles[i][j].visible = true;
                this._fog_tiles[i][j].addGradient(-1, 1 - $gameSystem.fow_fog_opacity);
                this._fog_tiles[i][j].x = (i - $gameMap.displayX())*48;
                this._fog_tiles[i][j].y = (j - $gameMap.displayY())*48;
            }
        }

        // Map has "Map Hidden" enabled, need to save a copy of discovered tiles
        if ($gameSystem.fow_map_hidden) {
            // Check if tiles have already been generated previously
            if (this._discovered_tiles == undefined) {
                this._discovered_tiles = new Array($dataMap.width);
                for (var i = 0; i < $dataMap.width; i++) {
                    this._discovered_tiles[i] = new Array($dataMap.height);

                    for (var j = 0; j < $dataMap.height; j++) {
                        this._discovered_tiles[i][j] = false;
                        this._fog_tiles[i][j].clearGradient();
                    }
                }

                $gameSystem.fow_discovered_map[$gameMap.mapId()] = this._discovered_tiles;
            } else {
                // For all previously hidden tiles, delete base gradient to black out tile
                for (var i = 0; i < $dataMap.width; i++) {
                    for (var j = 0; j < $dataMap.height; j++) {
                        if (! this._discovered_tiles[i][j])
                            this._fog_tiles[i][j].clearGradient();
                    }
                }
            }
        }

        // Hide all targets
        for (let e of $.getTargets()) {
            if (e != null && e != undefined) {
                e._transparent = true;
            }
        }

        // Add origins based on event tag
        for (let e of $.getOrigins()) {
            if (e == null || e == undefined) continue;
            
            $.applyVision(e);
        }
    }

    // Make all fog sprites invisible
    $.clear = function() {
        for (var i = 0; i < $dataMap.width; i++) {
            for (var j = 0; j < $dataMap.height; j++) {
                this._fog_tiles[i][j].clearGradient();
                this._fog_tiles[i][j].visible = false;
            }
        }

        // Clear origin events' old visible set
        for (let e of $.getOrigins()) {
            $.visible_sets[e.eventId()] = new CS_Set();
        }
    }

    // Delete all fog sprites
    $.erase = function() {
        if (this._fog_tiles != undefined)
            for (var i = 0; i < $dataMap.width; i++) {
                for (var j = 0; j < $dataMap.height; j++) {
                    this._fog_tiles[i][j].deleteSprite();
                }
            }
    }

    $.applyVision = function(e) {    
        // Initialize visible set if it doesn't exist
        if ($.visible_sets[e.eventId()] == undefined)
            $.visible_sets[e.eventId()] = new CS_Set();
        
        // Remove vision if it's outside
        if (! $.inMap(e.x, e.y)) {
            $.removeVision(e);
            return;
        }

        // Check edge points
        var range = this._getRange(e);

        // Need to recalculate end points because of different height
        if (range != e.old_range) {
            e.old_range = range;
            e.calculateEndPoints();
        }

        var new_set = new CS_Set();

        this._getVisibleSet(e, new_set);

        this._resolveVisibility(e, new_set);
    }

    $.removeVision = function(e) {
        if ($.visible_sets[e.eventId()] != undefined) {
            for (let s of $.visible_sets[e.eventId()].items()) {
                s.removeGradient(e.eventId());

                if (s.gradient_map.size < 2) {
                    // Hide target events on this square
                    for (let target of $.getTargets()) {
                        if (target != null && target != undefined) {
                            if (target.floorX == s.mapX && target.floorY == s.mapY) {
                                target._transparent = true;
                            }
                        }
                    }
                }
            }

            // remove event's visible set afterwards
            $.visible_sets[e.eventId()] = new CS_Set();
        }
    }

    $.tileVisible = function(event) {
        if (! $.inMap(event.x, event.y))
            return false;
        
        if (this._fog_tiles[event.x][event.y].gradient_map.size >= 2)
            return true;
        else
            return false;
    }
    
    $.inMap = function(x, y) {
        if (x < 0 || x >= $dataMap.width
           || y < 0 || y >= $dataMap.height)
            return false;
        
        return true;
    }

    // Checks tiles around origin and mark them as visible or blocked
    $._getVisibleSet = function(e, new_visible_set) {
        var origin_height = this._getHeight(e);

        new_visible_set.add(this._fog_tiles[e.floorX][e.floorY]);

        // Find direction for directional vision
        if (e.vision_type == 4) {
            var direction = e.direction();

            if (e.oldX > e._x) {
                if (e.oldY > e._y) {
                    // Up-Left
                    direction = 7;
                } else if (e.oldY < e._y) {
                    // Down-Left
                    direction = 1;
                } else {
                    // Left
                    direction = 4;
                }

            } else if (e.oldX < e._x) {
                if (e.oldY > e._y) {
                    // Up-Right
                    direction = 9;
                } else if (e.oldY < e._y) {
                    // Down-Right
                    direction = 3;
                } else {
                    // Right
                    direction = 6;
                }

            } else {
                if (e.oldY > e._y) {
                    // Up
                    direction = 8;
                } else if (e.oldY < e._y) {
                    // Down
                    direction = 2;
                }
            }
        }

        for (let pointArray of e.end_points) {

            var left_blocked = false;
            var right_blocked = false;

            for (var i = 0; i < pointArray.length; i++) {
                var cur_x = pointArray[i][0] + e.floorX;
                var cur_y = pointArray[i][1] + e.floorY;

                // Stop if reach outside of map
                if (! $.inMap(cur_x, cur_y))
                    break;

                // For Directional Vision only.  Need to limit vision based on direction
                if (e.vision_type == 4) {                
                    var deltaX = pointArray[i][0];
                    var deltaY = pointArray[i][1];
                    var stopped = false;

                    switch (direction) {
                        // Down Left
                        case 1:
                            if (pointArray[i][1] < 0 || 
                                pointArray[i][0] > 0)
                                stopped = true;
                            break;
                        // Down
                        case 2: 
                            if (pointArray[i][1] < 0 || 
                               (pointArray[i][1].abs() < pointArray[i][0].abs()))
                                stopped = true;
                            break;
                        // Down Right
                        case 3:
                            if (pointArray[i][1] < 0 || 
                                pointArray[i][0] < 0)
                                stopped = true;
                            break;
                        // Left
                        case 4:
                            if (pointArray[i][0] > 0 || 
                               (pointArray[i][1].abs() > pointArray[i][0].abs()))
                                stopped = true;
                            break;
                        // Right
                        case 6:
                            if (pointArray[i][0] < 0 || 
                               (pointArray[i][1].abs() > pointArray[i][0].abs()))
                                stopped = true;
                            break;
                        // Up Left
                        case 7:
                            if (pointArray[i][1] > 0 || 
                                pointArray[i][0] > 0)
                                stopped = true;
                            break;
                        // Up
                        case 8:
                            if (pointArray[i][1] > 0 || 
                               (pointArray[i][1].abs() < pointArray[i][0].abs()))
                                stopped = true;
                            break;
                        // Up Right
                        case 9:
                            if (pointArray[i][1] > 0 || 
                                pointArray[i][0] < 0)
                                stopped = true;
                            break;
                    }

                    if (stopped) break;
                }

                // Only need to check if unit isn't flying
                if (! e.flying_vision) {
                    // If Strict Diagonals is enabled, need to check left and right tiles if landed in between 4 tiles
                    if ($gameSystem.fow_strict_diagonals) {
                        if (i > 0) {
                            var first_point = pointArray[i-1];
                            var second_point = pointArray[i];
                        } else {
                            var first_point = [0, 0];
                            var second_point = pointArray[0];
                        }
                        
                        if (first_point[0] != second_point[0] && first_point[1] != second_point[1]) {
                            if (second_point[0] > first_point[0] && second_point[1] > first_point[1]) {
                                var left_region_id = $.getRegionType(cur_x, cur_y - 1);
                                var right_region_id = $.getRegionType(cur_x - 1, cur_y);
                            } else if (second_point[0] < first_point[0] && second_point[1] < first_point[1]) {
                                var left_region_id = $.getRegionType(cur_x, cur_y + 1);
                                var right_region_id = $.getRegionType(cur_x + 1, cur_y);
                            } else if (second_point[0] > first_point[0] && second_point[1] < first_point[1]) {
                                var left_region_id = $.getRegionType(cur_x, cur_y + 1);
                                var right_region_id = $.getRegionType(cur_x - 1, cur_y);
                            } else if (second_point[0] < first_point[0] && second_point[1] > first_point[1]) {
                                var left_region_id = $.getRegionType(cur_x, cur_y - 1);
                                var right_region_id = $.getRegionType(cur_x + 1, cur_y);
                            }
                            // Unit have limited visibility
                            if (origin_height == 0) {   
                                if (left_region_id == $._hill_region_id ||
                                    left_region_id == $._forest_region_id ||
                                    left_region_id == $._mountain_region_id ||
                                    left_region_id == $._blocker_region_id) {
                                    left_blocked = true;
                                }
                                if (right_region_id == $._hill_region_id ||
                                    right_region_id == $._forest_region_id ||
                                    right_region_id == $._mountain_region_id ||
                                    right_region_id == $._blocker_region_id) {
                                    right_blocked = true;
                                }
                            }
                            // Unit have high visibility (can see through everythign except mountain)
                            else
                            {
                                if (left_region_id == $._mountain_region_id ||
                                    left_region_id == $._blocker_region_id) {
                                    left_blocked = true;
                                }
                                if (right_region_id == $._mountain_region_id  ||
                                    right_region_id == $._blocker_region_id) {
                                    right_blocked = true;
                                }
                            }   

                            // Blocked if both left and right are blocked
                            if (left_blocked && right_blocked)
                                break;
                        }
                    }
                }

                // Only need to check if unit isn't flying
                var point_region_id = $.getRegionType(cur_x, cur_y);
                if (! e.flying_vision) {
                    if (point_region_id == $._blocker_region_id) {
                        break;
                    }   
                }

                if (point_region_id != $._dark_region_id)
                    new_visible_set.add(this._fog_tiles[cur_x][cur_y]);

                // Only need to check if unit isn't flying
                if (! e.flying_vision) {
                    // Unit have limited visibility
                    if (origin_height == 0)
                    {
                        if (point_region_id == $._hill_region_id ||
                            point_region_id == $._forest_region_id ||
                            point_region_id == $._mountain_region_id) {
                            break;
                        }
                    }
                    // Unit have high visibility (can see through everythign except mountain)
                    else
                    {
                        if (point_region_id == $._mountain_region_id) {
                            break;
                        }
                    }   
                }
            }
        }
    }

    // Generate an array of points from center [0, 0] to a given point [x, y]
    $.getPointsInALine = function(point) {
        var points = new Array();
        var my_x = 0.5;
        var my_y = 0.5;

        var target_x = point[0] + 0.5;
        var target_y = point[1] + 0.5;

        var cur_range = (target_x - my_x).abs() + (target_y - my_y).abs();

        var step_x = (target_x - my_x) / cur_range;
        var step_y = (target_y - my_y) / cur_range;

        var cur_x = my_x;
        var cur_y = my_y;

        for (var i = 1; i <= cur_range; i++)
        {   
            cur_x += step_x;
            cur_y += step_y;

            var floor_x = cur_x.floor();
            var floor_y = cur_y.floor();

            var deltaX = cur_x - cur_x.floor();
            var deltaY = cur_y - cur_y.floor();

            // Skip if point lands between two tiles
            if (deltaX <= 0.01 || deltaY <= 0.01) {
                continue;
            }

            points.push([floor_x, floor_y]);
        }

        return points;
    }

    // Update sight map with new visibility info
    $._resolveVisibility = function(origin, new_set) {
        var range = $._getRange(origin);

        // New set
        for (let s of new_set.items()) {
            if ($gameSystem.fow_map_hidden) {
                $._discovered_tiles[s.mapX][s.mapY] = true;
            }
            
            s.addGradient(-1, 1 - $gameSystem.fow_fog_opacity);

            // Calculate gradient
            if ($gameSystem.fow_gradient_vision) {
                // Depends on vision type
                var position = 0;
                switch (parseInt(origin.vision_type)) {
                    case 1: 
                        position = range - ((origin.floorX - s.mapX).abs() + (origin.floorY - s.mapY).abs()) + 1;
                        break;
                    case 2:
                        position = range - Math.max((origin.floorX - s.mapX).abs(), (origin.floorY - s.mapY).abs()) + 1;
                        break;
                    case 3:
                    case 4:
                        position = range - Math.sqrt(Math.pow(origin.floorX - s.mapX, 2) + Math.pow(origin.floorY - s.mapY, 2)) + 1;
                }

                var gradient = $gameSystem.fow_fog_opacity * (position / range) * origin.vision_brightness;
                s.addGradient(origin.eventId(), gradient);
            } else {
                // No gradient, then add enough light to reveal entire tile
                s.addGradient(origin.eventId(), $gameSystem.fow_fog_opacity * origin.vision_brightness);
            }
            
            if ($.visible_sets[origin.eventId()].has(s)) {
                // Tile was visible before, so delete from old set
                $.visible_sets[origin.eventId()].delete(s);
            }
        }

        // Old set    
        for (let s of $.visible_sets[origin.eventId()].items()) {
            s.removeGradient(origin.eventId());
        }

        // Show/Hide targets based on new visibility
        for (let target of $.getTargets()) {
            if (target != null && target != undefined) {
                $gameMap.event(target.eventId()).setTransparent(!$.tileVisible(target));
            }
        }

        $.visible_sets[origin.eventId()] = new_set;
    }

    // Get the object's "height"
    $._getHeight = function(e) {
        // Unit on a hill or mountain / wall
        if (this._inRegion(e, this._hill_region_id)
            || this._inRegion(e, this._mountain_region_id)
            || this._inRegion(e, this._watchtower_region_id))
            return 1;

        return 0;
    }

    // Get the object's "range"
    $._getRange = function(e) {
        // Unit on a watchtower
        if (this._inRegion(e, this._watchtower_region_id))
            return e.vision_range + this._watchtower_modifier;
        else
            return e.vision_range;
    }

    // Check if the event is in specified region
    $._inRegion = function(e, regionId) {
        e.updateFloor();
        return ($gameMap.regionId(e.floorX, e.floorY) == regionId);
    }
    
    $.getRegionType = function(x, y) {
        var region_type = $gameMap.regionId(x, y);
        var blocker_type = $.getBlockerTypeOnTile(x, y);
        if (blocker_type == 1) {
            // Hill type blocker
            if (region_type == undefined || region_type == 0)
                return $._hill_region_id;
            else
                return region_type;
        } else if (blocker_type == 2) {
            // Mountain type blocker
            if (region_type == undefined
                || region_type == 0
                || region_type == $._hill_region_id
                || region_type == $._forest_region_id)
                return $._mountain_region_id;
            else
                return region_type;
        }
        
        return region_type;
    }
    
    $.addOrigin = function(e) {
        e.is_origin = true;
        e.updateFloor();
        e.calculateEndPoints();
        if ($gameSystem.fow_enabled)
            $.applyVision(e);
    };
    
    $.getOrigins = function() {
        var origins = new Array();
        if ($gameSystem.fow_player_vision)
            origins.push($gamePlayer);
        for (let e of $gameMap.events()) {
            if (e.is_origin)
                origins.push(e);
        }
        
        return origins;
    }
    
    $.addTarget = function(e) {
        e.is_target = true;
        e.updateFloor();
        if ($gameSystem.for_enabled) {
            e.setTransparent(!$.tileVisible(e));
        }
    }
    
    $.getTargets = function() {
        var targets = new Array();
        for (let e of $gameMap.events()) {
            if (e.is_target)
                targets.push(e);
        }
        
        return targets;
    }
    
    $.addBlocker = function(e, type) {
        e.blocker_type = type;
        var tile = $._fog_tiles[e.floorX][e.floorY];
        
        for (let key of tile.gradient_map.keys()) {
            var origin = $gameMap.event(key);
            if (origin != undefined && origin.is_origin)
                $.applyVision(origin);
        }
    }
    
    $.removeBlocker = function(e) {
        e.blocker_type = 0;
        var tile = $._fog_tiles[e.floorX][e.floorY];
        
        for (let key of tile.gradient_map.keys()) {
            var origin = $gameMap.event(key);
            if (origin != undefined && origin.is_origin)
                $.applyVision(origin);
        }
    }
    
    $.getBlockers = function() {
        var blockers = new Array();
        for (let e of $gameMap.events()) {
            if (e.blocker_type != 0)
                blockers.push(e);
        }
        
        return blockers;
    }
    
    $.getBlockerTypeOnTile = function(x, y) {
        for (let e of $gameMap.events()) {
            if (e.blocker_type != 0 && e.floorX == x && e.floorY == y) 
                return e.blocker_type;
        }
    
        return 0;
    }

    // ===CS_Set Prototype===
    function CS_Set() {
        this.initialize.apply(this, arguments);
    }
    CS_Set.prototype.constructor = CS_Set;
    CS_Set.prototype.initialize = function() {
        this._array = new Array();
    }

    CS_Set.prototype.items = function() {
        return this._array;
    }

    CS_Set.prototype.has = function(object) {
       for (let o of this._array) {
            if (o == object)
                return true;
        } 

        return false;
    }
    
    CS_Set.prototype.getIndex = function(object) {
       for (var i = 0; i < this._array.length; i++) {
            if (this._array[i] == object)
                return i;
        } 

        return -1;
    }

    CS_Set.prototype.add = function(object) {
        if (! this.has(object)) {
            this._array.push(object);  
            return true;
        }

        return false;
    }

    CS_Set.prototype.delete = function(object) {
        if (this.has(object)) {
            var index = this._array.indexOf(object);
            if (this._array.length == 1 || index == (this._array.length - 1)) {
                this._array.pop();
                return true;
            } else {
                this._array[index] = this._array.pop();
                return true;
            }
        }
        return false;
    }
    // ===End CS_Set Prototype===

   
// ===End Game Interpreter prototype===   

})(CS_FogOfWar);
