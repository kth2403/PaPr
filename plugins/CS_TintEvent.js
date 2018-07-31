/*=============================================================================
 * CityShrimp's Tint Event
 * CS_TintEvent.js
 * Version: 1.0.1
 * Free for commercial and non commercial use.
 *=============================================================================*/

 /*:
 * @plugindesc This plugin provides a way to tint events
 *             
 * @author CityShrimp
 *
 * ===Parameter List===
 *
 * @param Default Tone
 * @desc Default tone of the tint that is applied if no [tone] is specified
 * @default 60, 60, 60, 0
 *
 * @param Fade Speed
 * @desc Number of frames for tint to fade in and fade out again.  1 = Immediate
 * @default 1
 *
 * @param Flicker
 * @desc Whether tint will constantly fade in and out for all events and characters.
 * @default false
 *
 * ===Event/Comment Notetag===
 *
 * <cste_tone [tone]>
 * desc: Event will be tinted with the given tone.  Example [tone]: 30,30,30,0.  (No spaces allowed)
 *
 * <cste_fade_speed: (value)>
 * desc: Number of frames for tint to fade in and fade out again.  0 = Constant tint
 *
 * <cste_flicker: (bool)>
 * desc: When true, the event's tint will constantly fade in and out.
 *
 * Note: Event tag will overwrite any Comment tags
 *
 * ===Plugin Commands===
 *
 * cs_te <target> <command>
 *
 * <target>:
 * - all_events: all events
 * - event <id>: event with given id
 * - player: player's character
 * - follower <index>: follow with given index
 * - party: entire player's party
 *
 * <command>:
 * - apply_tint [tone]: Apply tint on the specified target.
 * [tone] is optional. If none are specified, the default is used. Example [tone]: 30,30,30,0. (No spaces allowed)
 * - remove_tint: Remove tint from specified target. 
 * - fade_speed <speed>: Set the fade speed on specified target.
 * <speed> is required.  It must be an integer that's >= 0.  A fade_speed of 0 will cause tint to appear/remove instantly.
 * - flicker <bool>: Set the flicker property for specified target.
 * <bool> is required, can be true or false.
 *
 * Examples:
 * cs_te all_event apply_tint
 * This will apply default tint to all events
 *
 * cs_te event 1 apply_tint 60,0,0,0 
 * This will apply a red tint to event #1.
 *
 * cs_te player remove_tint
 * This will remove tint from the player
 * 
 * cs_te party fade_speed 30
 * This will change the entire party's fade speed to 30 - meaning it will take 30 frames to apply or remove tint.
 *
 * cs_te follower 0 flicker true
 * This will cause follower #1's tint to constantly fade in and out.
 *
 * @help
 * ============================================================================
 * Latest Version
 * ============================================================================
 * 
 * Get the latest version of this script on 
 * https://github.com/cityshrimp/rmmv_fow/blob/master/CS_TintEvent.js
 * 
 *=============================================================================
*/

var Imported = Imported || {};
Imported['CS_TintEvent'] = "1.0.1";

var CS_TintEvent = CS_TintEvent || {};

// ===MVCommons Module (taken from SuperOrangeMovementEX) ===
if (Imported['MVCommons'] === undefined) {
  var MVC = MVC || {};

  (function($) {
    $.getProp = function(meta, propName) {
        if (meta === undefined)
            return undefined;
        if (meta[propName] !== undefined)
            if (typeof meta[propName] === 'string')
                return meta[propName].trim();
            else
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
        
    $.parseTone = function(tone) {
        var tone_array = tone.split(',');
        if (tone_array.length != 4)
            return false;
        for (var i = 0; i < tone_array.length; i++) {
            tone_array[i] = parseFloat(tone_array[i].trim());
            if (Number.isNaN(tone_array[i]))
                return false;
        }
        return tone_array;
    }
    
    // Load parameters
    $.parameters = PluginManager.parameters("CS_TintEvent") || {};
    var temp = $.parseTone($.parameters['Default Tone']);
    $.default_tone = (temp) ? temp : [0,0,0,0];
    $.fade_speed = Number($.parameters['Fade Speed'] || 0);
    $.flicker = ($.parameters['Flicker'] === 'true') ? true : false;
    
    // ===Alias Sprite_Character===
    var old_Sprite_Character_update = Sprite_Character.prototype.update;
    Sprite_Character.prototype.update = function() {
        old_Sprite_Character_update.call(this);
        this.updateTone();
    };
    
    Sprite_Character.prototype.updateTone = function() {
        if (this._character.tone()) {
            this.setColorTone(this._character.tone());
        } else {
            this.setColorTone([0, 0, 0, 0]);
        }
    };

    // ===Alias Game_CharacterBase===
    var old_Game_CharacterBase_initialize = Game_CharacterBase.prototype.initialize;
    Game_CharacterBase.prototype.initialize = function() {
        old_Game_CharacterBase_initialize.call(this);
                
        // Load default values
        this._tone = [0, 0, 0, 0];
        this._target_tone = [0, 0, 0, 0];
        this._original_tone = [0, 0, 0, 0];
        this._fade_speed = $.fade_speed;
        this._flicker = $.flicker;
        this._stop = false;
    };
    
    var old_Game_CharacterBase_update = Game_CharacterBase.prototype.update;
    Game_CharacterBase.prototype.update = function() {
        old_Game_CharacterBase_update.call(this);
        
        this.updateTone();
    };
        
    Game_CharacterBase.prototype.tone = function() {
        return this._tone;
    }
    
    Game_CharacterBase.prototype.setTone = function(tone) {
        this._stop = false;
        this._original_tone = this._tone.slice();
        this._target_tone = tone;
    }
    
    Game_CharacterBase.prototype.removeTone = function() {
        this._stop = true;
        this.setTone([0,0,0,0]);
    }
    
    Game_CharacterBase.prototype.setFadeSpeed = function(fade_speed) {
        this._fade_speed = (fade_speed >= 1) ? fade_speed : 1;
    }
    
    Game_CharacterBase.prototype.setFlicker = function(flicker) {
    	if(flicker) {
    		if(!this._flicker) {
        		this._original_tone = [0,0,0,0];
        		this._target_tone = [60,60,60,0];
        		this._flicker = true;
        	}
    	} else {
    		this._flicker = false;
    	}
    	
    }
    
    Game_CharacterBase.prototype.updateTone = function() {
        if (this._tone == undefined)
            return;
        
        var over = 0;
        for (var i = 0; i < 4; i++) {
            if ((this._target_tone[i] >= this._original_tone[i]
               && this._tone[i] >= this._target_tone[i])
               || (this._target_tone[i] <= this._original_tone[i]
               && this._tone[i] <= this._target_tone[i])) {
                over++;
            }
        }
        
        if (over == 4) {
                // Flip the origin and target 
                var temp = this._target_tone;
                this._target_tone = this._original_tone;
                this._original_tone = temp;
            
            if (!this._flicker) {
            	for (var i=0; i<4; i++) {
            		if (this._original_tone[i] < this._target_tone[i]) {
                        this._original_tone[i] = 0;
                        this._target_tone[i] = 0;
            		}
            	}
            }
        } else {
            var step = 1.0 / this._fade_speed;    
            for (var i = 0; i < 4; i++) {
                var amount = (this._target_tone[i] - this._original_tone[i]) * step;
                this._tone[i] += amount;
            }
        }
    }
    
    // ===Alia Game_Event===
    var old_Game_Event_initialize = Game_Event.prototype.initialize;
    Game_Event.prototype.initialize = function(mapId, eventId) {
        old_Game_Event_initialize.call(this, mapId, eventId);
        
        var data_e = $dataMap.events[eventId];
            this.setFadeSpeed(30);
            this._flicker = false;
        
    }
    
    
    
    // ===End Alia Game_Event===

    // ===Game Interpreter prototype===
    
    // ===End Game Interpreter prototype===   

})(CS_TintEvent);
