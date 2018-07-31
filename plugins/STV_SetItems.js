//=============================================================================
// STV_SetItems.js
//=============================================================================
 
/*:
 * @plugindesc v1.2
 * || This will add a possibility to create Armor Sets.
 * @author SkottyTV
 *
 * @param ----- States -----
 *
 * @param Set Bonus States
 * @desc States for each set.
 * "12,13,14" = Set1 -> State12 / Set2 -> State13 etc.
 * @default 12,13,14
 *
 * @help
 *
 * With this Plugin you will be able to create Armor Sets.
 * An Actor equiped with a full set (e.g. Iron Shield, Iron Chest, Iron Boots)
 * will get a state as bonus. Whenever one part is missing, the state will be
 * removed immediately.
 *
 *
 * ////////////////////////////////////////////////////////////////////////////
 * ----------------------------- Terms of Usage: ------------------------------
 * ////////////////////////////////////////////////////////////////////////////
 
 * Feel free to use this Plugin in 1. Non-Commercial Games, 2. Commercial Games
 * However it would be nice to give proper Credits to "SkottyTV".
 * Also a free copy of your game would be nice :)
 *
 * Have Fun And Enjoy! :)
 *
 *
 * ////////////////////////////////////////////////////////////////////////////
 * --------------------------------- Updates:----------------------------------
 * ////////////////////////////////////////////////////////////////////////////
 *
 * Update v1.0
 * - Basic functionality
 *
 * Update v1.1
 * - Bug fixes
 *
 * Update v1.2
 * - Bug fixes
 *
 *
 * ////////////////////////////////////////////////////////////////////////////
 * -------------------------------- Notetags: ---------------------------------
 * ////////////////////////////////////////////////////////////////////////////
 *
 * Armor Note:
 *   <stvset: 1>            # This Armor will be part of Set 1.
 *   <stvset: 47>           # This Armor will be part of Set 47.
 *
 *
 * ////////////////////////////////////////////////////////////////////////////
 * --------------------- Examples / Tutorials / Help: -------------------------
 * ////////////////////////////////////////////////////////////////////////////
 *
 * ----------------------------- Setup Tutorial: ------------------------------
 * With the Plugin Parameter "Set Bonus States" you can decide which set will
 * give which Bonus/State.
 *
 * For Example:
 * Parameter "Set Bonus States" -> 4,13,6,200,....
 *
 * That means that set 1 gives the actor who wears it state 4.
 * Set 2 gives the actor who wears it state 13.
 *
 * You create a set by typing <stvset: X> inside the armors notetags.
 *
 * Important!
 * Create Sets progressing! (First Set 1, then Set 2, ....)
 * Do NOT give the first set the notetag <stvset: 1> and the second
 * the notetag <stvset: 3>. This will break the script.
 *
 *
*/

// ----------------------------------------------------------------------------------------------------------------------------
// STV_SetItems Parameters
// ----------------------------------------------------------------------------------------------------------------------------
    var stv_SetItems_parameters = PluginManager.parameters('STV_SetItems');
   
    //----- States -----
    var stv_SetItems_states = String(stv_SetItems_parameters['Set Bonus States']);
    var stv_SetItems_stateArray = stv_SetItems_states.split(",").map(Number);

// ----------------------------------------------------------------------------------------------------------------------------
// Alias methods
// ----------------------------------------------------------------------------------------------------------------------------
    STV_ArmorSets_PluginCommand = Game_Interpreter.prototype.pluginCommand;
    STV_ArmorSets_Create = DataManager.createGameObjects;
    STV_ArmorSets_Save = DataManager.makeSaveContents;
    STV_ArmorSets_Load = DataManager.extractSaveContents;
    STV_ArmorSets_Update = Scene_Map.prototype.update;

// ----------------------------------------------------------------------------------------------------------------------------
// DataManager
// ----------------------------------------------------------------------------------------------------------------------------
    var $stvArmorSets= null;
 
    DataManager.makeSaveContents = function() {
        contents = STV_ArmorSets_Save.call(this);
        contents.armorsets = $stvArmorSets;
        return contents;
    };
   
    DataManager.extractSaveContents = function(contents) {
        STV_ArmorSets_Load.call(this, contents);
        $stvArmorSets = contents.armorsets;
    };
   
    DataManager.createGameObjects = function() {
        STV_ArmorSets_Create.call(this);
        $stvArmorSets = new STV_ArmorSets();
    };
    
// ----------------------------------------------------------------------------------------------------------------------------
// STV_ArmorSets
// ----------------------------------------------------------------------------------------------------------------------------
    function STV_ArmorSets() {
        this.initialize.apply(this, arguments);
    }
   
    STV_ArmorSets.prototype.initialize = function() {
        this.clear();
        this.createSets();
    };
   
    // Clear Sets
    STV_ArmorSets.prototype.clear = function() {
        this._sets = [null];
        this._actors = [];
    };
        
    // Create Sets
    STV_ArmorSets.prototype.createSets = function() {
        for (var i = 1; i < $dataArmors.length; i++) {
            var armor = $dataArmors[i];
            if (armor) {
                var armornote = armor.note;
                if (armornote.match(/<(?:STVSET):[ ](.*)>/i)){
                    var setnumber = Number(RegExp.$1);
                    if (!this._sets[setnumber]) this._sets[setnumber] = [null];
                    this._sets[setnumber].push(armor.id);
                }
            }
        }
    };
    
    // Check Sets
    STV_ArmorSets.prototype.check = function() {
        for (var i = 1; i <= $gameParty.size(); i++) {
            var actor = $gameActors.actor(i);
            for (var j = 1; j < this._sets.length; j++) {
                var items = this._sets[j];
                for (var k = 1; k < items.length; k++) {
                    var itemId = items[k];
                    var armor = $dataArmors[itemId];
                    if (actor.hasArmor(armor)) {
                        actor.addState(stv_SetItems_stateArray[j-1]);
                    } else {
                        actor.removeState(stv_SetItems_stateArray[j-1]);
                        break;
                    }
                    actor.clearResult();
                }
            }
        }
    };

// ----------------------------------------------------------------------------------------------------------------------------
// Update ArmorSet status
// ----------------------------------------------------------------------------------------------------------------------------
    Scene_Map.prototype.update = function() {
        $stvArmorSets.check();
        STV_ArmorSets_Update.call(this);
    };

    Window_Selectable.prototype.activate = function() {
        $stvArmorSets.check();
        Window_Base.prototype.activate.call(this);
        this.reselect();
    };